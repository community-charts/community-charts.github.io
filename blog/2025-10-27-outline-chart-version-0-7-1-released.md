---
slug: outline-chart-version-0.7.1-released
title: Outline chart update 0.7.1 with app version 1.0.0
date: 2025-10-27T02:58
authors: burakince
tags: [outline, helm, kubernetes, open-source]
description: Outline Helm chart 0.7.1 is now available with app version 1.0.0, featuring improved dependencies and community enhancements.
---

# Outline chart version 0.7.1 released

We’re excited to announce the release of the **Outline Helm chart version 0.7.1**, officially available as of October 27, 2025. This latest version includes **app version 1.0.0**, delivering key updates, improved stability, and valuable contributions from our open-source community.

Whether you're running Outline in production or exploring it for the first time, this release brings smoother deployment and better integration with your Kubernetes environment.

## What’s new in version 0.7.1

This update improves both the Helm chart and important dependencies, aligning with the latest enhancements from upstream projects:

- ✅ Upgraded Outline Docker image to **v1.0.0**  
  ↳ [View upstream image](https://hub.docker.com/r/outlinewiki/outline)
- 🔄 Updated Redis dependency from 22.0.7 to **23.2.1**  
  ↳ [Redis Helm chart on ArtifactHub](https://artifacthub.io/packages/helm/bitnami/redis)
- 🔄 Updated PostgreSQL dependency from 16.7.27 to **18.1.1**  
  ↳ [PostgreSQL Helm chart on ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql)

See the full changelog in the [release notes on GitHub](https://github.com/community-charts/helm-charts/releases/tag/outline-0.7.1).

{/* truncate */}

## Getting started with Outline 0.7.1

Ready to deploy? Our comprehensive [documentation](https://community-charts.github.io/docs/category/outline) makes getting started easy:

- Install with default settings using a single Helm command
- Customize configurations to suit your environment
- Follow tips and best practices for production-ready deployments

Visit the [Outline installation guides](https://community-charts.github.io/docs/category/outline) to begin.

## Why use the Outline Helm chart?

Maintained by the GitHub Community Charts team, the Outline Helm chart offers everything you need for a reliable Kubernetes deployment:

- 🔧 Simple and fast installation process
- 🧩 Highly configurable for different environments
- 📦 Regular updates powered by community contributions
- ✅ Tested compatibility with current Kubernetes best practices

Whether you're running a small team wiki or a large knowledge base, this chart scales with your needs.

## Join our growing community

The GitHub Community Charts project values your support and contributions. Here’s how you can get involved:

- 📚 Explore the [Outline chart documentation](https://community-charts.github.io/docs/category/outline)
- 💡 Send pull requests to our [GitHub repo](https://github.com/community-charts/helm-charts)
- 🐞 Report bugs or issues via the [issue tracker](https://github.com/community-charts/helm-charts/issues)
- ✨ Suggest feature ideas and let us know what you’d love to see next

Thanks for being a part of the open-source community making Outline even better on Kubernetes. Let’s keep building together!