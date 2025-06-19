---
sidebar_position: 1
---

# Outline chart usage

[Outline](https://www.getoutline.com) is a modern team knowledge base and wiki. This chart lets you deploy Outline on Kubernetes for collaborative documentation and knowledge sharing.

- **Official Website:** [https://www.getoutline.com](https://www.getoutline.com)
- **GitHub Repository:** [https://github.com/outline/outline](https://github.com/outline/outline)
- **Documentation:** [https://docs.getoutline.com/s/guide](https://docs.getoutline.com/s/guide)
- **ArtifactHub:** [Outline Helm Chart](https://artifacthub.io/packages/helm/community-charts/outline)

## Why use this chart?

- Deploy Outline for your team or organization on Kubernetes
- Community-maintained and up-to-date
- Modern, user-friendly wiki platform

## Installation

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
helm install my-outline community-charts/outline -n <your-namespace>
```

Replace `<your-namespace>` with your target namespace. For advanced configuration, see [values.yaml](https://github.com/community-charts/helm-charts/blob/main/charts/outline/values.yaml) and [ArtifactHub page](https://artifacthub.io/packages/helm/community-charts/outline).
