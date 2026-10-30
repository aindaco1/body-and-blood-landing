# Body and Blood

Landing page for **Body and Blood: Catholic Horror in America**, by Matthew J. Cressler, Jack Lee Downey, Kathleen Holscher, and Michael Pasquier (NYU Press).

Site: https://bodyandbloodbook.com/

## Architecture

Adapted from `zema-landing`: Jekyll + Liquid/HTML, compressed SCSS, framework-free JavaScript, self-hosted fonts, YAML content, Pages CMS configuration, Playwright/axe, and test-gated GitHub Pages deployment. Cloudflare provides domain DNS. No backend, analytics, font CDN, forms, or media-upload service.

## Local development

Use Ruby 3.3 (CI) and patched Node 24.22.1+ or 26.12.1+.

```sh
bundle install
npm ci
npx playwright install chromium
npm run dev
```

Preview: http://127.0.0.1:4186/

```sh
npm test
git diff --check
```

`npm test` builds Jekyll, checks the publication boundary, and runs browser tests. `npm run test:browser` runs only the browser suite against an existing `_site` build.

## Source map

| Concern | Source |
| --- | --- |
| Public copy, authors, praise, reading and retailer links | `_data/book.yml` |
| Page layout and sections | `index.html`, `_layouts/default.html` |
| Colors, typography, responsive layout | `assets/css/main.scss` |
| Decorative GIF loading and pause control | `assets/js/main.js` |
| Artwork and font provenance | `docs/DESIGN.md` |
| Publication boundary | `scripts/check-publish.js` |
| Browser behavior and accessibility | `tests/e2e/site.spec.js` |
| Domain and canonical URL | `CNAME`, `_config.yml` |
| Editorial schema | `.pages.yml` |
| Release | `.github/workflows/pages.yml` |

## Publishing and rollback

Authorized pushes to `main` run the shared verification action, then upload **only `_site`** to GitHub Pages. GitHub Pages is configured for Actions builds. A custom domain is recorded in `CNAME`; Cloudflare DNS points the apex and `www` to GitHub Pages. Do not reuse Zema's domain, forms, credentials, or Cloudflare services.

To roll back, revert the relevant commit and push `main`; the same verification gate runs before the previous site content is restored. Keep a prior valid commit available. A successful push is not proof of a successful Pages deployment—check the workflow and the live URL.

The full book PDF is deliberately absent. It must never enter this repository, an upload, or the publication output. All PDF visual references remain outside the project. Public media consists only of the publisher's cover and its text-free atmospheric derivative.

## Content editing

Edit `_data/book.yml` directly or connect this repository in Pages CMS using the owner's GitHub account. The schema edits public content only and exposes no file uploader. The CMS configuration does not imply that an account connection has been completed.

Do not invent blurbs, ratings, bestseller labels, or availability. Recheck publisher and retailer facts before changing them. Sources and intentional omissions are documented in `docs/DESIGN.md`.

Automated axe checks supplement manual review. VoiceOver and physical-device testing remain useful release checks.
