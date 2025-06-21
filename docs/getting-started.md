---
id: getting-started
title: Getting Started with GitHub Community Charts
sidebar_label: Getting Started
sidebar_position: 1
description: Learn how to add the GitHub Community Charts Helm repository and start deploying open-source tools like MLflow, n8n, and Actual Budget on Kubernetes.
---

# Getting Started with GitHub Community Charts

Welcome to **GitHub Community Charts**, your source for community-maintained Helm charts that simplify deploying open-source tools on Kubernetes. Our charts support projects like [MLflow](https://mlflow.org), [n8n](https://n8n.io), [Actual Budget](https://actualbudget.org), and more, ensuring reliable and up-to-date deployments for tools that may lack official Helm chart support.

This guide walks you through setting up our Helm repository and exploring our chart offerings, so you can quickly deploy your favorite open-source applications.

## Prerequisites

Before you begin, ensure you have the following:

- A Kubernetes cluster (version >= 1.16.0)
- [Helm 3](https://helm.sh/docs/intro/install/) installed on your local machine
- `kubectl` configured to access your cluster

## Step 1: Add the Community Charts Helm Repository

To use our charts, add the GitHub Community Charts Helm repository to your Helm client:

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
```

- The `helm repo add` command registers our repository under the name `community-charts`.
- The `helm repo update` command ensures you have the latest chart versions.

Verify the repository was added:

```bash
helm repo list
```

You should see `community-charts` with the URL `https://community-charts.github.io/helm-charts`.

## Step 2: Explore Available Charts

Browse our available charts to find the tools you need:

```bash
helm search repo community-charts
```

This lists all charts in our repository, including:

- **MLflow**: Manage machine learning workflows with experiment tracking and model deployment.
- **n8n**: Automate tasks with a no-code/low-code workflow platform.
- **Actual Budget**: Track personal finances in a secure, self-hosted environment.
- **Outline**: Build collaborative knowledge bases with a modern wiki.
- **Cloudflared**: Create secure tunnels to your Kubernetes services using Cloudflare.
- **Drone**: Run continuous integration and deployment pipelines.
- **Pypiserver**: Host your own Python package repository.

For detailed descriptions and installation guides, visit the [Charts documentation](/docs/category/charts).

> **Tip**: To see all available versions of a chart, use `helm search repo community-charts -l`. For example, `helm search repo community-charts/mlflow -l` lists all MLflow chart versions.

## Step 3: Install a Chart

To install a chart, use the `helm install` command. Below is an example for installing the MLflow chart with default settings:

```bash
helm install my-mlflow community-charts/mlflow -n <your-namespace>
```

Replace `my-mlflow` with your preferred release name and `<your-namespace>` with the target namespace (e.g., `default`). If the namespace doesn't exist, create it first:

```bash
kubectl create namespace <your-namespace>
```

For customized installations (e.g., using PostgreSQL or AWS S3), refer to the chart's specific documentation. For MLflow, see [Basic Installation with SQLite](/docs/charts/mlflow/basic-installation), [PostgreSQL Backend Installation](/docs/charts/mlflow/postgresql-backend-installation), and [AWS S3 Integration](/docs/charts/mlflow/aws-s3-integration).

## Step 4: Verify the Installation

Check the status of your deployment:

```bash
kubectl get pods -n <your-namespace>
```

Look for pods associated with your release (e.g., `my-mlflow-XXXXX`) in a `Running` state.

Access the application using the instructions in the chart's documentation. For example, MLflow typically exposes a web UI at port 5000, which you can access via port-forwarding:

```bash
kubectl port-forward svc/my-mlflow -n <your-namespace> 5000:5000
```

Then, open `http://localhost:5000` in your browser.

## Our Chart Offerings

Here's a quick overview of our current charts and their use cases:

| Chart          | Description                                              | Documentation Link                                        |
| -------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| MLflow         | Platform for managing the machine learning lifecycle     | [/docs/charts/mlflow](/docs/category/mlflow)              |
| n8n            | Workflow automation tool for integrating apps            | [/docs/charts/n8n](/docs/category/n8n)                    |
| Actual Budget  | Self-hosted personal finance tracker                     | [/docs/charts/actualbudget](/docs/category/actualbudget)  |
| Outline        | Modern wiki for collaborative knowledge management       | [/docs/charts/outline](/docs/category/outline)            |
| Cloudflared    | Secure tunneling with Cloudflare for Kubernetes services | [/docs/charts/cloudflared](/docs/category/cloudflared)    |
| Drone          | Continuous integration and deployment system             | [/docs/charts/drone](/docs/category/drone)                |
| PyPI server    | Private minimal Python package repository                | [/docs/charts/pypiserver](/docs/category/pypiserver)      |

Explore the [Charts section](/docs/category/charts) for detailed installation guides and configuration options.

## Next Steps

Now that you've set up our Helm repository, try these next steps:

- Deploy a chart like MLflow with a [basic SQLite setup](/docs/charts/mlflow/basic-installation) for testing.
- Configure a production-ready deployment with [PostgreSQL](/docs/charts/mlflow/postgresql-backend-installation) or [AWS S3](/docs/charts/mlflow/aws-s3-integration).
- Contribute to our charts by submitting pull requests or suggesting new charts in our [GitHub repository](https://github.com/community-charts/helm-charts).
- Report issues or request features via [GitHub issues](https://github.com/community-charts/helm-charts/issues).
- Stay updated by following our [blog](/blog) for tutorials and announcements.

We're excited to have you as part of the GitHub Community Charts community. Let's make deploying open-source tools on Kubernetes easier, together!
