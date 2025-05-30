import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollIndicator from "./ScrollIndicator";

const HeroSection: React.FC = () => {
  const [text, setText] = useState("Welcome!");

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prevText) =>
        prevText === "Welcome!" ? "Bienvenue!" : "Welcome!"
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 4,
        p: { xs: 2, md: 4 },
        position: "relative",
      }}
    >
      <motion.div
        key={text}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "3rem", sm: "4.5rem", md: "5.5rem" },
          }}
        >
          {text}
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: "2.5rem", sm: "4rem", md: "6rem" },
          }}
        >
          I am Ritvik Goyal!
        </Typography>
        <Typography
          variant="h4"
          color="text.secondary"
          gutterBottom
          sx={{
            fontSize: { xs: "1.25rem", sm: "2rem", md: "2.125rem" },
          }}
        >
          A passionate Software Developer in Toronto!
        </Typography>
      </motion.div>
      <Button
        component={Link}
        to="/portfolio"
        variant="contained"
        color="primary"
        size="large"
      >
        See My Work
      </Button>
      <ScrollIndicator />
    </Box>
  );
};

export default HeroSection;
