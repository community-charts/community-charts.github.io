import React, {type ReactNode} from "react";
import Head from "@docusaurus/Head";
import {useBlogPostStructuredData} from "@docusaurus/plugin-content-blog/client";

const DEFAULT_IMAGE_PATH = "/img/social-card.png";

type RawBlogPosting = {
  "@context": string;
  "@type": string;
  url: string;
  headline: string;
  image?: object;
  [key: string]: unknown;
};

export default function BlogPostStructuredData(): ReactNode {
  const baseData = useBlogPostStructuredData() as unknown as RawBlogPosting;
  const siteUrl = new URL(baseData.url).origin;
  const blogUrl = `${siteUrl}/blog`;

  const imageUrl = `${siteUrl}${DEFAULT_IMAGE_PATH}`;
  const blogPosting = baseData.image
    ? baseData
    : {
        ...baseData,
        image: {
          "@type": "ImageObject",
          "@id": imageUrl,
          url: imageUrl,
          contentUrl: imageUrl,
          caption: `title image for the blog post: ${baseData.headline}`,
        },
      };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: `Home > Blog > ${baseData.headline}`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: {"@type": "WebPage", "@id": siteUrl, name: "Home"},
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: {"@type": "WebPage", "@id": blogUrl, name: "Blog"},
      },
      {
        "@type": "ListItem",
        position: 3,
        name: baseData.headline,
        item: {
          "@type": "WebPage",
          "@id": baseData.url,
          name: baseData.headline,
        },
      },
    ],
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(blogPosting)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
    </Head>
  );
}
