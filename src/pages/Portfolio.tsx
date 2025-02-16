"use client";
import { ThreeDCardDemo } from "../components/ProjCard";

const projects = [
  {
    title: "Panther Press Website",
    description: "School News Website",
    imgUrl: "/projects/ecommerce.jpg",
    date: "2024",
    demoLink: "https://pantherpress.ca"
  },
  {
    title: "Robotics Website",
    description: "School's FRC Robotic's team website",
    imgUrl: "/projects/social-media.jpg",
    date: "2024",
    demoLink: "https://vicparkrobotics.ca/"
  },
  {
    title: "Build-A-Budget",
    description: "Ignition Hacks Hackathon Project",
    imgUrl: "/projects/task-manager.jpg", 
    date: "2024",
    demoLink: "https://sassy33893.github.io/Budgeting-Fun/pages/index.html"
  },
  {
    title: "Child Trafficking Aid",
    description: "AmberHacks Hackathon Project",
    imgUrl: "/projects/task-manager.jpg", 
    date: "2023",
    demoLink: "https://ritvikgoyal1.github.io/Child-Trafficking-Aid/"
  }
  ,
  {
    title: "To-Do List",
    description: "A simple to-do list tracker",
    imgUrl: "/projects/task-manager.jpg", 
    date: "2022",
    demoLink: "https://ritvikgoyal1.github.io/todolist/"
  }

];

function Portfolio() {
  return (
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
  );
}

export default Portfolio;