"use client";
import { ThreeDCardDemo } from "../components/ProjCard";
function Portfolio() {
  return (<div className="card-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
  <ThreeDCardDemo />
  <ThreeDCardDemo />
  <ThreeDCardDemo /></div>);
}

export default Portfolio;