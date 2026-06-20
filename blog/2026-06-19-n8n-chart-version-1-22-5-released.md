---
slug: n8n-chart-version-1.22.5-released
title: n8n chart version 1.22.5 released
date: 2026-06-19T01:08
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Discover the enhancements in n8n chart version 1.22.5 Helm chart, featuring app version 2.26.6, including new features and community contributions.
---

# n8n chart version 1.22.5 released!

We are excited to share the release of the **n8n Helm chart version 1.22.5** on 2026-06-19, featuring **app version 2.26.6**. This update introduces new features and valuable community-driven enhancements, all focused on simplifying your n8n deployment on Kubernetes.

## What's New in n8n 1.22.5 chart

In this release, we've worked hard on updates to both the Helm chart (version 1.22.5) and the underlying application (version 2.26.6). Here’s a look at the significant changes:

- **Fixed**: Set the NPM_CONFIG_CACHE environment variable in the main container to enable community package installations while keeping readOnlyRootFilesystem enabled.
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/508)
    - [GitHub Issue](https://github.com/community-charts/community-charts.github.io/issues/102)
- **Fixed**: Resolved issues with community node packages not being accessible in external task runner mode and added --ignore-scripts to prevent postinstall script errors.
  
- **Added**: Introduced optional PVC persistence for community node packages via nodes.external.persistence.
  
- **Fixed**: Ensured that community package installs route into the main/worker PVC when its mountPath already includes /home/node/.n8n/nodes, eliminating unnecessary separate volumes.
  
- **Fixed**: Addressed the creation of the worker PVC not occurring when worker.count > 1 with ReadWriteMany access mode.
  
- **Fixed**: Fixed the sharing of community packages across StatefulSet replicas using a ReadWriteOnce PVC when forceToUseStatefulset is true.

For a complete overview of all changes, check out the [release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.22.5) on GitHub.

{/* truncate */}

## Getting Started with n8n 1.22.5 chart

Are you ready to deploy n8n 1.22.5? Our comprehensive [installation guides](https://community-charts.github.io/docs/category/n8n) walk you through the steps to get started, including:

- Quick installation using default configurations.
- Customizing settings tailored to your environment.
- Best practices for successful production deployments.

Visit the [n8n documentation](https://community-charts.github.io/docs/category/n8n) to explore all available options and deploy n8n today.

## Why Choose the n8n Helm Chart?

The n8n Helm chart, maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is crafted to make deploying n8n on Kubernetes both seamless and reliable. Here are some key benefits:

- **Ease of Use**: Streamlined installation and configuration process.
- **Community-Driven**: Continuous updates and improvements fueled by our contributors.
- **Flexibility**: Configurable options catering to a wide range of use cases.
- **Reliability**: Tested for consistent performance in Kubernetes environments.

## Get Involved

GitHub Community Charts thrives on community involvement, and we’re eager for your contributions! Whether it’s fixing bugs, enhancing documentation, or proposing new features, here’s how you can jump in:

- **Explore the Chart**: Delve into the [n8n documentation](https://community-charts.github.io/docs/category/n8n) for detailed configuration insights.
- **Contribute**: We welcome your pull requests on our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: If you’ve encountered a bug, [let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Share your suggestions via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for your support of n8n and GitHub Community Charts. Together, let's continue to simplify Kubernetes deployments!