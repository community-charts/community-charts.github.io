---
slug: n8n-chart-version-1.18.0-released
title: n8n chart version 1.18.0 released
date: 2026-06-07T12:00
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Announcing the release of n8n chart version 1.18.0 Helm chart, featuring app version 2.23.4, with new features and community-driven improvements.
---

# n8n chart version 1.18.0 released!

We are excited to share the launch of the **n8n Helm chart version 1.18.0** on June 7, 2026, featuring the updated **app version 2.23.4**. This release introduces new features, enhancements, and various community-driven improvements to make deploying n8n on Kubernetes even easier.

## What's New in the n8n 1.18.0 chart

This release not only updates the Helm chart to version 1.18.0 but also includes significant changes in the application (version 2.23.4). Here are the highlights from the changelog:

- **Added**: Security context definitions for the wait-for-main init containers and task runner sidecar containers.
  
- **Security**: Introduced seccompProfile RuntimeDefault to the pod security context (CIS 5.7.2).
  
- **Security**: Enabled readOnlyRootFilesystem for all containers with tmp, cache, and data emptyDir volumes and for the waitContainerSecurityContext (CIS 5.7.3).

For a complete overview of the changes, check out the [release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.18.0) on GitHub.

<!-- truncate -->

## Getting Started with the n8n 1.18.0 chart

Eager to deploy n8n 1.18.0? Our [installation guides](https://community-charts.github.io/docs/category/n8n) offer step-by-step instructions to help you get started, including:

- Quick installation with default configurations.
- Customizing settings to suit your specific environment.
- Best practices for a successful production deployment.

Head over to the [n8n documentation](https://community-charts.github.io/docs/category/n8n) to explore all available options and kick off your n8n deployment today!

## Why Choose the n8n Helm Chart?

The n8n Helm chart, maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is crafted to make deploying n8n on Kubernetes a smooth and reliable experience. Here are some key benefits:

- **Ease of Use**: Simplified installation and configuration processes.
- **Community-Driven**: Regular updates and enhancements from our dedicated contributors.
- **Flexibility**: Configurable options to suit various use cases.
- **Reliability**: Tested for stability across Kubernetes environments.

## Get Involved

The GitHub Community Charts project thrives on community contributions, and we would love for you to be a part of it! Whether you're interested in fixing bugs, enhancing documentation, or proposing new features, here’s how you can contribute:

- **Explore the Chart**: Visit the [n8n documentation](https://community-charts.github.io/docs/category/n8n) for detailed configuration insights.
- **Contribute**: Feel free to submit pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: If you encounter any bugs, please [let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: We welcome improvement suggestions via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for your continued support of n8n and GitHub Community Charts. Together, let’s make Kubernetes deployments even more accessible and efficient!