---
slug: n8n-chart-version-1.16.47-released
title: n8n chart version 1.16.47 released
date: 2026-06-05T11:47
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Announcing the release of n8n chart version 1.16.47 Helm chart, featuring app version 2.23.3, with new features and community-driven improvements.
---

# n8n chart version 1.16.47 released!

We are excited to share the launch of the **n8n Helm chart version 1.16.47** on June 5, 2026, which includes the highly anticipated **app version 2.23.3**. This update is packed with new features, enhancements, and valuable community-driven improvements to streamline the deployment of n8n on Kubernetes.

## What's New in the n8n 1.16.47 Chart

This release encompasses updates not only to the Helm chart (version 1.16.47) but also to the underlying application (version 2.23.3). Below are the key highlights from the changelog:

- **Changed**: Updated the n8nio/n8n image to version 2.23.3
    - [Upstream Project](https://github.com/n8n-io/n8n)
- **Added**: Set unhealthyPodEvictionPolicy to AlwaysAllow in PodDisruptionBudgets for main, worker, and webhook nodes.
  
- **Changed**: Adjusted PDB default from minAvailable 1 to maxUnavailable 1 for main, worker, and webhook nodes.

For a comprehensive overview of all changes, be sure to check out the [release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.16.47) on GitHub.

{/* truncate */}

## Getting Started with the n8n 1.16.47 Chart

Ready to deploy n8n version 1.16.47? Our [installation guides](https://community-charts.github.io/docs/category/n8n) offer detailed, step-by-step instructions to help you get up and running quickly, including:

- Quick installation with default configurations.
- Customization tips to tailor settings to your environment.
- Best practices for successful production deployments.

Visit the [n8n documentation](https://community-charts.github.io/docs/category/n8n) to explore all available options and start deploying n8n today.

## Why Choose the n8n Helm Chart?

The n8n Helm chart, expertly maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is crafted to make deploying n8n on Kubernetes smooth and dependable. Here are some key benefits:

- **Ease of Use**: Enjoy simplified installation and configuration processes.
- **Community-Driven**: Benefit from regular updates and enhancements from a dedicated contributor network.
- **Flexibility**: Access configurable options designed to meet a variety of use cases.
- **Reliability**: Each version is thoroughly tested for stability in Kubernetes environments.

## Get Involved

At GitHub Community Charts, we thrive on community contributions! We would love for you to be a part of our project. Whether you're fixing bugs, enhancing documentation, or suggesting new features, here’s how to get involved:

- **Explore the Chart**: Check out the [n8n documentation](https://community-charts.github.io/docs/category/n8n) for detailed configuration information.
- **Contribute**: Submit your pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: Encounter a bug? [Let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Share your suggestions via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for supporting n8n and the GitHub Community Charts project. Together, let’s make Kubernetes deployments easier and more enjoyable!