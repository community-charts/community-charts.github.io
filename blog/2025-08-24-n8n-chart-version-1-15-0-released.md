---
slug: n8n-chart-version-1.15.0-released
title: n8n chart version 1.15.0 released
date: 2025-08-24T20:21
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Announcing the release of n8n chart version 1.15.0 Helm chart featuring app version 1.107.4, with new features and community-powered improvements.
---

# n8n chart version 1.15.0 released!

We’re excited to share that the latest version of the n8n Helm chart—**v1.15.0**—is now available as of August 24, 2025. This release includes **app version 1.107.4**, bringing new features, enhancements, and community-suggested improvements to streamline your n8n deployment on Kubernetes.

## What’s New in Version 1.15.0

This update enhances both the n8n Helm chart and the application it deploys. Here's a summary of what's included:

- ✅ **Editor URL support improved** – Ensures smoother password reset and signup flows by properly defining the Editor URL  
  [Issue #210](https://github.com/community-charts/helm-charts/issues/210)

- 🔐 **PostgreSQL** – Added support for enabling SSL connections to PostgreSQL databases  
  [Issue #211](https://github.com/community-charts/helm-charts/issues/211)

- 🔒 **Redis** – Now supports secure Redis connections via TLS  
  [Issue #214](https://github.com/community-charts/helm-charts/issues/214)

- 🛠️ **External Redis port fix** – Corrected configuration of external Redis port values  
  [Issue #215](https://github.com/community-charts/helm-charts/issues/215)

For the full list of changes, be sure to check out the [official release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.15.0) on GitHub.

<!-- truncate -->

## Deploy n8n v1.15.0 on Kubernetes

Ready to get started? Our [step-by-step deployment guide](https://community-charts.github.io/docs/category/n8n) will walk you through every step, whether you're a beginner or looking to scale up for production:

- 🧪 Quick installation using defaults  
- ⚙️ Custom configuration options  
- 🚀 Production-ready best practices  

Head to the [n8n Helm chart docs](https://community-charts.github.io/docs/category/n8n) to dive in.

## Why Use the n8n Helm Chart?

Maintained by the [GitHub Community Charts](https://github.com/community-charts/helm-charts) team, the n8n Helm chart delivers a fast and reliable way to deploy your workflows in Kubernetes environments. Here's what makes it special:

- 🧩 **Simple & Configurable** – Designed for flexibility without complexity  
- 🌍 **Built by the Community** – Open-source contributions help drive feature updates  
- 🔄 **Keeps n8n Updated** – Quickly get the latest stable app releases  
- 📦 **Battle-Tested** – Proven to work reliably across Kubernetes setups

## Join the Community

Whether you're a developer, DevOps engineer, or open-source enthusiast, your help makes this project better! There are many ways to contribute:

- 📖 Learn more in the [docs](https://community-charts.github.io/docs/category/n8n)  
- 💡 Submit improvements via pull requests on [GitHub](https://github.com/community-charts/helm-charts)  
- 🐛 Report bugs and help troubleshoot via our [issue tracker](https://github.com/community-charts/helm-charts/issues)  
- 💬 Share feature ideas to shape future releases  

Thanks for being part of the open-source journey—let’s keep building better tools together!