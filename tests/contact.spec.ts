import { test, expect } from "@playwright/test";

const endpoint = "https://formsubmit.co/ajax/connect@ritvikgoyal.com";

async function fillMessage(page: import("@playwright/test").Page) {
  await page.goto("/?design=signature#sig-contact");
  await page.getByLabel("Your name").fill("Portfolio visitor");
  await page
    .getByLabel("Your email", { exact: true })
    .fill("visitor@example.com");
  await page
    .getByLabel("What’s on your mind?")
    .fill("I would love to talk about a project.");
}

test("contact form submits only the intended fields and confirms acceptance", async ({
  page,
}) => {
  let count = 0;
  await page.route(endpoint, async (route) => {
    count++;
    expect(route.request().postDataJSON()).toMatchObject({
      name: "Portfolio visitor",
      email: "visitor@example.com",
      message: "I would love to talk about a project.",
      _replyto: "visitor@example.com",
      _subject: "New message from ritvikgoyal.com",
    });
    await route.fulfill({ json: { success: "true" } });
  });
  await fillMessage(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Message submitted" }),
  ).toBeVisible();
  await expect(page.getByLabel("Your email", { exact: true })).toHaveValue("");
  await expect(page.locator(".sig-contact-email > a")).toHaveText(
    "connect@ritvikgoyal.com",
  );
  expect(count).toBe(1);
});

for (const failure of ["rejected", "network"]) {
  test(`contact form preserves drafts after ${failure} failure and can retry`, async ({
    page,
  }) => {
    let accepted = false;
    await page.route(endpoint, async (route) => {
      if (accepted) await route.fulfill({ json: { success: true } });
      else if (failure === "network") await route.abort();
      else
        await route.fulfill({
          json: { success: "false", message: "Form not activated" },
        });
    });
    await fillMessage(page);
    await page
      .getByRole("button", { name: "Send message", exact: true })
      .click();
    await expect(page.locator(".sig-message-feedback")).toContainText(
      "couldn’t confirm",
    );
    await expect(page.getByLabel("What’s on your mind?")).toHaveValue(
      "I would love to talk about a project.",
    );
    await expect(page.getByLabel("Your email", { exact: true })).toHaveValue(
      "visitor@example.com",
    );
    accepted = true;
    await page
      .getByRole("button", { name: "Send message", exact: true })
      .click();
    await expect(page.locator(".sig-message-feedback")).toContainText(
      "Message submitted",
    );
  });
}

test("empty, invalid, whitespace and honeypot submissions are not sent", async ({
  page,
}) => {
  let count = 0;
  await page.route(endpoint, async (route) => {
    count++;
    await route.fulfill({ json: { success: true } });
  });
  await page.goto("/?design=signature#sig-contact");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await page.getByLabel("Your email", { exact: true }).fill("not-an-email");
  await page.getByLabel("What’s on your mind?").fill("Hello");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await page
    .getByLabel("Your email", { exact: true })
    .fill("visitor@example.com");
  await page.getByLabel("What’s on your mind?").fill("   ");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await page.getByLabel("What’s on your mind?").fill("Hello");
  await page.locator('[name="_honey"]').evaluate((node) => {
    (node as HTMLInputElement).value = "spam";
  });
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  expect(count).toBe(0);
});

test("a pending request disables duplicate submissions and keeps the draft on timeout", async ({
  page,
}) => {
  await page.route(endpoint, () => {});
  await fillMessage(page);
  await page.clock.install();
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  await page.clock.fastForward(21000);
  await expect(page.locator(".sig-message-feedback")).toContainText(
    "couldn’t confirm",
  );
  await expect(page.getByLabel("Your email", { exact: true })).toHaveValue(
    "visitor@example.com",
  );
});
