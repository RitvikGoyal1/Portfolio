import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const read = (file) => readFile(path.join(dist, file), "utf8");
const origin = "https://ritvikgoyal.com";
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
  ["index.html", "/", "Ritvik Goyal — Software Developer"],
  ["resume.html", "/resume", "Ritvik Goyal — Resume"],
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
  assert.equal(meta(html, "og:image"), `${origin}/social-card.png`);
  assert.equal(meta(html, "twitter:image"), `${origin}/social-card.png`);
  assert.equal(meta(html, "twitter:card"), "summary_large_image");
  assert.doesNotMatch(meta(html, "robots"), /noindex|nofollow/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file} one heading`);
  assert.match(html, /<main\b/, `${file} prerendered main content`);
  assert.match(html, /data-prerendered="true"/);
  assert.doesNotMatch(html, /placehold\.co|<!--route-meta-->/);

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
  const page = schema["@graph"].find((item) =>
    ["ProfilePage", "WebPage"].includes(item["@type"]),
  );
  assert.equal(page?.url, url);
  assert.equal(page?.mainEntity?.["@id"], person["@id"]);

  for (const [, asset] of html.matchAll(
    /(?:href|src)="(\/assets\/[^"?#]+)"/g,
  )) {
    await access(path.join(dist, asset));
  }
  if (route === "/") {
    for (const project of [
      "Dealify",
      "Synapse Investments",
      "StudyFlow",
      "Panther Press",
    ]) {
      assert.ok(html.includes(project), `Prerendered project ${project}`);
    }
    for (const url of [
      "https://dealifytest.myshopify.com/",
      "https://synapseinvests.com",
      "https://dazzling-licorice-53acc6.netlify.app/",
      "https://panther-press.pages.dev",
    ])
      assert.ok(
        html.includes(`href="${url}"`),
        `Crawlable project link ${url}`,
      );
    assert.match(html, /<details class="sg-directory">/);
  } else {
    assert.match(html, /href="\/RG\.pdf"/);
    assert.equal(page.associatedMedia?.encodingFormat, "application/pdf");
  }
}

const sitemap = await read("sitemap.xml");
assert.deepEqual(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort(),
  [`${origin}/`, `${origin}/resume`],
);
assert.doesNotMatch(sitemap, /placehold\.co|2025-05-25/);
assert.match(
  await read("robots.txt"),
  /Sitemap: https:\/\/ritvikgoyal\.com\/sitemap\.xml/,
);
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
  "SEO build checks passed: static content, route metadata, schema, project links, sitemap, social image, and 404.",
);
