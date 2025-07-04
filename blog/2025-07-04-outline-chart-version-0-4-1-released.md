---
slug: outline-chart-version-0.4.1-released
title: outline chart version 0.4.1 released
date: 2025-07-04T02:57
authors: burakince
tags: [outline, helm, kubernetes, open-source]
description: Discover what's new in outline Helm chart 0.4.1 with updated dependencies, community enhancements, and streamlined Kubernetes deployments.
---

# Outline Chart Version 0.4.1 Released!

We’re excited to announce the release of the **Outline Helm Chart version 0.4.1**, available as of July 4, 2025. This update delivers important improvements and refreshed dependencies to make deploying Outline on your Kubernetes clusters smoother and more efficient.

<!-- truncate -->

## What’s New in 0.4.1

Release 0.4.1 includes updates to both the Helm chart and application stack, continuing our effort to provide a seamless and up-to-date deployment experience. Here’s what’s been updated:

- ✅ **Updated Image**: Bumped to `outlinewiki/outline:0.85.0`  
  → [View on Docker Hub](https://hub.docker.com/r/outlinewiki/outline)

- 🔄 **Redis Upgrade**: Now uses Redis chart `21.2.6` (previously `21.0.2`)  
  → [Available on ArtifactHub](https://artifacthub.io/packages/helm/bitnami/redis)

- 📦 **PostgreSQL Upgrade**: Upgraded PostgreSQL chart to `16.7.15` (from `16.7.2`)  
  → [Available on ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql)

📝 For the full list of enhancements and changes, check out the official [release notes on GitHub](https://github.com/community-charts/helm-charts/releases/tag/outline-0.4.1).

## Getting Started with Outline 0.4.1

Want to get up and running quickly? We’ve made it easy to deploy Outline in your Kubernetes environment with our comprehensive [installation guides](https://community-charts.github.io/docs/category/outline):

- 🚀 Straightforward setup using default values  
- ⚙️ Custom configurations tailored to your workload  
- 🛡️ Best practices for production-ready deployments

Visit the full [Outline documentation](https://community-charts.github.io/docs/category/outline) to start deploying today.

## Why Use the Outline Helm Chart?

Maintained by the [GitHub Community Charts](https://github.com/community-charts/helm-charts) team, the Outline Helm chart makes your deployments more efficient, reliable, and customizable. Here’s what makes it stand out:

- 👏 **User-Friendly**: Easy setup and configuration with minimal effort  
- 🌍 **Community-Powered**: Regular updates and feedback from real users  
- 🔧 **Flexible**: Supports a broad range of Kubernetes environments  
- ✅ **Stable**: Robust and tested across CI/CD workflows

Whether you're a developer, platform engineer, or part of a devops team, this chart provides the tools you need to scale knowledge sharing with Outline.

## Join the Community

We’re building this chart together—and your contributions matter! Jump in and help improve the Outline chart:

- 📖 Learn how to configure via the [Outline docs](https://community-charts.github.io/docs/category/outline)  
- 🔧 Submit PRs on [GitHub](https://github.com/community-charts/helm-charts)  
- 🐞 Report bugs or suggest features via the [issue tracker](https://github.com/community-charts/helm-charts/issues)

Thank you for supporting Outline and open-source Kubernetes tooling. Together, we’re making deployment easier—one chart at a time!