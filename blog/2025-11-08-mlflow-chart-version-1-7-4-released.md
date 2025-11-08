---
slug: mlflow-chart-version-1.7.4-released
title: mlflow chart version 1.7.4 released
date: 2025-11-08T11:58
authors: burakince
tags: [mlflow, helm, kubernetes, open-source]
description: Announcing the new mlflow Helm chart version 1.7.4 with app version 3.6.0, delivering improved support for Kubernetes deployments.
---

# mlflow chart version 1.7.4 released

We’re excited to share that the latest version of the **mlflow Helm chart (1.7.4)** is now available as of 2025-11-08. This release features **mlflow app version 3.6.0**, delivering a more seamless experience when deploying mlflow in Kubernetes environments.

## What’s new in version 1.7.4

Version 1.7.4 introduces updates focused on improving stability and compatibility. This includes an upgrade to the latest mlflow image along with enhancements to key dependencies:

- ✅ **Updated**: Upgraded Docker image to `burakince/mlflow:3.6.0`  
  ➤ [View on Docker Hub](https://hub.docker.com/r/burakince/mlflow)
- 🔄 **Updated**: PostgreSQL dependency bumped from `18.1.1` to `18.1.7`  
  ➤ [View on ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql)

For the full list of updates and detailed changelog, check out the official [1.7.4 release notes on GitHub](https://github.com/community-charts/helm-charts/releases/tag/mlflow-1.7.4).

<!-- truncate -->

## Getting started with mlflow 1.7.4

Ready to dive in? Setting up mlflow using the latest Helm chart is simple. Our [installation documentation](https://community-charts.github.io/docs/category/mlflow) covers everything you need to get started:

- 🚀 Quick installation with out-of-the-box defaults
- ⚙️ Tailoring configurations for your environment
- 📦 Tips for running mlflow in production on Kubernetes

Visit the [official mlflow chart docs](https://community-charts.github.io/docs/category/mlflow) to explore configuration options and deployment best practices.

## Why use the mlflow Helm chart?

Crafted and supported by the open-source community, the mlflow Helm chart is purpose-built for seamless Kubernetes integration. Here's why it stands out:

- 🧩 **Simple setup**: Deploy mlflow efficiently with Helm’s templated configuration system
- 💬 **Open-source collaboration**: Benefit from frequent updates driven by real-world feedback
- 🔧 **Customizable deployment**: Fine-tune the chart to fit your workflow or cloud infrastructure
- ✅ **Kubernetes-ready**: Built and tested for robust performance on Kubernetes

## Join our open-source community

The mlflow Helm chart is maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), a dedicated group of developers, DevOps engineers, and contributors. Whether you're here to explore or actively contribute, we’d love to have you involved:

- 📘 Check the [mlflow chart documentation](https://community-charts.github.io/docs/category/mlflow)
- 🔧 Contribute improvements, fixes, or enhancements on [GitHub](https://github.com/community-charts/helm-charts)
- 🐛 Submit bugs or suggest ideas via our [issue tracker](https://github.com/community-charts/helm-charts/issues)

Thanks for being part of the community. Together, we’re making kubernetes-native mlflow easier to deploy, maintain, and scale!