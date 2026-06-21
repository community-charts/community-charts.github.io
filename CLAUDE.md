# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation website for [Community Charts](https://community-charts.github.io) — community-maintained Helm charts for open-source Kubernetes apps. It's built with Docusaurus 3.10.x and React 19.

## Setup

Requires Node >= 22. Use nvm to activate the correct version:

```bash
nvm use
npm i
```

## Commands

```bash
npm start          # Start dev server (auto-runs generateBlogList.js first)
npm run build      # Production build (auto-runs generateBlogList.js first)
npm run typecheck  # TypeScript type checking
npm run lint:check # ESLint check without auto-fix
npm run lint       # ESLint with auto-fix
npm run format     # Prettier format src/**
npm run serve      # Serve the production build locally
npm run clear      # Clear Docusaurus cache
```

There are no tests. The pre-commit hooks run Prettier and ESLint automatically on staged files in `src/`, `docs/`, and `blog/`.

## Architecture

### Content vs. Code

- **`blog/`** — Markdown blog posts (one per chart release). Auto-processed by `scripts/generateBlogList.js` into `src/data/latestBlogPosts.json` at build time to power the homepage's latest posts widget.
- **`docs/`** — Docusaurus documentation pages. Sidebar is auto-generated from the directory structure (`sidebars.ts`).
- **`src/components/`** — Homepage section components (each with `index.tsx` + `styles.module.css`).
- **`src/theme/`** — Swizzled Docusaurus theme components. Key overrides for structured data:
  - `DocBreadcrumbs/StructuredData` — enhances doc page `BreadcrumbList` so each `item` is a `WebPage` object (fixes "Unknown item" in Google Rich Results Test).
  - `BlogPostPage/StructuredData` — adds a fallback `ImageObject` when a blog post has no image, and emits a `BreadcrumbList` (Home → Blog → Post).
  - `BlogListPage/StructuredData` — extends the default `Blog` schema to also emit a `BreadcrumbList` (Home → Blog).
  - `Blog/Pages/BlogAuthorsPostsPage` — emits `ProfilePage` JSON-LD with the author as `mainEntity Person`.
- **`static/`** — Static assets served as-is (robots.txt, favicon, search engine verification files).

### Homepage Flow

`src/pages/index.tsx` renders `HomepageStructuredData` first (injects canonical URL, `FAQPage` JSON-LD, and root `BreadcrumbList` via `<Head>`), then composes six section components: `HomepageHeader` → `HomepageWhatWeOffer` → `HomepageFeaturedCharts` → `HomepageHowToGetStarted` → `HomepageCommunity` → `HomepageLatestBlogPosts`. The last one reads from the generated `src/data/latestBlogPosts.json`.

Note: Docusaurus auto-injects canonical URLs for content pages (docs, blog) via their plugins, but NOT for custom `src/pages/` files — those need an explicit `<link rel="canonical">` in a `<Head>` component.

## Content Conventions

### Blog Posts

Blog posts follow the naming pattern `YYYY-MM-DD-<chart>-chart-version-<X>-<Y>-<Z>-released.md`. Required frontmatter:

```yaml
---
slug: <chart>-chart-version-<X>.<Y>.<Z>-released
title: <chart> chart version <X>.<Y>.<Z> released
date: YYYY-MM-DDTHH:MM
authors: burakince
tags: [<chart>, helm, kubernetes, open-source]
description: ...
---
```

Authors are defined in `blog/authors.yml`; tags must exist in `blog/tags.yml`.

`blog/authors.yml` supports custom fields beyond the Docusaurus standard (`name`, `title`, `url`, `image_url`, `email`, `socials`, `description`) for schema.org enrichment. The `BlogAuthorsPostsPage` wrapper reads these via `AuthorAttributes`'s `[customAuthorAttribute: string]: unknown` index signature:

| Custom field | Type | Purpose |
|---|---|---|
| `jobTitle` | string | Person `jobTitle` in JSON-LD |
| `worksFor` | object | Person `worksFor` Organization in JSON-LD |
| `gender` | string | Person `gender` in JSON-LD |
| `schemaImageUrl` | string | Overrides `image_url` for Person `image` in JSON-LD only |
| `personId` | string | Person `@id` — must differ from the `ProfilePage @id` (the author page URL) |
| `dateCreated` | ISO string | `ProfilePage dateCreated` |
| `additionalSameAs` | string[] | Extra URLs appended to Person `sameAs` |

### Documentation Pages

Chart docs live under `docs/charts/<chart-name>/`. Required frontmatter on each page:

```yaml
---
id: <page-slug>          # Do NOT include chart name — it's already in the path
title: ...
sidebar_label: ...
sidebar_position: <n>
description: ...
keywords: [...]
---
```

Chart guide pages must end with a **Next Steps** section.

### MDX & Components

Use MDX syntax in all Docusaurus Markdown files. React functional components are the standard for custom components.

The blog truncate marker must be `{/* truncate */}` — not `<!-- truncate -->`. HTML comments are invalid in MDX (the `future.v4` flag enables strict MDX parsing).

### Docusaurus Config Notes

`docusaurus.config.ts` has `future.v4: true`, which:
- Enables the Rspack bundler — requires `@docusaurus/faster` as a dependency (must match `@docusaurus/core` version)
- Enforces strict MDX parsing across all content files

`future.experimental_vcs: 'git-ad-hoc'` is enabled so the sitemap plugin can emit per-file `<lastmod>` dates from git history. The CI workflow already uses `fetch-depth: 0` (full history). Pair with `sitemap.lastmod: 'date'` in the preset config.

`headTags` in `docusaurus.config.ts` includes global `<link rel="alternate">` tags for RSS and Atom feeds so they are discoverable from every page, not just blog pages.

`onBrokenMarkdownLinks` belongs under `markdown.hooks`, not at the top level of `siteConfig`.

## Code Style

Prettier config: double quotes, semicolons, 2-space indent, 80-char print width, `trailingComma: "es5"`, `proseWrap: always`. ESLint enforces no unused imports (error) and warns on unused variables.
