"use client";
import { ThreeDCardDemo } from "../components/ProjCard";
import PageHeader from "../components/PageHeader";
import WorkIcon from "@mui/icons-material/Work";

const projects = [
  {
    title: "Panther Press Website",
    description: "School News Website",
    imgUrl:
      "https://cdn.hack.pet/slackcdn/01f43dd98ef044d832ffdc3784f79e23.png",
    date: "2024",
    demoLink: "https://pantherpress.ca",
  },
  {
    title: "Robotics Website",
    description: "School's FRC Robotic's team website",
    imgUrl:
      "https://cdn.hackclubber.dev/slackcdn/961714d89d5952ddd19b708cde7be192.png",
    date: "2024",
    demoLink: "https://vicparkrobotics.ca/",
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
    <>
      <PageHeader
        title="My Portfolio"
        subtitle="Explore my latest projects and creative works"
        icon={<WorkIcon sx={{ fontSize: 40 }} />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-h-[80vh] max-w-full mx-auto">
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
      </div>
    </>
  );
}

export default Portfolio;
