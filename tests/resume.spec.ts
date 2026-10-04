import { test, expect } from "@playwright/test";

for (const width of [320, 1440]) {
  test(`Resume opens directly with the existing PDF at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/resume");
    await expect(
      page.getByRole("heading", { name: "My resume." }),
    ).toBeVisible();
    await expect(page).toHaveTitle("Ritvik Goyal — Resume");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://ritvikgoyal.com/resume",
    );
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Resume", exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      page.locator('object[type="application/pdf"]'),
    ).toHaveAttribute("data", "/RG.pdf#view=FitH");
    await expect(
      page.getByRole("link", { name: "Open PDF", exact: true }),
    ).toHaveAttribute("href", "/RG.pdf");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const pdf = await page.request.get("/RG.pdf");
    expect(pdf.ok()).toBe(true);
    expect(pdf.headers()["content-type"]).toContain("application/pdf");
    expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
    const downloadPromise = page.waitForEvent("download");
    await page
      .getByRole("link", { name: "Download resume", exact: true })
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("Ritvik-Goyal-Resume.pdf");
    expect(await download.failure()).toBeNull();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "My resume." }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("Resume is reachable through mobile navigation and keyboard shortcuts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const nav = page.getByRole("navigation", {
    name: "Main navigation",
    exact: true,
  });
  await nav.getByRole("link", { name: "Resume", exact: true }).click();
  await expect(page).toHaveURL(/\/resume$/);
  await expect(page.getByRole("heading", { name: "My resume." })).toBeVisible();
  await page.goBack();
  await expect(page.locator("#sig-name")).toBeVisible();
  await page.keyboard.press("Control+k");
  await page
    .getByRole("textbox", { name: "Search portfolio shortcuts" })
    .fill("resume");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/resume$/);
  await page.getByRole("link", { name: "Back to the portfolio" }).click();
  await expect(page.locator("#sig-name")).toBeVisible();
  await page.locator("#sig-story").evaluate((node) => node.scrollIntoView());
  await expect(
    page
      .getByRole("navigation", { name: "Quick section navigation" })
      .getByRole("link", { name: "Resume", exact: true }),
  ).toBeVisible();
});
