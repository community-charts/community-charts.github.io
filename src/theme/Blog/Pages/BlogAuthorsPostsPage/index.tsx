import type {ReactNode} from "react";
import Head from "@docusaurus/Head";
import BlogAuthorsPostsPage from "@theme-original/Blog/Pages/BlogAuthorsPostsPage";
import type {Props} from "@theme/Blog/Pages/BlogAuthorsPostsPage";
import useDocusaurusContext from "@docusaurus/core/lib/client/exports/useDocusaurusContext";

type WorksFor = {
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
};

type ExtendedAuthor = Props["author"] & {
  jobTitle?: string;
  worksFor?: WorksFor;
  gender?: string;
  schemaImageUrl?: string;
  personId?: string;
  dateCreated?: string;
  additionalSameAs?: string[];
};

function normalizeUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function buildSameAs(
  socials: Record<string, string> | undefined,
  authorUrl: string | undefined,
  additionalSameAs: string[] = []
): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];

  const add = (url: string) => {
    const key = normalizeUrl(url);
    if (!seen.has(key)) {
      seen.add(key);
      urls.push(url);
    }
  };

  for (const v of Object.values(socials ?? {})) {
    if (v.startsWith("https://") || v.startsWith("http://")) {
      add(v);
    }
  }

  if (authorUrl) {
    add(authorUrl);
  }

  for (const v of additionalSameAs) {
    add(v);
  }

  return urls;
}

export default function BlogAuthorsPostsPageWrapper(props: Props): ReactNode {
  const {author, items} = props;
  const {siteConfig} = useDocusaurusContext();
  const ext = author as unknown as ExtendedAuthor;
  const authorName = ext.name || "this author";

  const pageUrl = ext.page?.permalink
    ? `${siteConfig.url}${ext.page.permalink}`
    : undefined;

  const sameAs = buildSameAs(ext.socials, ext.url, ext.additionalSameAs);
  const imageUrl = ext.schemaImageUrl ?? ext.imageURL;

  const latestPostDate = items?.[0]?.content?.metadata?.date;
  const dateModified = latestPostDate
    ? new Date(latestPostDate).toISOString()
    : undefined;

  const person = {
    "@type": "Person",
    ...(ext.personId ? {"@id": ext.personId} : {}),
    name: authorName,
    ...(ext.description ?? ext.title
      ? {description: ext.description ?? ext.title}
      : {}),
    ...(ext.jobTitle ? {jobTitle: ext.jobTitle} : {}),
    ...(ext.worksFor ? {worksFor: ext.worksFor} : {}),
    ...(ext.gender ? {gender: ext.gender} : {}),
    ...(ext.url ? {url: ext.url} : {}),
    ...(imageUrl
      ? {
          image: {
            "@type": "ImageObject",
            "@id": imageUrl,
            url: imageUrl,
          },
        }
      : {}),
    ...(sameAs.length > 0 ? {sameAs} : {}),
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    ...(pageUrl ? {"@id": pageUrl} : {}),
    ...(ext.dateCreated ? {dateCreated: ext.dateCreated} : {}),
    ...(dateModified ? {dateModified} : {}),
    mainEntity: person,
  };

  return (
    <>
      <Head>
        <meta
          name="description"
          content={`Read blog posts by ${authorName} on Community Charts. Explore their contributions and expertise.`}
        />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>
      <BlogAuthorsPostsPage {...props} />
    </>
  );
}
