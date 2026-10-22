import { expect, test, type Page } from "@playwright/test";

const chapters = ["top", "work", "wealthsnaps", "studyflow", "about", "contact"];
const viewports = [
  { width: 320, height: 568, touch: true },
  { width: 390, height: 844, touch: true },
  { width: 768, height: 1024, touch: true },
  { width: 1366, height: 768, touch: false },
  { width: 1920, height: 1080, touch: false },
];

async function ready(page: Page) {
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-ready",
    "true",
  );
}

async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
}

for (const viewport of viewports) {
  test(`world device ${viewport.width}×${viewport.height}: chapters, targets and expanded notes`, async ({
    browser,
    browserName,
    baseURL,
  }, testInfo) => {
    test.setTimeout(90000);
    const context = await browser.newContext({
      baseURL,
      viewport,
      hasTouch: viewport.touch,
      isMobile: browserName !== "firefox" && viewport.touch,
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    try {
      await page.goto("/");
      await ready(page);
      for (const chapter of chapters) {
        const link = page.locator(`.world-chapter-nav a[href='#${chapter}']`);
        if (viewport.touch) await link.tap();
        else await link.click();
        await expect(page.locator(".playground")).toHaveAttribute(
          "data-chapter",
          chapter,
        );
        await noOverflow(page);
        const copy = await page
          .locator(`#${chapter} .world-copy`)
          .boundingBox();
        const bottomBar = await page.locator(".world-bottom-bar").boundingBox();
        expect(copy).not.toBeNull();
        expect(copy!.x).toBeGreaterThanOrEqual(0);
        expect(copy!.x + copy!.width).toBeLessThanOrEqual(viewport.width);
        expect(copy!.y + copy!.height).toBeLessThanOrEqual(bottomBar!.y - 3);
        const hiddenPanels = await page
          .locator(".world-panel")
          .evaluateAll((panels) =>
            panels
              .filter(
                (panel) =>
                  !panel
                    .closest("section")
                    ?.matches(
                      `#${document.querySelector(".playground")?.getAttribute("data-chapter")}`,
                    ),
              )
              .every((panel) => (panel as HTMLElement).inert),
          );
        expect(hiddenPanels).toBe(true);
      }
      await page.locator(".world-chapter-nav a[href='#work']").click();
      const summary = page.locator("#work summary");
      if (viewport.touch) {
        for (const selector of [
          ".world-chapter-nav a",
          ".world-header nav a",
          "#work summary",
          "#work .world-object-action",
        ]) {
          for (const element of await page.locator(selector).all()) {
            if (!(await element.isVisible())) continue;
            const rect = (await element.boundingBox())!;
            expect(rect.width, selector).toBeGreaterThanOrEqual(24);
            expect(rect.height, selector).toBeGreaterThanOrEqual(44);
          }
        }
        await summary.tap();
      } else await summary.click();
      await expect(page.locator("#work details")).toHaveAttribute("open", "");
      const notes = (await page.locator("#work details > div").boundingBox())!;
      expect(notes.y).toBeGreaterThanOrEqual(60);
      expect(notes.y + notes.height).toBeLessThanOrEqual(viewport.height - 42);
      await expect(page.locator("#work details")).toContainText(
        "300 seeded synthetic shoppers",
      );
      await page.screenshot({
        path: testInfo.outputPath("expanded-notes.png"),
      });
      await summary.click();
      await page.locator("#work .world-object-action").click();
      await expect(page.locator("#work .world-object-action")).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
}

test("keyboard can skip to projects, use notes and bypass the hidden footer rail", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await ready(page);
  const tab = browserName === "webkit" ? "Alt+Tab" : "Tab";
  await page.keyboard.press(tab);
  await expect(page.locator(".world-skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-chapter",
    "work",
  );
  await page.locator("#work summary").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#work details")).toHaveAttribute("open", "");
  expect(
    await page
      .locator("#work summary")
      .evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe("none");
  await page.keyboard.press("Enter");
  await page.locator("#work .world-object-action").focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#work .world-object-action")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator(".world-chapter-nav a[href='#contact']").click();
  await page.locator(".world-message-link").click();
  await expect
    .poll(() =>
      page
        .locator(".world-chapter-nav")
        .evaluate((el) => (el as HTMLElement).inert),
    )
    .toBe(true);
  await page.keyboard.press(tab);
  await page.locator(".world-footer-bottom a").focus();
  await page.keyboard.press(tab);
  await expect(page.locator(".world-mode")).toBeFocused();
});

test("rotation preserves manually scrolled chapters instead of restoring a stale hash", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#work");
  await ready(page);
  await page.locator("#studyflow").evaluate((el) => el.scrollIntoView());
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-chapter",
    "studyflow",
  );
  await expect(page).toHaveURL(/#work$/);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-immersive",
    "false",
  );
  await expect(page.locator("#studyflow h2")).toBeInViewport();
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-chapter",
    "studyflow",
  );
  await noOverflow(page);
});

test("expanding reading-mode notes does not programmatically jump the page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#work");
  await expect(page.locator(".world-mode")).toBeVisible();
  // Isolate script-driven scrolling from each browser's native scroll anchoring.
  await page.addStyleTag({
    content: "html, body { overflow-anchor: none !important; }",
  });
  const summary = page.locator("#work summary");
  await summary.evaluate((el) => {
    el.scrollIntoView({ block: "center" });
    el.focus({ preventScroll: true });
  });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  const before = await page.evaluate(() => scrollY);
  await page.keyboard.press("Enter");
  await expect(page.locator("#work details")).toHaveAttribute("open", "");
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  expect(
    Math.abs((await page.evaluate(() => scrollY)) - before),
  ).toBeLessThanOrEqual(1);
});

test("resizing immersive layout preserves progress and browser history remains reversible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await ready(page);
  await page.locator(".world-chapter-nav a[href='#work']").click();
  await page.locator(".world-chapter-nav a[href='#wealthsnaps']").click();
  await page.setViewportSize({ width: 900, height: 1200 });
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-chapter",
    "wealthsnaps",
  );
  await expect
    .poll(async () =>
      Number(await page.locator("canvas").getAttribute("data-progress")),
    )
    .toBeCloseTo(2, 2);
  await page.goBack();
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-chapter",
    "work",
  );
  await page.goForward();
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-chapter",
    "wealthsnaps",
  );
});

test("WebGL loss at depth preserves the current reading position", async ({
  page,
}) => {
  await page.goto("/#work");
  await ready(page);
  await page.locator("#about").evaluate((el) => el.scrollIntoView());
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-chapter",
    "about",
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
  await expect(page.locator("#about h2")).toBeInViewport();
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("a failed scene chunk keeps artwork and navigation usable", async ({
  page,
}) => {
  await page.route(/(?:worldEngine|three-).*\.(?:tsx?|js)(?:\?.*)?$/, (route) =>
    route.abort(),
  );
  await page.goto("/");
  await expect(page.locator(".world-mode")).toBeVisible();
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-immersive",
    "false",
  );
  await expect(page.locator("#top .world-static-art")).toBeVisible();
  await page
    .getByRole("link", { name: "Explore my work", exact: true })
    .click();
  await expect(page.locator("#work h2")).toBeInViewport();
  await noOverflow(page);
});

test("200% desktop zoom equivalent retains readable content and form access", async ({
  page,
}) => {
  // Halving both CSS viewport dimensions represents 200% desktop zoom reflow.
  await page.setViewportSize({ width: 720, height: 450 });
  await page.goto("/");
  await expect(page.locator(".world-mode")).toBeVisible();
  await expect(page.locator(".playground")).toHaveAttribute(
    "data-immersive",
    "false",
  );
  for (const chapter of chapters) {
    await page.locator(`#${chapter}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${chapter} h1, #${chapter} h2`)).toBeVisible();
    await noOverflow(page);
  }
  await page.locator("#work summary").click();
  await expect(page.locator("#work details")).toContainText(
    "300 seeded synthetic shoppers",
  );
  await page.getByLabel("Your email", { exact: true }).fill("zoom@example.com");
  await expect(page.getByLabel("Your email", { exact: true })).toBeFocused();
});

test("network failure preserves the contact draft and an intercepted retry succeeds", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let calls = 0;
  await page.route(
    "https://formsubmit.co/ajax/connect@ritvikgoyal.com",
    async (route) => {
      calls++;
      if (calls === 1) await route.abort("internetdisconnected");
      else await route.fulfill({ json: { success: true } });
    },
  );
  await page.goto("/#message");
  await page
    .getByLabel("Your email", { exact: true })
    .fill("device-qa@example.com");
  await page
    .getByLabel("What’s on your mind?")
    .fill("Intercepted device QA; no message is sent.");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".sig-message-feedback")).toContainText(
    "couldn’t confirm",
  );
  await expect(page.locator(".sig-message-feedback")).toBeFocused();
  await expect(page.getByLabel("What’s on your mind?")).toHaveValue(
    "Intercepted device QA; no message is sent.",
  );
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".sig-message-feedback")).toContainText(
    "Message submitted",
  );
  await expect(page.locator(".sig-message-feedback")).toBeFocused();
  expect(calls).toBe(2);
});

test("reading copy and footer focus retain contrast on their solid backgrounds", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await ready(page);
  await page.locator(".world-mode").click();
  const textSamples = await page.evaluate(() => {
    const samples: {
      selector: string;
      color: string;
      background: string;
      opacity: number;
    }[] = [];
    for (const selector of [
      "#top .world-eyebrow",
      "#work .world-description",
      "#about .world-description",
      ".world-bottom-bar",
      ".sig-message-intro p",
      ".sig-message-actions p",
      ".world-footer-bottom",
    ]) {
      const element = document.querySelector<HTMLElement>(selector)!;
      const style = getComputedStyle(element);
      const base =
        element.closest(".world-message") ||
        document.querySelector(".playground")!;
      samples.push({
        selector,
        color: style.color,
        background: getComputedStyle(base).backgroundColor,
        opacity: Number(style.opacity),
      });
    }
    return samples;
  });
  const luminance = (channels: number[]) =>
    channels
      .map((value) => {
        const linear = value / 255;
        return linear <= 0.04045
          ? linear / 12.92
          : ((linear + 0.055) / 1.055) ** 2.4;
      })
      .reduce(
        (value, channel, index) =>
          value + channel * [0.2126, 0.7152, 0.0722][index],
        0,
      );
  const contrast = (color: string, background: string, opacity = 1) => {
    const parse = (value: string) =>
      value
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number);
    const bg = parse(background);
    const fg = parse(color).map(
      (channel, i) => channel * opacity + bg[i] * (1 - opacity),
    );
    const levels = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
    return (levels[0] + 0.05) / (levels[1] + 0.05);
  };
  const evidence = textSamples.map((sample) => ({
    ...sample,
    ratio: contrast(sample.color, sample.background, sample.opacity),
  }));
  for (const sample of evidence)
    expect(sample.ratio, sample.selector).toBeGreaterThanOrEqual(4.5);
  await page.keyboard.press("Tab");
  await page.locator(".world-footer-bottom a").focus();
  await expect(page.locator(".playground")).toHaveAttribute("data-end", "true");
  for (const selector of [
    ".world-footer-bottom a",
    ".world-mode",
    ".world-header nav a:first-child",
  ]) {
    await page.locator(selector).focus();
    const focus = await page.locator(selector).evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        outline: style.outlineColor,
        width: parseFloat(style.outlineWidth),
        background: getComputedStyle(document.querySelector(".world-message")!)
          .backgroundColor,
      };
    });
    expect(focus.width, selector).toBeGreaterThanOrEqual(2);
    expect(
      contrast(focus.outline, focus.background),
      selector,
    ).toBeGreaterThanOrEqual(3);
  }
  await testInfo.attach("solid-background-contrast", {
    body: JSON.stringify(evidence, null, 2),
    contentType: "application/json",
  });
});
