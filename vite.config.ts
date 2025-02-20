import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          animation: ["framer-motion", "aos"],
          utils: ["@/lib/utils"],
        },
      },
    },
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    headers: {
      "js": "Cache-Control: public, max-age=31536000, immutable",
      "css": "Cache-Control: public, max-age=31536000, immutable",
      "assets": "Cache-Control: public, max-age=31536000, immutable",
    },
  },
});