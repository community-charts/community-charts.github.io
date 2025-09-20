---
slug: cloudflared-chart-version-2.2.0-released
title: cloudflared chart version 2.2.0 released
date: 2025-09-20T11:50
authors: burakince
tags: [cloudflared, helm, kubernetes, open-source]
description: Discover what's new in cloudflared Helm chart version 2.2.0 with app version 2025.9.0, including security updates and streamlined Kubernetes deployment.
---

# cloudflared chart version 2.2.0 released!

We're excited to announce the latest release of the **cloudflared Helm chart version 2.2.0**, featuring **application version 2025.9.0**, officially available as of 2025-09-20. This update brings important enhancements and community-driven improvements to help you deploy cloudflared more effectively on Kubernetes.

## What’s New in cloudflared 2.2.0

This release includes several meaningful changes in both the Helm chart (v2.2.0) and the application (v2025.9.0):

- ➖ **Security Enhanced**: The NET_RAW capability has been removed from the default security context, helping to reduce unnecessary permissions.
- 🔧 **Configuration Improvement**: The TUNNEL_ORIGIN_CERT environment variable is now consistently set with the correct certificate file path.

These updates improve security and reliability while simplifying configuration.

Read the full list of changes in the official [release notes](https://github.com/community-charts/helm-charts/releases/tag/cloudflared-2.2.0).

<!-- truncate -->

## Get Started with cloudflared 2.2.0

Eager to upgrade or deploy for the first time? Our comprehensive [installation guides](https://community-charts.github.io/docs/category/cloudflared) walk you through every step, including:

- Quick start using default setup.
- Customizing values to match your environment.
- Production-ready deployment recommendations.

Visit the [cloudflared documentation](https://community-charts.github.io/docs/category/cloudflared) to get up and running quickly.

## Why Use the cloudflared Helm Chart?

Maintained by the [GitHub Community Charts](https://github.com/community-charts/helm-charts) team, the cloudflared chart provides an easy, flexible, and secure way to deploy cloudflared in Kubernetes environments. Benefits include:

- 🧩 **Simple Setup**: Deploy with minimal effort using Helm.
- 🤝 **Community-Powered**: Always improving with help from contributors around the world.
- 🎛️ **Highly Configurable**: Tailor it to suit your Kubernetes setup.
- 🔄 **Robust and Tested**: Built for stability in production-grade clusters.

## Get Involved and Contribute

cloudflared is an open-source project, and your input matters. Join our growing community in shaping the evolution of the Helm chart. Here's how you can participate:

- 📘 Explore the [documentation](https://community-charts.github.io/docs/category/cloudflared) to understand all configuration options.
- 🛠️ Contribute via pull requests on our [GitHub repo](https://github.com/community-charts/helm-charts).
- 🐞 Report issues or bugs [right here](https://github.com/community-charts/helm-charts/issues).
- 💡 Suggest new features or improvements through our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for being part of the growing cloudflared and Kubernetes community. Together, we're making open-source deployment more powerful and accessible!