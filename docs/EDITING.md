# Content editing

For the owner, editors, and future coding agents. Use this guide for copy and link changes; use [Design](DESIGN.md) for sources and visual decisions.

## Edit the source

Most public copy lives in [`_data/book.yml`](../_data/book.yml). Keep it as plain text and HTTPS URLs; do not add HTML or markdown formatting to content fields. Templates render much of this text directly.

| Field | Used for |
| --- | --- |
| `title`, `subtitle`, `description` | Book metadata, accessible title, social description, structured data |
| `publisher`, `publisher_url`, `isbn` | Publisher links and structured data; keep ISBN quoted as a string |
| `publication_label` | Availability label in the hero and purchase section |
| `authors[].name` | Four author names, in the existing order |
| `intro` | About-section label, heading, and paragraphs |
| `praise[]` | Complete endorsements, reviewer names, and attribution lines |
| `excerpt` | Featured CrimeReads link, headline, summary, and date |
| `reading[]` | Three related Revealer essays |
| `podcast` | Revealer episode link and supporting summary |
| `retailers[]` | Store names, secondary labels, and purchase URLs |

Preserve YAML indentation. Quote values containing punctuation such as `: `, and use the existing entries as the format reference. Run `npm test` after editing.

[`.pages.yml`](../.pages.yml) exposes most of these fields in Pages CMS. It does not currently expose `publisher`, `publisher_url`, or `isbn`; edit those directly in YAML. There is no media uploader. The schema is present, but a working CMS account connection has not been verified.

Some text is intentionally in templates: the visual hero title/subtitle, button labels, CrimeReads label, edition note, displayed publication year, and footer. The document title is in `_config.yml`. If changing a book identity or publication detail, search those files too; editing one YAML field does not update every visual label.

## Preserve sourced material

Keep endorsement wording, article and book titles, names, dates, and URLs faithful to their sources. Do not humanize or paraphrase endorsements. Use NYU Press to verify book facts and praise, and the linked publications to verify article or podcast details. Record any source correction in [Design](DESIGN.md).

The intro, metadata description, and supporting summaries are assistant-authored. Apply the Humanizer skill, with constrained editing where appropriate, only to such prose. Keep changes concrete and restrained; do not introduce claims, ratings, bestseller status, or new availability promises. Humanization must not alter sourced material.

The CrimeReads feature links to the published adapted excerpt. Do not replace that link with the private book file or reproduce interior manuscript text. The three Revealer essays and podcast are related coverage, not new book reviews.

## Praise format

Keep all three endorsements complete, in their existing order. The data and template have separate responsibilities:

- `quote` contains the full text without enclosing opening/closing quotation marks. Preserve quotation marks and apostrophes inside the original wording.
- `name` contains the reviewer's name.
- `credit` must use the exact prefix `Author of ` followed by the book title. The template removes that prefix from the title, renders it once in regular type, and puts the title in an italic `<cite>` element. A different attribution format needs a corresponding template change.

Quote bodies are italic. Each card keeps its large decorative opening quote above the body. Reviewer names and `Author of` remain regular type. Do not shorten the text to solve layout problems; adjust spacing or layout using the [praise layout rules](DESIGN.md#praise-layout).

The full quotes are stored only in the YAML file. Documentation should refer to them rather than maintain another copy.

## Decisions to retain

The footer says **Body + Blood**, matching the cover treatment. The formal book title in metadata remains **Body and Blood: Catholic Horror in America**.

The owner deliberately removed these assistant-authored lines. Do not restore them during redesigns or copy refreshes:

- “A new way to see the films you love.”
- “A history you won’t soon forget.”
- “Enter the conversation.”
- “For horror fans, curious readers, and anyone willing to look a little closer.”
- “A history of what haunts us.”

Keep CrimeReads prominent, the page short, and retailer navigation usable without JavaScript. Do not add third-party players, document embeds, signup forms, or tracking as a routine content edit.

## Review an edit

Compare the diff with the source and check the rendered page at phone, tablet, and desktop sizes. Confirm that all endorsement text and attribution survived, all four authors remain, and the intended links work. The browser suite checks structure and navigation but does not authenticate quote wording or test the external stores' availability.

Use [Operations](OPERATIONS.md) to validate and publish. The private reference restrictions in [AGENTS.md](../AGENTS.md) apply to documentation, commits, and temporary files inside this repository as well as to the site.
