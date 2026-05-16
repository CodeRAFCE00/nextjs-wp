import querystring from "query-string";
import type { Post, Category, Tag, Page, Author, FeaturedMedia } from "./wordpress.d";

const baseUrl = process.env.WORDPRESS_URL;
const isConfigured = Boolean(baseUrl);

if (!isConfigured) {
  console.warn("WORDPRESS_URL is not defined — WordPress features will be unavailable");
}

class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

const USER_AGENT = "Next.js WordPress Client";
const CACHE_TTL = 3600;

async function wordpressFetch<T>(
  path: string,
  query?: Record<string, unknown>,
  tags: string[] = ["wordpress"]
): Promise<T> {
  if (!baseUrl) throw new Error("WordPress URL not configured");

  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query)}` : ""}`;

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    next: { tags, revalidate: CACHE_TTL },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

async function wordpressFetchGraceful<T>(
  path: string,
  fallback: T,
  query?: Record<string, unknown>,
  tags: string[] = ["wordpress"]
): Promise<T> {
  if (!isConfigured) return fallback;
  try {
    return await wordpressFetch<T>(path, query, tags);
  } catch {
    console.warn(`WordPress fetch failed for ${path}`);
    return fallback;
  }
}

async function wordpressFetchPaginated<T>(
  path: string,
  query?: Record<string, unknown>,
  tags: string[] = ["wordpress"]
): Promise<WordPressResponse<T>> {
  if (!baseUrl) throw new Error("WordPress URL not configured");

  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query)}` : ""}`;

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    next: { tags, revalidate: CACHE_TTL },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return {
    data: await response.json(),
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

async function wordpressFetchPaginatedGraceful<T>(
  path: string,
  query?: Record<string, unknown>,
  tags: string[] = ["wordpress"]
): Promise<WordPressResponse<T[]>> {
  const emptyResponse: WordPressResponse<T[]> = {
    data: [],
    headers: { total: 0, totalPages: 0 },
  };
  if (!isConfigured) return emptyResponse;
  try {
    return await wordpressFetchPaginated<T[]>(path, query, tags);
  } catch {
    console.warn(`WordPress paginated fetch failed for ${path}`);
    return emptyResponse;
  }
}

export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: { author?: string; tag?: string; category?: string; search?: string }
): Promise<WordPressResponse<Post[]>> {
  const query: Record<string, unknown> = { _embed: true, per_page: perPage, page };
  const cacheTags = ["wordpress", "posts", `posts-page-${page}`];

  if (filterParams?.search) { query.search = filterParams.search; cacheTags.push("posts-search"); }
  if (filterParams?.author) { query.author = filterParams.author; cacheTags.push(`posts-author-${filterParams.author}`); }
  if (filterParams?.tag) { query.tags = filterParams.tag; cacheTags.push(`posts-tag-${filterParams.tag}`); }
  if (filterParams?.category) { query.categories = filterParams.category; cacheTags.push(`posts-category-${filterParams.category}`); }

  return wordpressFetchPaginatedGraceful<Post>("/wp-json/wp/v2/posts", query, cacheTags);
}

export async function getRecentPosts(): Promise<Post[]> {
  return wordpressFetchGraceful<Post[]>("/wp-json/wp/v2/posts", [], { _embed: true, per_page: 100 }, ["wordpress", "posts"]);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await wordpressFetchGraceful<Post[]>("/wp-json/wp/v2/posts", [], { slug, _embed: true });
  return posts[0];
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  if (!isConfigured) return [];
  try {
    const allSlugs: { slug: string }[] = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const response = await wordpressFetchPaginated<Post[]>("/wp-json/wp/v2/posts", { per_page: 100, page, _fields: "slug" });
      allSlugs.push(...response.data.map((post) => ({ slug: post.slug })));
      hasMore = page < response.headers.totalPages;
      page++;
    }
    return allSlugs;
  } catch {
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  return wordpressFetchGraceful<Category[]>("/wp-json/wp/v2/categories", [], { per_page: 100 }, ["wordpress", "categories"]);
}

export async function getAllTags(): Promise<Tag[]> {
  return wordpressFetchGraceful<Tag[]>("/wp-json/wp/v2/tags", [], { per_page: 100 }, ["wordpress", "tags"]);
}

export async function getAllAuthors(): Promise<Author[]> {
  return wordpressFetchGraceful<Author[]>("/wp-json/wp/v2/users", [], { per_page: 100 }, ["wordpress", "authors"]);
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return wordpressFetch<FeaturedMedia>(`/wp-json/wp/v2/media/${id}`);
}

export async function getAllPages(): Promise<Page[]> {
  return wordpressFetchGraceful<Page[]>("/wp-json/wp/v2/pages", [], { per_page: 100 }, ["wordpress", "pages"]);
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  const pages = await wordpressFetchGraceful<Page[]>("/wp-json/wp/v2/pages", [], { slug });
  return pages[0];
}

export { WordPressAPIError };
