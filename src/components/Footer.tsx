// src/components/Footer.tsx
import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: 4,
        mt: "auto",
        p: 2,
        borderTop: "1px solid rgba(255,255,255,0.1)",
        textAlign: "center",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} My Portfolio. All rights reserved.
      </Typography>
      <Typography variant="body2">
        <Link
          href="https://github.com/RitvikGoyal1"
          color="inherit"
          aria-label="GitHub Profile"
        >
          Github
        </Link>{" "}
        |{" "}
        <Link
          href="https://www.linkedin.com/in/ritvikgoyal1/"
          color="inherit"
          aria-label="LinkedIn Profile"
        >
          LinkedIn
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;