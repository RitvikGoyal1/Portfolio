import path from "node:path";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    {
      name: "static-resume-entry",
      apply: "build",
      async closeBundle() {
        const html = await readFile(path.resolve("dist/index.html"), "utf8");
        const resumeHtml = html
          .replace(
            "<title>Ritvik Goyal — Software Developer</title>",
            "<title>Ritvik Goyal — Resume</title>",
          )
          .replace(
            /(<link rel="canonical" href=")https:\/\/ritvikgoyal.com\/("\s*\/?>)/,
            "$1https://ritvikgoyal.com/resume$2",
          );
        await mkdir(path.resolve("dist/resume"), { recursive: true });
        await writeFile(path.resolve("dist/resume/index.html"), resumeHtml);
      },
    },
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: { vendor: ["react", "react-dom"], three: ["three"] },
      },
    },
  },
});
