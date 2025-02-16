import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Experiences from "./pages/Experiences";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useState, useEffect } from "react";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#82b1ff" : "#2962ff",
        light: darkMode ? "#b3e5fc" : "#768fff",
        dark: darkMode ? "#448aff" : "#0039cb",
        contrastText: darkMode ? "#000" : "#fff",
      },
      secondary: {
        main: darkMode ? "#ffab40" : "#ff9100",
        light: darkMode ? "#ffd180" : "#ffc947",
        dark: darkMode ? "#c66900" : "#c41c00",
        contrastText: darkMode ? "#000" : "#fff",
      },
      background: {
        default: darkMode ? "#121212" : "#fafafa",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#e0e0e0" : "#212121",
        secondary: darkMode ? "#bdbdbd" : "#616161",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename="/">
        <Header setDarkMode={setDarkMode} darkMode={darkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;