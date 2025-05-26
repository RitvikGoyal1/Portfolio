import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import PageHeader from "@/components/PageHeader";
import ThemedBackground from "../components/ThemedBackground";
import SEO from "@/components/SEO";
import LocalBusinessSEO from "../components/LocalBusinessSEO";
import PerformanceOptimization from "../components/PerformanceOptimization";

const Resume = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Resume - Ritvik Goyal Software Developer",
    description:
      "Professional resume of Ritvik Goyal, expert software developer and full-stack engineer. Download PDF resume showcasing technical skills, project experience, education, and professional qualifications.",
    url: "https://ritvikgoyal.com/resume",
    author: {
      "@type": "Person",
      name: "Ritvik Goyal",
    },
    mainEntity: {
      "@type": "Person",
      name: "Ritvik Goyal",
      jobTitle: "Software Developer",
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        name: "Computer Science Education",
        credentialCategory: "High School Education",
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
        {
          "@type": "ListItem",
          position: 2,
          name: "Resume",
          item: "https://ritvikgoyal.com/resume",
        },
      ],
    },
  };
  return (
    <PerformanceOptimization>
      <ThemedBackground>
        <SEO
          title="Resume - Ritvik Goyal | Software Developer CV & Professional Experience"
          description="Download Ritvik Goyal's professional resume showcasing expertise in software development, full-stack engineering, React, TypeScript, Python, and modern web technologies. View technical skills, project experience, education, certifications, and professional qualifications."
          keywords="ritvik goyal resume, software developer cv, download resume, professional experience, technical skills, react developer resume, full stack engineer cv, toronto developer resume, software development qualifications"
          url="https://ritvikgoyal.com/resume"
          structuredData={structuredData}
        />
        <LocalBusinessSEO page="resume" />
        <Container
          maxWidth="lg"
          sx={{ minHeight: "100vh", bgcolor: "transparent" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PageHeader
              title="My Resume"
              subtitle="Below you can view my professional experience, technical skills, and qualifications. You can also download a PDF version for your convenience."
              icon={<DescriptionIcon sx={{ fontSize: 40 }} />}
            />
            <main>
              <Box
                sx={{
                  py: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    width: "100%",
                    height: "800px",
                    overflow: "hidden",
                    borderRadius: 2,
                    position: "relative",
                  }}
                >
                  <object
                    data="/RG.pdf"
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                  >
                    <Box
                      sx={{
                        p: 6,
                        textAlign: "center",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 3,
                        bgcolor: "background.paper",
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="text.secondary"
                      >
                        Unable to display PDF file
                      </Typography>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          href="/RG.pdf"
                          download
                          size="large"
                          startIcon={<DownloadIcon />}
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "1.1rem",
                          }}
                        >
                          Download Resume
                        </Button>
                      </motion.div>
                    </Box>
                  </object>
                </Paper>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    href="/RG.pdf"
                    download
                    startIcon={<DownloadIcon />}
                    sx={{
                      mt: 3,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    Download PDF Version
                  </Button>
                </motion.div>
              </Box>
            </main>
          </motion.div>{" "}
        </Container>
      </ThemedBackground>
    </PerformanceOptimization>
  );
};

export default Resume;
