# Agent Guidelines

## Repository purpose

This repository is a small Next.js Pages Router blog used to test Axate wallet
and paywall behaviour. Keep changes straightforward and test-oriented; it is a
fixture for integration scenarios, not a production publishing platform.

## Stack and conventions

- Node.js 22 or newer and npm
- Next.js 16 Pages Router with React 19
- Mantine 9
- Mantine components where already used
- CSS Modules plus `styles/globals.css`
- JavaScript, 2-space indentation, and Prettier formatting

Prefer the existing project patterns over introducing new frameworks,
state-management libraries, or abstractions. Do not migrate to the App Router
unless the task explicitly requires it.

`package.json` pins `brace-expansion`, `nanoid`, `postcss`, and `sharp` under
`overrides` to force patched versions past transitive advisories. If a new
`npm audit` finding appears, raise the relevant floor rather than reaching for
`npm audit fix`, which will otherwise downgrade unrelated packages.

## Axate integration invariants

- `pages/_app.js` chooses the staging or live Axate bundle through
  `components/AxateEnvironment.js`. The canonical local-storage key is
  `selectedEnvironment`; preserve migration support for the legacy
  `selectedEnviroment` spelling.
- Staging is the safe default. Do not change a default test flow to production
  or trigger real purchases during validation.
- `pages/_document.js` owns the `#axate-wallet` element and its selector
  configuration.
- Premium content must continue to match `.premium`, and the in-page notice
  must continue to match `.axate-notice`, unless all corresponding selectors
  are updated together.
- Dynamic article pages intentionally alternate behaviour: odd article IDs use
  button mode and even IDs use the standard placement.
- Publisher registration links derive the publisher code from the current
  hostname. Check both plain `localhost` and a publisher subdomain when changing
  this logic.
- Keep the paywall-related `NewsArticle` JSON-LD aligned with visible article
  metadata and the premium CSS selector.

The wallet bundles and registration pages are remote services. A successful
local build does not prove that the complete Axate flow works; browser-test
integration changes against staging when practical.

## Content and image invariants

- `data/articles.js` is the single source of truth for the article catalogue.
  Change article count, hero, featured cards, or copy there rather than in
  `pages/index.js`.
- Cover art lives in `public/` as WebP and must be rendered through
  `components/CoverImage.js` (a `next/image` wrapper). Do not reintroduce CSS
  `background: url(...)` image divs; they bypass the optimizer, ship no
  `srcset`, and do not lazy-load.
- Article ids map onto the ten covers via `articleImageSrc(id)`. Keep it total
  over arbitrary positive ids, because `/articles/:id` is reachable for any id
  (the "Go to a Random Article" button targets 0–42690).
- Next.js 16 deprecated the `priority` prop on `next/image` in favour of
  `preload`. Use `preload` only when the image `src` is stable across SSR and
  hydration. The article hero uses `eager` + `fetchPriority` instead, because
  `pages/articles/[id].js` is statically prerendered with an empty
  `router.query.id`: the server always emits the article-1 cover and the
  client swaps it after hydration. That costs one extra image request on
  article pages. It is a known trade-off of keeping the route static, and it is
  pre-existing — do not "fix" it by switching the route to
  `getServerSideProps` without flagging the change, since that would also
  change the prerender characteristics the fixture relies on.
- `styles/globals.css` deliberately has no blanket `.app-container img` height
  rule. A previous `height: 200px` override silently beat every component's
  intended image height. Size images in the component that owns them.
- Under parallel Playwright load, `next dev` may log
  `Image with src "/article-0.webp" was detected as the Largest Contentful
Paint (LCP)`. This is a Next.js false positive, not a real LCP problem. In
  dev only, `shared/lib/get-img-props.js` keeps a `Map` of rendered images keyed
  by the image's `src` URL, and warns when the LCP element's entry has
  `loading: "lazy"`. The `src` attribute ignores `sizes` and is always the
  `w=3840` fallback, so the preloaded hero and the lazy cards for articles 10,
  20, and 30 — which reuse the same file — all share one key, and the cards'
  lazy entries overwrite the hero's. The warning therefore fires for an image
  that is correctly preloaded. Ignore it. It is unreproducible when the suite
  runs serially and is absent in production builds.

## Main areas

- `data/articles.js`: the article catalogue — ids, copy, hero, featured set, and
  the id → cover-image mapping
- `pages/index.js`: synthetic blog index, composed from the catalogue
- `components/AxateEnvironment.js`: external-store hook for environment
  persistence and legacy-key migration
- `components/SelectEnvironment.js`: accessible environment control
- `components/CoverImage.js`: `next/image` wrapper used by every local image
- `components/ArticleCard.js` and `components/HeroArticle.js`: index blocks
- `pages/articles/[id].js`: primary premium-article test fixture
- `pages/articles/axate-integration.js`: example integration instructions
- `pages/_app.js`: wallet script selection and Mantine provider
- `pages/_document.js`: Axate mount element and default selectors
- `pages/staticrypt.js` and `pages/api/encrypt.js`: password-protected HTML tool
- `lib/password_template.html`: Staticrypt output template
- `styles/`: global and page-level styles
- `tests/e2e/`: Playwright coverage for the core Axate scenarios

## Working rules

- Preserve unrelated user changes. In particular, do not rewrite the lockfile
  unless dependencies are intentionally changed.
- Keep the site marked `noindex`; its content is synthetic test data.
- Avoid adding secrets, publisher credentials, or production customer data.
- Treat uploaded HTML and passwords as sensitive. Do not log their values or
  persist them when working on the Staticrypt endpoint.
- Maintain keyboard-accessible controls and meaningful page metadata when
  changing UI code.
- Add or update README documentation when routes, commands, environment
  behaviour, or test scenarios change.

## Formatting and validation

Format changed files with Prettier:

```bash
npm run format
```

Before handing off a code change, run:

```bash
npm install
npm run format:check
npm run lint
npm run test:e2e
npm run build
npm audit
```

Install Chromium once with `npx playwright install chromium` before running the
browser suite. For Axate-facing changes, also smoke-test the affected page using
the staging environment. If dependency installation, the build, or
remote-service testing is blocked by the execution environment, report that
clearly in the handoff or pull request.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
