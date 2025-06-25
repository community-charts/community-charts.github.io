import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import HomepageHeader from '@site/src/components/HomepageHeader';
import HomepageWhatWeOffer from '@site/src/components/HomepageWhatWeOffer';
import HomepageFeaturedCharts from '@site/src/components/HomepageFeaturedCharts';
import HomepageHowToGetStarted from '@site/src/components/HomepageHowToGetStarted';
import HomepageCommunity from '@site/src/components/HomepageCommunity';
import HomepageLatestBlogPosts from '@site/src/components/HomepageLatestBlogPosts';

// --- Main Home Component ---
export default function Home(): ReactNode {
  return (
    <Layout
      title={`Community Helm Charts for Open-Source Kubernetes Apps`}
      description="Discover community-driven Helm charts for open-source tools lacking official support. Deploy apps effortlessly on Kubernetes.">
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
