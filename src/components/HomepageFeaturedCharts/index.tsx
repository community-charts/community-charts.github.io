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
  image: string;
}

const FeaturedCharts: FeaturedChart[] = [
  {
    name: 'MLflow',
    description: 'Open-source platform for managing the end-to-end machine learning lifecycle, including experiment tracking and model deployment.',
    docLink: '/docs/category/mlflow',
    githubLink: 'https://github.com/community-charts/helm-charts/tree/main/charts/mlflow',
    image: 'https://raw.githubusercontent.com/mlflow/mlflow/master/assets/logo.svg',
  },
  {
    name: 'n8n',
    description: 'Extendable workflow automation tool for integrating apps and automating tasks with a no-code/low-code interface.',
    docLink: '/docs/category/n8n',
    githubLink: 'https://github.com/community-charts/helm-charts/tree/main/charts/n8n',
    image: 'https://avatars1.githubusercontent.com/u/45487711?s=200&v=4',
  },
  {
    name: 'Actual Budget',
    description: 'Privacy-focused, self-hosted personal finance tracker for managing budgets and transactions.',
    docLink: '/docs/category/actual-budget',
    githubLink: 'https://github.com/community-charts/helm-charts/tree/main/charts/actualbudget',
    image: 'https://raw.githubusercontent.com/actualbudget/docs/refs/heads/master/static/img/actual.png',
  },
];

function Feature({name, description, docLink, githubLink, image}: FeaturedChart) {
  return (
    <div className={clsx('col col--4', styles.chartCardWrapper)}>
      <div className={styles.chartCard}>
        <div className="text--center">
          {image && <img src={image} alt={name} className={styles.chartImage} />}
        </div>
        <Heading as="h3" className="text--center">{name}</Heading>
        <p className="text--center">{description}</p>
        <div className={styles.chartCardButtons}>
          <Link
            className="button button--outline button--primary"
            to={docLink}>
            View Docs
          </Link>
          <Link
            className="button button--secondary"
            to={githubLink}>
            <FaGithub /> GitHub
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function HomepageFeaturedCharts(): ReactNode {
  return (
    <section className={styles.featuredCharts}>
      <div className="container">
        <Heading as="h2" className="text--center">Explore Our Featured Charts</Heading>
        <div className="row">
          {FeaturedCharts.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        <div className="text--center margin-top--lg">
          <Link
            className="button button--primary button--lg"
            to="/docs/category/charts">
            View All Charts
          </Link>
        </div>
      </div>
    </section>
  );
}