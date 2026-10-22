import { test, expect } from "@playwright/test";

const scenes = ["top", "work", "wealthsnaps", "studyflow", "about", "contact"];
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
]) {
  test(`spatial journey: endpoints, reversal and composition ${viewport.width}`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    const root = page.locator(".playground");
    await expect(root).toHaveAttribute("data-ready", "true");
    for (const id of scenes) {
      await page.locator(`.world-chapter-nav a[href='#${id}']`).click();
      await expect(root).toHaveAttribute("data-chapter", id);
      await expect
        .poll(async () =>
          Number(await page.locator("canvas").getAttribute("data-progress")),
        )
        .toBeCloseTo(scenes.indexOf(id), 2);
      await expect(page.locator(`#${id} .world-copy`)).toBeVisible();
      const geometry = await page
        .locator(`#${id} .world-copy`)
        .evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return {
            x: rect.x,
            right: rect.right,
            bottom: rect.bottom,
            viewport: innerHeight,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
      expect(geometry.overflow).toBe(false);
      expect(geometry.x).toBeGreaterThanOrEqual(0);
      expect(geometry.right).toBeLessThanOrEqual(viewport.width);
      expect(geometry.bottom).toBeLessThanOrEqual(viewport.height - 42);
      await page.mouse.move(0, 0);
      await page.screenshot({
        path: `artifacts/playground-${viewport.width}-${id}.png`,
      });
    }
    await page.locator(".world-chapter-nav a[href='#work']").click();
    await expect
      .poll(async () =>
        Number(await page.locator("canvas").getAttribute("data-progress")),
      )
      .toBeCloseTo(1, 2);
    await page.getByRole("button", { name: "Explode the build" }).click();
    await expect(
      page.getByRole("button", { name: "Put it back together" }),
    ).toHaveAttribute("aria-pressed", "true");
    await page.locator("#work summary").click();
    await expect(page.locator("#work details")).toContainText(
      "300 seeded synthetic shoppers",
    );
    await page.screenshot({
      path: `artifacts/playground-${viewport.width}-exploded.png`,
    });
    await page.locator(".world-chapter-nav a[href='#wealthsnaps']").click();
    await expect(
      page.getByRole("button", { name: "Scatter the snapshot" }),
    ).toHaveAttribute("aria-pressed", "false");
    await page.locator(".world-chapter-nav a[href='#work']").click();
    await expect(
      page.getByRole("button", { name: "Explode the build" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(errors).toEqual([]);
    console.log(
      "render metrics",
      viewport.width,
      await page.locator("canvas").evaluate((el) => ({ ...el.dataset })),
    );
  });
}

test("native scroll reverses the same state, anchors survive reload, mode restores location", async ({
  page,
}) => {
  await page.goto("/#wealthsnaps");
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-chapter",
    "wealthsnaps",
  );
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const midpoint = await page.evaluate(() => {
    const a = document.getElementById("work")!.offsetTop;
    const b = document.getElementById("wealthsnaps")!.offsetTop;
    return a + (b - a) * 0.4;
  });
  await page.evaluate((y) => scrollTo(0, y), midpoint);
  await expect
    .poll(async () =>
      Number(await page.locator("canvas").getAttribute("data-progress")),
    )
    .toBeCloseTo(1.4, 2);
  await page.evaluate((y) => scrollTo(0, y - 400), midpoint);
  await page.evaluate((y) => scrollTo(0, y), midpoint);
  await expect
    .poll(async () =>
      Number(await page.locator("canvas").getAttribute("data-progress")),
    )
    .toBeCloseTo(1.4, 2);
  await page.locator(".world-chapter-nav a[href='#wealthsnaps']").click();
  await page.reload();
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-chapter",
    "wealthsnaps",
  );
  await page.getByRole("button", { name: "Reading mode", exact: true }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("#wealthsnaps .world-copy")).toBeInViewport();
  await page
    .getByRole("button", { name: "Enter the experience", exact: true })
    .click();
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-chapter",
    "wealthsnaps",
  );
});

for (const success of [true, false]) {
  test(`contact form ${success ? "accepts" : "rejects"} intercepted submission`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    let calls = 0;
    await page.route(
      "https://formsubmit.co/ajax/connect@ritvikgoyal.com",
      async (route) => {
        calls++;
        await route.fulfill({ json: { success } });
      },
    );
    await page.goto("/#message");
    await page
      .getByLabel("Your email", { exact: true })
      .fill("visitor@example.com");
    await page
      .getByLabel("What’s on your mind?")
      .fill("Let’s build something.");
    await page
      .getByRole("button", { name: "Send message", exact: true })
      .click();
    await expect(page.locator(".sig-message-feedback")).toContainText(
      success ? "Message submitted" : "couldn’t confirm",
    );
    await expect(page.getByLabel("What’s on your mind?")).toHaveValue(
      success ? "" : "Let’s build something.",
    );
    expect(calls).toBe(1);
  });
}

test("system motion changes and WebGL context loss keep the content usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page
    .locator("canvas")
    .evaluate((el) =>
      el.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-immersive",
    "false",
  );
  await expect(page.locator("#top .world-static-art")).toBeVisible();
  await page
    .getByRole("link", { name: "Explore my work", exact: true })
    .click();
  await expect(page.locator("#work h2")).toBeInViewport();
});

test("short landscape viewport uses a readable layout", async ({ page }) => {
  await page.setViewportSize({ width: 740, height: 390 });
  await page.goto("/");
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-immersive",
    "false",
  );
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page.locator("#work h2")).toBeVisible();
  await page.locator("#work summary").click();
  await expect(page.locator("#work details")).toContainText(
    "300 seeded synthetic shoppers",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
