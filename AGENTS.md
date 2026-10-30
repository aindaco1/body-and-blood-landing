# Body and Blood landing page

Static book landing page built on the same Jekyll / GitHub Pages architecture as Zema. Start with README.md. Read docs/EDITING.md and docs/DESIGN.md for content or visual changes, docs/ARCHITECTURE.md for implementation changes, and docs/OPERATIONS.md before publishing.

- Keep it KISS and DRY: Liquid, YAML, SCSS, framework-free JavaScript. No application server or analytics.
- `_data/book.yml` owns public book copy, praise, author names, and external links.
- Preserve full endorsements verbatim. Praise text is italic with no enclosing quotation marks; keep the large decorative opening quote. Italicize only the book title after “Author of” in each attribution. Keep the compact tablet layout and the footer title `Body + Blood`.
- Humanize only assistant-authored prose; do not rewrite sourced quotes, titles, names, or facts. Do not restore the removed slogans listed in docs/EDITING.md.
- **Never copy, commit, embed, link, upload, or publish the full book PDF, interior page images, or extracted manuscript text.** The owner's PDF must stay outside this project. Public book-cover artwork and the three promotional endorsements explicitly requested by the owner are allowed.
- Run `npm test` before publishing. The publish guard checks filenames, PDF signatures, allowed output paths, and embeds.
- All purchase links and reading links work without JavaScript. No automatic third-party embeds.
- The GIF is purely decorative. Honor reduced motion, Save-Data, hidden tabs, and the pause button. Typography never animates.
- Use the Catholic crucifix cursor only on fine pointers. Retain keyboard focus, skip link, and native touch behavior.
- Preserve independent rollback through Git history. No changes belong in Zema or dust-wave-platform for this site.
- Deployment: GitHub Actions verifies before deploying GitHub Pages. Cloudflare owns DNS; no Worker or R2 resources are needed.
- Update the relevant guide when changing its documented behavior. Documentation is excluded from the site build but is public in this GitHub repository.
