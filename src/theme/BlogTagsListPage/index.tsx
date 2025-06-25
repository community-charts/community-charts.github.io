import Head from '@docusaurus/Head';
import BlogTagsListPage from '@theme-original/BlogTagsListPage';
import type { Props } from '@theme/BlogTagsListPage';

export default function BlogTagsListPageWrapper(props: Props) {
  return (
    <>
      <Head>
        <meta name="description" content="Browse all tags for blog posts about Helm, Kubernetes, and more. Find topics and discover content in the Community Charts blog." />
      </Head>
      <BlogTagsListPage {...props} />
    </>
  );
}