import { getPostsPaginated } from "@/lib/wordpress";
import type { Post } from "@/lib/wordpress.d";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export const metadata: Metadata = {
  title: "Blog",
  description: "Browse all our latest articles and stories.",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function readingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function PostMeta({ post }: { post: Post }) {
  const author = post._embedded?.author?.[0];
  const minutes = readingTime(post.content.rendered);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
      {author && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Avatar
            src={author.avatar_urls?.["48"] || ""}
            alt={author.name}
            sx={{ width: 22, height: 22, fontSize: "0.65rem" }}
          >
            {author.name?.[0]}
          </Avatar>
          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>
            {author.name}
          </Typography>
        </Box>
      )}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <CalendarTodayIcon sx={{ fontSize: 12, color: "#94A3B8" }} />
        <Typography variant="caption" sx={{ color: "#94A3B8" }}>
          {formatDate(post.date)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <AccessTimeIcon sx={{ fontSize: 12, color: "#94A3B8" }} />
        <Typography variant="caption" sx={{ color: "#94A3B8" }}>
          {minutes} min read
        </Typography>
      </Box>
    </Box>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const categories = post._embedded?.["wp:term"]?.[0] ?? [];
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 220);

  return (
    <Link href={`/blogs/${post.slug}`} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          transition: "box-shadow 0.25s, transform 0.25s",
          "&:hover": { boxShadow: 8, transform: "translateY(-2px)" },
          mb: 6,
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "55%" },
            minHeight: { xs: 240, md: 380 },
            bgcolor: "#DBEAFE",
            backgroundImage: featuredImage ? `url(${featuredImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexShrink: 0,
          }}
        />
        <CardContent
          sx={{
            p: { xs: 3, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5, mb: 2, flexWrap: "wrap" }}>
            <Chip label="Featured" size="small" color="primary" sx={{ fontWeight: 600 }} />
            {categories.slice(0, 2).map((cat) => (
              <Chip key={cat.id} label={cat.name} size="small" variant="outlined" sx={{ borderColor: "#E2E8F0", color: "#64748B" }} />
            ))}
          </Box>

          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: 700, color: "#0F172A", mb: 2, lineHeight: 1.3 }}
          >
            {post.title.rendered}
          </Typography>

          <Typography variant="body1" sx={{ color: "#64748B", mb: 3, lineHeight: 1.7 }}>
            {excerpt}
            {excerpt.length >= 220 && "…"}
          </Typography>

          <PostMeta post={post} />

          <Button
            variant="contained"
            disableElevation
            sx={{ mt: 3, alignSelf: "flex-start", px: 3 }}
          >
            Read Article
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

function PostCard({ post }: { post: Post }) {
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const categories = post._embedded?.["wp:term"]?.[0] ?? [];
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 130);

  return (
    <Link href={`/blogs/${post.slug}`} style={{ textDecoration: "none", height: "100%", display: "block" }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.25s, transform 0.25s",
          "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
        }}
      >
        <Box
          sx={{
            height: 200,
            bgcolor: "#DBEAFE",
            backgroundImage: featuredImage ? `url(${featuredImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexShrink: 0,
          }}
        />
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: "flex", gap: 0.5, mb: 1.5, flexWrap: "wrap" }}>
            {categories.slice(0, 2).map((cat) => (
              <Chip key={cat.id} label={cat.name} size="small" variant="outlined" sx={{ borderColor: "#E2E8F0", color: "#64748B" }} />
            ))}
          </Box>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 700, color: "#0F172A", mb: 1.5, lineHeight: 1.4 }}>
            {post.title.rendered}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mb: 2, lineHeight: 1.65 }}>
            {excerpt}{excerpt.length >= 130 && "…"}
          </Typography>
          <PostMeta post={post} />
        </CardContent>
        <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
          <Button variant="outlined" size="small" sx={{ borderColor: "#E2E8F0", color: "#2563EB" }}>
            Read More →
          </Button>
        </CardActions>
      </Card>
    </Link>
  );
}

function EmptyState() {
  return (
    <Box sx={{ textAlign: "center", py: 12 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: "#0F172A", mb: 1 }}>
        No posts yet
      </Typography>
      <Typography color="text.secondary">
        Head to your WordPress admin and publish your first post.
      </Typography>
    </Box>
  );
}

export default async function BlogsPage() {
  const { data: posts } = await getPostsPaginated(1, 12);
  const [featured, ...rest] = posts;

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E40AF 100%)",
          py: { xs: 8, md: 12 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            sx={{ color: "#60A5FA", letterSpacing: "0.15em", fontWeight: 600, display: "block", mb: 1 }}
          >
            Our Blog
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: "#F8FAFC", fontWeight: 800, mb: 2, maxWidth: 600, lineHeight: 1.2 }}
          >
            Stories, Ideas & Insights
          </Typography>
          <Typography variant="body1" sx={{ color: "#94A3B8", maxWidth: 480, lineHeight: 1.75 }}>
            Explore articles, tutorials, and deep-dives written for curious minds.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Featured post */}
            {featured && <FeaturedPost post={featured} />}

            {/* Remaining posts */}
            {rest.length > 0 && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A" }}>
                    All Posts
                  </Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                  <Typography variant="body2" sx={{ color: "#94A3B8", whiteSpace: "nowrap" }}>
                    {rest.length} article{rest.length !== 1 && "s"}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {rest.map((post) => (
                    <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <PostCard post={post} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
}
