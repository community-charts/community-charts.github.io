---
slug: n8n-chart-version-1.23.2-released
title: n8n chart version 1.23.2 released
date: 2026-06-23T02:58
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Announcing the release of n8n chart version 1.23.2 Helm chart, featuring app version 2.26.9, with new features and community-driven improvements.
---

# n8n chart version 1.23.2 released!

We are excited to announce the launch of the **n8n Helm chart version 1.23.2** on June 23, 2026, featuring **app version 2.26.9**. This update introduces new features, enhancements, and community-driven improvements to simplify the deployment of n8n on Kubernetes.

## What's New in n8n 1.23.2 chart

This release incorporates updates to both the Helm chart (version 1.23.2) and the underlying application (version 2.26.9). Here’s a brief overview of the changes:

- **Changed**: Updated the n8nio/n8n image version to 2.26.9
    - [Upstream Project](https://github.com/n8n-io/n8n)
- **Changed**: Upgraded the redis dependency from 27.0.10 to 27.0.12
    - [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/redis)
- **Changed**: Updated the postgresql dependency from 18.7.6 to 18.7.7
    - [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql)

For a complete list of changes, you can view the [release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.23.2) on GitHub.

<!-- truncate -->

## Getting Started with n8n 1.23.2 chart

Are you ready to deploy n8n 1.23.2? Our [installation guides](https://community-charts.github.io/docs/category/n8n) provide step-by-step instructions to help you get started, including:

- Quick installation with default configurations.
- Customizing settings to fit your environment.
- Best practices for production deployments.

Visit the [n8n documentation](https://community-charts.github.io/docs/category/n8n) to explore all available options and deploy n8n today.

## Why Choose the n8n Helm Chart?

The n8n Helm chart, maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is designed to make deploying n8n on Kubernetes both straightforward and reliable. Here are some key benefits:

- **Ease of Use**: Simplified installation and configuration.
- **Community-Driven**: Regular updates and enhancements from contributors.
- **Flexibility**: Configurable options to cater to various use cases.
- **Reliability**: Tested for stability in Kubernetes environments.

## Get Involved

GitHub Community Charts is a community-driven project, and we warmly welcome your contributions! Whether you’re fixing bugs, enhancing documentation, or suggesting new features, here’s how you can get involved:

- **Explore the Chart**: Check out the [n8n documentation](https://community-charts.github.io/docs/category/n8n) for configuration details.
- **Contribute**: Submit pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: If you encounter a bug, [let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Suggest improvements via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for your support of n8n and GitHub Community Charts. Together, we can continue to make Kubernetes deployments easier and more efficient!