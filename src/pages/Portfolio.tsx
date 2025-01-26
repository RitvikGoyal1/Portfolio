"use client";
import { ThreeDCardDemo } from "../components/ProjCard";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "Full-stack online shopping solution",
    imgUrl: "/projects/ecommerce.jpg",
    date: "2023",
    demoLink: "https://example.com"
  },
  {
    title: "Social Media App",
    description: "Real-time messaging platform",
    imgUrl: "/projects/social-media.jpg",
    date: "2024",
    demoLink: "https://example.com"
  },
  {
    title: "Task Manager",
    description: "Productivity workflow system",
    imgUrl: "/projects/task-manager.jpg", 
    date: "2024",
    demoLink: "https://example.com"
  }
];

function Portfolio() {
  return (
    <div className="card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-h-[80vh] max-w-full mx-auto">
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