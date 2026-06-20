---
slug: outline-chart-version-0.9.0-released
title: outline chart version 0.9.0 released
date: 2026-06-20T21:14
authors: burakince
tags: [outline, helm, kubernetes, open-source]
description: Announcing the release of outline chart version 0.9.0 Helm chart, featuring app version 1.8.1, with new features and community-driven improvements.
---

# outline chart version 0.9.0 released!

We are excited to share the release of the **outline Helm chart version 0.9.0** on June 20, 2026, featuring **app version 1.8.1**. This latest update introduces a host of new features, enhancements, and community-driven improvements, all aimed at making your deployment of outline on Kubernetes more seamless.

## What's New in outline 0.9.0 chart

This version includes important updates to both the Helm chart (version 0.9.0) and the underlying application (version 1.8.1). Check out the detailed changelog below:

- **Added**: Optional image digest support for immutable image pulls.
  
- **Fixed**: Enabled readOnlyRootFilesystem and added a built-in tmp emptyDir volume.
  
- **Changed**: Updated outlinewiki/outline image version to 1.8.1
    - [Upstream Project](https://hub.docker.com/r/outlinewiki/outline)
- **Changed**: Upgraded dependency redis from version 25.5.3 to 27.0.4
    - [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/redis)
- **Changed**: Updated dependency postgresql from version 18.7.0 to 18.7.2
    - [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql)

For a complete list of changes, please refer to the [release notes](https://github.com/community-charts/helm-charts/releases/tag/outline-0.9.0) on GitHub.

{/* truncate */}

## Getting Started with outline 0.9.0 chart

Are you ready to deploy outline 0.9.0? Our [installation guides](https://community-charts.github.io/docs/category/outline) provide you with step-by-step instructions to get started, including:

- Quick installation using default configurations.
- Customizing settings to fit your specific environment.
- Best practices for successful production deployments.

Visit the [outline documentation](https://community-charts.github.io/docs/category/outline) to discover all available options and deploy outline today.

## Why Choose the outline Helm Chart?

The outline Helm chart, maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is crafted to make it easy and reliable to deploy outline on Kubernetes. Key benefits include:

- **Ease of Use**: Simplified installation and configuration process.
- **Community-Driven**: Regular updates and enhancements from a dedicated group of contributors.
- **Flexibility**: Configurable options to cater to various use cases.
- **Reliability**: Thoroughly tested for stability in Kubernetes environments.

## Get Involved

GitHub Community Charts is a collaborative project, and we invite you to contribute! Whether you want to fix bugs, enhance documentation, or propose new features, here’s how you can get started:

- **Explore the Chart**: Dive into the [outline documentation](https://community-charts.github.io/docs/category/outline) for detailed configuration information.
- **Contribute**: Submit your pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: If you discover a bug, please [let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Share your improvement suggestions via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for supporting outline and the GitHub Community Charts. Together, let's make Kubernetes deployments easier and more effective!