import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OpenCharts',
  tagline: 'Community-Maintained Helm Charts for Your Favorite Open Source Projects',
  favicon: 'favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    experimental_vcs: 'git-ad-hoc', // enables per-file git dates for sitemap <lastmod>
  },

  // Set the production url of your site here
  url: 'https://community-charts.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'community-charts', // Usually your GitHub org/user name.
  projectName: 'community-charts.github.io', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/community-charts/community-charts.github.io/tree/main',
        },
        blog: {
          blogTitle: 'Community Charts Blog Posts',
          blogDescription: 'Discover Community Helm Charts blog posts for new chart releases, Kubernetes deployment guides, updates, and tips for open-source DevOps solutions.',
          blogSidebarCount: 16, // or 'ALL'
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/community-charts/community-charts.github.io/tree/main',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-6QM4ZM0XG7',
          anonymizeIP: true,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
          lastmod: 'date',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://community-charts.github.io',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Community Charts Blog Posts RSS',
        href: 'https://community-charts.github.io/blog/rss.xml',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'application/atom+xml',
        title: 'Community Charts Blog Posts Atom',
        href: 'https://community-charts.github.io/blog/atom.xml',
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Organization',
        name: 'Community Charts',
        url: 'https://community-charts.github.io/',
        logo: 'https://community-charts.github.io/img/logo.png',
      }),
    },
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    colorMode: {
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    image: 'img/social-card.png',
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    blog: {
      sidebar: {
        groupByYear: true,
      },
    },
    algolia: {
      appId: 'C4YC101RQL',
      apiKey: 'c037e00400a7512214e49d2d68df2104',
      indexName: 'community-chartsio',

      searchPagePath: 'search',

      insights: false,
    },
    navbar: {
      title: 'Community Charts',
      logo: {
        alt: 'Community Charts Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guideSidebar',
          position: 'left',
          label: 'Guide',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/community-charts/community-charts.github.io',
          label: 'GitHub',
          position: 'right',
        },
      ],
      hideOnScroll: true,
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/community-charts',
            },
            {
              label: 'X (Twitter)',
              href: 'https://x.com/ChartsCommunity',
            },
            {
              label: 'BlueSky',
              href: 'https://bsky.app/profile/community-charts.bsky.social',
            },
            {
              label: 'Keybase',
              href: 'https://keybase.io/communitycharts',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/community-charts/helm-charts',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Community Charts`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: {light: 'neutral'},
    },
  } satisfies Preset.ThemeConfig,
  plugins: [
    [
      '@gracefullight/docusaurus-plugin-microsoft-clarity',
      {
        projectId: 's5ia53rdga',
      },
    ],
    [
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        siteTitle: 'Community Charts',
        depth: 3,
        content: {
          includeBlog: true,
          includePages: true,
          enableLlmsFullTxt: true,
        }
      }
    ],
  ],
};

export default config;
