---
slug: n8n-chart-version-1.24.1-released
title: n8n chart version 1.24.1 released
date: 2026-06-30T03:04
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Announcing the release of n8n chart version 1.24.1 Helm chart, featuring app version 2.27.5, with new features and community-driven improvements.
---

# n8n chart version 1.24.1 released!

We are excited to share the launch of the **n8n Helm chart version 1.24.1** on June 30, 2026, featuring **app version 2.27.5**. This update introduces a range of new features and enhancements, all designed to streamline the deployment of n8n on Kubernetes.

## What's New in n8n 1.24.1 chart

This release showcases improvements to both the Helm chart (version 1.24.1) and the underlying application (version 2.27.5). Here’s a brief overview of what’s included:

- **Changed**: Updated the n8nio/n8n image version to 2.27.5
    - [Upstream Project](https://github.com/n8n-io/n8n)
- **Changed**: Updated the Redis dependency from version 27.0.12 to 27.0.13
    - [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/redis)
- **Changed**: Updated the PostgreSQL dependency from version 18.7.8 to 18.7.9
    - [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql)

For a comprehensive list of changes, please check out the [release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.24.1) on GitHub.

{/* truncate */}

## Getting Started with n8n 1.24.1 chart

Looking to deploy n8n 1.24.1? Our [installation guides](https://community-charts.github.io/docs/category/n8n) offer clear, step-by-step instructions to help you get started, including:

- Quick installation with default configurations.
- Customizing settings for your specific environment.
- Best practices for successful production deployments.

Visit the [n8n documentation](https://community-charts.github.io/docs/category/n8n) to explore all the options and deploy n8n today.

## Why Choose the n8n Helm Chart?

The n8n Helm chart, managed by [GitHub Community Charts](https://github.com/community-charts/helm-charts), aims to make the deployment of n8n on Kubernetes both straightforward and dependable. Here are some key benefits:

- **Ease of Use**: Simple installation and configuration processes.
- **Community-Driven**: Continuous updates and enhancements contributed by the community.
- **Flexibility**: Configurable options tailored to diverse use cases.
- **Reliability**: Thoroughly tested for stability in Kubernetes environments.

## Get Involved

GitHub Community Charts is a collaborative project, and we welcome your contributions! Whether you're fixing bugs, improving documentation, or suggesting new features, here’s how you can get involved:

- **Explore the Chart**: Visit the [n8n documentation](https://community-charts.github.io/docs/category/n8n) for detailed configuration information.
- **Contribute**: Submit pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: Encounter a bug? [Let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Share your suggestions via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for supporting n8n and GitHub Community Charts. Together, we can make Kubernetes deployments more accessible and efficient!