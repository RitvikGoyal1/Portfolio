import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
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
        © {new Date().getFullYear()} Ritvik Goyal. All rights reserved.{" "}
      </Typography>
      <Typography variant="body2">
        <Link component={RouterLink} to="/" color="inherit" aria-label="Home Page">
          Home
        </Link>{" "}
        |{" "}
        <Link
          href="https://github.com/RitvikGoyal1"
          color="inherit"
          aria-label="GitHub Profile"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </Link>{" "}
        |{" "}
        <Link
          href="https://www.linkedin.com/in/ritvikgoyal1/"
          color="inherit"
          aria-label="LinkedIn Profile"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
