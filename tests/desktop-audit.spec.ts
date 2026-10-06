import { chromium, firefox, webkit, test, expect } from "@playwright/test";

for (const engine of [chromium, firefox, webkit]) {
  test(`desktop ${engine.name()}: navigation, dialogs, message and resume`, async ({
    baseURL,
  }) => {
    test.setTimeout(60000);
    const browser = await engine.launch();
    const context = await browser.newContext({
      baseURL,
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    try {
      await page.goto("/");
      await expect(page.locator("#sig-name")).toBeVisible();
      await page.keyboard.press("Control+k");
      const search = page.getByRole("textbox", {
        name: "Search portfolio shortcuts",
      });
      await expect(search).toBeFocused();
      await search.fill("story");
      await page.keyboard.press("Enter");
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect
        .poll(() =>
          page
            .locator("#sig-story")
            .evaluate((node) => node.getBoundingClientRect().top),
        )
        .toBeLessThan(160);
      await page.getByRole("tab", { name: "2024", exact: true }).click();
      await page.keyboard.press("ArrowRight");
      await expect(
        page.getByRole("tab", { name: "2025", exact: true }),
      ).toBeFocused();
      await expect(page.getByRole("tabpanel")).toContainText("Scrapyard");

      const notesButton = page.getByRole("button", {
        name: "Build notes",
        exact: true,
      });
      await notesButton.click();
      await expect(
        page.getByRole("dialog", { name: "Dealify build notes" }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(notesButton).toBeFocused();

      const directory = page.locator(".sg-directory");
      await directory.locator("summary").click();
      await expect(directory.getByRole("heading")).toHaveCount(4);
      await expect(
        directory.getByRole("link", { name: "StudyFlow", exact: true }),
      ).toBeVisible();
      await directory.locator("summary").click();

      let submissions = 0;
      await page.route("https://formsubmit.co/**", async (route) => {
        submissions++;
        expect(route.request().postDataJSON()).toMatchObject({
          name: "Browser QA",
          email: "test@example.com",
          message: "This submission is intercepted locally and never sent.",
        });
        await route.fulfill({ json: { success: true } });
      });
      await page.getByLabel("Your name").fill("Browser QA");
      await page
        .getByLabel("Your email", { exact: true })
        .fill("test@example.com");
      await page
        .getByLabel("What’s on your mind?")
        .fill("This submission is intercepted locally and never sent.");
      await page
        .getByRole("button", { name: "Send message", exact: true })
        .click();
      await expect(page.locator(".sig-message-feedback")).toContainText(
        "Message submitted",
      );
      await expect(page.locator(".sig-message-feedback")).toBeFocused();
      expect(submissions).toBe(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);

      await page.keyboard.press("Meta+k");
      await expect(search).toBeFocused();
      await search.fill("resume");
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/resume$/);
      await expect(
        page.getByRole("heading", { name: "My resume." }),
      ).toBeVisible();
      const pdf = await page.request.get("/RG.pdf");
      expect(pdf.ok()).toBe(true);
      expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
      await page.reload();
      await expect(
        page.getByRole("heading", { name: "My resume." }),
      ).toBeVisible();
      await page.getByRole("link", { name: "Back to the portfolio" }).click();
      await expect(page.locator("#sig-name")).toBeVisible();
      expect(errors).toEqual([]);
    } finally {
      await browser.close();
    }
  });
}

for (const platform of ["Win32", "MacIntel"]) {
  test(`desktop shortcut label matches ${platform}`, async ({ page }) => {
    await page.addInitScript((value) => {
      Object.defineProperty(navigator, "platform", { get: () => value });
    }, platform);
    await page.goto("/");
    const label = platform === "MacIntel" ? "⌘ K" : "Ctrl K";
    const shortcut = platform === "MacIntel" ? "Meta+K" : "Control+K";
    const trigger = page.getByRole("button", {
      name: "Open portfolio shortcuts",
    });
    await expect(trigger).toContainText(label);
    await expect(trigger).toHaveAttribute("aria-keyshortcuts", shortcut);
    await trigger.click();
    await expect(
      page.getByRole("textbox", { name: "Search portfolio shortcuts" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await page.locator("#sig-story").scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("button", { name: "Search portfolio", exact: true }),
    ).toContainText(label);
  });
}
