# Branch Master Demo

This is a simple Next.js project for testing the Axate wallet. It can run from different subdomains to imitate various publishers.

## Requirements

- Node.js
- npm

## Getting Started

1. Install dependencies with `npm install`. This will also fetch the [Mantine](https://mantine.dev/) UI library used in the project.
2. Launch the development server using `npm run dev`.
3. Open `http://localhost:3000` or use a subdomain such as `rad.localhost:3000` to emulate that publisher.

## Publisher Subdomains

Use any of the following short codes as subdomains to mimic a publisher:

- rad
- wse
- sle
- lsp
- cwr
- cwh
- mad
- kwr
- yrk
- mohm
- bcc
- pop
- mag
- bxn
- gjw
- brw
- rtw

When accessed through one of these subdomains, the app reads the hostname and acts as that publisher.

## Formatting

Run Prettier to keep the code style consistent:

```bash
npx prettier --write "**/*.{js,jsx,ts,tsx,css,html,json,md}"
```

## Building

Before committing, ensure the project builds without errors:

```bash
npm install
npm run build
```
