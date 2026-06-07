# Codezempic

**Trim the bloat. Keep the logic.**

A joke tool that makes overly verbose AI-generated code skinnier. Fully client-side, rule-based. No API calls.

## Features

- **JS/TS, Python, Go & Ruby** support
- **Three dose levels**: Small (comments/whitespace), Medium (+ imports, conditionals, naming), Large (+ types, boilerplate, AI slop)
- Side-by-side diff view with weight-loss stats
- Drag-and-drop file support
- Copy & download results

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/` for GitHub Pages deployment.

## Deploy

Pushes to `main` trigger GitHub Actions to build and deploy to the `gh-pages` branch.

Site URL: https://adameubanks.github.io/codezempic/

## Side Effects

May include shorter functions, fewer comments, and improved developer self-esteem.
