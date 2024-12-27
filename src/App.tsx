import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Experiences from "./pages/Experiences";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useState } from "react";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header setDarkMode={setDarkMode} darkMode={darkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Experiences" element={<Experiences />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
