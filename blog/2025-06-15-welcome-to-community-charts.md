---
slug: welcome-to-community-charts
title: Welcome to GitHub Community Charts - Empowering Kubernetes with Community-Driven Helm Charts
authors: burakince
tags: [helm, kubernetes, mlflow, open-source, community]
description: Introducing GitHub Community Charts, a project dedicated to providing Helm charts for open-source tools like MLflow, n8n, and Actual Budget, with a focus on community collaboration.
---

# Welcome to GitHub Community Charts: Empowering Kubernetes with Community-Driven Helm Charts

We're thrilled to announce the launch of the **GitHub Community Charts** website, your go-to resource for community-maintained Helm charts designed to simplify deploying open-source projects on Kubernetes. Our mission is to bridge the gap for projects that lack official or actively maintained Helm charts, ensuring you can easily integrate tools like [MLflow](https://mlflow.org), [n8n](https://n8n.io), and [Actual Budget](https://actualbudget.org) into your Kubernetes clusters.

## Why GitHub Community Charts?

Many open-source projects lose official Helm chart support when companies shift priorities or discontinue contributions. That's where we step in. At GitHub Community Charts, we maintain and enhance Helm charts for essential tools, keeping them up-to-date, well-documented, and production-ready. Our community-driven approach ensures these charts remain relevant, reliable, and easy to use.

<!-- truncate -->

### Featured Chart: MLflow

One of our flagship offerings is the [MLflow Helm chart](/docs/category/mlflow), which enables seamless deployment of [MLflow](https://mlflow.org), an open-source platform for managing the machine learning lifecycle. Whether you're tracking experiments, managing models, or deploying ML pipelines, our chart supports:

- **Multiple Backends**: PostgreSQL, MySQL, or SQLite for flexible storage.
- **Cloud Integration**: AWS S3, Azure Blob Storage, and Google Cloud Storage for artifacts.
- **Authentication**: Basic auth, LDAP, or centralized PostgreSQL for secure access.
- **Autoscaling**: Horizontal Pod Autoscaling (HPA) for production workloads.

Check out our [MLflow documentation](/docs/category/mlflow) for step-by-step guides on [basic installation](/docs/charts/mlflow/basic-installation), [PostgreSQL setup](/docs/charts/mlflow/postgresql-backend-installation), [AWS S3 integration](/docs/charts/mlflow/aws-s3-integration), and more.

## Our Current Chart Lineup

We currently support the following Helm charts, each crafted to meet the needs of diverse use cases:

- **MLflow**: Manage your machine learning workflows with ease.
- **n8n**: Automate tasks and integrate apps with a no-code/low-code platform.
- **Actual Budget**: Track personal finances securely in a self-hosted environment.
- **Cloudflared**: Securely connect to your Kubernetes services with Cloudflare tunnels.
- **Drone**: Set up continuous integration and deployment pipelines.
- **Outline**: Collaborate on knowledge bases with a modern wiki solution.
- **Pypiserver**: Host your own Python package repository.

Explore all our charts in the [Charts section](/docs/category/charts) and let us know which projects you'd like us to support next!

## Get Involved

GitHub Community Charts is built by the community, for the community. We welcome contributions, whether you're fixing bugs, improving documentation, or proposing new charts. Here's how you can get started:

1. **Browse Our Charts**: Visit our [documentation](/docs/category/charts) to explore installation guides and configuration options.
2. **Contribute**: Check out our [contribution guide](https://github.com/community-charts/helm-charts/blob/main/CONTRIBUTING.md) and submit pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
3. **Suggest a Chart**: Have an open-source project in mind? [Submit a chart request](https://github.com/community-charts/helm-charts/issues/new?template=chart_request.yml).
4. **Report Issues**: Found a bug? [Let us know](https://github.com/community-charts/helm-charts/issues) so we can improve.

## What's Next?

This is just the beginning. We're actively working on enhancing our documentation, adding new charts, and integrating community feedback. Stay tuned for updates on new features, chart releases, and tutorials. Follow our [GitHub repository](https://github.com/community-charts/helm-charts) for the latest news, and join our community (coming soon!) to connect with other Kubernetes enthusiasts.

Thank you for supporting GitHub Community Charts. Let's make deploying open-source tools on Kubernetes easier, together!
