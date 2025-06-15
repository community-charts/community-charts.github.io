import type { ReactNode } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

export default function HomepageHeader(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          {siteConfig.tagline || 'Your Go-To Source for Community-Driven Helm Deployments.'}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/charts/all-charts"> {/* Update this path to your chart index */}
            Browse Charts
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/getting-started"> {/* Update this path to your getting started guide */}
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}