import { Container } from "@mui/material";
import HeroSection from "../components/HeroSection";
import Card from "../components/Card";

const items = [
  {
    title: "Core Development Journey",
    text: "Experienced developer with strong foundation in Java, Python, JavaScript, and TypeScript. Passionate about clean code and efficient solutions.",
    icon: "💻"
  },
  {
    title: "Frontend Expertise",
    text: "Skilled in modern web development using React, Svelte, and Astro. Proficient in creating responsive and intuitive user interfaces with HTML5 and CSS3.",
    icon: "🎨"
  },
  {
    title: "UI & Design Skills",
    text: "Extensive experience with Tailwind, Material-UI, Bootstrap, Shadcn and Aceternity UI. Focus on creating beautiful, user-friendly interfaces.",
    icon: "✨"
  },
  {
    title: "Backend & Infrastructure",
    text: "Proficient in backend development using Flask and Firebase. Experience with cloud deployment using Cloudflare and basic api calls.",
    icon: "🔧"
  },
  {
    title: "Game Development",
    text: "Passionate game developer with experience in Godot, Pygame, and Java Swing. Love creating interactive and engaging experiences.",
    icon: "🎮"
  }
];

function Home() {
  return (
    <Container maxWidth="md">
      <HeroSection />
      <div className="App">
        {items.map((item, i) => (
          <Card 
            key={i} 
            text={item.text} 
            index={i} 
            title={item.title}
            icon={item.icon}
          />
        ))}
      </div>
    </Container>
  );
}

export default Home;