import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import RssFeedIcon from "@mui/icons-material/RssFeed";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0F172A",
        color: "#64748B",
        py: 5,
        mt: "auto",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RssFeedIcon sx={{ color: "#60A5FA", fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 600 }}>
              The Blog
            </Typography>
          </Box>
          <Typography variant="caption">
            © {new Date().getFullYear()} · Powered by WordPress & Next.js
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
