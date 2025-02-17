import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2962ff",
      light: "#768fff",
      dark: "#0039cb",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ff9100",
      light: "#ffc947",
      dark: "#c41c00",
      contrastText: "#fff",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#616161",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#82b1ff",
      light: "#b3e5fc",
      dark: "#448aff",
      contrastText: "#000",
    },
    secondary: {
      main: "#ffab40",
      light: "#ffd180",
      dark: "#c66900",
      contrastText: "#000",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#bdbdbd",
    },
  },
});