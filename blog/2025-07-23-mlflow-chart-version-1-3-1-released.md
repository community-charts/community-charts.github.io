---
slug: mlflow-chart-version-1.3.1-released
title: mlflow chart version 1.3.1 released
date: 2025-07-23T21:15
authors: burakince
tags: [mlflow, helm, kubernetes, open-source, devops, cloud-databases]
description: We're excited to announce mlflow chart version 1.3.1 with app version 3.1.3, packed with Helm dependency upgrades and community-powered improvements.
---

# mlflow chart version 1.3.1 released!

We’re excited to announce the release of the **mlflow Helm chart version 1.3.1**, officially available as of **July 23, 2025**. This update includes **mlflow app version 3.1.3**, featuring enhancements, updated dependencies, and meaningful contributions from our open-source community.

## What’s New in mlflow 1.3.1

Helm chart version 1.3.1 introduces several key improvements and version bumps to support a smoother and more secure deployment experience on Kubernetes:

- 🔄 **App Update**: Upgraded `burakince/mlflow` image to version `3.1.3`
  - [View on Docker Hub](https://hub.docker.com/r/burakince/mlflow)
- 📦 **PostgreSQL Update**: Bumped the Bitnami `postgresql` dependency from `16.7.13` to `16.7.21`
  - [View on ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql)
- 📦 **MySQL Update**: Upgraded Bitnami `mysql` dependency from `13.0.2` to `14.0.0`
  - [View on ArtifactHub](https://artifacthub.io/packages/helm/bitnami/mysql)

For a complete breakdown of changes, see the official [release notes on GitHub](https://github.com/community-charts/helm-charts/releases/tag/mlflow-1.3.1).

<!-- truncate -->

## Getting Started with mlflow 1.3.1

Excited to get started with mlflow? Our comprehensive [installation guides](https://community-charts.github.io/docs/category/mlflow) walk you through:

- Deploying quickly with default settings.
- Customizing configurations for your specific environment.
- Leveraging best practices for production-ready clusters.

Whether you're running a quick proof of concept or setting up for a large-scale deployment, the mlflow Helm chart has you covered.

## Why Choose the mlflow Helm Chart?

Maintained by the [GitHub Community Charts](https://github.com/community-charts/helm-charts) project, the mlflow Helm chart is designed for developers, data scientists, and DevOps teams who want simple, scalable, and reliable mlflow deployments on Kubernetes.

Top reasons to choose this chart include:

- ✅ **Simplicity**: Easy to install and configure—perfect for newcomers and pros alike.
- 👥 **Community-Powered**: Built and maintained by the open-source community.
- ⚙️ **Highly Configurable**: Adapts to a wide variety of use cases and infrastructures.
- 🛡️ **Production-Ready**: Tested in real-world Kubernetes clusters for stability.

## Join the Community

Open-source is at the heart of what we do—and we welcome your contributions! Whether you're submitting a bug fix, enhancing documentation, or suggesting new features, here’s how you can get involved:

- 📘 Read the [mlflow chart docs](https://community-charts.github.io/docs/category/mlflow) for instructions and configurations.
- 🔧 Contribute directly via pull requests on [GitHub](https://github.com/community-charts/helm-charts).
- 🐞 Report bugs or suggest features using our [issue tracker](https://github.com/community-charts/helm-charts/issues).

Thank you for supporting the mlflow Helm chart and being an essential part of the GitHub Community Charts ecosystem. Together, we’re making Helm deployments easier, better, and more accessible for everyone.