---
id: getting-started
title: Getting Started with GitHub Community Charts
sidebar_label: Getting Started
sidebar_position: 1
description: Learn how to add the GitHub Community Charts Helm repository and start deploying open-source tools like MLflow, n8n, and Actual Budget on Kubernetes.
keywords: ["helm", "kubernetes", "community charts", "mlflow", "n8n", "actual budget", "outline", "cloudflared", "drone", "pypiserver", "deployment", "getting started", "installation", "open source"]
---

# Getting Started with GitHub Community Charts

Welcome to **GitHub Community Charts**, your source for community-maintained Helm charts that simplify deploying open-source tools on Kubernetes. Our charts support projects like [MLflow](https://mlflow.org), [n8n](https://n8n.io), [Actual Budget](https://actualbudget.org), and more, ensuring reliable and up-to-date deployments for tools that may lack official Helm chart support.

:::info
**Community-Driven:** These charts are maintained by the community to fill gaps where official Helm charts may not exist or may not be actively maintained.
:::

This guide walks you through setting up our Helm repository and exploring our chart offerings, so you can quickly deploy your favorite open-source applications.

:::tip
**Quick Start:** Follow this guide step-by-step to get your first application running on Kubernetes in minutes.
:::

## Prerequisites

:::warning
**Requirements:** Ensure you have all prerequisites installed and configured before proceeding with chart installations.
:::

Before you begin, ensure you have the following:

- A Kubernetes cluster (version >= 1.16.0)
- [Helm 3](https://helm.sh/docs/intro/install/) installed on your local machine
- `kubectl` configured to access your cluster

:::danger
**Cluster Compatibility:** Verify your Kubernetes cluster version meets the minimum requirements to avoid deployment issues.
:::

:::tip
**Development Setup:** For local development, consider using tools like Minikube, Docker Desktop, or Kind to create a local Kubernetes cluster.
:::

## Step 1: Add the Community Charts Helm Repository

:::info
**Repository Setup:** Adding our Helm repository gives you access to all community-maintained charts in one place.
:::

To use our charts, add the GitHub Community Charts Helm repository to your Helm client:

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
```

- The `helm repo add` command registers our repository under the name `community-charts`.
- The `helm repo update` command ensures you have the latest chart versions.

:::tip
**Repository Management:** Always run `helm repo update` after adding a new repository to get the latest chart information.
:::

Verify the repository was added:

```bash
helm repo list
```

You should see `community-charts` with the URL `https://community-charts.github.io/helm-charts`.

## Step 2: Explore Available Charts

:::info
**Chart Discovery:** Browse our available charts to find the tools that best fit your needs and use cases.
:::

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

:::tip
**Chart Selection:** To see all available versions of a chart, use `helm search repo community-charts -l`. For example, `helm search repo community-charts/mlflow -l` lists all MLflow chart versions.
:::

For detailed descriptions and installation guides, visit the [Charts documentation](/docs/category/charts).

## Step 3: Install a Chart

:::warning
**Installation Planning:** Choose appropriate namespaces and release names for your deployments to maintain organization and avoid conflicts.
:::

To install a chart, use the `helm install` command. Below is an example for installing the MLflow chart with default settings:

```bash
helm install my-mlflow community-charts/mlflow -n <your-namespace>
```

Replace `my-mlflow` with your preferred release name and `<your-namespace>` with the target namespace (e.g., `default`). If the namespace doesn't exist, create it first:

```bash
kubectl create namespace <your-namespace>
```

:::tip
**Namespace Organization:** Use dedicated namespaces for different applications to keep your cluster organized and simplify management.
:::

:::danger
**Release Names:** Choose unique release names to avoid conflicts. Release names must be unique within a namespace.
:::

For customized installations (e.g., using PostgreSQL or AWS S3), refer to the chart's specific documentation. For MLflow, see [Basic Installation with SQLite](/docs/charts/mlflow/basic-installation), [PostgreSQL Backend Installation](/docs/charts/mlflow/postgresql-backend-installation), and [AWS S3 Integration](/docs/charts/mlflow/aws-s3-integration).

## Step 4: Verify the Installation

:::info
**Verification Process:** Always verify your installations to ensure applications are running correctly before proceeding with configuration.
:::

Check the status of your deployment:

```bash
kubectl get pods -n <your-namespace>
```

Look for pods associated with your release (e.g., `my-mlflow-XXXXX`) in a `Running` state.

:::warning
**Pod Status:** If pods are not in `Running` state, check the logs with `kubectl logs <pod-name> -n <namespace>` to diagnose issues.
:::

Access the application using the instructions in the chart's documentation. For example, MLflow typically exposes a web UI at port 5000, which you can access via port-forwarding:

```bash
kubectl port-forward svc/my-mlflow -n <your-namespace> 5000:5000
```

Then, open `http://localhost:5000` in your browser.

:::tip
**Port Forwarding:** Port forwarding is suitable for development and testing. For production, configure ingress or load balancers for external access.
:::

## Our Chart Offerings

:::info
**Chart Overview:** Each chart is designed for specific use cases and includes comprehensive documentation for various deployment scenarios.
:::

Here's a quick overview of our current charts and their use cases:

| Chart          | Description                                              | Documentation Link                                        |
| -------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| MLflow         | Platform for managing the machine learning lifecycle     | [mlflow chart docs](/docs/category/mlflow)              |
| n8n            | Workflow automation tool with **unique npm package installation** and **exclusive external task runner support** | [n8n chart docs](/docs/category/n8n)                    |
| Actual Budget  | Self-hosted personal finance tracker                     | [actualbudget chart docs](/docs/category/actualbudget)  |
| Outline        | Modern wiki for collaborative knowledge management       | [outline chart docs](/docs/category/outline)            |
| Cloudflared    | Secure tunneling with Cloudflare for Kubernetes services | [cloudflared chart docs](/docs/category/cloudflared)    |
| Drone          | Continuous integration and deployment system             | [drone chart docs](/docs/category/drone)                |
| PyPI server    | Private minimal Python package repository                | [pypiserver chart docs](/docs/category/pypiserver)      |

:::tip
**Unique Features:** Our n8n chart offers exclusive features not available in other Helm charts, including advanced npm package management and external task runner support.
:::

Explore the [Charts section](/docs/category/charts) for detailed installation guides and configuration options.

## Production Considerations

:::warning
**Production Readiness:** These charts are designed for production use, but always review security, backup, and monitoring requirements for your specific environment.
:::

### Security Best Practices

- Use dedicated namespaces for different applications
- Configure RBAC (Role-Based Access Control) appropriately
- Use Kubernetes secrets for sensitive data
- Enable TLS/SSL for external access
- Regularly update chart versions for security patches

:::danger
**Security Configuration:** Never use default passwords or credentials in production environments. Always configure proper authentication and authorization.
:::

### Backup and Monitoring

- Set up regular backups for databases and persistent data
- Configure monitoring and alerting for your applications
- Use health checks and readiness probes
- Monitor resource usage and set appropriate limits

:::tip
**Monitoring Setup:** Most charts include ServiceMonitor configurations for Prometheus integration and comprehensive monitoring.
:::

## Troubleshooting

:::info
**Common Issues:** This section covers frequently encountered problems and their solutions.
:::

### Installation Issues

1. **Chart not found**: Ensure the repository is added and updated
2. **Namespace issues**: Verify the namespace exists and you have permissions
3. **Resource constraints**: Check cluster capacity and resource limits
4. **Image pull errors**: Verify image repositories and credentials

### Debug Commands

```bash
# Check Helm repository status
helm repo list
helm repo update

# Verify chart availability
helm search repo community-charts

# Check installation status
helm list -n <namespace>
kubectl get pods -n <namespace>

# View application logs
kubectl logs <pod-name> -n <namespace>

# Check events
kubectl get events -n <namespace> --sort-by='.lastTimestamp'
```

:::tip
**Debug Process:** Start with basic connectivity and permissions, then move to application-specific configuration issues.
:::

## Next Steps

:::tip
**Getting Started:** Follow these recommended next steps to build on your initial deployment.
:::

Now that you've set up our Helm repository, try these next steps:

- Deploy a chart like MLflow with a [basic SQLite setup](/docs/charts/mlflow/basic-installation) for testing.
- Configure a production-ready deployment with [PostgreSQL](/docs/charts/mlflow/postgresql-backend-installation) or [AWS S3](/docs/charts/mlflow/aws-s3-integration).
- Contribute to our charts by submitting pull requests or suggesting new charts in our [GitHub repository](https://github.com/community-charts/helm-charts).
- Report issues or request features via [GitHub issues](https://github.com/community-charts/helm-charts/issues).
- Stay updated by following our [blog](/blog) for tutorials and announcements.

:::info
**Community Contribution:** We welcome contributions from the community! Whether it's improving documentation, adding new features, or reporting issues, every contribution helps make these charts better.
:::

We're excited to have you as part of the GitHub Community Charts community. Let's make deploying open-source tools on Kubernetes easier, together!
