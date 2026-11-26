const { test, expect } = require('@playwright/test');
const { default: AxeBuilder } = require('@axe-core/playwright');
const { readFileSync } = require('node:fs');
const YAML = require('yaml');
const { film: filmData } = YAML.parse(readFileSync('_data/book.yml', 'utf8'));

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
    await page.locator('#film summary').click();
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({ width: window.innerWidth, body: document.body.scrollWidth, document: document.documentElement.scrollWidth }));
    expect(metrics.body, `body at ${width}px`).toBeLessThanOrEqual(metrics.width);
    expect(metrics.document, `document at ${width}px`).toBeLessThanOrEqual(metrics.width);
  }
});

test('the film loads YouTube only after a reader presses Play', async ({ page }) => {
  const external = [];
  page.on('request', request => {
    if (new URL(request.url()).hostname !== '127.0.0.1') external.push(request.url());
  });
  const embed = `https://www.youtube-nocookie.com/embed/${filmData.youtube_id}?autoplay=1&playsinline=1`;
  await page.route(embed, route => route.fulfill({ contentType: 'text/html', body: '<title>Film player</title>' }));
  await page.goto('/');
  await page.getByRole('link', { name: 'Film', exact: true }).click();
  const film = page.locator('#read + #film:has(+ #buy)');
  await expect(film).toBeInViewport();
  const poster = film.locator('.film-player img');
  await expect.poll(() => poster.evaluate(img => img.naturalWidth)).toBe(1280);
  await expect(film.locator('iframe')).toHaveCount(0);
  expect(external).toEqual([]);
  const play = film.getByRole('button', { name: 'Play film' });
  await play.focus();
  await page.keyboard.press('Enter');
  const player = film.locator('iframe');
  await expect(player).toHaveAttribute('src', embed);
  await expect(player).toHaveAccessibleName(filmData.title);
  await expect(player).toBeFocused();
  await expect(film.getByRole('link', { name: 'Watch on YouTube' })).toBeVisible();
  expect(external).toEqual([embed]);
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
  await page.getByRole('link', { name: 'Film', exact: true }).click();
  const film = page.locator('#film');
  await expect(film.locator('iframe, button:visible')).toHaveCount(0);
  await expect(film.getByRole('link', { name: 'Watch on YouTube' })).toHaveAttribute('href', `https://www.youtube.com/watch?v=${filmData.youtube_id}`);
  await film.locator('summary').click();
  await expect(film.getByRole('listitem')).toHaveText(filmData.sounds);
  await expect(film.getByRole('listitem').last()).toBeVisible();
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
