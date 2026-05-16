"use client";

import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [{ label: "Blog", href: "/blogs" }];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#0F172A",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto", px: { xs: 2, md: 4 } }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, flexGrow: 1 }}>
            <RssFeedIcon sx={{ color: "#60A5FA", fontSize: 22 }} />
            <Typography
              variant="h6"
              sx={{ color: "#F8FAFC", fontWeight: 700, letterSpacing: "-0.02em", fontSize: "1.1rem" }}
            >
              The Blog
            </Typography>
          </Link>

          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 0.5 }}>
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    color: active ? "#60A5FA" : "#94A3B8",
                    bgcolor: active ? "rgba(96,165,250,0.1)" : "transparent",
                    "&:hover": { color: "#F8FAFC", bgcolor: "rgba(255,255,255,0.06)" },
                    px: 2,
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>

          <IconButton
            sx={{ display: { xs: "flex", sm: "none" }, color: "#94A3B8" }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 260, bgcolor: "#0F172A" } } }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#94A3B8" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.href} disablePadding>
              <ListItemButton
                component={Link}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                sx={{ color: "#94A3B8", "&:hover": { color: "#F8FAFC", bgcolor: "rgba(255,255,255,0.06)" } }}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
