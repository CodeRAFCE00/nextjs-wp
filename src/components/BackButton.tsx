"use client";

import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<ArrowBackIcon />}
      onClick={() => router.back()}
      sx={{ mb: 4, borderColor: "#E2E8F0", color: "#64748B", "&:hover": { borderColor: "#94A3B8" } }}
    >
      Back to Blog
    </Button>
  );
}
