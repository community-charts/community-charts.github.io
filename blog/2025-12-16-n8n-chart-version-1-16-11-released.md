---
slug: n8n-chart-version-1.16.11-released
title: n8n chart version 1.16.11 released
date: 2025-12-16T02:59
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Announcing the release of the n8n Helm chart version 1.16.11 with app version 2.0.2, featuring improvements to Redis and PostgreSQL dependencies.
---

# n8n chart version 1.16.11 released!

We’re excited to share that the latest version of the n8n Helm chart—**v1.16.11**, featuring **application version 2.0.2**—is now available! Released on 2025-12-16, this update delivers valuable enhancements for deploying n8n on Kubernetes with smoother workflows and better flexibility.

<!-- truncate -->

## Highlights of Helm Chart v1.16.11

This release brings key updates to both the Helm chart and the n8n application itself. Here’s what’s new in version 1.16.11:

- 🔄 **Updated**: Upgraded the n8nio/n8n container image to **v2.0.2**  
  → [See on GitHub](https://github.com/n8n-io/n8n)
  
- 🧱 **Redis**: Bumped Redis Helm dependency from **v24.0.4** to **v24.0.8**  
  → [View Redis Chart](https://artifacthub.io/packages/helm/bitnami/redis) on ArtifactHub

- 🗄️ **PostgreSQL**: Updated PostgreSQL Helm dependency from **v18.1.13** to **v18.1.14**  
  → [View PostgreSQL Chart](https://artifacthub.io/packages/helm/bitnami/postgresql) on ArtifactHub

Want the full list of updates? Check out the [release notes on GitHub](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.16.11).

## How to Get Started

Getting up and running with the new release is easy! Our detailed [n8n installation guides](https://community-charts.github.io/docs/category/n8n) walk you through:

- Installing with default settings using Helm.
- Customizing configurations to suit your environment.
- Optimizing for production-ready setups.

Deploy confidently with helpful documentation and best practices from the community.

## Why Use the n8n Helm Chart?

Maintained by the open-source contributors at [GitHub Community Charts](https://github.com/community-charts/helm-charts), this Helm chart streamlines n8n deployments on Kubernetes. Benefits include:

- ✅ **Easy Setup**: Start automating workflows in minutes.
- 🚀 **Community-Driven**: Developed and improved by experts and users.
- ⚙️ **Customizable**: Fine-tune parameters to match your architecture.
- 🔒 **Stable**: Regularly tested across modern Kubernetes environments.

Whether you're creating automations for personal productivity or handling enterprise workflows, this chart gives you the reliability and flexibility you need.

## Join the Community

We're always looking for passionate contributors to help grow the project. Get involved and make an impact:

- 📚 Dive into the [n8n docs](https://community-charts.github.io/docs/category/n8n) to learn more.
- 🔧 Submit improvements or fixes through [pull requests](https://github.com/community-charts/helm-charts).
- 🐛 Report issues or bugs via the [issue tracker](https://github.com/community-charts/helm-charts/issues).
- 💡 Suggest features to shape future development.

Thanks for being part of the n8n and Kubernetes community. Together, we’re building powerful, accessible automation at scale.