# Branch Master News

Branch Master News is a deliberately simple blog used to exercise the Axate
wallet and paywall flow. It provides a set of synthetic articles, switches
between Axate staging and production, and can imitate multiple publishers by
running the site on different subdomains.

This is a test fixture rather than a production publication. The site is
marked `noindex`, and its article text and images are sample content.

## What it demonstrates

- Loading the Axate wallet bundle in a Next.js app
- Marking article content as premium and placing the in-page Axate notice
- Testing both button-mode and standard-mode wallet behaviour
- Building publisher registration links from the current hostname
- Switching between the Axate staging and live environments in the UI
- Supplying paywalled-article structured data for search engines
- Generating a password-protected HTML file with Staticrypt

## Requirements

- Node.js 22 or newer
- npm 11 (the repository pins Node 24 in `.nvmrc`)

No environment variables are required for local development.

## Run locally

```bash
npm install
npx playwright install chromium
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To imitate a publisher,
use one of the supported publisher codes as the subdomain, for example
[http://rad.localhost:3000](http://rad.localhost:3000).

Supported codes are `rad`, `wse`, `sle`, `lsp`, `cwr`, `cwh`, `mad`, `kwr`,
`yrk`, `mohm`, `bcc`, `pop`, `mag`, `bxn`, `gjw`, `brw`, and `rtw`.

The selected Axate environment is stored under the `selectedEnvironment`
local-storage key. Existing `selectedEnviroment` values are migrated
automatically. If no value has been selected, the app uses staging.

> The **Live** option loads the production wallet and registration service.
> Use staging for routine development and testing.

## Useful routes

| Route                         | Purpose                                             |
| ----------------------------- | --------------------------------------------------- |
| `/`                           | Synthetic blog index and Axate environment selector |
| `/articles/:id`               | Generated premium article; odd IDs use button mode  |
| `/articles/axate-integration` | Example Axate embed markup                          |
| `/staticrypt`                 | Upload and password-protect an HTML file            |
| `/api/encrypt`                | POST endpoint used by the Staticrypt page           |

The Axate integration depends on the markup in `pages/_document.js` and the
`.premium` and `.axate-notice` selectors used by article pages. See
`pages/articles/[id].js` for the primary test scenario.

## Commands

```bash
npm run dev       # start the development server
npm run build     # create a production build
npm start         # serve the production build
npm run format    # format the repository with Prettier
npm run lint      # run Next.js and React Hooks lint rules
npm run test:e2e  # run the Playwright integration suite
```

Before submitting a change, run the complete validation suite:

```bash
npm run format:check
npm run lint
npm run test:e2e
npm run build
npm audit
```

## Project layout

```text
components/            Reusable UI: environment state and selector, cards, images
  AxateEnvironment.js  External store for the environment, incl. legacy-key migration
  SelectEnvironment.js Accessible staging/live selector
  CoverImage.js        next/image wrapper: fixed-height, cover-cropped frame
  ArticleCard.js       One index-grid card
  HeroArticle.js       The pinned hero article at the top of the index
data/articles.js       The article catalogue — edit this to change content
pages/                 Next.js Pages Router pages and API routes
  articles/[id].js     Main generated paywall scenario
  api/encrypt.js       Server-side Staticrypt endpoint
lib/                   Staticrypt HTML template
public/                WebP sample article covers and static assets
styles/                Global, index, card, and article styles
tests/e2e/              Playwright browser and API scenarios
```

### Changing the articles

`data/articles.js` is the single source of truth for the index. Edit it to
change how many articles exist, which card is the hero, which cards render
double-width (`FEATURED_ARTICLE_IDS`), or the blurb copy. The index page, the
grid, and the article page's cover image all derive from it — no page edits
required.

### Images

All covers ship as WebP in `public/` (`article-0.webp` … `article-9.webp`,
plus `axate-logo.webp`) and are rendered through `next/image` via
`components/CoverImage.js`, which produces a responsive `srcset` and negotiates
AVIF/WebP. Article ids map onto the ten covers with `articleImageSrc(id)`,
so any id — not just the ones in the catalogue — resolves to a real image.

The raw PNGs this fixture used to ship totalled ~20 MB. Keeping WebP masters
plus the optimizer brings a full index-page image payload to roughly 220 KB.
If you replace a cover, export it at 1536×1024 and convert it with
`cwebp -q 80 in.png -o article-N.webp`.

The encryption API accepts HTML documents up to 1.5 million characters, limits
request bodies to 2 MB, and applies a lightweight per-instance rate limit. A
shared external rate limiter is recommended if this utility is exposed from a
multi-instance production deployment.

## Axate endpoints

The environment selector controls which remote services the browser uses:

| Environment | Wallet bundle                       | Registration service        |
| ----------- | ----------------------------------- | --------------------------- |
| Staging     | `wallet-staging.axate.io/bundle.js` | `register-staging.axate.io` |
| Live        | `wallet.axate.io/bundle.js`         | `register.axate.io`         |

### Mobile usability

Layouts start with a single column and expand at 40rem and 60rem. The index follows the Ghost demo’s layout: a compact white header, left-aligned site
identity, a thumbnail lead story, two featured cards, and a borderless story grid.
Cards stack with full-width images on phones; responsive image sizes follow
those layouts.
Article text and spacing scale with the viewport. Navigation and form controls
have at least 44px touch targets, and keyboard users can skip to the main content.
Motion respects the system reduced-motion preference. The wallet status appears
in normal document flow so it does not cover reading or wallet controls.

The browser suite checks every page at 320, 390, 768, and 1280px, as well as
keyboard skip navigation, mobile story navigation, and labelled utility inputs.
