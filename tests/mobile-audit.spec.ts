import { devices, expect, test } from "@playwright/test";

const cases = [
  { name: "small phone", device: "iPhone SE", width: 320, height: 568 },
  { name: "iPhone", device: "iPhone 13", width: 390, height: 844 },
  { name: "Android", device: "Pixel 7", width: 412, height: 915 },
  { name: "tablet portrait", device: "iPad (gen 7)", width: 768, height: 1024 },
  {
    name: "tablet landscape",
    device: "iPad (gen 7)",
    width: 1024,
    height: 768,
  },
];

for (const scenario of cases) {
  test(`touch audit: ${scenario.name} ${scenario.width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      ...devices[scenario.device],
      viewport: { width: scenario.width, height: scenario.height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    let submissions = 0;
    await context.route("https://formsubmit.co/**", async (route) => {
      submissions++;
      expect(route.request().postDataJSON()).toMatchObject({
        email: "mobile-audit@example.com",
        message: "Touch device test; intercepted locally.",
      });
      await route.fulfill({ json: { success: true } });
    });
    if (scenario.width === 320) {
      await context.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (
          type: string,
          ...args: unknown[]
        ) {
          if (type.startsWith("webgl")) return null;
          return Reflect.apply(original, this, [type, ...args]);
        } as typeof original;
      });
    }
    await page.goto("http://127.0.0.1:5173/");
    await expect(page.locator("#sig-name")).toBeVisible();
    for (const name of ["Open portfolio shortcuts", "Pause ambient motion"]) {
      const target = await page
        .getByRole("button", { name, exact: true })
        .boundingBox();
      expect(Math.round(target?.width ?? 0)).toBeGreaterThanOrEqual(44);
      expect(Math.round(target?.height ?? 0)).toBeGreaterThanOrEqual(44);
    }
    if (scenario.width === 320) {
      await expect(page.locator(".signature-personal-field")).toHaveClass(
        /is-fallback/,
      );
    }
    const menu = page.getByRole("button", {
      name: "Open navigation",
      exact: true,
    });
    if (await menu.isVisible()) await menu.tap();
    await page
      .getByRole("navigation", { name: "Main navigation", exact: true })
      .getByRole("link", { name: "The work", exact: true })
      .tap();
    if (await menu.isVisible())
      await expect(menu).toHaveAttribute("aria-expanded", "false");
    await page.getByRole("button", { name: "Build notes", exact: true }).tap();
    const dialog = page.getByRole("dialog", {
      name: "Dealify build notes",
      exact: true,
    });
    await expect(dialog).toBeVisible();
    expect(
      await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth),
    ).toBe(true);
    await dialog
      .getByRole("link", { name: "Read the code" })
      .scrollIntoViewIfNeeded();
    await expect(
      dialog.getByRole("link", { name: "Read the code" }),
    ).toBeVisible();
    await dialog.getByRole("button", { name: "Close build notes" }).tap();
    await expect(dialog).not.toBeVisible();
    await page.getByRole("button", { name: "Next project", exact: true }).tap();
    await expect(
      page.getByRole("heading", { name: "Synapse Investments", exact: true }),
    ).toBeVisible();
    await page.getByRole("tab", { name: "2024", exact: true }).tap();
    await expect(page.getByRole("tabpanel")).toContainText("IgnitionHacks");
    await page.getByRole("tab", { name: "2022", exact: true }).tap();
    await expect(
      page.getByRole("tab", { name: "2022", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page.getByLabel("Your name").fill("Mobile QA");
    await page
      .getByLabel("Your email", { exact: true })
      .fill("mobile-audit@example.com");
    await page
      .getByLabel("What’s on your mind?")
      .fill("Touch device test; intercepted locally.");
    await page.getByRole("button", { name: "Send message", exact: true }).tap();
    await expect(page.locator(".sig-message-feedback")).toContainText(
      "Message submitted",
    );
    expect(submissions).toBe(1);
    for (const section of [
      "#sig-top",
      "#sig-work",
      "#sig-story",
      "#sig-contact",
    ]) {
      await page.locator(section).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
    await context.close();
  });
}
