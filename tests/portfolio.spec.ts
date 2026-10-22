import { test, expect } from "@playwright/test";

for (const design of ["signature", "forma"]) {
  for (const width of [320, 768, 1440]) {
    test(`${design}: shared projects and social profiles at ${width}px`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/?design=${design}`);
      await expect(page.locator(`.${design}`)).toBeVisible();
      if (design === "signature") {
        await page.getByRole("button", { name: "02 WealthSnaps" }).click();
        await expect(page.locator(".sg-project-details")).toContainText(
          "In development",
        );
        await expect(page.locator(".sg-screen img")).toHaveAttribute(
          "src",
          "/projects/wealthsnaps.png",
        );
        await page
          .getByRole("button", { name: "Build notes", exact: true })
          .click();
        await expect(page.getByRole("dialog")).toContainText("OCR.space");
        await page.getByRole("button", { name: "Close build notes" }).click();
      } else {
        await expect(page.locator("#wealthsnaps")).toContainText("WealthSnaps");
        await page.locator("#wealthsnaps summary").click();
        await expect(page.locator("#wealthsnaps")).toContainText(
          "In development",
        );
      }
      const x = page.getByRole("link", {
        name: "X (@_ritvikgoyal1)",
        exact: true,
      });
      await x.scrollIntoViewIfNeeded();
      await expect(x).toBeVisible();
      await expect(x).toHaveAttribute("href", "https://x.com/_ritvikgoyal1");
      const instagram = page.getByRole("link", {
        name: "Instagram (@_ritvikgoyal1)",
        exact: true,
      });
      await instagram.scrollIntoViewIfNeeded();
      await expect(instagram).toBeVisible();
      await expect(instagram).toHaveAttribute(
        "href",
        "https://www.instagram.com/_ritvikgoyal1/",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      const missing = await page
        .locator(`.${design} a[href^="#"]`)
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute("href")!.slice(1))
            .filter((id) => id && !document.getElementById(id)),
        );
      expect(missing).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("only two designs can be selected, including with browser history", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?design=signature");
  const switcher = page.getByRole("navigation", {
    name: "Portfolio design explorations",
  });
  await expect(switcher.locator(".concept-switcher-option")).toHaveCount(2);
  await switcher.getByRole("button", { name: "02 Playground" }).click();
  await expect(page.locator(".playground")).toBeVisible();
  await expect(page).toHaveURL(/design=forma/);
  await page.goBack();
  await expect(page.locator(".signature")).toBeVisible();
  await page
    .getByRole("button", { name: "Hide design comparison controls" })
    .click();
  await expect(switcher).toHaveCount(0);
  await page
    .getByRole("button", { name: "Show design comparison controls" })
    .click();
  await expect(switcher).toBeVisible();
  for (const retired of ["obsidian", "atelier", "signal"]) {
    await page.goto(`/?design=${retired}`);
    await expect(page.locator(".playground")).toBeVisible();
    await expect(page.locator(`.${retired}`)).toHaveCount(0);
  }
});

test("WealthSnaps notes accurately describe the preview and carry X metadata", async ({
  page,
}) => {
  await page.goto("/projects/wealthsnaps");
  await expect(
    page.getByRole("heading", { name: "WealthSnaps", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".project-availability")).toContainText(
    "In development",
  );
  await expect(page.locator(".project-figure img")).toHaveJSProperty(
    "naturalWidth",
    1280,
  );
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.locator('meta[name="twitter:creator"]')).toHaveAttribute(
    "content",
    "@_ritvikgoyal1",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://app.ritvikgoyal.com/projects/wealthsnaps",
  );
  await expect(
    page.locator('.project-actions a[href="https://wealthsnaps.com/"]'),
  ).toBeVisible();
});
