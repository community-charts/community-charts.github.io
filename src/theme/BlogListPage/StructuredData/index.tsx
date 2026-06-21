import type { ReactNode } from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useBlogListPageStructuredData } from "@docusaurus/plugin-content-blog/client";
import type { Props } from "@theme/BlogListPage/StructuredData";

export default function BlogListPageStructuredData(props: Props): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url;
  const structuredData = useBlogListPageStructuredData(props);

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
