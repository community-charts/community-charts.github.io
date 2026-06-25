---
slug: n8n-chart-version-1.24.0-released
title: n8n chart version 1.24.0 released
date: 2026-06-25T22:46
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Announcing the release of n8n chart version 1.24.0 Helm chart, featuring app version 2.27.4, with new features and community-driven improvements.
---

# n8n chart version 1.24.0 released!

We are excited to share that the **n8n Helm chart version 1.24.0** has been officially released on 2026-06-25, featuring **app version 2.27.4**. This latest update introduces a range of new features, enhancements, and community-driven improvements, all designed to streamline your deployment of n8n on Kubernetes.

## What's New in n8n 1.24.0 chart

This release includes important updates to the Helm chart (version 1.24.0) and the underlying application (version 2.27.4). Here’s a quick overview of the changes you can expect:

- **Added**: A new option, log.format, allows you to control N8N_LOG_FORMAT (choose between text or json; default is text).
  
- **Fixed**: The log.file.location default has been changed to the absolute path /home/node/.n8n/logs/n8n.log, ensuring that file logging works seamlessly with readOnlyRootFilesystem enabled.
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/521)
- **Fixed**: The emptyDir is now mounted at /home/node/.npm to enable npm to write temporary files and logs when readOnlyRootFilesystem is in use.
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/521)

For a comprehensive list of all changes, feel free to check out the [release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.24.0) on GitHub.

{/* truncate */}

## Getting Started with n8n 1.24.0 chart

Are you ready to deploy n8n 1.24.0? Our [installation guides](https://community-charts.github.io/docs/category/n8n) provide easy-to-follow instructions to help you get started. You'll find:

- Quick installation instructions with default configurations.
- Tips for customizing settings to match your environment.
- Best practices for deploying in production.

Visit the [n8n documentation](https://community-charts.github.io/docs/category/n8n) to discover all the available options and get n8n up and running today.

## Why Choose the n8n Helm Chart?

The n8n Helm chart, maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is designed to facilitate straightforward and reliable deployments of n8n on Kubernetes. Here are some key benefits:

- **Ease of Use**: Installation and configuration made simple.
- **Community-Driven**: Regular updates and enhancements contributed by our community.
- **Flexibility**: Configurable options tailored for a variety of use cases.
- **Reliability**: Thoroughly tested for stability within Kubernetes environments.

## Get Involved

GitHub Community Charts is a vibrant, community-driven project, and we warmly welcome your contributions! Whether you're interested in fixing bugs, enhancing documentation, or proposing new features, here’s how to get started:

- **Explore the Chart**: Check out the [n8n documentation](https://community-charts.github.io/docs/category/n8n) for detailed configuration options.
- **Contribute**: Feel free to submit pull requests via our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: If you encounter any bugs, [let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Share your suggestions through our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for your support of n8n and the GitHub Community Charts. Together, we can continue simplifying Kubernetes deployments!