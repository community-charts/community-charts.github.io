import React, {type ReactNode} from "react";
import Head from "@docusaurus/Head";
import {useBreadcrumbsStructuredData} from "@docusaurus/plugin-content-docs/client";
import type {Props} from "@theme/DocBreadcrumbs/StructuredData";

type RawListItem = {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
};

export default function DocBreadcrumbsStructuredData({
  breadcrumbs,
}: Props): ReactNode {
  const baseData = useBreadcrumbsStructuredData({breadcrumbs});
  const rawItems = (baseData.itemListElement ?? []) as unknown as RawListItem[];

  if (rawItems.length === 0) {
    return null;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: rawItems.map((i) => i.name).join(" > "),
    itemListElement: rawItems.map((i) => ({
      "@type": "ListItem",
      position: i.position,
      name: i.name,
      item: {
        "@type": "WebPage",
        "@id": i.item,
        name: i.name,
      },
    })),
  };

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
}
