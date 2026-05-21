"use client";

import { useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: 800, color: "#DC2626", lineHeight: 1 }}>
          500
        </Typography>
        <Typography variant="h5" sx={{ color: "#F8FAFC", fontWeight: 600, mt: 2, mb: 1 }}>
          Something went wrong
        </Typography>
        <Typography variant="body1" sx={{ color: "#94A3B8", mb: 4 }}>
          An unexpected error occurred. Please try again.
        </Typography>
        <Button onClick={reset} variant="contained" disableElevation sx={{ px: 4 }}>
          Try Again
        </Button>
      </Container>
    </Box>
  );
}
