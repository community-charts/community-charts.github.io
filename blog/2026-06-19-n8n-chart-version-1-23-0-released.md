---
slug: n8n-chart-version-1.23.0-released
title: n8n chart version 1.23.0 released
date: 2026-06-19T22:28
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Announcing the release of n8n chart version 1.23.0 Helm chart, featuring app version 2.26.7, with new features and community-driven improvements.
---

# n8n chart version 1.23.0 released!

We are excited to share the release of the **n8n Helm chart version 1.23.0** as of June 19, 2026, showcasing **app version 2.26.7**. This update includes a host of new features, enhancements, and community-driven improvements designed to streamline your experience deploying n8n on Kubernetes.

## What's New in the n8n 1.23.0 Chart

This release not only updates the Helm chart (version 1.23.0) but also enhances the underlying application (version 2.26.7). Here’s a quick look at what’s new:

- **Added**: Introduced the extraEnv field in main, worker, webhook, and webhook.mcp blocks for environment variables that support valueFrom (e.g., secretKeyRef, configMapKeyRef, fieldRef).

For a more detailed list of changes, be sure to check out the [release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.23.0) on GitHub.

{/* truncate */}

## Getting Started with the n8n 1.23.0 Chart

Are you ready to deploy n8n version 1.23.0? Our comprehensive [installation guides](https://community-charts.github.io/docs/category/n8n) provide all the information you need to get up and running, including:

- Quick installation with default configurations.
- Customization options to fit your environment.
- Best practices for seamless production deployments.

Visit the [n8n documentation](https://community-charts.github.io/docs/category/n8n) to explore all available options and start deploying n8n today.

## Why Choose the n8n Helm Chart?

The n8n Helm chart, brought to you by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is crafted to make your experience deploying n8n on Kubernetes both simple and efficient. Here are some key benefits:

- **Ease of Use**: Enjoy a streamlined installation and configuration process.
- **Community-Driven**: Benefit from regular updates and enhancements contributed by our vibrant community.
- **Flexibility**: Take advantage of customizable options to address your unique use cases.
- **Reliability**: Count on stability and performance, tested in various Kubernetes environments.

## Get Involved

GitHub Community Charts thrives on community contributions, and we encourage you to get involved! Whether you’re interested in fixing bugs, enhancing documentation, or proposing new features, here’s how you can contribute:

- **Explore the Chart**: Dive into the [n8n documentation](https://community-charts.github.io/docs/category/n8n) for configuration details.
- **Contribute**: Share your expertise by submitting pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: If you've encountered a bug, [let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Have a suggestion? Share your ideas via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for your support of n8n and GitHub Community Charts. Together, we can make Kubernetes deployments even easier!