---
slug: actualbudget-chart-version-1.9.0-released
title: actualbudget chart version 1.9.0 released
date: 2026-06-20T20:51
authors: burakince
tags: [actualbudget, helm, kubernetes, open-source]
description: Discover the exciting features of the actualbudget chart version 1.9.0 Helm chart with app version 26.6.0, designed for smooth and efficient deployments.
---

# actualbudget chart version 1.9.0 released!

We are excited to share the launch of the **actualbudget Helm chart version 1.9.0** on June 20, 2026, featuring **app version 26.6.0**. This latest update introduces enhanced functionalities and community-driven improvements, making it easier than ever to deploy actualbudget on Kubernetes.

## What's New in actualbudget 1.9.0 chart

This release includes significant updates to the Helm chart (version 1.9.0) alongside the underlying application (version 26.6.0). Here’s a sneak peek at the changes:

- **Added**: Optional image digest support for immutable image pulls
- **Fixed**: Corrected secret namespace to use the release namespace rather than an undefined value
- **Fixed**: Aligned schema default values with the actual values.yaml defaults
- **Fixed**: Corrected a typo in the supplementalGroups schema title
- **Fixed**: Adjusted the notContains test assertion on scalar fields to use isNull
- **Fixed**: Updated NOTES.txt to reflect configurable service port in port-forward instructions
- **Fixed**: Implemented @deprecated marker convention for the discoverUrl field
- **Fixed**: Enabled readOnlyRootFilesystem and added a built-in tmp emptyDir volume

For a comprehensive list of changes, please take a look at the [release notes](https://github.com/community-charts/helm-charts/releases/tag/actualbudget-1.9.0) on GitHub.

{/* truncate */}

## Getting Started with actualbudget 1.9.0 chart

Eager to deploy actualbudget 1.9.0? Our [installation guides](https://community-charts.github.io/docs/category/actualbudget) provide easy-to-follow instructions that include:

- Quick installation options with default settings.
- Customizing configurations to match your environment.
- Best practices for seamless production deployments.

Visit the [actualbudget documentation](https://community-charts.github.io/docs/category/actualbudget) to explore all available options and deploy actualbudget today.

## Why Choose the actualbudget Helm Chart?

The actualbudget Helm chart, maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is designed to provide a straightforward and reliable way to deploy actualbudget on Kubernetes. Here are some key benefits:

- **Ease of Use**: Simplified installation and configuration process.
- **Community-Driven**: Regular updates and enhancements from dedicated contributors.
- **Flexibility**: Numerous configurable options to meet various use cases.
- **Reliability**: Rigorously tested for stability within Kubernetes environments.

## Get Involved

GitHub Community Charts is a collaborative project, and we welcome your contributions! Whether you're fixing bugs, enhancing documentation, or suggesting fresh features, here’s how you can get involved:

- **Explore the Chart**: Visit the [actualbudget documentation](https://community-charts.github.io/docs/category/actualbudget) for configuration details.
- **Contribute**: Submit your pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: Found a bug? [Let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Share your suggestions through our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for supporting actualbudget and GitHub Community Charts. Together, let’s continue simplifying Kubernetes deployments!