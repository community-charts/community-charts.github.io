---
slug: outline-chart-version-0.7.4-released
title: Outline Chart Version 0.7.4 Released
date: 2026-05-29T20:00
authors: burakince
tags: [outline, helm, kubernetes, open-source]
description: Discover the new features and improvements in outline chart version 0.7.4 Helm chart, featuring app version 1.7.1. Join our community-driven journey!
---

# Outline Chart Version 0.7.4 Released!

We are excited to share the release of the **Outline Helm chart version 0.7.4** on May 29, 2026, featuring **app version 1.7.1**. This latest update introduces an array of new features, enhancements, and community-driven improvements designed to make deploying Outline on Kubernetes even easier.

## What's New in Outline Chart 0.7.4

This release showcases updates to the Helm chart (version 0.7.4) alongside the underlying application (version 1.7.1). Here’s a quick look at the key changes:

- **Changed**: Updated the outlinewiki/outline image version to 1.7.1
    - [Upstream Project](https://hub.docker.com/r/outlinewiki/outline)
- **Fixed**: Resolved entrypoint script issues, now utilizing node instead of yarn (a requirement since v1.2.0)
    - [Upstream Release Notes](https://github.com/outline/outline/releases/tag/v1.2.0)
- **Changed**: Updated the Redis dependency from 23.2.12 to 25.5.3
    - [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/redis)
- **Changed**: Updated the PostgreSQL dependency from 18.1.9 to 18.6.8
    - [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql)

For a comprehensive list of changes, you can refer to the [release notes](https://github.com/community-charts/helm-charts/releases/tag/outline-0.7.4) on GitHub.

<!-- truncate -->

## Getting Started with Outline Chart 0.7.4

Are you ready to deploy Outline 0.7.4? Our [installation guides](https://community-charts.github.io/docs/category/outline) provide easy-to-follow instructions for getting started, including:

- Quick installation using default configurations.
- Customization options to fit your specific environment.
- Best practices for seamless production deployments.

Explore the [Outline documentation](https://community-charts.github.io/docs/category/outline) to discover all your deployment options and bring Outline to life today!

## Why Choose the Outline Helm Chart?

The Outline Helm chart, maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is meticulously designed to facilitate straightforward and reliable deployments of Outline on Kubernetes. Here are just a few reasons to choose it:

- **Ease of Use**: Enjoy simplified installation and configuration.
- **Community-Driven**: Benefit from regular updates and enhancements contributed by our passionate community.
- **Flexibility**: Access a range of configurable options tailored to diverse use cases.
- **Reliability**: Count on stability tested in various Kubernetes environments.

## Get Involved

GitHub Community Charts thrives on contributions from enthusiastic individuals like you! Whether you want to fix bugs, enhance documentation, or propose exciting new features, we invite you to get involved:

- **Explore the Chart**: Visit the [Outline documentation](https://community-charts.github.io/docs/category/outline) for detailed configuration information.
- **Contribute**: Submit pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: If you encounter a bug, don’t hesitate to [let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: We encourage suggestions for improvements via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for being a part of the Outline and GitHub Community Charts journey. Together, we can make Kubernetes deployments a breeze!