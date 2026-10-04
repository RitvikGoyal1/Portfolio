import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`Signature layout and content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto("/?design=signature");
    await expect(page.locator("#sig-name")).toBeVisible();
    await expect(page.locator(".signature-personal-field canvas")).toHaveCount(
      1,
    );
    await expect(page.locator(".signature-personal-field")).toHaveClass(
      /is-rendered/,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const missing = await page
      .locator('.signature a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((a) => a.getAttribute("href")!.slice(1))
          .filter((id) => id && !document.getElementById(id)),
      );
    expect(missing).toEqual([]);
    for (const image of await page.locator(".signature img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((node) => (node as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
    }
    await expect(page.locator(".sig-story-mark")).toHaveText(/rg\./);
    await expect(page.locator("#sig-story img")).toHaveCount(0);
    const yearsFit = await page.getByRole("tab").evaluateAll((tabs) =>
      tabs.every((tab) => {
        const bounds = tab.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth;
      }),
    );
    expect(yearsFit).toBe(true);
    await page.locator("#sig-contact").scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("button", { name: "Copy email address", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("Signature reveals RG and pauses ambient animation", async ({ page }) => {
  await page.goto("/?design=signature");
  await page
    .getByRole("button", { name: "Break the pattern", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Put it back together", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.locator(".sig-play-trigger .sig-scramble-output"),
  ).toHaveText("Put it back together");
  await expect(page.locator(".sig-playground-label")).toContainText(
    "YOU FOUND MY SIGNATURE.",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Break the pattern", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Pause ambient motion" }).click();
  await expect(
    page.getByRole("button", { name: "Resume ambient motion" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("Signature project focus and journey keyboard navigation work", async ({
  page,
}) => {
  await page.goto("/?design=signature");
  await expect(page.getByRole("tab")).toHaveCount(5);
  await expect(page.getByRole("tab", { name: /2026/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  const projects = page.getByRole("group", { name: "Choose a project" });
  await projects.getByRole("button", { name: /StudyFlow/ }).click();
  await expect(
    page.getByRole("link", { name: "Open StudyFlow live project" }),
  ).toHaveAttribute("href", "https://dazzling-licorice-53acc6.netlify.app/");
  await expect(page.locator(".sig-project-copy")).toContainText("Recharts");
  await page.getByRole("tab", { name: /2025/ }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Scrapyard Toronto");
  await page.keyboard.press("ArrowLeft");
  await expect(
    page.getByRole("tab", { name: "2024", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("IgnitionHacks");
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tabpanel")).toContainText("STEM·E");
  await page.keyboard.press("End");
  await expect(page.getByRole("tabpanel")).toContainText("Shopify");
  await expect(page.getByRole("tabpanel")).toContainText("Dealify");
});

test("Signature command menu supports search, keyboard selection, and dismissal", async ({
  page,
}) => {
  await page.goto("/?design=signature");
  await expect(
    page.getByRole("button", { name: "Open portfolio shortcuts" }),
  ).toBeVisible();
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search portfolio shortcuts" })
    .fill("story");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect
    .poll(() =>
      page
        .locator("#sig-story")
        .evaluate((node) => node.getBoundingClientRect().top),
    )
    .toBeLessThan(160);
  await page.getByRole("button", { name: "Open portfolio shortcuts" }).click();
  await page
    .getByRole("textbox", { name: "Search portfolio shortcuts" })
    .fill("signature");
  await page.keyboard.press("Enter");
  await expect(page.locator(".sig-playground-label")).toContainText(
    "YOU FOUND MY SIGNATURE.",
  );
  await page.keyboard.press("Control+k");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("Signature mobile navigation, clipboard, and fallback work", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.emulateMedia({ reducedMotion: "reduce" });
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
  await page.goto("/?design=signature");
  await expect(page.locator(".signature-personal-field")).toHaveClass(
    /is-fallback/,
  );
  await page
    .getByRole("button", { name: "Break the pattern", exact: true })
    .click();
  await expect(
    page.locator(".signature-field-fallback.is-monogram text"),
  ).toHaveText("RG");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "The human" })
    .click();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  await page
    .getByRole("button", { name: "Copy email address", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Email address copied" }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "connect@ritvikgoyal.com",
  );
});

test("Signature gallery exposes build notes and accessible project controls", async ({
  page,
}) => {
  await page.goto("/?design=signature");
  await expect(
    page.getByRole("link", {
      name: /Open Dealify live project/,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Build notes", exact: true }).click();
  const notes = page.getByRole("dialog", {
    name: "Dealify build notes",
    exact: true,
  });
  await expect(notes).toBeVisible();
  await expect(notes).toContainText("The boundary");
  await expect(notes).toContainText("Shopify: Hack Shopping with AI");
  await expect(
    notes.getByRole("link", { name: "Read the code" }),
  ).toHaveAttribute("href", "https://github.com/Maristanez/dealify");
  await page.keyboard.press("Escape");
  await expect(notes).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Build notes", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Next project", exact: true }).click();
  await expect(
    page.getByRole("link", {
      name: /Open Synapse Investments live project/,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Previous project", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Dealify", exact: true }),
  ).toBeVisible();
});

test("Signature scroll chapter progresses reversibly and respects reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?design=signature");
  const manifesto = page.locator(".sig-scroll-manifesto");
  await expect(manifesto).toBeAttached();
  await manifesto.evaluate((node) =>
    window.scrollTo({
      top:
        (node as HTMLElement).offsetTop +
        (node as HTMLElement).offsetHeight -
        innerHeight,
      behavior: "instant",
    }),
  );
  await expect(manifesto).toHaveAttribute("data-manifesto-state", "complete");
  await expect
    .poll(() =>
      page
        .locator(".sm-stage")
        .evaluate((node) => Math.abs(node.getBoundingClientRect().top)),
    )
    .toBeLessThan(2);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(manifesto).toHaveAttribute("data-manifesto-state", "reading");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(manifesto).toHaveAttribute("data-manifesto-state", "complete");
  await expect(page.locator(".sm-stage")).toHaveCSS("position", "relative");
});
