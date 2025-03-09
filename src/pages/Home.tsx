import { Container } from "@mui/material";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import SEO from "../components/SEO";
import ThemedBackground from "../components/ThemedBackground";
import MergedSkillsSection from "../components/MergedSkillsSection";

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title="Ritvik Goyal - Software Developer"
        description="Welcome to my portfolio - I'm a passionate software developer based in Toronto"
      />
      <Container maxWidth="md">
        <HeroSection />
      </Container>
      <MergedSkillsSection />
    </motion.div>
  );
}

export default Home;
