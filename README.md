# Community Charts Documentation Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

Please enable the correct node version witn [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) by running `nvm use` command. And install required packages with `npm i` command.

## Local Development

You can run the page in development mode with the following command.

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Structured Data (SEO)

The site emits schema.org JSON-LD on every page:

- **Docs pages** — `BreadcrumbList` with `WebPage` items (swizzled `DocBreadcrumbs/StructuredData`)
- **Blog posts** — `BlogPosting` with fallback image + `BreadcrumbList` (Home → Blog → Post) (swizzled `BlogPostPage/StructuredData`)
- **Author page** — `ProfilePage` wrapping a `Person` as `mainEntity` (swizzled `Blog/Pages/BlogAuthorsPostsPage`)

Author schema.org enrichment fields (`jobTitle`, `worksFor`, `gender`, `schemaImageUrl`, `personId`, `dateCreated`, `additionalSameAs`) are configured directly in `blog/authors.yml`.
