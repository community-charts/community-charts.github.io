---
sidebar_position: 1
---

# Drone CI chart usage

[Drone](https://drone.io) is a modern Continuous Integration and Continuous Deployment (CI/CD) platform built on container technology. This chart lets you deploy Drone on Kubernetes easily.

- **Official Website:** [https://drone.io](https://drone.io)
- **GitHub Repository:** [https://github.com/harness/drone](https://github.com/harness/drone)
- **Documentation:** [https://docs.drone.io](https://docs.drone.io)
- **ArtifactHub:** [Drone Helm Chart](https://artifacthub.io/packages/helm/community-charts/drone)

## Why use this chart?

- Run CI/CD pipelines in your own Kubernetes cluster
- Community-maintained and up-to-date
- Supports plugins and custom runners

## Installation

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
helm install my-drone community-charts/drone -n <your-namespace>
```

Replace `<your-namespace>` with your target namespace. For advanced configuration, see [values.yaml](https://github.com/community-charts/helm-charts/blob/main/charts/drone/values.yaml) and [ArtifactHub page](https://artifacthub.io/packages/helm/community-charts/drone).
