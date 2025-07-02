---
slug: n8n-chart-version-1.11.0-released
title: n8n chart version 1.11.0 released
date: 2025-06-28T14:03
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Discover what's new in the n8n Helm chart version 1.11.0 with app version 1.99.1, featuring improvements and updated deployment configurations.
---

# n8n chart version 1.11.0 released

We’re excited to share the release of **n8n Helm chart version 1.11.0**, available as of **2025-06-28**, featuring the upgraded **app version 1.99.1**. This new version includes key updates and enhancements designed to make deploying n8n on Kubernetes easier and more flexible.

## What’s New in Version 1.11.0

This release introduces updates across the Helm chart and the core n8n application. Highlights include:

- 🛑 **Deprecated**: The root-level affinity field is now deprecated. Please use the affinity field within the `main`, `worker`, and `webhook` blocks instead. This change improves configuration flexibility and consistency.
  - [View Pull Request](https://github.com/community-charts/helm-charts/pull/150)
- ✅ **Added**: New `affinity` fields added to the `main`, `worker`, and `webhook` specification blocks.
  - [View Pull Request](https://github.com/community-charts/helm-charts/pull/150)

For the full list of updates, check out the official [release notes on GitHub](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.11.0).

<!-- truncate -->

## Getting Started with n8n 1.11.0

Ready to deploy? Explore our [installation guides](https://community-charts.github.io/docs/category/n8n) for step-by-step instructions including:

- Quick installs with default configurations
- Customizing deployments for your environment
- Production-ready recommendations

Visit the [n8n documentation](https://community-charts.github.io/docs/category/n8n) to get started today.

## Why Use the n8n Helm Chart?

Maintained by the [GitHub Community Charts](https://github.com/community-charts/helm-charts) project, the n8n Helm chart is a reliable solution for deploying n8n in Kubernetes environments. Benefits include:

- 🚀 **Easy to Deploy**: Simplifies deployment and configuration
- 🤝 **Built by the Community**: Actively maintained and improved
- 🔧 **Highly Configurable**: Adapts to many use cases with flexible settings
- 🛡️ **Proven Stability**: Continuously tested for production environments

## Join Our Community

We welcome feedback, ideas, and contributions! Here's how you can get involved:

- 📘 Learn more from the [n8n documentation](https://community-charts.github.io/docs/category/n8n)
- 🔧 Contribute code or improvements via [pull requests](https://github.com/community-charts/helm-charts)
- 🐞 Report bugs or issues on our [issue tracker](https://github.com/community-charts/helm-charts/issues)
- 💡 Share your feature requests with us [here](https://github.com/community-charts/helm-charts/issues/new)

Thank you for being part of the n8n and GitHub Community Charts ecosystem. Together, we’re shaping the future of open-source workflow automation in Kubernetes!
