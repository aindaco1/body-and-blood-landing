# Design, sources, and media

For designers and maintainers preserving the site's visual direction. [Content editing](EDITING.md) records editorial rules; [Operations](OPERATIONS.md) covers release checks.

## Direction

The book's cover establishes scarlet, deep burgundy, near-black, and ivory; its title uses widely tracked, delicate capitals. The interior title page supplies a restrained serif counterpart. Julius Sans One approximates the cover's lettering; EB Garamond supplies the literary text; Jost handles small labels and controls. These are open-license approximations, not extracted commercial fonts. All are self-hosted with their SIL Open Font License files.

The short sequence borrows the clarity of https://jamesclear.com/atomic-habits: immediate purchase intent, a concise premise, praise cards, an excerpt, supporting reading/listening, and a final retailer choice. No copy or imagery from Atomic Habits is used.

### Typography and color

| Element | Current treatment |
| --- | --- |
| Hero title, author line, footer title | Julius Sans One; delicate, widely spaced capitals |
| Section headings and praise | EB Garamond, exposed as `Garamond` in CSS |
| Body copy, navigation, attributions | Jost |
| Primary text | Ivory `#fff6e9` |
| Secondary text | `#d2bcb3` |
| Page fallback | Near-black burgundy `#190606` |
| Background | Red pool artwork under dark gradients for text contrast |

The three WOFF2 files and their SIL Open Font License files live in `assets/fonts`. Only normal 400-weight faces are declared; browsers synthesize the requested italics. If adding a dedicated italic font later, self-host it, keep its license, and recheck wrapping. Font files were not extracted from the private book.

### Praise layout

The owner requested full endorsements but found three narrow columns too tall on tablets. Keep the responsive arrangement below. Pixel equivalents assume the browser's default 16 px root font size.

| Viewport width | Layout | Quote size | Card padding |
| --- | --- | --- | --- |
| Up to 700 px | One column | `1.0625rem` / 17 px | 22 px |
| 701–1100 px | Two columns; third card spans the next row | `1rem` / 16 px | 24 px |
| Above 1100 px | Three columns | `1.0625rem` / 17 px | 24 px |

Quote line-height is `1.45`, and the decorative opening mark is `2.75rem`. Cards grow with their content; do not add fixed heights, clipping, line clamps, or excerpt truncation. The layout and current tests assume three endorsements. Review both before changing the count.

The quote and attribution formatting contract is in [Content editing](EDITING.md#praise-format). Use `assets/css/main.scss` for size and spacing changes, keeping all breakpoints together with the existing responsive rules.

## Public content sources (checked October 30, 2026)

- Publisher, authors, description, and praise: https://nyupress.org/9781479845859/body-and-blood/
- Featured adapted excerpt: https://crimereads.com/rosemarys-grandbabies-how-a-new-wave-of-horror-changed-america/ (October 28, 2026).
- Essay series: the three The Revealer links in `_data/book.yml`, originally published in 2022. These are related essays, not represented as new book reviews or excerpts.
- Podcast: https://therevealer.org/the-revealer-podcast-episode-27-catholic-horror/ (July 26, 2022). Link out; never preload a third-party player.
- NPR audio: https://www.npr.org/2026/10/30/nx-s1-6019382/why-scary-movies-keep-borrowing-ideas-from-religion (October 30, 2026). The source page identifies Deena Prichep, All Things Considered, and a 4:12 runtime. The card uses the exact headline and an original short summary of the page description; it makes no claim about book-author participation. Link to NPR rather than embedding or hosting the audio.
- Retailer URLs were supplied by the owner; the publisher is the authority for book metadata. Prices are intentionally omitted.
- The supplied Lindsey Sells Books listing was reviewed but omitted: it attributes a four-author book to one author and shows inconsistent ratings. It is not used as a source of praise.

Praise cards contain all three full endorsements, supplied on the promotional page of the owner's reference file and checked against the public NYU Press listing. Kelly J. Baker's final sentence follows the public listing's “A necessary read” wording (the supplied promotional page says “A necessary book”). Quotes, names, and attribution have not been humanized. No interior manuscript content is published. The CrimeReads feature links to the adapted excerpt and uses an original short summary rather than reproducing the article.

The Humanizer and Constrained Humanization Editing skills were applied only to assistant-authored website copy: metadata, the introduction, supporting summaries, and generic headings/link labels. Book and article titles, author names, dates, URLs, publisher facts, and endorsement wording remain sourced. [Content editing](EDITING.md#decisions-to-retain) records the owner's wording decisions and removed slogans.

### Listening cards

Keep CrimeReads as the main feature. Supporting audio follows in `podcasts[]` order, with NPR first. Above 1000 px, compact listening cards stack beside the essays. At 701–1000 px, they sit side by side below the essays; on phones, they stack in one column. Preserve full titles and summaries and let cards grow with their text. The cards are ordinary links, with no player, audio preload, or external script.

## Artwork

- `assets/media/book-cover.webp`: public NYU Press jacket, downloaded from `https://ingram-nyu.imgix.net/covers/9781479845859.jpg?w=1000&q=90`, optimized to 800 × 1200.
- `assets/media/pool-still.webp`: built-in image-generation edit of the owner's attached cover screenshot. All lettering and the central plus were removed. The source book PDF was never passed to an image service.
- `assets/media/pool-ripple.gif`: six-second, 8 fps seamless displacement loop from the text-free source. Maximum local displacement is 1.5 pixels at 640px width. No lettering is baked into the animation. Recreate with `node scripts/animate-pool.js /absolute/path/to/text-free-pool.png` (requires ffmpeg).
- `assets/media/social.jpg`: screenshot of the site's HTML hero for social previews.
- `assets/media/crucifix-cursor.svg`: original small vector crucifix with corpus, ivory cross, and dark outline. CSS-only, 32 × 40, fine pointers only; no follower overlay or pointer interception.

Static image and GIF use identical aspect ratios and positioning. JavaScript hydrates the GIF after load, and only when motion and data preferences permit. Pause swaps back to the still; reduced-motion, Save-Data, no-JavaScript, and image-error fallbacks show the still. Hidden tabs stop displaying the GIF.

### Regenerate the ripple

The existing text-free still can be used as input; no private reference file is needed. With `ffmpeg` available, run from the repository root:

```sh
node scripts/animate-pool.js assets/media/pool-still.webp
```

This overwrites `assets/media/pool-ripple.gif`. Review the loop and its diff, check that the motion remains subtle, and run `npm test` before publishing. Keep the still and GIF composition aligned so pausing does not visibly jump. Save intermediate images outside the repository. The social preview is a separate static image; changing HTML does not regenerate it.

### Final image-edit prompt

Built-in `image_gen` tool, `precise-object-edit`:

> Edit the supplied book cover screenshot. Remove ALL white lettering and the central white cross/plus completely, reconstructing the red liquid/glass texture naturally under every letter. Remove the narrow charcoal screenshot bars on the left and right. Preserve the exact overhead photographic composition of the blood-red pool / red glass bowl, the circular concentric glass rings, scarlet and deep crimson palette, dark black shadows and the warm subtle orange edge highlights. Keep the central circular ring slightly below center like the original; no added objects, no new typography, no symbol, no watermark, no splashes, no hands. Preserve organic texture and the photographic irregularities, not a synthetic perfect gradient. Return a single clean high-resolution portrait background image, edge to edge. This is the still source for later very subtle ripple animation; do not render any motion blur.

## Private reference boundary

The supplied 252-page review PDF was inspected locally for cover and typography. Its promotional page also supplies the full endorsements requested by the owner. The file remains outside the project. No PDF, page image, interior manuscript text, extracted embedded font, or review-copy contact sheet belongs in the repository. Git ignores PDF extensions and the build guard rejects both PDF filenames and PDF signatures, including renamed files. The `_site` allowlist excludes documentation, tools, dependencies, source references, and temporary media.

## Decision history

These October 30, 2026 commits explain the initial choices. Use the current files for implementation details and `git log` for later changes.

| Commit | Decision |
| --- | --- |
| [`d0891bf`](https://github.com/aindaco1/body-and-blood-landing/commit/d0891bf7ea547d43b6e57953ad11a92ea2b71707) | Initial independent Jekyll site, public assets, restrained ripple, crucifix cursor, publication checks |
| [`e2b1839`](https://github.com/aindaco1/body-and-blood-landing/commit/e2b18399bcb8ad65d87433d32f028625ab9467ab) | Full endorsements, selective humanization, slogan removals, `Body + Blood` footer |
| [`3b88e20`](https://github.com/aindaco1/body-and-blood-landing/commit/3b88e20663557c27c1a45bfb2c59334d336ecc66) | Smaller praise type and wider tablet cards |
| [`ae5be3a`](https://github.com/aindaco1/body-and-blood-landing/commit/ae5be3aa7ffab1aa14621d0cbab203a3bd625395) | Italic praise without enclosing quotes; decorative mark retained; attribution titles italicized |
