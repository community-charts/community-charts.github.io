import type { ReactNode } from "react";
import Head from "@docusaurus/Head";
import BlogAuthorsListPage from "@theme-original/Blog/Pages/BlogAuthorsListPage";
import type { Props } from "@theme/Blog/Pages/BlogAuthorsListPage";

export default function BlogAuthorsListPageWrapper(props: Props): ReactNode {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Meet the authors behind the Community Charts blog. Discover contributors, their profiles, and their latest posts."
        />
      </Head>
      <BlogAuthorsListPage {...props} />
    </>
  );
}
