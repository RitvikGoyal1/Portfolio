"use client";
import { Box, Container } from "@mui/material";
import { ThreeDCardDemo } from "../components/ProjCard";
import PageHeader from "../components/PageHeader";
import WorkIcon from "@mui/icons-material/Work";
import ThemedBackground from "../components/ThemedBackground";

const projects = [
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
      <PageHeader
        title="My Portfolio"
        subtitle="Explore my latest projects and creative works"
        icon={<WorkIcon sx={{ fontSize: 40 }} />}
      />
      <Container
        maxWidth="xl"
        sx={{
          bgcolor: "transparent",
          py: 2,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
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
    </ThemedBackground>
  );
}

export default Portfolio;
