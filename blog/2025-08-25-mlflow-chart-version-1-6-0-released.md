---
slug: mlflow-chart-version-1.6.0-released
title: mlflow chart version 1.6.0 released
date: 2025-08-25T17:45
authors: burakince
tags: [mlflow, helm, kubernetes, open-source]
description: Discover what’s new in mlflow Helm chart 1.6.0, now supporting app version 3.2.0, with performance enhancements and community-driven updates for Kubernetes deployments.
---

# mlflow chart version 1.6.0 released

We’re excited to announce the release of the latest version of the mlflow Helm chart — version 1.6.0 — available as of August 25, 2025. This release includes the updated mlflow application version 3.2.0 and brings a variety of improvements designed to make your Kubernetes deployments more seamless and secure.

## What’s new in mlflow chart 1.6.0

Version 1.6.0 introduces several key changes and fixes thanks to contributions from our vibrant open-source community. Highlights include:

- 🔁 Auth and LDAP Auth external secret loading now handled via init containers  
  - Addresses: [Issue #200](https://github.com/community-charts/helm-charts/issues/200), [Issue #217](https://github.com/community-charts/helm-charts/issues/217)

- 🔒 Improved security handling by removing empty security context definitions  
  - Fixes: [Issue #219](https://github.com/community-charts/helm-charts/issues/219)

For the full list of updates and technical details, check out the official [mlflow 1.6.0 release notes](https://github.com/community-charts/helm-charts/releases/tag/mlflow-1.6.0) on GitHub.

<!-- truncate -->

## Get started with mlflow 1.6.0

Deploying mlflow in your Kubernetes environment is easier than ever. Our updated [installation guide](https://community-charts.github.io/docs/category/mlflow) covers everything you need to get up and running:

- One-step install with default configurations  
- How to customize settings for your specific needs  
- Best practices for stable and secure production setups

Start exploring mlflow Helm chart features and deployment strategies by visiting the [mlflow documentation](https://community-charts.github.io/docs/category/mlflow).

## Why choose the mlflow Helm chart?

Backed by the [GitHub Community Charts](https://github.com/community-charts/helm-charts) initiative, the mlflow Helm chart is built to provide a production-ready, flexible, and easy-to-use deployment strategy:

- ⚙️ Simple, intuitive setup with Helm  
- 🤝 Actively maintained by a passionate open-source community  
- 🧩 Highly configurable to fit a range of Kubernetes environments  
- 🛡️ Stable and secure architecture for reliable ML workflows

## Join the community

We’d love for you to be part of the growing mlflow Helm chart community! There are many ways to get involved:

- 📚 Learn how the chart works in the [official documentation](https://community-charts.github.io/docs/category/mlflow)  
- 🔧 Contribute code or fixes via pull requests to the [GitHub repository](https://github.com/community-charts/helm-charts)  
- 🐞 Report bugs or issues through our [issue tracker](https://github.com/community-charts/helm-charts/issues)  
- 💡 Propose new features and enhancements

Thank you for being part of the mlflow journey. With support from our community, we’re making MLOps on Kubernetes more accessible and powerful for everyone.