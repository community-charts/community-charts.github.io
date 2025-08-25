---
slug: mlflow-chart-version-1.6.1-released
title: mlflow chart version 1.6.1 released
date: 2025-08-25T22:08
authors: burakince
tags: [mlflow, helm, kubernetes, open-source, devops, ci-cd]
description: Discover mlflow Helm chart version 1.6.1, powered by app version 3.3.1, featuring enhanced dependencies and community-driven improvements.
---

# mlflow chart version 1.6.1 released!

We’re excited to announce the release of the **mlflow Helm chart version 1.6.1**, published on 2025-08-25 and powered by **mlflow app version 3.3.1**. This update introduces several enhancements, improved dependency versions, and continued support from the open-source community to make deploying MLflow on Kubernetes even easier.

## What’s new in version 1.6.1

This release includes updates to both the Helm chart and its dependencies, ensuring greater reliability and smoother integration for Kubernetes users:

- 🔄 **Image Update**: Upgraded Docker image to `burakince/mlflow:3.3.1`  
  ➤ [View on Docker Hub](https://hub.docker.com/r/burakince/mlflow)

- ⬆️ **PostgreSQL Dependency**: Upgraded Bitnami PostgreSQL chart from `16.7.21` to `16.7.26`  
  ➤ [View on ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql)

- ⬆️ **MySQL Dependency**: Upgraded Bitnami MySQL chart from `14.0.0` to `14.0.3`  
  ➤ [View on ArtifactHub](https://artifacthub.io/packages/helm/bitnami/mysql)

🔗 For the complete list of changes, review the official [release notes on GitHub](https://github.com/community-charts/helm-charts/releases/tag/mlflow-1.6.1).

<!-- truncate -->

## Get started with mlflow 1.6.1

Deploying mlflow on Kubernetes has never been easier. Check out our [installation guides](https://community-charts.github.io/docs/category/mlflow) to get up and running quickly:

- Install using default configurations for a fast setup
- Customize values to match your specific use case
- Follow best practices for production environments

📘 Visit the [mlflow docs](https://community-charts.github.io/docs/category/mlflow) for full configuration options and deployment guidance.

## Why use the mlflow Helm chart?

Maintained by the open-source community via the [GitHub Community Charts](https://github.com/community-charts/helm-charts) project, this Helm chart streamlines the mlflow deployment process:

- ✅ **User-Friendly**: Deploy with minimal config effort  
- 💡 **Community-Powered**: Frequent improvements and feedback-driven updates  
- ⚙️ **Flexible**: Adaptable to various Kubernetes setups  
- 📦 **Stable**: Tested for resilience in production-grade clusters

## Join the mlflow community

The GitHub Community Charts initiative thrives on collaboration. Whether you're new to Kubernetes or a seasoned devops pro, your contributions are highly valued:

- 🔍 Read more about chart configuration in our [official docs](https://community-charts.github.io/docs/category/mlflow)
- 💻 Submit a PR on our [GitHub repository](https://github.com/community-charts/helm-charts)
- 🐞 Report issues or request features via our [issue tracker](https://github.com/community-charts/helm-charts/issues)

Thank you for being part of the mlflow and Helm chart community. Together, we’re building better tools for deploying machine learning solutions at scale.