---
sidebar_position: 1
---

# MLflow chart usage

[MLflow](https://mlflow.org) is an open-source platform for managing the end-to-end machine learning lifecycle, including experiment tracking, model management, and deployment. This chart helps you deploy MLflow on Kubernetes.

- **Official Website:** [https://mlflow.org](https://mlflow.org)
- **GitHub Repository:** [https://github.com/mlflow/mlflow](https://github.com/mlflow/mlflow)
- **Documentation:** [https://mlflow.org/docs/latest/index.html](https://mlflow.org/docs/latest/index.html)
- **ArtifactHub:** [MLflow Helm Chart](https://artifacthub.io/packages/helm/community-charts/mlflow)

## Why use this chart?

- Easily deploy MLflow tracking server and UI on Kubernetes
- Community-maintained and up-to-date
- Flexible backend support (SQLite, PostgreSQL, MySQL, S3, Azure, etc.)

## Installation

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
helm install my-mlflow community-charts/mlflow -n <your-namespace>
```

Replace `<your-namespace>` with your target namespace. For advanced configuration, see [values.yaml](https://github.com/community-charts/helm-charts/blob/main/charts/mlflow/values.yaml) and [ArtifactHub page](https://artifacthub.io/packages/helm/community-charts/mlflow).
