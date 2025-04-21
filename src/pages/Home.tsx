import { Container } from "@mui/material";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import SEO from "../components/SEO";
import MergedSkillsSection from "../components/MergedSkillsSection";

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ background: "transparent" }}
    >
      <SEO
        title="Ritvik Goyal - Software Developer"
        description="Welcome to my portfolio - I'm a passionate software developer based in Toronto specializing in web development."
      />
      <main style={{ background: "transparent" }}>
        <Container maxWidth="md" sx={{ background: "transparent", pt: 8 }}>
          <HeroSection />
        </Container>
        <MergedSkillsSection />
      </main>
    </motion.div>
  );
}

export default Home;
