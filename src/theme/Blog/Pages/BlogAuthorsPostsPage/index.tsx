import type { ReactNode } from "react";
import Head from "@docusaurus/Head";
import BlogAuthorsPostsPage from "@theme-original/Blog/Pages/BlogAuthorsPostsPage";
import type { Props } from "@theme/Blog/Pages/BlogAuthorsPostsPage";

export default function BlogAuthorsPostsPageWrapper(props: Props): ReactNode {
  const authorName = props?.author?.name || "this author";

  return (
    <>
      <Head>
        <meta
          name="description"
          content={`Read blog posts by ${authorName} on Community Charts. Explore their contributions and expertise.`}
        />
      </Head>
      <BlogAuthorsPostsPage {...props} />
    </>
  );
}
