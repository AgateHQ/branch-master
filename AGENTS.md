# Agent Guidelines

This repository hosts a simple Next.js project.

## Formatting

Use Prettier to keep the code style consistent:

```bash
npx prettier --write "**/*.{js,jsx,ts,tsx,css,html,json,md}"
```

## Indentation

Use 2 spaces for indentation in all files.

## Validation

Before committing, ensure the project builds without errors:

```bash
npm install
npm run build
```

If build or install steps fail due to environment restrictions, mention it in the PR.
