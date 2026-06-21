import type { ReactNode } from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useBlogListPageStructuredData } from "@docusaurus/plugin-content-blog/client";
import type { Props } from "@theme/BlogListPage/StructuredData";

const DEFAULT_IMAGE_PATH = "/img/social-card.png";

type BlogPosting = {
  "@type": string;
  headline?: string;
  image?: object;
  [key: string]: unknown;
};

type BlogStructuredData = {
  blogPost?: BlogPosting[];
  [key: string]: unknown;
};

export default function BlogListPageStructuredData(props: Props): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url;
  const rawStructuredData = useBlogListPageStructuredData(
    props
  ) as unknown as BlogStructuredData;

  const imageUrl = `${siteUrl}${DEFAULT_IMAGE_PATH}`;

  const structuredData: BlogStructuredData = {
    ...rawStructuredData,
    blogPost: rawStructuredData.blogPost?.map((post) =>
      post.image
        ? post
        : {
            ...post,
            image: {
              "@type": "ImageObject",
              "@id": imageUrl,
              url: imageUrl,
              contentUrl: imageUrl,
              caption: `title image for the blog post: ${post.headline ?? ""}`,
            },
          }
    ),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: "Home > Blog",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: { "@type": "WebPage", "@id": siteUrl, name: "Home" },
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: {
          "@type": "WebPage",
          "@id": `${siteUrl}/blog`,
          name: "Blog",
        },
      },
    ],
  };

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
    </Head>
  );
}
