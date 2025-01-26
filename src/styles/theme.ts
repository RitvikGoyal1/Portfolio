import { createTheme} from "@mui/material/styles";

const theme = createTheme({
    palette: {
      primary: { main: '#4CAF50', contrastText: '#fff' },
      secondary: { main: '#FFC107', contrastText: '#000' },
      background: {
        default: '#ffffff',
        paper: '#f5f5f5',
      },
      text: {
        primary: '#1a1a1a',
        secondary: '#4a4a4a',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'all 0.3s ease',
          },
        },
      },
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      h1: { fontWeight: 700, letterSpacing: '-0.03em' },
      h2: { fontWeight: 600, letterSpacing: '-0.02em' },
    },
  });

export default theme;
