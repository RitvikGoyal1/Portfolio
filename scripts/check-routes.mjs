import assert from "node:assert/strict";

// Use the Cloudflare local runtime or the live deployment; Vite preview does
// not interpret Cloudflare _redirects and therefore cannot verify this contract.
const base = new URL(process.argv[2] || "http://127.0.0.1:8788");
const origin =
  process.argv[3] ||
  (base.hostname === "ritvikgoyal.com"
    ? "https://ritvikgoyal.com"
    : "https://app.ritvikgoyal.com");
const pages = [
  "/",
  "/resume",
  "/projects/dealify",
  "/projects/wealthsnaps",
  "/projects/studyflow",
  "/projects/panther",
];
const agents = ["Mozilla/5.0", "Googlebot", "bingbot", "OAI-SearchBot"];
// Root-domain Cloudflare settings inject Rocket Loader and randomly keyed email
// protection. Normalize only those transport changes, preserving email values
// and all authored content when comparing browser and crawler responses.
const decodeEmail = (hex) => {
  const bytes = Buffer.from(hex, "hex");
  return Buffer.from(
    bytes.subarray(1).map((byte) => byte ^ bytes[0]),
  ).toString();
};
const normalizeEdgeMarkup = (html) =>
  html
    .replace(/ type="[a-f0-9]+-text\/javascript"/g, "")
    .replace(/type="[a-f0-9]+-module"/g, 'type="module"')
    .replace(
      /<script\b[^>]*src="\/cdn-cgi\/scripts\/[^" ]+\/cloudflare-static\/rocket-loader\.min\.js"[^>]*><\/script>/g,
      "",
    )
    .replace(
      /(\/cdn-cgi\/l\/email-protection#)([a-f0-9]+)/g,
      (_, prefix, hex) => prefix + decodeEmail(hex),
    )
    .replace(
      /data-cfemail="([a-f0-9]+)"/g,
      (_, hex) => `data-cfemail="${decodeEmail(hex)}"`,
    );
for (const pathname of pages) {
  let reference;
  for (const agent of agents) {
    const response = await fetch(new URL(pathname, base), {
      headers: { "User-Agent": agent },
      redirect: "manual",
    });
    assert.equal(response.status, 200, `${agent} ${pathname}`);
    assert.doesNotMatch(
      response.headers.get("x-robots-tag") || "",
      /noindex|nofollow|nosnippet|noarchive/i,
    );
    const html = await response.text();
    assert.ok(
      html.includes(`<link rel="canonical" href="${origin}${pathname}"`),
      `${pathname} canonical`,
    );
    assert.match(html, /<main\b/, `${pathname} static content`);
    if (reference)
      assert.equal(
        normalizeEdgeMarkup(html),
        reference,
        `${pathname}: same content served to visitors and crawler user agents`,
      );
    reference = normalizeEdgeMarkup(html);
  }
  if (pathname !== "/") {
    for (const alias of [`${pathname}/`, `${pathname}.html`]) {
      const response = await fetch(new URL(alias, base), {
        redirect: "manual",
      });
      assert.equal(response.status, 301, `${alias} permanent redirect`);
      assert.equal(
        new URL(response.headers.get("location"), base).pathname,
        pathname,
      );
    }
  }
}
const missing = await fetch(new URL("/projects/not-a-project", base));
assert.equal(missing.status, 404, "Unknown project must return HTTP 404");
assert.match(await missing.text(), /noindex/);
console.log(
  `Cloudflare route checks passed at ${base.origin}: ${pages.length} static pages, 4 user agents, ${(pages.length - 1) * 2} canonical redirects, and a real 404. User-agent checks do not impersonate verified crawler IPs.`,
);
