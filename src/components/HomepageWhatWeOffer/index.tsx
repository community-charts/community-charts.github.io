import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";

import { FaShieldAlt, FaUsers, FaLightbulb, FaTools } from "react-icons/fa";

import styles from "./styles.module.css";

interface FeatureItem {
  title: string;
  icon: ReactNode;
  description: ReactNode;
}

const FeatureList: FeatureItem[] = [
  {
    title: "Community-Driven",
    icon: <FaUsers size={40} />,
    description: (
      <>
        Managed and maintained by a dedicated community of contributors,
        ensuring charts stay relevant and functional.
      </>
    ),
  },
  {
    title: "Reliable Deployments",
    icon: <FaShieldAlt size={40} />,
    description: (
      <>
        Ensuring up-to-date and functional charts, even for projects without
        official support, for seamless Kubernetes deployments.
      </>
    ),
  },
  {
    title: "Easy to Use",
    icon: <FaTools size={40} />,
    description: (
      <>
        Simplified deployments with well-documented charts and clear, concise
        instructions for every project.
      </>
    ),
  },
  {
    title: "Expand Your Ecosystem",
    icon: <FaLightbulb size={40} />,
    description: (
      <>
        Bringing essential open-source projects, often lacking official charts,
        into the Kubernetes ecosystem.
      </>
    ),
  },
];

function Feature({ title, icon, description }: FeatureItem): ReactNode {
  return (
    <div className={clsx("col col--3", styles.featureItem)}>
      <div className="text--center">{icon}</div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageWhatWeOffer(): ReactNode {
  return (
    <section className={styles.whatWeOffer}>
      <div className="container">
        <Heading as="h2" className="text--center">
          Why Choose GitHub Community Charts?
        </Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
