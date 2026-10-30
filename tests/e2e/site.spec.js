const { test, expect } = require('@playwright/test');
const { default: AxeBuilder } = require('@axe-core/playwright');

test('readers can find the book, excerpt, praise, and all three retailers', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().includes('127.0.0.1')) errors.push(response.url()); });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('Catholic Horror in America');
  await page.getByRole('link', { name: 'Get your copy' }).first().click();
  await expect(page.locator('#buy')).toBeInViewport();
  await expect(page.locator('.retailer')).toHaveCount(3);
  await expect(page.locator('.excerpt-feature')).toHaveAttribute('href', /crimereads.com\/rosemarys-grandbabies/);
  await expect(page.locator('.praise-card')).toHaveCount(3);
  await expect(page.locator('.essay')).toHaveCount(3);
  await expect(page.locator('iframe, object, embed, a[href$=".pdf"]')).toHaveCount(0);
  const schema = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(schema).author).toHaveLength(4);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bodyandbloodbook.com/');
  expect(errors).toEqual([]);
});

test('layout fits small phones, tablets, and desktop without overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({ width: window.innerWidth, body: document.body.scrollWidth, document: document.documentElement.scrollWidth }));
    expect(metrics.body, `body at ${width}px`).toBeLessThanOrEqual(metrics.width);
    expect(metrics.document, `document at ${width}px`).toBeLessThanOrEqual(metrics.width);
  }
});

test('WCAG 2.2 AA automated checks pass at desktop and phone sizes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations).toEqual([]);
  }
});

test('motion can be paused and resumed without moving any text', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Pause motion' });
  await expect(page.locator('#pool')).toHaveAttribute('src', /pool-ripple.gif$/);
  const bounds = await page.locator('h1').boundingBox();
  await toggle.click();
  await expect(page.locator('#pool')).toHaveAttribute('src', /pool-still.webp$/);
  await expect(page.getByRole('button', { name: 'Play motion' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Play motion' }).click();
  await expect(page.locator('#pool')).toHaveAttribute('src', /pool-ripple.gif$/);
  expect(await page.locator('h1').boundingBox()).toEqual(bounds);
});

test('reduced motion never downloads the GIF and responds to preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await expect(page.locator('#pool')).toHaveAttribute('src', /pool-still.webp$/);
  await expect(page.locator('.motion-toggle')).toBeHidden();
  expect(requests.some(url => url.endsWith('.gif'))).toBe(false);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.motion-toggle')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#pool')).toHaveAttribute('src', /pool-still.webp$/);
});

test('Save-Data visitors get the still background without a GIF request', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true, addEventListener() {} } }));
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await expect(page.locator('.motion-toggle')).toBeHidden();
  expect(requests.some(url => url.endsWith('.gif'))).toBe(false);
});

test('content and purchase navigation work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4187/');
  await page.getByRole('link', { name: 'Get your copy' }).first().click();
  await expect(page.locator('#buy')).toBeInViewport();
  await expect(page.locator('.retailer').first()).toHaveAttribute('href', /nyupress.org/);
  await expect(page.locator('.motion-toggle')).toBeHidden();
  await context.close();
});

test('keyboard skip link and crucifix cursor remain usable', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  const cursor = await page.locator('.retailer').first().evaluate(el => getComputedStyle(el).cursor);
  expect(cursor).toContain('crucifix-cursor.svg');
});
