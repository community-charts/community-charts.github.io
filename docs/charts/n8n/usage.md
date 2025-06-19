---
sidebar_position: 1
---

# n8n chart usage

[n8n](https://n8n.io) is a powerful workflow automation tool that lets you connect apps and automate tasks with a no-code/low-code interface. This chart makes it easy to run n8n on Kubernetes.

- **Official Website:** [https://n8n.io](https://n8n.io)
- **GitHub Repository:** [https://github.com/n8n-io/n8n](https://github.com/n8n-io/n8n)
- **Documentation:** [https://docs.n8n.io](https://docs.n8n.io)
- **ArtifactHub:** [n8n Helm Chart](https://artifacthub.io/packages/helm/community-charts/n8n)

## Why use this chart?

- Deploy n8n reliably on Kubernetes
- Community-maintained and up-to-date
- Great for automating business and personal workflows

## Installation

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
helm install my-n8n community-charts/n8n -n <your-namespace>
```

Replace `<your-namespace>` with your target namespace. For advanced configuration, see [values.yaml](https://github.com/community-charts/helm-charts/blob/main/charts/n8n/values.yaml) and [ArtifactHub page](https://artifacthub.io/packages/helm/community-charts/n8n).
