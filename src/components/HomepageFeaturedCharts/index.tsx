import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

import { FaGithub } from 'react-icons/fa';

import styles from './styles.module.css';

interface FeaturedChart {
  name: string;
  description: string;
  docLink: string;
  githubLink: string;
  image: string; // URL for the image
}

const FeaturedCharts: FeaturedChart[] = [
  {
    name: 'MLflow',
    description: 'Open-source platform for managing the end-to-end machine learning lifecycle, including experiment tracking and model deployment.',
    docLink: '/docs/charts/mlflow',
    githubLink: 'https://github.com/community-charts/helm-charts/tree/main/charts/mlflow',
    image: 'https://raw.githubusercontent.com/mlflow/mlflow/master/assets/logo.svg',
  },
  {
    name: 'n8n',
    description: 'Extendable workflow automation tool for integrating apps and automating tasks with a no-code/low-code interface.',
    docLink: '/docs/charts/n8n',
    githubLink: 'https://github.com/community-charts/helm-charts/tree/main/charts/n8n',
    image: 'https://avatars1.githubusercontent.com/u/45487711?s=200&v=4',
  },
  {
    name: 'Actual Budget',
    description: 'Privacy-focused, self-hosted personal finance tracker for managing budgets and transactions.',
    docLink: '/docs/charts/actualbudget',
    githubLink: 'https://github.com/community-charts/helm-charts/tree/main/charts/actualbudget',
    image: 'https://raw.githubusercontent.com/actualbudget/docs/refs/heads/master/static/img/actual.png',
  },
];

export default function HomepageFeaturedCharts(): ReactNode {
  return (
    <section className={styles.featuredCharts}>
      <div className="container">
        <Heading as="h2" className="text--center">Explore Our Featured Charts</Heading>
        <div className="row">
          {FeaturedCharts.map((chart, idx) => (
            <div key={idx} className={clsx('col col--4', styles.chartCardWrapper)}>
              <div className={styles.chartCard}>
                <div className="text--center">
                  {chart.image && <img src={chart.image} alt={chart.name} className={styles.chartImage} />}
                </div>
                <Heading as="h3" className="text--center">{chart.name}</Heading>
                <p className="text--center">{chart.description}</p>
                <div className={styles.chartCardButtons}>
                  <Link
                    className="button button--outline button--primary"
                    to={chart.docLink}>
                    View Docs
                  </Link>
                  <Link
                    className="button button--secondary"
                    to={chart.githubLink}>
                    <FaGithub /> GitHub
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text--center margin-top--lg">
          <Link
            className="button button--primary button--lg"
            to="/docs/charts/all-charts"> {/* Link to all charts */}
            View All Charts
          </Link>
        </div>
      </div>
    </section>
  );
}