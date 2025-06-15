import type { ReactNode } from 'react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

import { FaRocket, FaHandsHelping, FaGithub } from 'react-icons/fa';

import styles from './styles.module.css';

export default function HomepageCommunity(): ReactNode {
  return (
    <section className={styles.communitySection}>
      <div className="container">
        <Heading as="h2" className="text--center">Join Our Community & Contribute!</Heading>
        <p className="text--center">
          Our charts are built by the community, for the community. We welcome your contributions, feedback, and ideas.
        </p>
        <div className={styles.communityButtons}>
          <Link
            className="button button--primary button--lg"
            to="https://github.com/community-charts/helm-charts/issues/new?template=chart_request.yml">
            <FaRocket /> Suggest a New Chart
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="https://github.com/community-charts/helm-charts/blob/main/CONTRIBUTING.md">
            <FaHandsHelping /> Contribute to an Existing Chart
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="https://github.com/community-charts/helm-charts/issues">
            <FaGithub /> Report an Issue
          </Link>
          {/* Add a Discord/Discussions link if you have one */}
          {/* <Link
            className="button button--info button--lg"
            to="YOUR_DISCORD_INVITE_LINK">
            <FaDiscord /> Join Discord
          </Link> */}
        </div>
      </div>
    </section>
  );
}