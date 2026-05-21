import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ff.webriy.com";
  const slugs = await getAllPostSlugs();

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/blogs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...slugs.map(({ slug }) => ({
      url: `${siteUrl}/blogs/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
