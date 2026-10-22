import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Run once after a successful release: node scripts/submit-indexnow.mjs --submit
// Without --submit, validate the local payload only; no network requests occur.
const config = JSON.parse(
  await readFile(new URL("./indexnow-config.json", import.meta.url), "utf8"),
);
assert.equal(config.host, "app.ritvikgoyal.com");
assert.match(config.keyFile, /^[a-f0-9]{32}\.txt$/);
const key = (
  await readFile(
    new URL(`../public/${config.keyFile}`, import.meta.url),
    "utf8",
  )
).trim();
assert.equal(`${key}.txt`, config.keyFile);
const sitemap = await readFile(
  new URL("../dist/sitemap.xml", import.meta.url),
  "utf8",
);
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
assert.ok(urlList.length > 0 && urlList.length <= 10000);
for (const value of urlList) {
  const url = new URL(value);
  assert.equal(url.origin, `https://${config.host}`);
  assert.equal(url.search, "");
  assert.equal(url.hash, "");
}
const keyLocation = `https://${config.host}/${config.keyFile}`;
if (!process.argv.includes("--submit")) {
  console.log(
    `Validated ${urlList.length} canonical URLs for ${config.host}. Deploy first, then run with --submit.`,
  );
  process.exit(0);
}

const keyResponse = await fetch(keyLocation, {
  redirect: "error",
  signal: AbortSignal.timeout(15000),
});
assert.equal(keyResponse.status, 200, "Ownership file must be deployed first");
assert.equal(
  (await keyResponse.text()).trim(),
  key,
  "Live ownership file does not match",
);
for (const url of urlList) {
  const response = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, 200, `${url} must be live before submission`);
  const html = await response.text();
  assert.ok(
    html.includes(`<link rel="canonical" href="${url}"`),
    `${url} canonical must match`,
  );
  assert.doesNotMatch(html, /<meta\s+name="robots"\s+content="[^"]*noindex/);
}
const result = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: config.host, key, keyLocation, urlList }),
  signal: AbortSignal.timeout(20000),
});
assert.ok(
  [200, 202].includes(result.status),
  `IndexNow returned HTTP ${result.status}: ${await result.text()}`,
);
console.log(
  `IndexNow received ${urlList.length} URLs (HTTP ${result.status}). ${result.status === 202 ? "Ownership validation is pending. " : ""}Receipt does not guarantee crawling, indexing, rankings, or AI citations.`,
);
