---
slug: n8n-chart-version-1.13.0-released
title: n8n chart 1.13.0 update is here
date: 2025-07-06T15:27
authors: burakince
tags: [n8n, helm, kubernetes, open-source]
description: Discover what's new in n8n Helm chart version 1.13.0, with community improvements and Kubernetes deployment enhancements.
---

# n8n chart 1.13.0 update is here

We’re excited to announce the release of the latest version of the n8n Helm chart — **version 1.13.0**, published on July 6, 2025! While the app version is currently undefined, this update introduces several valuable improvements that enhance the experience of deploying n8n on Kubernetes.

## What’s new in version 1.13.0

The Helm chart (v1.13.0) includes multiple additions, fixes, and enhancements based on community feedback. Here's a quick overview of the highlights:

- ✅ **Fixed:** Resolved an issue with MCP connections handling multiple webhooks  
  → [View GitHub Issue](https://github.com/community-charts/helm-charts/issues/165)

- 🆕 **Added:** New field for defining service labels

- 🆕 **Added:** Option to enable or disable MCP Webhooks

- 🔁 **Changed:** Main pod labels now use main.name and main.fullname for better consistency

- 🆕 **Added:** Configurable runtimeClassName for main, worker, and webhook pods

Find the complete list and technical details in our official [release notes](https://github.com/community-charts/helm-charts/releases/tag/n8n-1.13.0).

<!-- truncate -->

## Quick start with Helm chart 1.13.0

Thinking of updating or deploying n8n with the latest chart? Our comprehensive [documentation](https://community-charts.github.io/docs/category/n8n) offers everything you need to get going:

- One-command installation with default values
- Simple steps for custom configuration
- Guidelines for production-grade deployments in Kubernetes environments

Whether you're running on Minikube, EKS, or another cloud provider, our guides have you covered.

## Why use the n8n Helm chart?

Our open-source Helm chart is built to streamline DevOps workflows and CI/CD pipelines for the n8n automation platform in Kubernetes. It offers:

- 🚀 Easy setup and upgrades
- 🤝 Actively maintained by a supportive open-source community
- ⚙️ Fully customizable to suit complex environments
- 🛡️ Robust and production-ready templates

Hosted and maintained by [GitHub Community Charts](https://github.com/community-charts/helm-charts), our goal is to help developers and teams deploy automated workflows with confidence.

## Join the community

We’d love for you to be part of the journey! There are many ways you can contribute and connect:

- 📘 Read the [n8n documentation](https://community-charts.github.io/docs/category/n8n) to get familiar with features and options
- 🛠️ Submit a pull request or explore open issues on our [GitHub repo](https://github.com/community-charts/helm-charts)
- 🐞 Report bugs or request new features via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new)

Thanks for being part of the open-source community—let's keep making Kubernetes deployments for automation easier and more powerful!