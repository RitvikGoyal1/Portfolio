import path from "node:path";
import { xProfile } from "./src/content/social";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import react from "@vitejs/plugin-react-swc";
import { createServer, defineConfig, loadEnv } from "vite";
import {
  pageMetadata,
  pageRoutes,
  resolvePage,
  structuredData,
  type PageId,
} from "./src/seo";

const escapeAttribute = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
function metadataHtml(id: PageId, origin: string) {
  const page = pageMetadata(id, origin);
  const meta = (attribute: string, key: string, value: string) =>
    `<meta ${attribute}="${key}" content="${escapeAttribute(value)}" />`;
  return `<!--route-meta-start-->
<title>${page.title}</title>
${meta("name", "description", page.description)}
${meta("name", "robots", page.robots)}
${meta("name", "author", "Ritvik Goyal")}
<link rel="canonical" href="${page.url}" />
${meta("property", "og:type", "website")}
${meta("property", "og:site_name", "Ritvik Goyal")}
${meta("property", "og:locale", "en_CA")}
${meta("property", "og:title", page.title)}
${meta("property", "og:description", page.description)}
${meta("property", "og:url", page.url)}
${meta("property", "og:image", page.image)}
${meta("property", "og:image:width", String(page.imageWidth))}
${meta("property", "og:image:height", String(page.imageHeight))}
${meta("property", "og:image:alt", page.imageAlt)}
${meta("name", "twitter:card", "summary_large_image")}
${meta("name", "twitter:creator", xProfile.handle)}
${meta("name", "twitter:site", xProfile.handle)}
${meta("name", "twitter:title", page.title)}
${meta("name", "twitter:description", page.description)}
${meta("name", "twitter:image", page.image)}
${meta("name", "twitter:image:alt", page.imageAlt)}
<link rel="manifest" href="/manifest.json" />
<script type="application/ld+json">${JSON.stringify(structuredData(id, origin)).replace(/</g, "\\u003c")}</script>
<!--route-meta-end-->`;
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env };
  // The existing root-domain Pages integration builds `dist` on pushes to main.
  // Local builds and the separate app-domain Worker default to Playground.
  const isPages = env.CF_PAGES === "1";
  const requestedDesign = env.VITE_SITE_DESIGN || (isPages ? "signature" : "forma");
  const design = requestedDesign === "signature" ? "signature" : "forma";
  const siteUrl =
    env.VITE_SITE_URL ||
    (design === "signature"
      ? "https://ritvikgoyal.com"
      : "https://app.ritvikgoyal.com");
  const outDir = design === "signature" && !isPages ? "dist-signature" : "dist";
  const define = {
    "import.meta.env.VITE_SITE_DESIGN": JSON.stringify(design),
    "import.meta.env.VITE_SITE_URL": JSON.stringify(siteUrl),
  };
  return {
    define,
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
              metadataHtml(resolvePage(context.path), siteUrl),
            );
          },
        },
        async closeBundle() {
          const template = await readFile(
            path.resolve(outDir, "index.html"),
            "utf8",
          );
          const manifest = JSON.parse(
            await readFile(path.resolve(outDir, ".vite/manifest.json"), "utf8"),
          );
          const renderer = await createServer({
            configFile: false,
            define,
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
            for (const route of pageRoutes) {
              const isResume = route.id === "resume";
              const isProject = route.path.startsWith("/projects/");
              const pageDesign = isResume
                ? "signature"
                : isProject
                  ? "forma"
                  : design;
              const chunkName = isResume
                ? "Resume"
                : isProject
                  ? "Project"
                  : design === "signature"
                    ? "Signature"
                    : "Forma";
              const entry = isResume
                ? "src/pages/Resume.tsx"
                : isProject
                  ? "src/pages/Project.tsx"
                  : design === "signature"
                    ? "src/concepts/signature/Signature.tsx"
                    : "src/concepts/forma/Forma.tsx";
              // Rollup may merge a dynamic entry into a named shared chunk.
              // Resolve its stable module name instead of depending on its key.
              const pageChunk:
                | { css?: string[]; assets?: string[] }
                | undefined =
                manifest[entry] ||
                (Object.values(manifest).find(
                  (chunk) => (chunk as { name?: string }).name === chunkName,
                ) as { css?: string[]; assets?: string[] } | undefined);
              const css = pageChunk?.css || [];
              if (!css.length)
                throw new Error(`Missing page styles for ${entry}`);
              const fonts =
                [
                  ...((manifest["index.html"]?.assets as
                    | string[]
                    | undefined) || []),
                  ...(pageChunk?.assets || []),
                ].filter((file) =>
                  (pageDesign === "signature"
                    ? /manrope|italic/
                    : /barlow.*(400|700)/
                  ).test(file),
                ) || [];
              const html = template
                .replace(
                  /<!--route-meta-start-->[\s\S]*?<!--route-meta-end-->/,
                  metadataHtml(route.id, siteUrl),
                )
                .replace(
                  '<html lang="en" data-design="forma">',
                  `<html lang="en" data-design="${pageDesign}" data-prerendered="true">`,
                )
                .replace(
                  '<div id="root"></div>',
                  `<div id="root">${renderPage(route.id, design)}</div>`,
                )
                .replace(
                  "</head>",
                  `${fonts.map((file) => `<link rel="preload" href="/${file}" as="font" type="font/woff2" crossorigin />`).join("\n")}\n${css.map((file) => `<link rel="stylesheet" href="/${file}" />`).join("\n")}\n<style>html[data-prerendered] [data-sig-reveal]{opacity:1;translate:none;transform:none}html[data-prerendered] .sig-kinetic-letter,html[data-prerendered] .sig-reveal-word{opacity:1;transform:none}</style>\n</head>`,
                );
              const output = path.resolve(outDir, route.file);
              await mkdir(path.dirname(output), { recursive: true });
              await writeFile(output, html);
            }
            const redirects = await readFile(
              path.resolve("public/_redirects"),
              "utf8",
            );
            await writeFile(
              path.resolve(outDir, "_redirects"),
              design === "signature"
                ? redirects
                    .replaceAll("/#work", "/#sig-work")
                    .replaceAll("/#about", "/#sig-story")
                    .replaceAll("/#contact", "/#sig-contact")
                : redirects,
            );
            const robots = await readFile(
              path.resolve("public/robots.txt"),
              "utf8",
            );
            await writeFile(
              path.resolve(outDir, "robots.txt"),
              robots.replace(/Sitemap: .*/, `Sitemap: ${siteUrl}/sitemap.xml`),
            );
            // The sitemap and rendered pages share one route registry. No guessed
            // modification timestamps: lastmod is optional and must be accurate.
            await writeFile(
              path.resolve(outDir, "sitemap.xml"),
              `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageRoutes.map((route) => `  <url><loc>${siteUrl}${route.path}</loc></url>`).join("\n")}\n</urlset>\n`,
            );
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
            metadataHtml(resolvePage(context.path), siteUrl),
          );
        },
      },
    ],
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
    build: {
      outDir,
      manifest: true,
      target: "es2020",
      rollupOptions: {
        output: {
          manualChunks: { vendor: ["react", "react-dom"], three: ["three"] },
        },
      },
    },
  };
});
