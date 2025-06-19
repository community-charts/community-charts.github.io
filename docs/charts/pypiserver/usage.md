---
sidebar_position: 1
---

# PyPI Server chart usage

[Pypiserver](https://github.com/pypiserver/pypiserver) is a minimal PyPI compatible server for hosting your own Python packages. This chart helps you deploy a private PyPI server on Kubernetes.

- **Official Website:** [https://github.com/pypiserver/pypiserver](https://github.com/pypiserver/pypiserver)
- **GitHub Repository:** [https://github.com/pypiserver/pypiserver](https://github.com/pypiserver/pypiserver)
- **Documentation:** [https://github.com/pypiserver/pypiserver?tab=readme-ov-file#pypiserver](https://github.com/pypiserver/pypiserver?tab=readme-ov-file#pypiserver)
- **ArtifactHub:** [PyPI server Helm Chart](https://artifacthub.io/packages/helm/community-charts/pypiserver)

## Why use this chart?

- Host your own private Python package repository
- Community-maintained and up-to-date
- Simple, lightweight, and easy to use

## Installation

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
helm install my-pypiserver community-charts/pypiserver -n <your-namespace>
```

Replace `<your-namespace>` with your target namespace. For advanced configuration, see [values.yaml](https://github.com/community-charts/helm-charts/blob/main/charts/pypiserver/values.yaml) and [ArtifactHub page](https://artifacthub.io/packages/helm/community-charts/pypiserver).
