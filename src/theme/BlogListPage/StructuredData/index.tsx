import type { ReactNode } from "react";
import Head from "@docusaurus/Head";
import { useBlogListPageStructuredData } from "@docusaurus/plugin-content-blog/client";
import type { Props } from "@theme/BlogListPage/StructuredData";

export default function BlogListPageStructuredData(props: Props): ReactNode {
  const structuredData = useBlogListPageStructuredData(props);
  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
}
