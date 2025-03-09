import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

interface ThemedBackgroundProps {
  children: React.ReactNode;
}

const ThemedBackground: React.FC<ThemedBackgroundProps> = ({ children }) => {
  const theme = useTheme();

  const background =
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #0a192f 0%, #001e3c 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background,
        py: 4,
      }}
    >
      {children}
    </Box>
  );
};

export default ThemedBackground;
