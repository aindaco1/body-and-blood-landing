# Design, sources, and media

## Direction

The book's cover establishes scarlet, deep burgundy, near-black, and ivory; its title uses widely tracked, delicate capitals. The interior title page supplies a restrained serif counterpart. Julius Sans One approximates the cover's lettering; EB Garamond supplies the literary text; Jost handles small labels and controls. These are open-license approximations, not extracted commercial fonts. All are self-hosted with their SIL Open Font License files.

The short sequence borrows the clarity of https://jamesclear.com/atomic-habits: immediate purchase intent, a concise premise, praise cards, an excerpt, supporting reading/listening, and a final retailer choice. No copy or imagery from Atomic Habits is used.

## Public content sources (checked October 30, 2026)

- Publisher, authors, description, and praise: https://nyupress.org/9781479845859/body-and-blood/
- Featured adapted excerpt: https://crimereads.com/rosemarys-grandbabies-how-a-new-wave-of-horror-changed-america/ (October 28, 2026).
- Essay series: the three The Revealer links in `_data/book.yml`, originally published in 2022. These are related essays, not represented as new book reviews or excerpts.
- Podcast: https://therevealer.org/the-revealer-podcast-episode-27-catholic-horror/ (July 26, 2022). Link out; never preload a third-party player.
- Retailer URLs were supplied by the owner; the publisher is the authority for book metadata. Prices are intentionally omitted.
- The supplied Lindsey Sells Books listing was reviewed but omitted: it attributes a four-author book to one author and shows inconsistent ratings. It is not used as a source of praise.

Praise cards contain short, exact fragments from publisher-listed endorsements (21 quoted words total), with author attribution and a link to the complete praise. The CrimeReads feature links to the adapted excerpt and uses an original short summary rather than reproducing the article. No interior manuscript content is published.

## Artwork

- `assets/media/book-cover.webp`: public NYU Press jacket, downloaded from `https://ingram-nyu.imgix.net/covers/9781479845859.jpg?w=1000&q=90`, optimized to 800 × 1200.
- `assets/media/pool-still.webp`: built-in image-generation edit of the owner's attached cover screenshot. All lettering and the central plus were removed. The source book PDF was never passed to an image service.
- `assets/media/pool-ripple.gif`: six-second, 8 fps seamless displacement loop from the text-free source. Maximum local displacement is 1.5 pixels at 640px width. No lettering is baked into the animation. Recreate with `node scripts/animate-pool.js /absolute/path/to/text-free-pool.png` (requires ffmpeg).
- `assets/media/social.jpg`: screenshot of the site's HTML hero for social previews.
- `assets/media/crucifix-cursor.svg`: original small vector crucifix with corpus, ivory cross, and dark outline. CSS-only, 32 × 40, fine pointers only; no follower overlay or pointer interception.

Static image and GIF use identical aspect ratios and positioning. JavaScript hydrates the GIF after load, and only when motion and data preferences permit. Pause swaps back to the still; reduced-motion, Save-Data, no-JavaScript, and image-error fallbacks show the still. Hidden tabs stop displaying the GIF.

### Final image-edit prompt

Built-in `image_gen` tool, `precise-object-edit`:

> Edit the supplied book cover screenshot. Remove ALL white lettering and the central white cross/plus completely, reconstructing the red liquid/glass texture naturally under every letter. Remove the narrow charcoal screenshot bars on the left and right. Preserve the exact overhead photographic composition of the blood-red pool / red glass bowl, the circular concentric glass rings, scarlet and deep crimson palette, dark black shadows and the warm subtle orange edge highlights. Keep the central circular ring slightly below center like the original; no added objects, no new typography, no symbol, no watermark, no splashes, no hands. Preserve organic texture and the photographic irregularities, not a synthetic perfect gradient. Return a single clean high-resolution portrait background image, edge to edge. This is the still source for later very subtle ripple animation; do not render any motion blur.

## Private reference boundary

The supplied 252-page review PDF was inspected locally for cover and typography only. It remains outside the project. No PDF, page image, manuscript text, extracted embedded font, or review-copy contact sheet belongs in the repository. Git ignores PDF extensions and the build guard rejects both PDF filenames and PDF signatures, including renamed files. The `_site` allowlist excludes documentation, tools, dependencies, source references, and temporary media.
