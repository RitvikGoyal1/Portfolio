import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        textAlign: "center",
        mb: 6,
        pt: 4,
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60px",
          height: "4px",
          background: "linear-gradient(90deg, primary.main, secondary.main)",
          borderRadius: "2px",
        },
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={(theme) => ({
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          })}
        >
          {icon}
          {title}
        </Typography>
      </motion.div>
      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6,
              fontSize: { xs: "1rem", md: "1.2rem" },
              fontWeight: 400,
            }}
          >
            {subtitle}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default PageHeader;
