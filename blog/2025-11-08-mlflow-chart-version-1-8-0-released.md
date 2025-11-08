---
slug: mlflow-chart-version-1.8.0-released
title: mlflow chart version 1.8.0 released
date: 2025-11-08T13:48
authors: burakince
tags: [mlflow, helm, kubernetes, open-source]
description: Introducing mlflow Helm chart version 1.8.0 with app version 3.6.0, offering improved init container resource support and community-driven enhancements.
---

# mlflow chart version 1.8.0 released

We’re excited to announce the release of the **mlflow Helm chart version 1.8.0**, available as of 2025-11-08. This release includes the latest **app version 3.6.0** and brings valuable improvements focused on performance, customization, and Kubernetes-native deployments.

## What’s New in mlflow Helm chart 1.8.0

This version of the chart includes important updates designed to offer greater flexibility when running mlflow on Kubernetes. Highlights include:

- ✅ **Resource Configuration for Init Containers**: You can now define compute resources for the `dbchecker` and `ini-file-initializer` init containers.  
  See the discussion on [GitHub Issue #265](https://github.com/community-charts/helm-charts/issues/265)

These changes allow for more efficient use of resources and better alignment with production-grade deployments.

Explore the full changelog in the [official release notes](https://github.com/community-charts/helm-charts/releases/tag/mlflow-1.8.0).

<!-- truncate -->

## Get Started with mlflow 1.8.0

Deploying mlflow on Kubernetes has never been easier. Our step-by-step [installation guides](https://community-charts.github.io/docs/category/mlflow) walk you through everything you need to get up and running. Learn how to:

- Perform a basic install with default values
- Customize the chart to fit your specific use case
- Apply best practices for robust, production-ready deployments

Check out the full [mlflow documentation](https://community-charts.github.io/docs/category/mlflow) to get started.

## Why Use the mlflow Helm Chart?

The mlflow Helm chart is built and maintained by the open-source [GitHub Community Charts](https://github.com/community-charts/helm-charts) project with the goal of making mlflow easy, scalable, and reliable to run in Kubernetes.

Key benefits include:

- 🚀 **Simple Deployment**: Install mlflow with a single command
- 🤝 **Community-Driven**: Developed and improved by contributors from around the world
- 🔧 **Highly Configurable**: Easily adapt to any environment, from dev to production
- 🛠 **Proven Stability**: Built for modern Kubernetes workflows

## Join the Community

mlflow Helm is part of a vibrant open-source community. Whether you're a developer, DevOps engineer, or enthusiast, there are many ways to contribute:

- Browse configuration options in the [official mlflow docs](https://community-charts.github.io/docs/category/mlflow)
- Help improve the chart by submitting [pull requests](https://github.com/community-charts/helm-charts)
- Report bugs or share ideas in the [issue tracker](https://github.com/community-charts/helm-charts/issues)
- Ask questions and collaborate with others deploying mlflow

Thank you for being part of the journey. Together, we’re making cloud-native mlflow deployments better for everyone!