import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import react from "@vitejs/plugin-react-swc";
import { createServer, defineConfig } from "vite";
import { pageMetadata, structuredData } from "./src/seo";

const escapeAttribute = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
function metadataHtml(isResume: boolean) {
  const page = pageMetadata(isResume);
  const meta = (attribute: string, key: string, value: string) =>
    `<meta ${attribute}="${key}" content="${escapeAttribute(value)}" />`;
  return `<!--route-meta-start-->
<title>${page.title}</title>
${meta("name", "description", page.description)}
${meta("name", "robots", "index, follow, max-image-preview:large")}
${meta("name", "author", "Ritvik Goyal")}
<link rel="canonical" href="${page.url}" />
${meta("property", "og:type", "website")}
${meta("property", "og:site_name", "Ritvik Goyal")}
${meta("property", "og:locale", "en_CA")}
${meta("property", "og:title", page.title)}
${meta("property", "og:description", page.description)}
${meta("property", "og:url", page.url)}
${meta("property", "og:image", page.image)}
${meta("property", "og:image:width", "1200")}
${meta("property", "og:image:height", "630")}
${meta("property", "og:image:alt", "Ritvik Goyal — Software Developer. Toronto. Shopify Dev Degree · York University.")}
${meta("name", "twitter:card", "summary_large_image")}
${meta("name", "twitter:title", page.title)}
${meta("name", "twitter:description", page.description)}
${meta("name", "twitter:image", page.image)}
${meta("name", "twitter:image:alt", "Ritvik Goyal — Software Developer in Toronto")}
<link rel="manifest" href="/manifest.json" />
<script type="application/ld+json">${JSON.stringify(structuredData(isResume)).replace(/</g, "\\u003c")}</script>
<!--route-meta-end-->`;
}

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    {
      name: "static-portfolio-pages",
      transformIndexHtml: {
        order: "pre",
        handler(html, context) {
          return html.replace(
            "<!--route-meta-->",
            metadataHtml(context.path.replace(/\/+$/, "") === "/resume"),
          );
        },
      },
      async closeBundle() {
        const template = await readFile(
          path.resolve("dist/index.html"),
          "utf8",
        );
        const manifest = JSON.parse(
          await readFile(path.resolve("dist/.vite/manifest.json"), "utf8"),
        );
        const renderer = await createServer({
          configFile: false,
          esbuild: { jsx: "automatic", jsxDev: false },
          optimizeDeps: { noDiscovery: true, include: [] },
          server: { middlewareMode: true, hmr: false, ws: false },
          appType: "custom",
          resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
        });
        try {
          const { renderPage } = await renderer.ssrLoadModule(
            "/src/entry-server.tsx",
          );
          for (const isResume of [false, true]) {
            const entry = isResume
              ? "src/pages/Resume.tsx"
              : "src/concepts/signature/Signature.tsx";
            const css = (manifest[entry]?.css as string[] | undefined) || [];
            if (!css.length)
              throw new Error(`Missing page styles for ${entry}`);
            const fonts =
              (manifest["index.html"]?.assets as string[] | undefined)?.filter(
                (file) => /manrope|italic/.test(file),
              ) || [];
            const html = template
              .replace(
                /<!--route-meta-start-->[\s\S]*?<!--route-meta-end-->/,
                metadataHtml(isResume),
              )
              .replace(
                '<html lang="en">',
                '<html lang="en" data-prerendered="true">',
              )
              .replace(
                '<div id="root"></div>',
                `<div id="root">${renderPage(isResume)}</div>`,
              )
              .replace(
                "</head>",
                `${fonts.map((file) => `<link rel="preload" href="/${file}" as="font" type="font/woff2" crossorigin />`).join("\n")}\n${css.map((file) => `<link rel="stylesheet" href="/${file}" />`).join("\n")}\n<style>html[data-prerendered] [data-sig-reveal]{opacity:1;translate:none;transform:none}html[data-prerendered] .sig-kinetic-letter,html[data-prerendered] .sig-reveal-word{opacity:1;transform:none}</style>\n</head>`,
              );
            await writeFile(
              path.resolve(isResume ? "dist/resume.html" : "dist/index.html"),
              html,
            );
          }
        } finally {
          await renderer.close();
        }
      },
      apply: "build",
    },
    // Vite's dev server uses the same metadata without requiring a production build.
    {
      name: "dev-page-metadata",
      apply: "serve",
      transformIndexHtml(html, context) {
        return html.replace(
          "<!--route-meta-->",
          metadataHtml(context.path.replace(/\/+$/, "") === "/resume"),
        );
      },
    },
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    manifest: true,
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: { vendor: ["react", "react-dom"], three: ["three"] },
      },
    },
  },
});
