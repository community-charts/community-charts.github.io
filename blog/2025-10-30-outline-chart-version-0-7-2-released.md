---
slug: outline-chart-version-0.7.2-released
title: Outline chart 0.7.2 includes app version 1.0.1 with Redis and Postgres updates
date: 2025-10-30T02:57
authors: burakince
tags: [outline, helm, kubernetes, open-source, redis, postgres]
description: Discover what's new in Outline Helm chart 0.7.2 with app version 1.0.1, now featuring updated Redis and PostgreSQL dependencies for improved Kubernetes readiness.
---

# Outline chart 0.7.2 includes app version 1.0.1 with Redis and Postgres updates

We’re excited to introduce the release of the **Outline Helm chart version 0.7.2**, published on October 30, 2025. This release includes support for **Outline application version 1.0.1** and brings important updates to chart dependencies—making it easier than ever to run and scale Outline on Kubernetes.

<!-- truncate -->

## What's new in Outline 0.7.2

This version provides a series of enhancements and community-led improvements that update the chart for performance, reliability, and compatibility:

- 🔄 **Application update**: Upgrades the container image to `outlinewiki/outline:1.0.1`  
  [View on Docker Hub](https://hub.docker.com/r/outlinewiki/outline)

- 🛠 **Redis update**: Bumps Helm chart dependency from version 23.2.1 to 23.2.2  
  [View Redis Chart](https://artifacthub.io/packages/helm/bitnami/redis)

- 🗄 **PostgreSQL update**: Upgrades postgresql chart from version 18.1.1 to 18.1.3  
  [View PostgreSQL Chart](https://artifacthub.io/packages/helm/bitnami/postgresql)

For the full list of changes, check out the official [GitHub release notes](https://github.com/community-charts/helm-charts/releases/tag/outline-0.7.2).

## How to install Outline 0.7.2

Getting started with the latest Outline chart is simple. Head over to our [installation documentation](https://community-charts.github.io/docs/category/outline) for setup instructions and configuration examples tailored to your needs:

- Quick install steps using default values  
- Advanced customization for production use  
- Deployment best practices for Kubernetes environments

Everything you need to get running is in our [Outline Helm docs](https://community-charts.github.io/docs/category/outline).

## Why deploy Outline using the Helm chart?

The Outline Helm chart, maintained by the [GitHub Community Charts](https://github.com/community-charts/helm-charts) project, is a reliable and flexible way to manage your installation in Kubernetes. Here’s why the community loves it:

- ✅ **Easy to deploy**: Minimize manual setup with templated configurations  
- 🔁 **Community-supported**: Active development with feedback from real users  
- 🧩 **Highly configurable**: Designed for use cases both simple and complex  
- 🔐 **Built for Kubernetes**: Optimized for scalable, cloud-native environments

## Join the community

We believe in open-source and welcome your involvement! Whether you're here to deploy Outline, improve the chart, or join in discussions, there are plenty of ways to get started:

- Read the [Outline Helm chart docs](https://community-charts.github.io/docs/category/outline)  
- Contribute via pull requests on [GitHub](https://github.com/community-charts/helm-charts)  
- Report bugs or share ideas through the [GitHub issue tracker](https://github.com/community-charts/helm-charts/issues)

Thank you for being part of the Outline and Helm chart community. Together, we’re building a better Kubernetes experience—one release at a time.