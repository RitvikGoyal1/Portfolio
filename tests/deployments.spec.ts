import { test, expect } from "@playwright/test";

for (const deployment of [
  {
    name: "Signature",
    local: "http://127.0.0.1:4174",
    origin: "https://ritvikgoyal.com",
    design: "signature",
    anchor: "sig-work",
  },
  {
    name: "Playground",
    local: "http://127.0.0.1:4173",
    origin: "https://app.ritvikgoyal.com",
    design: "forma",
    anchor: "wealthsnaps",
  },
]) {
  for (const javaScriptEnabled of [true, false]) {
    test(`${deployment.name} deployment, JavaScript ${javaScriptEnabled}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        javaScriptEnabled,
        reducedMotion: "reduce",
        viewport: { width: 390, height: 844 },
      });
      const page = await context.newPage();
      await page.goto(deployment.local);
      await expect(page.locator(`.${deployment.design}`)).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${deployment.origin}/`,
      );
      await expect(
        page.getByRole("link", { name: "X (@_ritvikgoyal1)", exact: true }),
      ).toHaveAttribute("href", "https://x.com/_ritvikgoyal1");
      await expect(
        page.getByRole("link", {
          name: "Instagram (@_ritvikgoyal1)",
          exact: true,
        }),
      ).toHaveAttribute("href", "https://www.instagram.com/_ritvikgoyal1/");
      if (deployment.design === "signature") {
        await page.locator(".sg-directory summary").click();
        await expect(page.locator(".sg-directory")).toContainText(
          "WealthSnaps",
        );
      } else {
        await expect(page.locator("#wealthsnaps")).toContainText("WealthSnaps");
      }
      await page.goto(`${deployment.local}/projects/wealthsnaps`);
      await expect(
        page.getByRole("heading", { name: "WealthSnaps", exact: true }),
      ).toBeVisible();
      await expect(
        page.locator(
          'a[href="https://github.com/RitvikGoyal1/ExpenseManagement"]',
        ),
      ).toHaveCount(0);
      await expect(page.locator(".project-facts")).toContainText(
        "React Native",
      );
      await expect(page.locator(".project-facts")).toContainText("Supabase");
      await expect(page.locator(".project-facts")).toContainText(
        "Google Gemini",
      );
      await expect(page.locator(".project-prose")).toContainText("OCR.space");
      await expect(page.locator(".project-availability")).toContainText(
        "In development",
      );
      await expect(page.locator(".project-figure img")).toBeVisible();
      if (javaScriptEnabled) {
        await expect(page.locator(".project-figure img")).toHaveJSProperty(
          "naturalWidth",
          1280,
        );
      } else {
        // Firefox may omit DOM property reads when page scripting is disabled.
        const artwork = await context.request.get(
          `${deployment.local}/projects/wealthsnaps.png`,
        );
        expect(artwork.ok()).toBe(true);
        expect(artwork.headers()["content-type"]).toContain("image/png");
      }
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${deployment.origin}/projects/wealthsnaps`,
      );
      await expect(
        page.locator('meta[name="twitter:creator"]'),
      ).toHaveAttribute("content", "@_ritvikgoyal1");
      await expect(page.locator(".project-next a").first()).toHaveAttribute(
        "href",
        `/#${deployment.anchor}`,
      );
      await page.locator(".project-next a").first().click();
      await expect(page.locator(`.${deployment.design}`)).toBeVisible();
      await expect(page.locator(`#${deployment.anchor}`)).toBeInViewport();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await context.close();
    });
  }
}
