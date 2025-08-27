---
slug: n8n-chart-version-1.15.2-released
title: n8n Helm chart 1.15.2 now available
date: 2025-08-27T16:11
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Discover what's new in n8n Helm chart 1.15.2 featuring app version 1.108.2, including updated dependencies and community-backed improvements.
---

# n8n Helm chart 1.15.2 now available

We’re excited to announce the release of the latest version of the n8n Helm chart! Version **1.15.2** is now live as of August 27, 2025, and includes **app version 1.108.2**. This update introduces several enhancements, dependency upgrades, and ongoing community contributions to make Kubernetes deployments even smoother.

## What’s new in version 1.15.2

Here’s a breakdown of the key changes included in this release:

- ✅ Updated the base container image to `n8nio/n8n` version **1.108.2**  
  → [View upstream project](https://github.com/n8n-io/n8n)

- 🔧 Bumped Redis dependency from `22.0.4` to `22.0.6`  
  → [Redis chart on ArtifactHub](https://artifacthub.io/packages/helm/bitnami/redis)

- 🔧 Upgraded PostgreSQL dependency from `16.7.26` to `16.7.27`  
  → [PostgreSQL chart on ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql)

For a full list of updates, check out the [official release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.15.2) on GitHub.

<!-- truncate -->

## How to get started

Ready to upgrade or install n8n with Helm? Our comprehensive [installation guides](https://community-charts.github.io/docs/category/n8n) walk you through every step, including:

- Quick-start instructions for first-time users  
- Customization options to fit your specific environment  
- Best practices for reliable production deployments

Whether you're deploying on AWS, Azure, or any other Kubernetes provider, our Helm chart makes it simple.

## Why use the n8n Helm chart?

Maintained by the open-source [GitHub Community Charts](https://github.com/community-charts/helm-charts), the n8n chart provides a reliable and flexible way to run n8n in Kubernetes. Here’s what you get:

- 🛠 Easy setup and configuration  
- 🌱 Active community with frequent updates  
- 🔌 Highly configurable to suit any use case  
- 🔒 Production-ready with proven stability

## Join the community

We believe that great software is built together. If you’d like to contribute to the n8n Helm chart or help grow the community, here’s how you can get involved:

- 👀 Browse the [n8n chart documentation](https://community-charts.github.io/docs/category/n8n)  
- 💬 Join the discussion and contribute via [GitHub](https://github.com/community-charts/helm-charts)  
- 🐛 Report bugs or request features through our [issue tracker](https://github.com/community-charts/helm-charts/issues/new)

Thank you to all contributors helping improve the n8n Helm chart. Let’s keep building better Kubernetes experiences—together.