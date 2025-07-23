---
slug: outline-chart-version-0.4.3-released
title: Outline chart 0.4.3 released with app version 0.85.1
date: 2025-07-23T22:30
authors: burakince
tags: [outline, helm, kubernetes, open-source]
description: Outline Helm chart 0.4.3 is now available, featuring app version 0.85.1 with PostgreSQL fixes and better S3 config—built with community input.
---

# Outline chart 0.4.3 released with app version 0.85.1

We’re excited to announce the release of the latest version of the Outline Helm chart—**version 0.4.3**, paired with **application version 0.85.1**—shipped on July 23, 2025. This update brings key improvements and important fixes, making it even easier to deploy and manage Outline on Kubernetes.

## Highlights in Helm chart v0.4.3

Here’s what’s new in this release of the chart and application:

- 🛠️ **Fixed**: Support for non-default PostgreSQL ports when connecting to external databases.
  - Source: [Outline Docker Image](https://hub.docker.com/r/outlinewiki/outline)
- 📚 **Improved**: Documentation now correctly references `fileStorage.s3.bucketUrl` instead of the outdated `fileStorage.s3.baseUrl`.

These changes were driven by feedback and contributions from the open-source community. Explore the full changelog on our [GitHub release page](https://github.com/community-charts/helm-charts/releases/tag/outline-0.4.3).

<!-- truncate -->

## How to get started with Outline 0.4.3

Getting up and running is easy. Whether you're just testing or going into production, our [installation documentation](https://community-charts.github.io/docs/category/outline) covers everything:

- 🔧 Quickstart guides for fast setups.
- ⚙️ Advanced configuration options.
- 🛡️ Best practices for secure and reliable production deployments.

Visit the [Outline Helm chart docs](https://community-charts.github.io/docs/category/outline) to explore all deployment options.

## Why choose Outline on Kubernetes via Helm?

The Outline chart, maintained by the [GitHub Community Charts project](https://github.com/community-charts/helm-charts), is purpose-built to help teams deploy Outline easily and securely in Kubernetes environments:

- 🚀 **Easy Installation**: Helm simplifies the deployment process.
- 🤝 **Community-Powered**: Benefit from regular updates and support.
- 🔄 **Flexible Configuration**: Tailor deployments to your needs.
- ✅ **Reliable Operations**: Built and tested for Kubernetes environments.

## Join the community

The GitHub Community Charts project thrives on open-source collaboration. Want to get involved and make contributions?

- 📘 Dive into the [Outline docs](https://community-charts.github.io/docs/category/outline) for config options and examples.
- 🛠 Submit pull requests to improve the [Helm repo on GitHub](https://github.com/community-charts/helm-charts).
- 🐛 Found a bug? [Report issues](https://github.com/community-charts/helm-charts/issues) to help us investigate.
- 💡 Have a feature idea? [Request enhancements](https://github.com/community-charts/helm-charts/issues/new).

Thank you for being part of the journey. Together, we’re making open-source Kubernetes deployments better, faster, and easier!