# Body and Blood landing page

Static book landing page built on the same Jekyll / GitHub Pages architecture as Zema. Read README.md and docs/DESIGN.md before changes.

- Keep it KISS and DRY: Liquid, YAML, SCSS, framework-free JavaScript. No application server or analytics.
- `_data/book.yml` owns public book copy, praise, author names, and external links.
- **Never copy, commit, embed, link, upload, or publish the full book PDF, interior page images, or extracted manuscript text.** The owner's PDF is a local visual reference only. It must stay outside this project. Public book-cover artwork is allowed.
- Run `npm test` before publishing. The publish guard checks filenames, PDF signatures, allowed output paths, and embeds.
- All purchase links and reading links work without JavaScript. No automatic third-party embeds.
- The GIF is purely decorative. Honor reduced motion, Save-Data, hidden tabs, and the pause button. Typography never animates.
- Use the Catholic crucifix cursor only on fine pointers. Retain keyboard focus, skip link, and native touch behavior.
- Preserve independent rollback through Git history. No changes belong in Zema or dust-wave-platform for this site.
- Deployment: GitHub Actions verifies before deploying GitHub Pages. Cloudflare owns DNS; no Worker or R2 resources are needed.
