---
slug: n8n-chart-version-1.14.0-released
title: n8n chart version 1.14.0 released
date: 2025-08-11T00:20
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Announcing n8n Helm chart version 1.14.0 with app version 1.105.4, featuring improved persistence handling and community enhancements.
---

# n8n chart version 1.14.0 released!

We’re excited to share that the latest version of the n8n Helm chart—**v1.14.0**—is now available as of 2025-08-11, featuring **app version 1.105.4**. This release delivers valuable enhancements and community-driven fixes to streamline your n8n deployments on Kubernetes.

{/* truncate */}

## What’s New in Chart v1.14.0

This update includes important refinements to the chart and application, with a primary focus on improved persistence management:

- ✅ **Persistence Fix**: Resolved an issue preventing Persistent Volume Claims (PVCs) from being created when using multiple main node replicas with ReadWriteMany-enabled storage.
  - [View GitHub Issue](https://github.com/community-charts/helm-charts/issues/203)

Explore the full changelog by visiting the official [release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.14.0) on GitHub.

## Set Up with Helm in Minutes

Getting started with the n8n Helm chart is quick and easy. Our comprehensive [installation documentation](https://community-charts.github.io/docs/category/n8n) walks you through:

- Fast setup using default values.
- Advanced configuration for team-specific needs.
- Tips for scaling and securing production environments.

Whether you’re experimenting or launching at scale, we’ve got the tooling and flexibility to support your Kubernetes journey.

## Why Use the n8n Helm Chart?

Maintained by the community via [GitHub Community Charts](https://github.com/community-charts/helm-charts), this Helm chart is built to simplify and strengthen your n8n experience in Kubernetes:

- 🔧 **Easy to Customize**: Tailor settings without hassle.
- 🤝 **Built by the Community**: Constantly improved by open-source contributors.
- 🔄 **Flexible Deployments**: Handles a variety of use cases and environments.
- ✅ **Production-Ready**: Battle-tested for stability and reliability.

## Join the Community

We invite you to be part of this open-source journey. Whether you're a DevOps pro or just getting started, your contributions help shape better Kubernetes tooling for everyone:

- 🔍 [Explore the Documentation](https://community-charts.github.io/docs/category/n8n)
- 🤓 [Contribute on GitHub](https://github.com/community-charts/helm-charts)
- 🐛 [Report an Issue](https://github.com/community-charts/helm-charts/issues)
- 💡 [Request a Feature](https://github.com/community-charts/helm-charts/issues/new)

Thanks for being part of the Helm and Kubernetes community. Let’s keep building and collaborating to make deployment smoother for all!