import { test, expect } from "@playwright/test";

test.describe("Readable before JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("prerendered story, artwork, notes, and resume work", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#world-title")).toBeVisible();
    await expect(page.locator("#top .world-static-art")).toBeVisible();
    expect(
      await page
        .locator("#top .world-static-art")
        .evaluate((el: HTMLImageElement) => el.naturalWidth),
    ).toBeGreaterThan(0);
    await page.locator("#work summary").click();
    await expect(page.locator("#work details")).toHaveAttribute("open", "");
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: /Résumé/ })
      .click();
    await expect(
      page.getByRole("heading", { name: "My resume." }),
    ).toBeVisible();
  });
});
test("reduced motion has all content, no Three download, and narrow-screen reflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const requests: string[] = [];
  page.on("request", (req) => requests.push(req.url()));
  await page.goto("/");
  await expect(page.locator("#world-title")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Reduced motion" }),
  ).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(requests.some((url) => /\/assets\/three-/.test(url))).toBe(false);
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page.locator("#work h2")).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("failed WebGL leaves a complete navigable story", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (type.startsWith("webgl")) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator("#top .world-static-art")).toBeVisible();
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page.locator("#work h2")).toBeInViewport();
  await page.getByRole("link", { name: "Run it back ↑" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(50);
});

for (const javaScriptEnabled of [true, false]) {
  test.describe(`project pages with JavaScript ${javaScriptEnabled ? "enabled" : "disabled"}`, () => {
    test.use({ javaScriptEnabled, viewport: { width: 320, height: 740 } });
    test("all project pages load artwork, reflow and return to their chapter", async ({
      page,
    }) => {
      test.setTimeout(60000);
      const projects = [
        { slug: "dealify", title: "Dealify", chapter: "work" },
        { slug: "wealthsnaps", title: "WealthSnaps", chapter: "wealthsnaps" },
        { slug: "studyflow", title: "StudyFlow", chapter: "studyflow" },
      ];
      for (const project of projects) {
        await page.goto(`/projects/${project.slug}`);
        await expect(page.locator(".project-page h1")).toHaveText(
          project.title,
        );
        await expect(page.locator(".project-figure img")).toBeVisible();
        await expect
          .poll(() =>
            page
              .locator(".project-figure img")
              .evaluate((el: HTMLImageElement) => el.naturalWidth),
          )
          .toBeGreaterThan(0);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page
          .locator(".project-next a")
          .filter({ hasText: "Back to the experience" })
          .click();
        await expect(page).toHaveURL(new RegExp(`#${project.chapter}$`));
        await expect(page.locator(`#${project.chapter} h2`)).toBeInViewport();
        // Wait for the self-hosted face to settle before targeting a link.
        await expect
          .poll(() => page.evaluate(() => document.fonts.status))
          .toBe("loaded");
        await page
          .locator(`#${project.chapter} a[href='/projects/${project.slug}']`)
          .click();
        await expect(page.locator(".project-page h1")).toHaveText(
          project.title,
        );
        await page.goBack();
        await expect(page.locator(`#${project.chapter} h2`)).toBeInViewport();
      }
    });
  });
}
