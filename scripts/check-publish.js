const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { gzipSync } = require('node:zlib');
const YAML = require('yaml');

const omitted = new Set(['.git', 'node_modules', 'vendor', '.bundle', '.jekyll-cache', '.sass-cache', 'test-results', 'playwright-report']);
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (omitted.has(entry.name)) return [];
    const file = path.join(dir, entry.name);
    assert(!entry.isSymbolicLink(), `Do not publish or reference symlinks: ${file}`);
    return entry.isDirectory() ? files(file) : [file];
  });
}
for (const file of files('.')) {
  assert(!/\.pdf$/i.test(file), `Private PDF found: ${file}`);
  const descriptor = fs.openSync(file, 'r');
  const header = Buffer.alloc(1024);
  fs.readSync(descriptor, header, 0, 1024, 0);
  fs.closeSync(descriptor);
  assert(!header.includes(Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d])), `PDF data found under another name: ${file}`);
}
const allowedRoots = new Set(['index.html', '404.html', 'CNAME', 'robots.txt', 'sitemap.xml']);
for (const file of files('_site')) {
  const relative = path.relative('_site', file);
  assert(allowedRoots.has(relative) || /^assets\/(css|js|media|fonts)\/[a-z0-9_.-]+$/i.test(relative), `Unexpected public file: ${relative}`);
  assert(fs.statSync(file).size < 8_000_000, `Oversized public asset: ${file}`);
}
const html = fs.readFileSync('_site/index.html', 'utf8');
assert(!/<(?:iframe|object|embed)\b/i.test(html), 'No document or third-party embeds are allowed.');
assert(!/\.pdf(?:["?#<\s]|$)/i.test(html), 'No PDF links are allowed.');
assert(!/zema|formspree|googletagmanager/i.test(html), 'Template-specific integration leaked.');
for (const [, source] of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)[^"]*"/g)) {
  assert(fs.existsSync(path.join('_site', source)), `Missing public asset: ${source}`);
}
const book = YAML.parse(fs.readFileSync('_data/book.yml', 'utf8'));
assert.equal(book.authors.length, 4);
for (const item of [...book.retailers, ...book.reading, book.excerpt, ...book.podcasts]) assert.equal(new URL(item.url).protocol, 'https:');
assert(gzipSync(fs.readFileSync('_site/assets/css/main.css')).length < 20_000, 'CSS exceeded 20 KB gzip.');
assert(gzipSync(fs.readFileSync('_site/assets/js/main.js')).length < 8_000, 'JavaScript exceeded 8 KB gzip.');
console.log(`Publish boundary passed: ${files('_site').length} approved files; no PDFs, document embeds, or raw references.`);
