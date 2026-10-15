# Improvement TODO

Prioritised backlog for Branch Master News, derived from a codebase review.
Sorted highest priority first.

Priority key:

- **P1** — correctness, security, or dead code with a real effect today.
- **P2** — documentation drift, reliability, CI, and duplicated logic.
- **P3** — accessibility, polish, and test coverage.

Baseline after P3 (all items below): `build`, `lint`, `format:check` and all 22
e2e tests pass; `npm audit` reports 4 advisories (4 high), all in the dev-only
ESLint toolchain (see items 11–12). `npm ci` is verified against the lockfile.

---

## P1 — Correctness and security

### Mantine 9 prop misuse (`components/Comments.js`)

- [x] 1. Replace `Group spacing="12px"` with `gap="12px"` (heading group).
- [x] 2. Replace the two `Group spacing="8px"` uses with `gap="8px"`.
- [x] 3. Replace `Text fontSize="var(--mantine-font-size-lg)"` with `size="lg"`
      (or `fz="lg"`).
- [x] 4. Confirm the rendered HTML no longer emits `spacing="…"` attributes and
      that `--group-gap` reflects the intended value. Verified: groups render
      `--group-gap: 8px`/`12px`, heading carries `--text-fz: lg`, no `spacing=`
      attributes remain.

### Comment action buttons (`components/Comments.js`)

- [x] 5. Show `Reply` and `Like` for every comment, not only those with replies.
- [x] 6. Keep the reply box itself gated on `comment.replies > 0`.
- [x] 7. Add a regression check that a 0-reply comment exposes Reply and Like.
      Added an e2e test ("shows comment actions for comments without replies").

### Dependency advisories (`package.json`)

- [x] 8. Bump `next` from `16.3.6` to the patched `16.4.1` (or newer).
- [x] 9. Raise the `overrides` floor for `source-map-js` (event-loop DoS).
      Added `"source-map-js": "^1.2.2"`; `postcss` also bumped to `^8.5.30`.
- [x] 10. Raise the `overrides` floor for `postcss-selector-parser` (moderate).
      Done differently: `postcss-preset-mantine` and `postcss-simple-vars` were
      unused leftovers (no PostCSS config exists), and removing them eliminates
      `postcss-mixins`, `postcss-nested`, and `postcss-selector-parser` entirely.
- [x] 11. Pin `braces`/`micromatch` to clear the
      `@next/eslint-plugin-next → fast-glob` chain. **Not possible:** advisory
      GHSA-vfj7-8cjw-p6xm covers all `braces` versions with no patched release,
      and npm's only "fix" is downgrading `@next/eslint-plugin-next` to 14.x.
      Accepted as a dev-only residual; revisit when a patched `braces` ships.
- [x] 12. Re-run `npm audit` and confirm zero actionable advisories without
      `npm audit fix` downgrading unrelated packages. Reduced 10 → 4; the four
      that remain are the unfixable `braces` chain above, dev-only.

### Dead integration route

- [x] 13. Delete `pages/articles/axate-integration.js` (unreachable behind the
      `next.config.js` redirect).
- [x] 14. Decide the redirect's fate: keep it (removes the page) or drop it
      (revives the page). Record the decision. **Decision: keep the redirect**
      (it is the stable install URL and README already documents it as a
      redirect); the page is deleted. Recorded in AGENTS.md.
- [x] 15. Remove the `highlight.js` dependency and its stylesheet import.
- [x] 16. Remove the now-unused `next/link`/`hljs` references. Also removed the
      orphaned `.articleParagraph` and `.codeSnippet` rules from
      `styles/Article.module.css`.
- [x] 17. Verify a production build no longer ships the highlight.js chunk. The
      route list dropped from 5 to 4 static pages and the build is clean.

---

## P2 — Documentation and reliability

### Documentation drift

- [x] 18. Correct the AGENTS.md note claiming `pages/articles/[id].js` is
      statically prerendered with an empty `router.query.id` (it now uses
      `getServerSideProps`). Rewrote the bullet to explain the route is
      server-rendered and the hero `src` is therefore stable.
- [x] 19. Update the `CoverImage.js` doc comment that repeats the stale
      trade-off reasoning. The now-unused `eager`/`fetchPriority` props were
      removed from the wrapper too.
- [x] 20. Either switch the article hero to `preload` (src is now stable) or
      document why `eager` + `fetchPriority` is retained. **Switched to
      `preload`**; no extra image request is needed.
- [x] 21. Confirm the README route table still matches the redirect behaviour.
      Confirmed: the `/articles/axate-integration` redirect row is unchanged.

### Continuous integration

- [x] 22. Add a CI workflow running `format:check`, `lint`, and `build`. Added
      `.github/workflows/ci.yml` (Node 24, `npm ci`, `contents: read`).
- [x] 23. Add an e2e job that installs Chromium and runs `test:e2e`. Added a
      `needs: verify` job using `npx playwright install --with-deps chromium`.
- [x] 24. Modernise `.github/workflows/branches.yml` (`actions/checkout@v4`,
      safe push semantics). Now `fetch-depth: 0`, explicit git identity, creates
      missing branches, and pushes non-force.
- [x] 25. Trigger CI on pull requests and cancel superseded runs. Runs on PRs,
      pushes to `main`, and manual dispatch; `concurrency` cancels superseded
      runs.

### Wallet environment handling

- [x] 26. Skip the `/api/axate-versions` fetch when the environment is `live`
      (the manifest is unused there). Also gated on `hydrated`, because the
      first effect run after hydration would otherwise see the SSR default
      (`staging`) and fire a wasted request. Verified: staging issues 1 request,
      live issues 0.
- [x] 27. Move the legacy-key migration out of `subscribeToStorage` so it runs
      once instead of on every (re)subscribe. Now a one-time `useEffect`.
- [x] 28. Route `registrationLink` through `useAxateEnvironment()` instead of
      re-reading `localStorage` directly. Verified both origins
      (`register-staging` / `register`).
- [x] 29. Confirm the SSR snapshot and client value cannot drift after the
      refactor. Extended the hydration e2e test to also load `/articles/2` and
      assert no hydration errors there.

### API hardening

- [x] 30. Prune expired entries from the `pages/api/encrypt.js` rate-limit map.
      `pruneExpiredEntries` drops any address whose newest hit is outside the
      window, bounding the map.
- [x] 31. Wrap the `staticrypt/lib/*` internals behind a small local module so
      upgrades break in one place. Added `lib/staticrypt.js`; `encrypt.js` no
      longer imports the deep paths.
- [x] 32. Decide whether `/api/axate-versions` should cache briefly (README
      currently documents it as intentionally uncached). **Decision: keep it
      uncached** — the fixture must surface fresh staging releases; documented
      in the handler and README.

---

## P3 — Accessibility, polish, and tests

### Accessibility

- [x] 33. Render the comments heading as a real `<h2>` so the page outline is
      correct. `<Text component="h2">`; asserted via `getByRole` level 2.
- [x] 34. Give avatars appropriate alt text (or mark them decorative). The avatar
      is decorative next to the author name, so `alt=""`.
- [x] 35. Expose state on Like/Reply/Report buttons (e.g. `aria-pressed`,
      labels). Like is a real toggle with `aria-pressed`; Reply/Report carry the
      author in their `aria-label`.
- [x] 36. Add `eslint-plugin-jsx-a11y` to the lint config to catch these. Added
      the plugin and its `flatConfigs.recommended`; lint is clean. Its peer range
      stops at ESLint 9, so `.npmrc` sets `legacy-peer-deps=true` (the flat
      config works under ESLint 10).

### Staticrypt page UX (`pages/staticrypt.js`)

- [x] 37. Replace `alert()` errors with an inline error message. Rendered as
      `<p role="alert">`.
- [x] 38. Mask the password field and add a show/hide toggle.
- [x] 39. Reset the file input value so the same file can be re-selected. The
      input is cleared on change and the chosen name is shown separately.
- [x] 40. Add a client-side size check that mirrors the server limit. Uses the
      same 1,500,000-character cap as `pages/api/encrypt.js`.

### Metadata and polish

- [x] 41. Give the footer version a fallback (build SHA) or hide it when empty.
      Falls back to the short commit SHA and hides entirely when neither is set.
- [x] 42. Add a `public/robots.txt` that disallows all crawlers. **Already
      present** (`User-agent: *` / `Disallow: /`); no change needed.
- [x] 43. Set `poweredByHeader: false` in `next.config.js`.
- [x] 44. Make JSON-LD `isAccessibleForFree` reflect whether an article is a
      free control rather than hardcoding `false`. Article 6 is now genuinely
      free (`FREE_CONTROL_ARTICLE_IDS`): it drops `.premium`/`.axate-notice` and
      the JSON-LD reports `isAccessibleForFree: true` with no `hasPart`.
- [x] 45. Include the article id in the SocialShare title. The page passes the
      computed headline through.

### Test coverage

- [x] 46. Add a test for legacy `selectedEnviroment` key migration.
- [x] 47. Add a test for the live-environment registration link.
- [x] 48. Add a test for persistence of a pinned staging version on KWR.
- [x] 49. Add a unit test proving `articleImageSrc` stays total over arbitrary
      positive ids. Added `tests/e2e/articles.spec.js` (also covers negatives and
      the free-control predicate).
- [x] 50. Add an `npm test` alias (or `test:ci`) that runs lint + e2e for CI.
      Added `npm run test:ci`; documented in the README.

---

## Done

- [x] 51. Run the full validation suite
      (`format:check`, `lint`, `test:e2e`, `build`, `audit`) once P1 and P2 land.
      Ran after P3: format:check, lint, build clean; 22 e2e pass; `npm audit`
      unchanged at 4 dev-only high (`braces` chain). `npm ci` also verified.
- [ ] 52. Smoke-test the affected pages against Axate staging before release.
      **Not done here:** this needs a browser against the real staging services
      and is outside the local environment. The wallet-facing flow is covered by
      the hermetic e2e suite; run the manual staging smoke test before release.
