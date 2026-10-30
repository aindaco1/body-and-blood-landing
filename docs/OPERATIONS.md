# Operations

For maintainers running checks, publishing changes, or investigating a failed release. Run commands from the repository root. GitHub commands require `gh` authentication with access to this repository; normal site publishing does not require Cloudflare credentials.

## Validate a change

1. Review `git status --short` and stop any `npm run dev` / Jekyll watcher for this checkout.
2. Run the production checks:

   ```sh
   npm test
   git diff --check
   ```

3. Review the changed page at phone, tablet, and desktop widths. To serve the production build without rebuilding it:

   ```sh
   bundle exec ruby -run -e httpd _site -p 4186 -b 127.0.0.1
   ```

4. Inspect the diff and publication output before committing. Never stage dependencies, `_site`, private references, credentials, or screenshots containing unpublished material.

The static preview on port 4186 may remain open during tests. The Jekyll development watcher may not: it can rewrite `_site` while tests run and change the canonical URL to localhost. Port 4187 belongs to the test server; Playwright deliberately refuses to reuse an existing server there.

### What the checks cover

`npm test` runs a production Jekyll build, [`check-publish.js`](../scripts/check-publish.js), then eight Chromium tests. The tests cover main navigation/content, overflow at 320–1920 px, axe accessibility checks at phone and desktop sizes, pause/resume, reduced motion, Save-Data, navigation without JavaScript, keyboard skip navigation, and the cursor.

`npm run build` omits browser tests. `npm run test:browser` assumes a current production `_site` already exists. Failures retain screenshots and traces under ignored test output directories. Automated checks do not replace quote/source review, visual inspection, VoiceOver, or Safari and physical-device testing.

For praise changes, inspect 390, 768, 834, 1024, and 1440 px widths, plus either side of 700 and 1100 px if changing breakpoints. Verify full text, the decorative quote, italic body/title styling, regular attribution, and no clipped text.

## Publish and confirm

Pull requests run [Check site](../.github/workflows/check.yml) without deploying. A push to `main`, or a manual dispatch of [Deploy GitHub Pages](../.github/workflows/pages.yml), verifies the site before uploading only `_site`. No Cloudflare build or cache-purge step is part of this release process.

After reviewing and committing the intended files:

```sh
git push origin main
git rev-parse HEAD
gh run list --repo aindaco1/body-and-blood-landing --workflow pages.yml --limit 5 --json databaseId,status,conclusion,headSha,url
```

Match `headSha` to the pushed commit. Substitute that workflow's numeric ID below:

```sh
gh run watch RUN_ID --repo aindaco1/body-and-blood-landing --interval 15 --exit-status
```

A successful run must include both build and deploy jobs. Then load [the live site](https://bodyandbloodbook.com/) in a fresh browser context and inspect the actual change. Confirm content and computed styles where relevant. If a normal reload shows old assets, check with a fresh context or a hard reload before investigating DNS.

Read-only checks:

```sh
curl -I https://bodyandbloodbook.com/
curl -I https://www.bodyandbloodbook.com/
gh api repos/aindaco1/body-and-blood-landing/pages --jq '{html_url,build_type,cname,https_enforced,https_certificate}'
```

An HTTP success alone does not prove that a particular revision is live. Record the commit, workflow result, and observed page behavior in the change summary.

## Domain and HTTPS

Snapshot checked October 30, 2026 through public DNS and the GitHub Pages API:

| Setting | Observed value |
| --- | --- |
| Canonical domain | `bodyandbloodbook.com` |
| Pages build type | `workflow` (GitHub Actions) |
| HTTPS | Enforced; approved certificate covers apex and `www` |
| HTTP behavior | Apex HTTPS returns 200; `www` HTTPS redirects to the apex with 301 |
| Apex A records | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| Apex AAAA records | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| `www` CNAME | `aindaco1.github.io` |

Cloudflare manages these records; DNS currently resolves directly to GitHub Pages. Recheck live records before changing domain configuration. Do not use these values as a generic template for other projects.

```sh
dig +short bodyandbloodbook.com A
dig +short bodyandbloodbook.com AAAA
dig +short www.bodyandbloodbook.com CNAME
```

A domain change requires coordinated updates to `CNAME`, `_config.yml`, GitHub Pages settings, DNS, and tests that assert the canonical URL. Verify HTTPS and apex/`www` behavior afterward. Avoid changing DNS to fix an ordinary content or CSS release.

## Roll back a release

Identify the regression and the last verified good commit with `git log`. Preserve unrelated working-tree changes first. For a single ordinary commit, create a revert on a review branch:

```sh
git switch -c revert-site-change
git revert COMMIT_TO_REVERT
npm test
git diff --check
```

Review and merge the revert through the normal release path, then verify its workflow and live output. Do not force-push or reset shared history. If several commits depend on each other, review the intended combined diff before reverting. Rollback procedures are documented for recovery; they have not been exercised against production as a drill.

## Troubleshooting

| Symptom | First check |
| --- | --- |
| Canonical URL is localhost during tests | Stop the Jekyll watcher, then rerun `npm test` to rebuild production output. |
| Port 4187 is occupied | Inspect `lsof -nP -iTCP:4187 -sTCP:LISTEN`; stop only the identified stale test process. |
| Missing browser executable | Run `npx playwright install chromium`; Linux CI uses `--with-deps`. |
| Ruby or Node dependency failure | Match the verification action's runtime versions and install from the committed lockfiles. |
| Publication guard rejects a file | Remove the unintended source/output or correct the build exclusion; do not bypass the guard to publish private material. |
| Checks fail in Actions | Use `gh run view RUN_ID --repo aindaco1/body-and-blood-landing --log-failed`. |
| Build passed but site is unchanged | Confirm the matching deploy job completed, then inspect a fresh live page. |
| GIF does not move | Check reduced motion, Save-Data, pause state, tab visibility, and image requests. A still image can be expected behavior. |
| Certificate or domain failure | Compare current DNS and Pages settings with the dated snapshot; inspect certificate state through the API. |

If private material ever reaches the public repository or a Pages artifact, treat removal from the current page as only the first step. Stop further publication of it, notify the owner, and review repository history and deployed artifacts separately. Do not assume a later commit erases earlier exposure.

## Maintenance

Update lockfiles and pinned workflow actions deliberately, then run the same verification gate. Add or change checks when behavior changes; do not add a framework or a docs build for routine maintenance. Keep this guide aligned with scripts, ports, and deployment settings, and date any external-service snapshot.
