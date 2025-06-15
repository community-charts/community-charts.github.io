import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageHeader from '@site/src/components/HomepageHeader';
import HomepageWhatWeOffer from '@site/src/components/HomepageWhatWeOffer';
import HomepageFeaturedCharts from '@site/src/components/HomepageFeaturedCharts';
import HomepageHowToGetStarted from '@site/src/components/HomepageHowToGetStarted';
import HomepageCommunity from '@site/src/components/HomepageCommunity';

// --- Main Home Component ---
export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Home | ${siteConfig.title}`}
      description="Community-maintained Helm Charts for open-source projects lacking official support. Deploy your applications easily on Kubernetes.">
      <HomepageHeader />
      <main>
        <HomepageWhatWeOffer />
        <HomepageFeaturedCharts />
        <HomepageHowToGetStarted />
        <HomepageCommunity />
        {/* Potentially add a latest blog posts section here if you have a blog */}
        {/* <HomepageLatestBlogPosts /> */}
      </main>
    </Layout>
  );
}
