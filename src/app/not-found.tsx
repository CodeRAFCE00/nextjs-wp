import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: 800, color: "#1E40AF", lineHeight: 1 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ color: "#F8FAFC", fontWeight: 600, mt: 2, mb: 1 }}>
          Page not found
        </Typography>
        <Typography variant="body1" sx={{ color: "#94A3B8", mb: 4 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button component={Link} href="/blogs" variant="contained" disableElevation sx={{ px: 4 }}>
          Back to Blog
        </Button>
      </Container>
    </Box>
  );
}
