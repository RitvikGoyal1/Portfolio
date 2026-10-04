import { test, expect } from '@playwright/test';

const designs = ['obsidian', 'atelier', 'signal'] as const;
const controls = {
  obsidian: ['Unfold the idea', 'Reassemble'],
  atelier: ['Pull it apart', 'Bring it together'],
  signal: ['Change your perspective', 'Restore the orbit'],
};

for (const design of designs) {
  for (const width of [390, 768, 1440]) {
    test(`${design}: complete and usable at ${width}px`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/?design=${design}`);
      await expect(page.locator(`.${design}`)).toBeVisible();
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('canvas')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const [before, after] = controls[design];
      await page.getByRole('button', { name: before, exact: true }).click();
      await expect(page.getByRole('button', { name: after, exact: true })).toHaveAttribute('aria-pressed', 'true');
      await page.getByRole('button', { name: after, exact: true }).click();
      await expect(page.getByRole('button', { name: before, exact: true })).toHaveAttribute('aria-pressed', 'false');
      const missingAnchors = await page.locator(`.${design} a[href^="#"]`).evaluateAll(links => links.map(link => link.getAttribute('href')!.slice(1)).filter(id => id && !document.getElementById(id)));
      expect(missingAnchors).toEqual([]);
      for (const image of await page.locator(`.${design} img`).all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toBeVisible();
        await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      }
      const contact = page.locator(`.${design} a[href="mailto:connect@ritvikgoyal.com"]`).first();
      await contact.scrollIntoViewIfNeeded();
      await expect(contact).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]);
    });
  }
  test(`${design}: reduced motion and no WebGL fallback`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
        if (type.startsWith('webgl')) return null;
        return Reflect.apply(original, this, [type, ...args]);
      } as typeof original;
    });
    await page.goto(`/?design=${design}`);
    await expect(page.locator('main h1')).toBeVisible();
    const [before, after] = controls[design];
    await page.getByRole('button', { name: before, exact: true }).click();
    await expect(page.getByRole('button', { name: after, exact: true })).toBeVisible();
    await expect(page.locator('body')).not.toContainText('This scene couldn’t load');
  });
}

test('comparison switcher, browser history, and hidden controls', async ({ page }) => {
  await page.goto('/?design=obsidian');
  const switcher = page.getByRole('navigation', { name: 'Portfolio design explorations' });
  await switcher.getByRole('button', { name: '02 Atelier' }).click();
  await expect(page.locator('.atelier')).toBeVisible();
  await expect(page).toHaveURL(/design=atelier/);
  await switcher.getByRole('button', { name: '03 Signal' }).click();
  await expect(page.locator('.signal')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.atelier')).toBeVisible();
  await page.getByRole('button', { name: 'Hide design comparison controls' }).click();
  await expect(switcher).toHaveCount(0);
  await page.getByRole('button', { name: 'Show design comparison controls' }).click();
  await expect(switcher).toBeVisible();
});

test('Signal filters and archive expose real projects', async ({ page }) => {
  await page.goto('/?design=signal');
  await page.getByRole('group', { name: 'Filter projects' }).getByRole('button', { name: /Mobile/ }).click();
  await expect(page.locator('.signal-project-selector button')).toHaveCount(1);
  await expect(page.locator('.signal-project-selector')).toContainText('mapSTEM');
  await expect(page.locator('.signal-work a[href*="apps.apple.com"]').first()).toBeVisible();
  await page.getByRole('button', { name: /Open the archive/ }).click();
  await expect(page.locator('#signal-archive-list')).toBeVisible();
  await expect(page.locator('#signal-archive-list a')).toHaveCount(3);
});
