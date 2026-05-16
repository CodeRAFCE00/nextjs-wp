import { getPostBySlug, getAllPostSlugs } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BackButton from "@/components/BackButton";

export async function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, "").trim().slice(0, 160),
    openGraph: {
      title: post.title.rendered,
      images: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
        ? [post._embedded["wp:featuredmedia"][0].source_url]
        : [],
    },
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];
  const author = post._embedded?.author?.[0];
  const categories = post._embedded?.["wp:term"]?.[0] ?? [];
  const tags = post._embedded?.["wp:term"]?.[1] ?? [];
  const minutes = readingTime(post.content.rendered);

  return (
    <>
      {/* Article hero */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
          py: { xs: 7, md: 10 },
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <BackButton />

          {categories.length > 0 && (
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 3 }}>
              {categories.map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  size="small"
                  sx={{ bgcolor: "rgba(96,165,250,0.15)", color: "#60A5FA", fontWeight: 600, border: "1px solid rgba(96,165,250,0.3)" }}
                />
              ))}
            </Box>
          )}

          <Typography
            variant="h3"
            component="h1"
            sx={{ color: "#F8FAFC", fontWeight: 800, lineHeight: 1.25, mb: 4 }}
          >
            {post.title.rendered}
          </Typography>

          {/* Author + meta row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            {author && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Avatar
                  src={author.avatar_urls?.["96"] || ""}
                  alt={author.name}
                  sx={{ width: 36, height: 36, border: "2px solid rgba(255,255,255,0.15)" }}
                >
                  {author.name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: "#F1F5F9", fontWeight: 600, lineHeight: 1 }}>
                    {author.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Author
                  </Typography>
                </Box>
              </Box>
            )}

            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.1)", display: { xs: "none", sm: "block" } }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 13, color: "#64748B" }} />
              <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                {formatDate(post.date)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 13, color: "#64748B" }} />
              <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                {minutes} min read
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Featured image */}
      {featuredImage?.source_url && (
        <Box sx={{ bgcolor: "#0F172A" }}>
          <Container maxWidth="md" disableGutters>
            <Box
              component="img"
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              sx={{
                width: "100%",
                maxHeight: 500,
                objectFit: "cover",
                display: "block",
              }}
            />
          </Container>
        </Box>
      )}

      {/* Article body */}
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            "& h1": { fontSize: "1.875rem", fontWeight: 700, mt: 4, mb: 1.5, color: "#0F172A", lineHeight: 1.3 },
            "& h2": { fontSize: "1.5rem", fontWeight: 700, mt: 4, mb: 1.5, color: "#0F172A", lineHeight: 1.35 },
            "& h3": { fontSize: "1.25rem", fontWeight: 600, mt: 3, mb: 1, color: "#0F172A" },
            "& p": { mb: 2, lineHeight: 1.85, color: "#334155", fontSize: "1.0625rem" },
            "& a": { color: "#2563EB", textDecoration: "underline", textUnderlineOffset: 3 },
            "& img": { maxWidth: "100%", borderRadius: "8px", my: 2 },
            "& ul, & ol": { pl: 3, mb: 2, "& li": { mb: 0.5, lineHeight: 1.75, color: "#334155" } },
            "& blockquote": {
              borderLeft: "4px solid #2563EB",
              bgcolor: "#EFF6FF",
              borderRadius: "0 8px 8px 0",
              pl: 3,
              pr: 2,
              py: 1.5,
              ml: 0,
              my: 3,
              "& p": { color: "#1E40AF", mb: 0, fontStyle: "italic" },
            },
            "& pre": {
              bgcolor: "#0F172A",
              color: "#E2E8F0",
              p: 3,
              borderRadius: "8px",
              overflowX: "auto",
              fontSize: "0.875rem",
              my: 3,
            },
            "& code": {
              bgcolor: "#F1F5F9",
              color: "#0F172A",
              px: 0.75,
              py: 0.25,
              borderRadius: "4px",
              fontSize: "0.875em",
              fontFamily: "monospace",
            },
            "& pre code": { bgcolor: "transparent", color: "inherit", p: 0 },
            "& hr": { borderColor: "#E2E8F0", my: 4 },
            "& table": { width: "100%", borderCollapse: "collapse", mb: 3 },
            "& th, & td": { border: "1px solid #E2E8F0", p: 1.5, textAlign: "left", color: "#334155" },
            "& th": { bgcolor: "#F8FAFC", fontWeight: 600, color: "#0F172A" },
          }}
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <Box sx={{ mt: 6, pt: 4, borderTop: "1px solid #E2E8F0" }}>
            <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 600, mb: 1.5, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.7rem" }}>
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              {tags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: "#E2E8F0", color: "#64748B" }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Bottom back button */}
        <Box sx={{ mt: 6, pt: 4, borderTop: "1px solid #E2E8F0" }}>
          <BackButton />
        </Box>
      </Container>
    </>
  );
}
