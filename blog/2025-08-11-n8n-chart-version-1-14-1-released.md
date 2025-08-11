---
slug: n8n-chart-version-1.14.1-released
title: n8n chart version 1.14.1 released
date: 2025-08-11T17:37
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Announcing the release of n8n Helm chart 1.14.1 with app version 1.106.3, featuring enhanced features and improved dependency updates for Kubernetes users.
---

# n8n chart version 1.14.1 released!

We’re excited to share that the n8n Helm chart has been updated to version **1.14.1**, featuring **app version 1.106.3**, as of 2025-08-11. This release introduces enhanced capabilities, fresh dependency upgrades, and continued support from the open-source community—all helping you streamline n8n deployments on Kubernetes.

## What’s new in version 1.14.1

This release includes updates to both the chart and underlying application. Here’s what’s changed:

- ✅ **Updated** image to `n8nio/n8n:1.106.3`  
  → Check out the [n8n source code](https://github.com/n8n-io/n8n)

- ✅ **Upgraded** Redis dependency from `21.2.14` to `22.0.1`  
  → View details on [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/redis)

- ✅ **Updated** PostgreSQL dependency from `16.7.21` to `16.7.24`  
  → Explore the chart on [ArtifactHub](https://artifacthub.io/packages/helm/bitnami/postgresql)

Get the full breakdown in the official [release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.14.1).

<!-- truncate -->

## Getting started with Helm chart 1.14.1

Ready to upgrade or deploy n8n for the first time? Our comprehensive [installation guides](https://community-charts.github.io/docs/category/n8n) walk you through:

- Quick start deployments with sensible defaults  
- Customizing configurations to fit your workflow  
- Production-ready setup and scaling tips

Whether you're launching n8n on a dev cluster or in a high-availability setup, this release has you covered.

## Why use the n8n Helm chart?

Maintained by the open-source [GitHub Community Charts](https://github.com/community-charts/helm-charts) team, the n8n Helm chart delivers a robust and flexible way to run your automation workflows on Kubernetes. Here’s why developers and teams trust it:

- 🧭 Simple, fast installation  
- 💬 Backed by an active open-source community  
- 🛠️ Designed for customization and extensibility  
- 🔒 Built with stability and reliability in mind

Harness the power of DevOps best practices to boost your workflow automation through a production-ready Kubernetes deployment.

## Join the Community

n8n continues to grow thanks to dedicated supporters like you. Want to get involved? Here’s how to contribute:

- 📘 Review the [n8n configuration docs](https://community-charts.github.io/docs/category/n8n)  
- 🔧 Submit your improvements via [GitHub pull requests](https://github.com/community-charts/helm-charts)  
- 🐛 Report bugs and issues through our [issue tracker](https://github.com/community-charts/helm-charts/issues)  
- 💡 Suggest new features you’d love to see implemented

Thanks for being a part of the journey. Together, we’re making open-source Kubernetes deployments easier and more powerful than ever!