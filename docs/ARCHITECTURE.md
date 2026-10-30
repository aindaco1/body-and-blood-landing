# Architecture

For developers maintaining the site. This describes the implementation as of October 30, 2026; the linked source files remain authoritative.

## Build and hosting

```text
YAML content + Liquid templates + SCSS + static assets
                       |
                 Jekyll build
                       |
                     _site
                       |
          publication guard + browser tests
                       |
             GitHub Pages deployment
                       |
             bodyandbloodbook.com
```

Cloudflare supplies DNS. GitHub Pages serves the site and its HTTPS certificate. There is no Worker, R2 bucket, server-side application, database, or checkout integration. Retailer links lead to external stores.

The project follows Zema's architecture but is an independent repository. It does not import Zema or Dust Wave Platform, and releases do not require changes in either project. All fonts and page media are served from this repository.

## Source map

| File | Responsibility |
| --- | --- |
| [`_data/book.yml`](../_data/book.yml) | Public book metadata, authors, intro, praise, article/podcast summaries, retailers |
| [`index.html`](../index.html) | Hero, about, praise, reading/listening, and purchase sections |
| [`_layouts/default.html`](../_layouts/default.html) | Page shell, background, navigation, footer, motion button |
| [`_includes/head.html`](../_includes/head.html) | Metadata, canonical URL, social cards, Book JSON-LD, asset loading |
| [`assets/css/main.scss`](../assets/css/main.scss) | Typography, color, layout, responsive rules, cursor, focus styles |
| [`assets/js/main.js`](../assets/js/main.js) | Decorative background motion only |
| [`_config.yml`](../_config.yml) | Site URL, compressed SCSS, build exclusions |
| [`.pages.yml`](../.pages.yml) | Pages CMS fields for editing the YAML file |
| [`CNAME`](../CNAME), [`robots.txt`](../robots.txt), [`sitemap.xml`](../sitemap.xml) | Domain, crawling, and homepage discovery |
| [`scripts/check-publish.js`](../scripts/check-publish.js) | Publication checks and size budgets |
| [`tests/e2e/site.spec.js`](../tests/e2e/site.spec.js) | Browser behavior and automated accessibility checks |
| [`.github/actions/verify-site/action.yml`](../.github/actions/verify-site/action.yml) | Shared CI dependency setup and verification |
| [`.github/workflows/check.yml`](../.github/workflows/check.yml) | Pull-request checks; no deployment |
| [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) | Build and Pages deployment on `main` or manual dispatch |

Dependencies are locked in `Gemfile.lock` and `package-lock.json`. `Gemfile` uses the `github-pages` gem. npm dependencies support validation; there is no JavaScript application bundle.

The `private: true` field in `package.json` prevents npm package publication. It does not change the GitHub repository's public visibility.

## Rendering contracts

Liquid renders content during the build. Links, navigation, purchase options, and readable content work without JavaScript. Existing section targets are `#main`, `#about`, `#read`, and `#buy`. The praise heading has `id="praise-title"`; there is no `#praise` section target.

Book JSON-LD uses the YAML title, subtitle, description, ISBN, publisher, and four authors. The browser title uses `_config.yml`. Some visual labels remain in templates; see [Content editing](EDITING.md) before renaming the book or changing credits.

## Motion lifecycle

The HTML initially loads `pool-still.webp`. After page load, JavaScript switches to the GIF only when motion is allowed, the user has not paused it, and the document is visible.

- Reduced-motion or Save-Data preferences keep the still image and hide the motion control.
- Pause switches back to the still. The choice lasts for the page session; it is not stored across reloads.
- Visibility and page navigation events update the image. A hidden tab displays the still.
- A GIF load failure falls back to the still and hides the control until readiness is restored.
- Without JavaScript, the still remains and the button stays hidden.

The background is decorative and hidden from assistive technology. Text never animates. The crucifix cursor is CSS-only and applies only to hovering, fine pointers; touch behavior and text-input cursors remain native.

## Publication checks

The build guard scans repository files outside its excluded dependency/cache directories for PDF filenames, PDF signatures in the first 1,024 bytes, and symlinks. It checks generated HTML for document embeds, PDF links, missing referenced assets, and known leftover template integrations.

Allowed output is limited to named root files and flat `assets/css`, `assets/js`, `assets/media`, and `assets/fonts` paths. Each output file must be below 8,000,000 bytes; compressed CSS below 20,000 bytes and JavaScript below 8,000 bytes. Retailer and reading URLs must use HTTPS, and four authors must be present.

These are bounded checks, not a manuscript detector or a guarantee that all content is appropriate. Review staged files and generated output before release. Build exclusions keep docs and tooling off the website; they do not make committed files private.
