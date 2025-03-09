import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Grid,
  Paper,
  Tooltip,
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

interface SkillProps {
  name: string;
  icon: string;
  color?: string;
}

const SkillsSection: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const isDark = theme.palette.mode === "dark";

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const skillCategories = [
    {
      category: "Languages",
      icon: <CodeIcon />,
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
      skills: [
        {
          name: "Tailwind CSS",
          icon: "https://skillicons.dev/icons?i=tailwind",
        },
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
          icon: "https://ui.aceternity.com/_next/image?url=%2Flogo-dark.png&w=128&q=75",
        },
      ],
    },
    {
      category: "Backend & Cloud",
      icon: <CloudIcon />,
      skills: [
        { name: "Flask", icon: "https://skillicons.dev/icons?i=flask" },
        { name: "Firebase", icon: "https://skillicons.dev/icons?i=firebase" },
        {
          name: "Cloudflare",
          icon: "https://skillicons.dev/icons?i=cloudflare",
        },
      ],
    },
    {
      category: "Game Dev",
      icon: <SportsEsportsIcon />,
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
      skills: [
        { name: "VS Code", icon: "https://skillicons.dev/icons?i=vscode" },
        { name: "Git", icon: "https://skillicons.dev/icons?i=git" },
        { name: "Eclipse", icon: "https://skillicons.dev/icons?i=eclipse" },
      ],
    },
    {
      category: "Learning",
      icon: <SchoolIcon />,
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
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
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
              backgroundClip: "text",
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

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="skills categories tabs"
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
                fontSize: "0.95rem",
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {category.icon}
                    <span>{category.category}</span>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>
      </Box>

      {skillCategories.map((category, index) => (
        <div key={index} role="tabpanel" hidden={activeTab !== index}>
          {activeTab === index && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid container spacing={3} justifyContent="center">
                {category.skills.map((skill, skillIndex) => (
                  <Grid item key={skillIndex} xs={6} sm={4} md={3} lg={2}>
                    <motion.div variants={itemVariants}>
                      <Tooltip title={skill.name} arrow placement="top">
                        <Paper
                          elevation={2}
                          component={motion.div}
                          whileHover={{
                            y: -5,
                            boxShadow: isDark
                              ? "0 10px 20px rgba(131, 111, 255, 0.2)"
                              : "0 10px 20px rgba(255, 107, 107, 0.15)",
                          }}
                          sx={{
                            p: 2,
                            height: 110,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: isDark
                              ? alpha(theme.palette.background.paper, 0.6)
                              : alpha(theme.palette.background.paper, 0.8),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                          }}
                        >
                          <Box
                            sx={{
                              height: 48,
                              width: 48,
                              mb: 1,
                              display: "flex",
                              justifyContent: "center",
                              "& img": { maxWidth: "100%", maxHeight: "100%" },
                            }}
                          >
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              loading="lazy"
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ textAlign: "center", mt: 1, fontWeight: 500 }}
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

export default SkillsSection;
