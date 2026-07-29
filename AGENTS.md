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

## Main areas

- `pages/index.js`: synthetic blog index and environment selector
- `components/AxateEnvironment.js`: external-store hook for environment
  persistence and legacy-key migration
- `components/SelectEnvironment.js`: accessible environment control
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
