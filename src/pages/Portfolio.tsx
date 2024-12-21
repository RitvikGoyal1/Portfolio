import React from "react";
import { projects } from "../utils/data";
import { Grid, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import PortfolioCard from "../components/PortfolioCard";
function Portfolio() {
  return (
    <Grid container spacing={3}>
      {projects.map((project, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <PortfolioCard
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.link}
            />
        </Grid>
      ))}
    </Grid>
  );
}

export default Portfolio;