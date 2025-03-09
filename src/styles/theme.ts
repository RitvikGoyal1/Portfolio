import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ff6f61",
      light: "#ff9a8d",
      dark: "#c94c4c",
      contrastText: "#ffffff",
    },
    
    secondary: {
      main: "#4a90e2",
      light: "#7fb3f0",
      dark: "#357ab8",
      contrastText: "#fff",
    },
    background: {
      default: "#FDFCFB",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff6f61",
      light: "#ff9a8d",
      dark: "#c94c4c",
      contrastText: "#000",
    },
    secondary: {
      main: "#4a90e2",
      light: "#7fb3f0",
      dark: "#357ab8",
      contrastText: "#000",
    },
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#cfcfcf",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
  },
});