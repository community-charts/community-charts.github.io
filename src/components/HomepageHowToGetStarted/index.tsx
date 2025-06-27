import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

export default function HomepageHowToGetStarted(): ReactNode {
  return (
    <section className={styles.howToGetStarted}>
      <div className="container">
        <Heading as="h2" className="text--center">
          How to Get Started
        </Heading>
        <div className="row">
          <div className={clsx("col col--4")}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <Heading as="h3">Add Our Helm Repository</Heading>
              <p>
                Add the GitHub Community Charts Helm repository to your local
                setup to access our charts.
              </p>
              <pre>
                <code>
                  helm repo add community-charts
                  https://community-charts.github.io/helm-charts
                </code>
              </pre>
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <Heading as="h3">Find Your Chart</Heading>
              <p>
                Browse our extensive documentation to find the chart you need,
                with detailed configuration options.
              </p>
              <Link
                className="button button--outline button--primary"
                to="/docs/category/charts"
              >
                Browse All Charts
              </Link>
            </div>
          </div>
          <div className={clsx("col col--4")}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <Heading as="h3">Deploy with Helm</Heading>
              <p>
                Install the chart directly into your Kubernetes cluster with a
                simple Helm command.
              </p>
              <pre>
                <code>helm install my-release community-charts/my-chart</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
