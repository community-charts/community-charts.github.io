---
slug: mlflow-chart-version-1.9.0-released
title: mlflow Helm Chart Version 1.9.0 Released
date: 2026-06-20T14:36
authors: burakince
tags: [mlflow, helm, kubernetes, open-source]
description: Announcing the release of mlflow chart version 1.9.0 Helm chart, featuring app version 3.14.0, with new features and community-driven improvements.
---

# mlflow Helm Chart Version 1.9.0 Released!

We are excited to share the release of the **mlflow Helm chart version 1.9.0** on June 20, 2026, which includes the **app version 3.14.0**. This update introduces new features, enhancements, and improvements inspired by our vibrant community, making it easier than ever to deploy mlflow on Kubernetes.

## What's New in mlflow 1.9.0 Chart

This release encompasses updates to both the Helm chart (version 1.9.0) and the underlying application (version 3.14.0). Here’s a summary of the key changes:

- **Added**: An optional oauth2-proxy sidecar for OIDC/OAuth2 authentication in front of MLflow, complete with configurable provider settings, secret management, and automatic Ingress port forwarding.
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/321)
- **Added**: An oidcAuth block for built-in OIDC authentication via the mlflow-oidc-auth plugin, including Redis cache and PostgreSQL user-database support.
    - [GitHub PR](https://github.com/community-charts/helm-charts/pull/328)

For a comprehensive list of changes, please refer to the [release notes](https://github.com/community-charts/helm-charts/releases/tag/mlflow-1.9.0) on GitHub.

{/* truncate */}

## Getting Started with mlflow 1.9.0 Chart

Eager to deploy mlflow 1.9.0? Our [installation guides](https://community-charts.github.io/docs/category/mlflow) offer step-by-step instructions to help you get started, including:

- Quick installation with default configurations.
- Customization options tailored to your environment.
- Best practices for successful production deployments.

Explore all the available options and start deploying mlflow today by visiting the [mlflow documentation](https://community-charts.github.io/docs/category/mlflow).

## Why Choose the mlflow Helm Chart?

The mlflow Helm chart, lovingly maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is created to facilitate easy and reliable deployment of mlflow on Kubernetes. Here are some of the advantages:

- **Ease of Use**: Simplified installation and configuration process.
- **Community-Driven**: Regular updates and enhancements from passionate contributors.
- **Flexibility**: Configurable settings to suit a variety of use cases.
- **Reliability**: Tested for stability and performance in Kubernetes environments.

## Get Involved

We invite you to be part of the GitHub Community Charts! Your contributions are invaluable, whether you're fixing bugs, enhancing documentation, or proposing new features. Here’s how you can contribute:

- **Explore the Chart**: Visit the [mlflow documentation](https://community-charts.github.io/docs/category/mlflow) for detailed configuration information.
- **Contribute**: Share your expertise by submitting pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: If you encounter a bug, please [let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Suggest improvements through our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for supporting mlflow and GitHub Community Charts. Together, let’s continue to simplify Kubernetes deployments!
