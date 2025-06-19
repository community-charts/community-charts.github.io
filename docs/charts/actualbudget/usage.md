---
sidebar_position: 1
---

# Actual Budget chart usage

[Actual Budget](https://actualbudget.org) is a self-hosted personal finance manager that helps you track your spending, set budgets, and gain control over your finances. This Helm chart makes it easy to deploy Actual Budget on Kubernetes.

- **Official Website:** [https://actualbudget.org](https://actualbudget.org)
- **GitHub Repository:** [https://github.com/actualbudget/actual](https://github.com/actualbudget/actual)
- **Documentation:** [https://actualbudget.org/docs](https://actualbudget.org/docs)
- **ArtifactHub:** [Actual Budget Helm Chart](https://artifacthub.io/packages/helm/community-charts/actualbudget)

## Why use this chart?

- Quick, reliable deployment of Actual Budget on any Kubernetes cluster
- Community-maintained and up-to-date
- Great for self-hosters and teams needing private finance management

## Installation

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
helm install my-actualbudget community-charts/actualbudget -n <your-namespace>
```

Replace `<your-namespace>` with your target namespace. For advanced configuration, see the [values.yaml](https://github.com/community-charts/helm-charts/blob/main/charts/actualbudget/values.yaml) and [ArtifactHub page](https://artifacthub.io/packages/helm/community-charts/actualbudget).
