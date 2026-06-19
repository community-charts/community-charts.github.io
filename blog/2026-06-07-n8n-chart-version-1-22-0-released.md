---
slug: n8n-chart-version-1.22.0-released
title: n8n chart version 1.22.0 released
date: 2026-06-07T22:42
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Discover the features of n8n chart version 1.22.0 Helm chart, featuring app version 2.23.4, along with community enhancements and improvements.
---

# n8n chart version 1.22.0 released!

We are excited to share the launch of the **n8n Helm chart version 1.22.0** as of June 7, 2026, featuring **app version 2.23.4**. This update introduces a variety of new features, enhancements, and community-driven improvements designed to streamline your experience deploying n8n on Kubernetes.

## What's New in n8n 1.22.0 chart

This release encompasses updates to the Helm chart (version 1.22.0) and its core application (version 2.23.4). Here’s a snapshot of the key changes made:

- **Fixed**: Removed deprecated N8N_RUNNERS_ENABLED environment variable (safe since n8n 1.69+)
    - [Issue #412](https://github.com/community-charts/helm-charts/issues/412)
    - [Issue #436](https://github.com/community-charts/helm-charts/issues/436)
    - [Issue #474](https://github.com/community-charts/helm-charts/issues/474)
- **Fixed**: Updated to use n8nio/runners image for the external task runner sidecar instead of n8nio/n8n
    - [Issue #329](https://github.com/community-charts/helm-charts/issues/329)
    - [Issue #434](https://github.com/community-charts/helm-charts/issues/434)
- **Fixed**: Adjusted to skip the external task runner sidecar on the main pod when worker.mode is set to queue
    - [Issue #414](https://github.com/community-charts/helm-charts/issues/414)
- **Fixed**: Renamed runner sidecar port from http to runner-health to eliminate duplicate port name warnings
- **Fixed**: Moved N8N_RUNNERS_STDLIB_ALLOW and N8N_RUNNERS_EXTERNAL_ALLOW to the task-broker configmap, ensuring n8n enforces the correct Python security policy
- **Added**: Enabled Python runner support via nodes.python.enabled flag (requires n8n 1.111.0+ and taskRunners.mode=external)
- **Added**: Introduced nodes.python.external.packages to install Python packages via uv before the runner starts; N8N_RUNNERS_EXTERNAL_ALLOW is derived automatically from the package list
- **Added**: Included optional PVC persistence for Python installed packages via nodes.python.persistence; ReadWriteMany is required for HPA or multi-node deployments
- **Added**: Integrated pypiRegistry support for installing Python packages from a private PyPI index (URL-only via UV_DEFAULT_INDEX or uv.toml config file via UV_CONFIG_FILE; mirrors npmRegistry pattern)

For further details, check out the complete [release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.22.0) on GitHub.

{/* truncate */}

## Getting Started with n8n 1.22.0 chart

Eager to deploy n8n 1.22.0? Our comprehensive [installation guides](https://community-charts.github.io/docs/category/n8n) provide step-by-step instructions, including:

- Quick installation with default settings.
- Customization options tailored to your environment.
- Best practices for ensuring successful production deployments.

Dive into the [n8n documentation](https://community-charts.github.io/docs/category/n8n) to discover all available options and get n8n up and running today.

## Why Choose the n8n Helm Chart?

The n8n Helm chart, managed by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is crafted to simplify deploying n8n on Kubernetes reliably and efficiently. Here are the key advantages:

- **Ease of Use**: Streamlined installation and configuration process.
- **Community-Driven**: Regular updates and enhancements contributed by the community.
- **Flexibility**: Configurable options designed to cater to a variety of use cases.
- **Reliability**: Thoroughly tested for stability within Kubernetes environments.

## Get Involved

GitHub Community Charts thrives on community contributions, and we wholeheartedly welcome your involvement! Whether you’re fixing bugs, enhancing documentation, or proposing new features, here’s how you can contribute:

- **Explore the Chart**: Visit the [n8n documentation](https://community-charts.github.io/docs/category/n8n) for configuration insights.
- **Contribute**: Submit pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: Encounter a bug? [Let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Share your ideas for improvements via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for your support of n8n and GitHub Community Charts. Together, let’s continue to make Kubernetes deployments easier and more efficient!