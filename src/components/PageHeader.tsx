import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        textAlign: "center",
        mb: { xs: 8, md: 10 },
        pt: { xs: 4, md: 6 },
        position: "relative",
        px: 2,
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-24px",
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "120px", md: "160px" },
          height: "8px",
          borderRadius: "4px",
          background: isDark
            ? "linear-gradient(90deg, #4A90E2 0%, #836FFF 50%, #C158DC 100%)"
            : "linear-gradient(90deg, #FF6B6B 0%, #FF9671 50%, #FFA400 100%)",
          opacity: 0.85,
          boxShadow: isDark
            ? "0 4px 12px rgba(74, 144, 226, 0.3), 0 0 20px rgba(131, 111, 255, 0.2)"
            : "0 4px 12px rgba(255, 107, 107, 0.25), 0 0 20px rgba(255, 164, 0, 0.15)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "60px", md: "80px" },
          height: "4px",
          borderRadius: "4px",
          background: isDark
            ? "linear-gradient(90deg, #4A90E2 0%, #836FFF 100%)"
            : "linear-gradient(90deg, #FF6B6B 0%, #FFA400 100%)",
          opacity: 0.6,
        },
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2.5,
            mb: 1.5,
          }}
        >
          {icon && (
            <Box
              component={motion.div}
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              sx={{
                display: "flex",
                p: 1.5,
                borderRadius: "12px",
                background: isDark
                  ? "linear-gradient(135deg, rgba(74, 144, 226, 0.2) 0%, rgba(131, 111, 255, 0.2) 100%)"
                  : "linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 164, 0, 0.15) 100%)",
                boxShadow: isDark
                  ? "0 4px 20px rgba(74, 144, 226, 0.2)"
                  : "0 4px 20px rgba(255, 107, 107, 0.15)",
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.7rem", sm: "3.5rem", md: "4rem" },
              letterSpacing: "-0.02em",
              background: isDark
                ? "linear-gradient(135deg, #4A90E2 0%, #836FFF 50%, #C158DC 100%)"
                : "linear-gradient(135deg, #FF6B6B 0%, #FF9671 50%, #FFA400 100%)",
              backgroundSize: "200% 200%",
              animation: "gradientFlow 8s ease infinite",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: isDark
                ? "0 2px 10px rgba(74, 144, 226, 0.3)"
                : "0 2px 10px rgba(255, 107, 107, 0.2)",
              "@keyframes gradientFlow": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
            }}
          >
            {title}
          </Typography>
        </Box>
      </motion.div>

      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              mt: 2,
              lineHeight: 1.7,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              fontWeight: 400,
              opacity: 0.85,
              px: { xs: 2, md: 6 },
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
