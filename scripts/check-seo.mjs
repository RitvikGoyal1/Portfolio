import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const signature = process.argv.includes("--signature");
const dist = path.join(root, signature ? "dist-signature" : "dist");
const read = (file) => readFile(path.join(dist, file), "utf8");
const origin = signature
  ? "https://ritvikgoyal.com"
  : "https://app.ritvikgoyal.com";
const attribute = (tag, name) =>
  tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

function meta(html, key) {
  const matches = [...html.matchAll(/<meta\b[^>]*>/g)]
    .map(([tag]) => tag)
    .filter((tag) =>
      [attribute(tag, "name"), attribute(tag, "property")].includes(key),
    );
  assert.equal(matches.length, 1, `Expected one ${key} meta tag`);
  return attribute(matches[0], "content");
}

for (const [file, route, title] of [
  ["index.html", "/", "Ritvik Goyal: Software Developer"],
  ["resume.html", "/resume", "Ritvik Goyal: Resume"],
  [
    "projects/dealify.html",
    "/projects/dealify",
    "Dealify: AI shopkeeper for Shopify | Ritvik Goyal",
  ],
  [
    "projects/wealthsnaps.html",
    "/projects/wealthsnaps",
    "WealthSnaps: expense tracking in development | Ritvik Goyal",
  ],
  [
    "projects/studyflow.html",
    "/projects/studyflow",
    "StudyFlow: study planning and Pomodoro sessions | Ritvik Goyal",
  ],
  [
    "projects/panther.html",
    "/projects/panther",
    "Panther Press: a student newsroom | Ritvik Goyal",
  ],
]) {
  const html = await read(file);
  const url = `${origin}${route}`;
  assert.equal(html.match(/<title>([^<]+)<\/title>/)?.[1], title);
  const canonicals = [...html.matchAll(/<link\b[^>]*>/g)]
    .map(([tag]) => tag)
    .filter((tag) => attribute(tag, "rel") === "canonical");
  assert.equal(canonicals.length, 1, `${file} canonical count`);
  assert.equal(attribute(canonicals[0], "href"), url);
  assert.equal(meta(html, "og:url"), url);
  assert.equal(meta(html, "og:title"), title);
  assert.equal(meta(html, "twitter:title"), title);
  assert.ok(
    meta(html, "description").length > 70,
    `${file} meaningful description`,
  );
  assert.equal(meta(html, "og:description"), meta(html, "description"));
  assert.equal(meta(html, "twitter:description"), meta(html, "description"));
  const isProject = route.startsWith("/projects/");
  const imagePath =
    route === "/projects/wealthsnaps"
      ? "/projects/wealthsnaps.png"
      : isProject
        ? `${route}.webp`
        : "/social-card.png";
  assert.equal(meta(html, "og:image"), `${origin}${imagePath}`);
  assert.equal(meta(html, "twitter:image"), `${origin}${imagePath}`);
  await access(path.join(dist, imagePath));
  assert.ok(meta(html, "og:image:alt").length > 30);
  assert.equal(meta(html, "twitter:card"), "summary_large_image");
  assert.equal(meta(html, "twitter:creator"), "@_ritvikgoyal1");
  assert.doesNotMatch(meta(html, "robots"), /noindex|nofollow/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file} one heading`);
  assert.match(html, /<main\b/, `${file} prerendered main content`);
  assert.match(html, /data-prerendered="true"/);
  assert.ok(
    html.includes(
      `data-design="${route === "/resume" || (route === "/" && signature) ? "signature" : "forma"}"`,
    ),
    `${file} exposes its design before JavaScript runs`,
  );
  assert.doesNotMatch(html, /placehold\.co|<!--route-meta-->/);
  assert.doesNotMatch(
    html,
    /ratingValue|reviewCount|123 Tech Street|Tech Colleague|G-XXXXXXXXXX/,
  );

  const schemas = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  assert.equal(schemas.length, 1, `${file} structured data count`);
  const schema = JSON.parse(schemas[0][1]);
  assert.equal(schema["@context"], "https://schema.org");
  assert.ok(Array.isArray(schema["@graph"]));
  const person = schema["@graph"].find((item) => item["@type"] === "Person");
  assert.equal(person?.name, "Ritvik Goyal");
  assert.ok(person.sameAs.includes("https://github.com/RitvikGoyal1"));
  assert.ok(person.sameAs.includes("https://x.com/_ritvikgoyal1"));
  assert.ok(person.sameAs.includes("https://www.instagram.com/_ritvikgoyal1/"));
  const page = schema["@graph"].find((item) =>
    ["ProfilePage", "WebPage"].includes(item["@type"]),
  );
  assert.equal(page?.url, url);
  assert.equal(
    page?.mainEntity?.["@id"],
    isProject ? `${url}#project` : person["@id"],
  );
  if (isProject) {
    const project = schema["@graph"].find(
      (item) => item["@type"] === "CreativeWork",
    );
    const breadcrumb = schema["@graph"].find(
      (item) => item["@type"] === "BreadcrumbList",
    );
    assert.equal(project?.["@id"], page.mainEntity["@id"]);
    assert.equal(project?.creator[0]["@id"], person["@id"]);
    assert.equal(breadcrumb?.itemListElement.at(-1).item, url);
    assert.match(
      html,
      /class="project-prose"/,
      `${file} substantive static content`,
    );
    assert.match(
      html,
      /href="\/#(?:work|sig-work|wealthsnaps|studyflow|message)"/,
      `${file} return link`,
    );
    assert.match(html, /href="\/projects\//, `${file} related project link`);
    assert.ok(project.citation.length > 0, `${file} evidence links`);
    if (route === "/projects/dealify") {
      assert.deepEqual(
        project.creator.slice(1).map((creator) => creator.name),
        ["Bryan Maristanez", "Ricardo Gao"],
      );
      assert.equal(
        project.award,
        "Hack the North 2026: Shopify: Hack Shopping with AI category winner",
      );
      assert.match(html, /300 seeded synthetic shoppers/);
    }
  }

  for (const [, asset] of html.matchAll(
    /(?:href|src)="(\/assets\/[^"?#]+)"/g,
  )) {
    await access(path.join(dist, asset));
  }
  if (route === "/") {
    for (const project of [
      "Dealify",
      "WealthSnaps",
      "StudyFlow",
      "Panther Press",
    ]) {
      assert.ok(html.includes(project), `Prerendered project ${project}`);
    }
    for (const url of [
      signature
        ? "https://dealifytest.myshopify.com/"
        : "/projects/dealify#demo",
      "https://wealthsnaps.com/",
      "https://dazzling-licorice-53acc6.netlify.app/",
      "/projects/panther",
    ])
      assert.ok(
        html.includes(`href="${url}"`),
        `Crawlable project link ${url}`,
      );
    assert.match(
      html,
      signature ? /class="sg-directory"/ : /class="world-details"/,
    );
    for (const slug of ["dealify", "wealthsnaps", "studyflow", "panther"]) {
      assert.ok(
        html.includes(`href="/projects/${slug}"`),
        `Homepage links to ${slug} notes`,
      );
    }
  } else if (route === "/resume") {
    assert.match(html, /href="\/RG\.pdf"/);
    assert.equal(page.associatedMedia?.encodingFormat, "application/pdf");
    assert.match(html, /Digital Technologies/);
    assert.match(html, /Shopify/);
  }
}

const sitemap = await read("sitemap.xml");
assert.deepEqual(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort(),
  [
    `${origin}/`,
    `${origin}/resume`,
    ...["dealify", "wealthsnaps", "studyflow", "panther"].map(
      (slug) => `${origin}/projects/${slug}`,
    ),
  ].sort(),
);
assert.doesNotMatch(sitemap, /placehold\.co|2025-05-25/);
assert.match(
  await read("robots.txt"),
  new RegExp(`Sitemap: ${origin}/sitemap.xml`),
);
assert.match(await read("robots.txt"), /User-agent: OAI-SearchBot\s+Allow: \//);
assert.doesNotMatch(await read("robots.txt"), /Disallow:\s*\//);
assert.match(meta(await read("404.html"), "robots"), /noindex/);
const manifest = JSON.parse(await read("manifest.json"));
for (const icon of manifest.icons) {
  assert.ok(icon.src.startsWith("/"), "Manifest icons must be local assets");
  await access(path.join(dist, icon.src));
}
const png = await readFile(path.join(dist, "social-card.png"));
assert.equal(png.subarray(1, 4).toString(), "PNG");
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
console.log(
  "SEO build checks passed across 6 canonical pages: static content, metadata, schema, factual project attribution, crawlable links, sitemap, images, crawler policy, and 404.",
);
