import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
  Tooltip,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import CodeIcon from "@mui/icons-material/Code";
import WebIcon from "@mui/icons-material/Web";
import BrushIcon from "@mui/icons-material/Brush";
import CloudIcon from "@mui/icons-material/Cloud";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import BuildIcon from "@mui/icons-material/Build";
import SchoolIcon from "@mui/icons-material/School";

const skillCategories = [
  {
    category: "Languages",
    icon: <CodeIcon />,
    description:
      "Programming languages I've mastered for building various applications",
    skills: [
      { name: "Java", icon: "https://skillicons.dev/icons?i=java" },
      { name: "Python", icon: "https://skillicons.dev/icons?i=python" },
      { name: "JavaScript", icon: "https://skillicons.dev/icons?i=js" },
      { name: "TypeScript", icon: "https://skillicons.dev/icons?i=ts" },
    ],
  },
  {
    category: "Frontend",
    icon: <WebIcon />,
    description:
      "Technologies I use to create responsive, interactive web applications",
    skills: [
      { name: "HTML", icon: "https://skillicons.dev/icons?i=html" },
      { name: "CSS", icon: "https://skillicons.dev/icons?i=css" },
      { name: "React", icon: "https://skillicons.dev/icons?i=react" },
      { name: "Next.js", icon: "https://skillicons.dev/icons?i=nextjs" },
      { name: "Svelte", icon: "https://skillicons.dev/icons?i=svelte" },
      { name: "Astro", icon: "https://skillicons.dev/icons?i=astro" },
    ],
  },
  {
    category: "UI Frameworks",
    icon: <BrushIcon />,
    description:
      "Design systems and frameworks for creating beautiful user interfaces",
    skills: [
      { name: "Tailwind CSS", icon: "https://skillicons.dev/icons?i=tailwind" },
      {
        name: "Material UI",
        icon: "https://skillicons.dev/icons?i=materialui",
      },
      { name: "Bootstrap", icon: "https://skillicons.dev/icons?i=bootstrap" },
      {
        name: "Theme UI",
        icon: "https://raw.githubusercontent.com/system-ui/theme-ui/refs/heads/develop/packages/docs/static/logo-dark.png",
      },
      {
        name: "Aceternity UI",
        icon: "https://th.bing.com/th/id/OIP.k7bUWvQbXDQSgUXyJQbWeAAAAA?rs=1&pid=ImgDetMain",
      },
      {
        name: "shadcn/ui",
        icon: "https://cdn.hack.pet/U084RT5K678/Screenshot 2025-03-17 152859.png",
      },
      { name: "Figma", icon: "https://skillicons.dev/icons?i=figma" },
    ],
  },
  {
    category: "Backend & Cloud",
    icon: <CloudIcon />,
    description: "Server-side technologies and cloud services I work with",
    skills: [
      { name: "Flask", icon: "https://skillicons.dev/icons?i=flask" },
      { name: "Firebase", icon: "https://skillicons.dev/icons?i=firebase" },
      { name: "Cloudflare", icon: "https://skillicons.dev/icons?i=cloudflare" },
    ],
  },
  {
    category: "Game Dev",
    icon: <SportsEsportsIcon />,
    description: "Tools and frameworks I use for game development",
    skills: [
      { name: "Godot", icon: "https://skillicons.dev/icons?i=godot" },
      {
        name: "Pygame",
        icon: "https://www.pygame.org/ftp/pygame-head-party.png",
      },
      { name: "Java Swing", icon: "https://skillicons.dev/icons?i=java" },
    ],
  },
  {
    category: "Dev Tools",
    icon: <BuildIcon />,
    description: "Essential tools in my development workflow",
    skills: [
      { name: "VS Code", icon: "https://skillicons.dev/icons?i=vscode" },
      { name: "Git", icon: "https://skillicons.dev/icons?i=git" },
      { name: "Eclipse", icon: "https://skillicons.dev/icons?i=eclipse" },
      { name: "Vercel", icon: "https://skillicons.dev/icons?i=vercel" },
      { name: "Netlify", icon: "https://skillicons.dev/icons?i=netlify" },
    ],
  },
  {
    category: "Learning",
    icon: <SchoolIcon />,
    description:
      "Technologies I'm currently exploring and adding to my skillset",
    skills: [
      { name: "Docker", icon: "https://skillicons.dev/icons?i=docker" },
      { name: "PyTorch", icon: "https://skillicons.dev/icons?i=pytorch" },
      { name: "Node.js", icon: "https://skillicons.dev/icons?i=nodejs" },
      { name: "SQLite", icon: "https://skillicons.dev/icons?i=sqlite" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const MergedSkillsSection: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: isDark
                ? "linear-gradient(90deg, #4A90E2 0%, #836FFF 50%, #C158DC 100%)"
                : "linear-gradient(90deg, #FF6B6B 0%, #FF9671 50%, #FFA400 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Technical Skills
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: "700px", mx: "auto" }}
          >
            My toolkit spans various technologies and frameworks that I use to
            build robust web applications and creative projects
          </Typography>
        </motion.div>

        <Box
          sx={{
            borderRadius: 2,
            background: isDark
              ? alpha(theme.palette.background.paper, 0.4)
              : alpha(theme.palette.background.paper, 0.6),
            p: 2,
            mb: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="skills categories tabs"
            TabIndicatorProps={{
              style: {
                height: 4,
                borderRadius: 2,
              },
            }}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: isDark ? "#836FFF" : "#FF9671",
                height: 3,
                borderRadius: "2px",
              },
              "& .MuiTab-root": {
                minWidth: 120,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                py: 2,
                "&.Mui-selected": {
                  color: isDark ? "#836FFF" : "#FF9671",
                },
              },
            }}
          >
            {skillCategories.map((category, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        p: 1,
                        borderRadius: "50%",
                        backgroundColor:
                          activeTab === index
                            ? isDark
                              ? "rgba(131, 111, 255, 0.2)"
                              : "rgba(255, 150, 113, 0.2)"
                            : "transparent",
                      }}
                    >
                      {category.icon}
                    </Box>
                    <span>{category.category}</span>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        key={`desc-${activeTab}`}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            mb: 4,
            fontWeight: 400,
            color: "text.secondary",
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          {skillCategories[activeTab].description}
        </Typography>
      </motion.div>

      {skillCategories.map((category, index) => (
        <div key={index} role="tabpanel" hidden={activeTab !== index}>
          {activeTab === index && (
            <motion.div
              key={`panel-${index}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid container spacing={4} justifyContent="center">
                {category.skills.map((skill, idx) => (
                  <Grid key={idx} item xs={6} sm={4} md={3} lg={2}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.05,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        },
                      }}
                    >
                      <Tooltip title={skill.name} arrow placement="top">
                        <Paper
                          elevation={3}
                          sx={{
                            p: 3,
                            height: 140,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: isDark
                              ? alpha(theme.palette.background.paper, 0.6)
                              : alpha(theme.palette.background.paper, 0.8),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderRadius: 4,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: isDark
                                ? "0 10px 30px rgba(131, 111, 255, 0.2)"
                                : "0 10px 30px rgba(255, 107, 107, 0.15)",
                              borderColor: isDark ? "#836FFF" : "#FF9671",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              height: 60,
                              width: 60,
                              mb: 2,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              "& img": {
                                maxWidth: "100%",
                                maxHeight: "100%",
                                filter:
                                  "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                              },
                            }}
                          >
                            <motion.img
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: idx * 0.05 + 0.2 }}
                              src={skill.icon}
                              alt={skill.name}
                              loading="lazy"
                            />
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              textAlign: "center",
                              mt: 1,
                              fontWeight: 500,
                              color: isDark
                                ? alpha(theme.palette.text.primary, 0.9)
                                : theme.palette.text.primary,
                            }}
                          >
                            {skill.name}
                          </Typography>
                        </Paper>
                      </Tooltip>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </div>
      ))}
    </Container>
  );
};

export default MergedSkillsSection;
