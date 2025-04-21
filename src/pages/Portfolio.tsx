"use client";
import { Box, Container, Typography } from "@mui/material";
import { ThreeDCardDemo } from "../components/ProjCard";
import PageHeader from "../components/PageHeader";
import WorkIcon from "@mui/icons-material/Work";
import ThemedBackground from "../components/ThemedBackground";
import SEO from "@/components/SEO";

const projects = [
  {
    title: "mapSTEM",
    description: "STEM Events Map",
    imgUrl:
      "https://hc-cdn.hel1.your-objectstorage.com/s/v3/5f0a47b1fc3e7252fcd733a29639e7b96d7f3f51_befunky-collage__1_.jpg",
    date: "2025",
    demoLink: "https://apps.apple.com/us/app/mapstem/id6504693720",
  },
  {
    title: "Note Sage App",
    description: "AI Note Making and Quizes App for Students",
    imgUrl:
      "https://hc-cdn.hel1.your-objectstorage.com/s/v3/8b15d4d6039446dc3b894f6e8823a60634686d5d_image.png",
    date: "2025",
    demoLink:
      "https://www.figma.com/proto/zRiY1AQkOvauA9fqb9nkSc/App7?node-id=3563-1507&p=f&t=zWa2wGtB0jjhq1UQ-0",
  },
  {
    title: "Panther Press",
    description: "School News Website",
    imgUrl:
      "https://cdn.hack.pet/slackcdn/01f43dd98ef044d832ffdc3784f79e23.png",
    date: "2024",
    demoLink: "https://pantherpress.ca",
  },
  {
    title: "Robotics",
    description: "School's FRC Robotic's team website",
    imgUrl:
      "https://cdn.hackclubber.dev/slackcdn/961714d89d5952ddd19b708cde7be192.png",
    date: "2024",
    demoLink: "https://vicparkrobotics.ca/",
  },
  {
    title: "Scrapyard | Toronto",
    description: "Local hackathon website",
    imgUrl:
      "https://hc-cdn.hel1.your-objectstorage.com/s/v3/851dccf54239ff145a0b9d323897ad55a0692de5_image.png",
    date: "2025",
    demoLink: "https://scrapyard.hackclub.com/toronto",
  },
  {
    title: "Build-A-Budget",
    description: "Ignition Hacks Hackathon Project",
    imgUrl:
      "https://cdn.hackclubber.dev/slackcdn/84062b6c51651836ee2ba413be4b67e9.png",
    date: "2024",
    demoLink: "https://sassy33893.github.io/Budgeting-Fun/pages/index.html",
  },
  {
    title: "Child Trafficking Aid",
    description: "AmberHacks Hackathon Project",
    imgUrl:
      "https://cdn.hackclubber.dev/slackcdn/1e30d22c9b1091efaebf47a116cff8c5.png",
    date: "2023",
    demoLink: "https://ritvikgoyal1.github.io/Child-Trafficking-Aid/",
  },
  {
    title: "To-Do List",
    description: "A simple to-do list tracker",
    imgUrl:
      "https://cdn.hack.pet/slackcdn/285fe75a0db3c54200c3099de724dbb4.png",
    date: "2022",
    demoLink: "https://ritvikgoyal1.github.io/todolist/",
  },
];

function Portfolio() {
  return (
    <ThemedBackground>
      <SEO
        title="My Portfolio - Ritvik Goyal"
        description="Browse through my collection of web development projects, including hackathon submissions, personal apps, and websites, showcasing my skills in React, TypeScript, and more."
      />
      <PageHeader
        title="My Portfolio"
        subtitle="Explore a selection of my latest projects, hackathon creations, and personal works demonstrating my passion for software development and design."
        icon={<WorkIcon sx={{ fontSize: 40 }} />}
      />
      <main>
        <Container
          maxWidth="xl"
          sx={{
            bgcolor: "transparent",
            py: 2,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            Here you can find a curated selection of projects I've worked on. These range from hackathon challenges to personal applications and websites I've developed. Each card provides a glimpse into the project, and you can click "View Demo" to explore further.
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fit, minmax(280px, 1fr))",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
              py: 2,
              width: "100%",
            }}
          >
            {projects.map((project, i) => (
              <ThreeDCardDemo
                key={i}
                title={project.title}
                description={project.description}
                imgUrl={project.imgUrl}
                date={project.date}
                demoLink={project.demoLink}
              />
            ))}
          </Box>
        </Container>
      </main>
    </ThemedBackground>
  );
}

export default Portfolio;
