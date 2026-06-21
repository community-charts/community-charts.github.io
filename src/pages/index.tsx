import type { ReactNode } from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageHeader from "@site/src/components/HomepageHeader";
import HomepageWhatWeOffer from "@site/src/components/HomepageWhatWeOffer";
import HomepageFeaturedCharts from "@site/src/components/HomepageFeaturedCharts";
import HomepageHowToGetStarted from "@site/src/components/HomepageHowToGetStarted";
import HomepageCommunity from "@site/src/components/HomepageCommunity";
import HomepageLatestBlogPosts from "@site/src/components/HomepageLatestBlogPosts";

function HomepageStructuredData(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: "Home",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: { "@type": "WebPage", "@id": `${siteUrl}/`, name: "Home" },
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Community Charts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Community Charts provides community-maintained Helm charts for open-source applications that lack official Kubernetes/Helm support. It offers production-ready charts for tools like MLflow, n8n, and Actual Budget.",
        },
      },
      {
        "@type": "Question",
        name: "How do I add the Community Charts Helm repository?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Run the following commands: helm repo add community-charts https://community-charts.github.io/helm-charts && helm repo update",
        },
      },
      {
        "@type": "Question",
        name: "What Helm charts are available in Community Charts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Community Charts offers Helm charts for MLflow (ML lifecycle management and experiment tracking), n8n (workflow automation), Actual Budget (self-hosted personal finance), and other open-source tools. Browse all available charts at https://community-charts.github.io/docs/category/charts",
        },
      },
      {
        "@type": "Question",
        name: "How do I install a chart from Community Charts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "After adding the repository, run: helm install my-release community-charts/<chart-name>. Replace <chart-name> with the chart you want to deploy, for example: helm install my-mlflow community-charts/mlflow",
        },
      },
      {
        "@type": "Question",
        name: "How can I contribute to Community Charts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can contribute by suggesting new charts, reporting bugs, or submitting pull requests on GitHub at https://github.com/community-charts/helm-charts. Chart requests and issues are welcome via the GitHub issue tracker.",
        },
      },
    ],
  };

  return (
    <Head>
      <link rel="canonical" href={`${siteUrl}/`} />
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      <script type="application/ld+json">{JSON.stringify(faq)}</script>
    </Head>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title={`Community Helm Charts for Open-Source Kubernetes Apps`}
      description="Discover community-driven Helm charts for open-source tools lacking official support. Deploy apps effortlessly on Kubernetes."
    >
      <HomepageStructuredData />
      <HomepageHeader />
      <main>
        <HomepageWhatWeOffer />
        <HomepageFeaturedCharts />
        <HomepageHowToGetStarted />
        <HomepageCommunity />
        <HomepageLatestBlogPosts />
      </main>
    </Layout>
  );
}
