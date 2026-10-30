# Body and Blood

The landing page for **Body and Blood: Catholic Horror in America**, by Matthew J. Cressler, Jack Lee Downey, Kathleen Holscher, and Michael Pasquier (NYU Press).

- [Live site](https://bodyandbloodbook.com/)
- [Public repository](https://github.com/aindaco1/body-and-blood-landing)
- [Builds and deployments](https://github.com/aindaco1/body-and-blood-landing/actions)

This README is for someone editing, maintaining, or taking over the site. The project uses Jekyll, Liquid, SCSS, plain JavaScript, and GitHub Pages, following the architecture of `zema-landing`. It has no backend, analytics, forms, or external font service. Cloudflare manages DNS.

## Start here

| Task | Guide |
| --- | --- |
| Find the right file or understand the build | [Architecture](docs/ARCHITECTURE.md) |
| Edit copy, endorsements, or purchase links | [Content editing](docs/EDITING.md) |
| Preserve the visual direction or replace artwork | [Design, sources, and media](docs/DESIGN.md) |
| Run checks, deploy, troubleshoot, or roll back | [Operations](docs/OPERATIONS.md) |
| Work as a coding agent | [Repository instructions](AGENTS.md) |

The full book PDF is a private reference and must remain outside this repository. Never copy, commit, upload, embed, or link it, its interior pages, or extracted manuscript text. Only the public cover, approved derivative artwork, and the three owner-requested promotional endorsements belong here. Documentation is excluded from the website build, but **everything committed to this repository is public on GitHub**.

## Local setup

The owner's working checkout is the `body-and-blood-landing` folder in iCloud Drive. Work in that checkout or a separate clone of this repository.

Use Ruby 3.3 to match CI, Bundler, and Node 24.22.1+ on major 24 or 26.12.1+ on major 26. The exact supported ranges are in [package.json](package.json); CI versions are in the [verification action](.github/actions/verify-site/action.yml).

From the repository root:

```sh
bundle install
npm ci
npx playwright install chromium
npm run dev
```

Open [the local preview](http://127.0.0.1:4186/). The development server watches source files and rebuilds `_site`.

Stop that server before running the production checks:

```sh
npm test
git diff --check
```

`npm test` builds the production site, checks what may be published, and runs eight browser tests. It starts its own static server on port 4187. An active Jekyll watcher can overwrite the production build with development URLs; see [the test procedure](docs/OPERATIONS.md#validate-a-change).

## Working rules

Keep changes small and use the existing Liquid/YAML/CSS structure. Source content lives in [`_data/book.yml`](_data/book.yml); rendered output in `_site` is disposable. Never edit `_site` as the source of a change.

Preserve complete endorsements, their wording, the compact praise layout, and the footer's `Body + Blood` spelling. Editorial restrictions and removed slogans are recorded in [Content editing](docs/EDITING.md).

Pushes to `main` run checks and deploy automatically. A successful push alone does not establish that the live site changed: check the matching workflow and the live page. The [operations guide](docs/OPERATIONS.md) covers release verification and rollback.

When changing behavior, update its guide in the same commit. Keep sources and visual decisions in `DESIGN.md`, content contracts in `EDITING.md`, and release procedures in `OPERATIONS.md`.
