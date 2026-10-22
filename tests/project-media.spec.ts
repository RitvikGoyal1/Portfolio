import { test, expect } from "@playwright/test";

test("previews wait for a choice, play, and pause when scrolled away", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const slug of ["dealify", "studyflow", "panther"]) {
    const mediaRequests: string[] = [];
    const record = (request: { url(): string }) => {
      if (/\.(mp4|webm)(?:\?|$)/.test(request.url()))
        mediaRequests.push(request.url());
    };
    page.on("request", record);
    await page.goto(`/projects/${slug}`);
    await expect(page.locator(".project-play")).toBeVisible();
    expect(mediaRequests).toEqual([]);
    await expect(page.locator("video")).toHaveCount(0);
    await page.locator(".project-play").click();
    const video = page.locator(".project-player video");
    await expect(video).toBeVisible();
    await expect
      .poll(() =>
        video.evaluate((element: HTMLVideoElement) => element.currentTime),
      )
      .toBeGreaterThan(0);
    expect(mediaRequests.length).toBeGreaterThan(0);
    await page.locator(".project-footer").scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
      .toBe(true);
    await page.setViewportSize({ width: 320, height: 568 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    page.off("request", record);
  }
});

test("Dealify has an independent full recording and a recoverable preview failure", async ({
  page,
}) => {
  await page.route("**/dealify-preview.mp4", (route) => route.abort());
  await page.goto("/projects/dealify#demo");
  await page.getByRole("button", { name: "Play Dealify walkthrough" }).click();
  await expect(page.getByRole("status")).toContainText(
    "preview could not load",
  );
  await expect(
    page.getByRole("link", { name: "Open animated WebP" }),
  ).toHaveAttribute("href", "/projects/demos/dealify-loop.webp");
  await page.locator(".project-full-demo summary").click();
  const full = page.getByRole("link", { name: "Open the full recording" });
  await expect(full).toHaveAttribute(
    "href",
    "/projects/demos/dealify-full.mp4",
  );
  await expect(page.locator(".project-full-demo video")).toBeVisible();
  await page.locator(".project-full-demo summary").click();
  await expect(page.locator(".project-full-demo video")).toHaveCount(0);
});

test("recordings and descriptions remain accessible without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 568 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/projects/dealify");
  await expect(
    page.getByRole("button", { name: "Play Dealify walkthrough" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Open the short preview" }),
  ).toHaveAttribute("href", "/projects/demos/dealify-preview.mp4");
  await page.locator(".project-full-demo summary").click();
  await expect(
    page.getByRole("link", { name: "Open the full recording" }),
  ).toBeVisible();
  await context.close();
});
