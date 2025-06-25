---
slug: mlflow-chart-version-1.3.0-released
title: mlflow chart version 1.3.0 released
authors: burakince
tags: [mlflow, helm, kubernetes, open-source]
description: Announcing the release of mlflow chart version 1.3.0 Helm chart, featuring app version 3.1.1, with new features and community-driven improvements.
---

# mlflow chart version 1.3.0 released!

We are thrilled to announce the release of the **mlflow Helm chart version 1.3.0** on 2025-06-25, featuring **app version 3.1.1**. This update brings new features, enhancements, and community-driven improvements to simplify deploying mlflow on Kubernetes.

## What's New in mlflow 1.3.0 chart

This release includes updates to the Helm chart (version 1.3.0) and the underlying application (version 3.1.1). Below is the detailed changelog:

- **Changed**: Update burakince/mlflow image version to 3.1.1
    - [Upstream Project](https://hub.docker.com/r/burakince/mlflow)
- **Added**: Add group attribute key for Active Directory users
    - [Github Issue](https://github.com/burakince/mlflow/issues/221)
- **Changed**: Update bitnami/postgresql chart version to 16.7.13
    - [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql/16.7.13)
- **Changed**: Update bitnami/mysql chart version to 13.0.2
    - [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/mysql/13.0.2)


For a complete list of changes, view the [release notes](https://github.com/community-charts/helm-charts/releases/tag/mlflow-1.3.0) on GitHub.

<!-- truncate -->

## Getting Started with mlflow 1.3.0 chart

Ready to deploy mlflow 1.3.0? Our [installation guides](https://community-charts.github.io/docs/category/mlflow) provide step-by-step instructions to get you started, including:

- Quick installation with default configurations.
- Customizing settings to suit your environment.
- Best practices for production deployments.

Visit the [mlflow documentation](https://community-charts.github.io/docs/category/mlflow) to explore all available options and deploy mlflow today.

## Why Choose the mlflow Helm Chart?

The mlflow helm chart, maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is designed to make deploying mlflow on Kubernetes straightforward and reliable. Key benefits include:

- **Ease of Use**: Simplified installation and configuration.
- **Community-Driven**: Regular updates and improvements from contributors.
- **Flexibility**: Configurable options to meet diverse use cases.
- **Reliability**: Tested for stability in Kubernetes environments.

## Get Involved

GitHub Community Charts is a community-driven project, and we welcome your contributions! Whether you're fixing bugs, improving documentation, or suggesting new features, here's how you can get started:

- **Explore the Chart**: Check out the [mlflow documentation](https://community-charts.github.io/docs/category/mlflow) for configuration details.
- **Contribute**: Submit pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: Found a bug? [Let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Suggest improvements via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for supporting mlflow and GitHub Community Charts. Let's continue making Kubernetes deployments easier, together!
