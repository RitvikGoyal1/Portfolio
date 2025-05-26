import { Container } from "@mui/material";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import SEO from "../components/SEO";
import MergedSkillsSection from "../components/MergedSkillsSection";
import SEOBreadcrumbs from "../components/SEOBreadcrumbs";
import LocalBusinessSEO from "../components/LocalBusinessSEO";
import PerformanceOptimization from "../components/PerformanceOptimization";
import SocialMetaTags from "../components/SocialMetaTags";
import SEOErrorBoundary from "../components/SEOErrorBoundary";
import seoConfig from "../config/seoConfig";

function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Ritvik Goyal - Expert Software Developer in Toronto",
    description:
      "Professional portfolio showcasing Ritvik Goyal's expertise in full-stack development, React, TypeScript, and modern web technologies. Based in Toronto, Canada.",
    url: "https://ritvikgoyal.com/",
    mainEntity: {
      "@type": "Person",
      name: "Ritvik Goyal",
      jobTitle: "Software Developer",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Toronto",
        addressRegion: "Ontario",
        addressCountry: "Canada",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://ritvikgoyal.com/",
        },
      ],
    },
  };
  return (
    <PerformanceOptimization>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: "transparent" }}
      >
        <SEOErrorBoundary componentName="Home SEO">
          <SEO
            title="Ritvik Goyal - Expert Software Developer & Full-Stack Engineer in Toronto"
            description="Welcome to Ritvik Goyal's professional portfolio. Expert software developer and full-stack engineer based in Toronto, Canada. Specializing in React, TypeScript, Node.js, Python, and modern web development. Available for freelance projects and full-time opportunities."
            keywords={seoConfig.keywords.home}
            url="https://ritvikgoyal.com/"
            structuredData={structuredData}
          />
          <SocialMetaTags
            title="Ritvik Goyal - Expert Software Developer in Toronto"
            description="Professional portfolio showcasing expertise in React, TypeScript, Python, and modern web development. Based in Toronto, Canada."
            url="https://ritvikgoyal.com/"
            type="profile"
          />
        </SEOErrorBoundary>
        <LocalBusinessSEO page="home" />
        <main style={{ background: "transparent" }}>
          <Container maxWidth="md" sx={{ background: "transparent", pt: 8 }}>
            <SEOBreadcrumbs />
            <HeroSection />
          </Container>
          <MergedSkillsSection />{" "}
        </main>
      </motion.div>
    </PerformanceOptimization>
  );
}

export default Home;
