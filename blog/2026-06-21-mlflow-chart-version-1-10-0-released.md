---
slug: mlflow-chart-version-1.10.0-released
title: mlflow chart version 1.10.0 released
date: 2026-06-21T17:35
authors: burakince
tags: [mlflow, helm, kubernetes, open-source]
description: Discover the enhanced mlflow chart version 1.10.0 Helm chart, featuring app version 3.14.0, with exciting new features and community-driven improvements.
---

# mlflow chart version 1.10.0 released!

We are excited to share the release of the **mlflow Helm chart version 1.10.0** on June 21, 2026, featuring **app version 3.14.0**. This latest update includes a host of new features, enhancements, and improvements driven by our vibrant community, all designed to ensure a smoother deployment experience for mlflow on Kubernetes.

## What's New in mlflow 1.10.0 chart

This release showcases significant updates to both the Helm chart (version 1.10.0) and the underlying application (version 3.14.0). Here’s a look at some of the key changes:

- **Added**: Optional image digest support for immutable image pulls
- **Added**: MinIO subchart for S3-compatible artifact storage without external dependencies
- **Added**: Support for uvicorn-opts with log-level merging; uvicorn is now the default server for log injection instead of gunicorn
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/223)
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/310)
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/411)
- **Security**: Enhanced security with readOnlyRootFilesystem and a built-in tmp emptyDir volume
- **Fixed**: Default key names for AWS authentication to ensure existingSecret works with minimal setup
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/225)
- **Security**: Automatic injection of MLFLOW_SERVER_ALLOWED_HOSTS from ingress hosts to mitigate DNS rebinding risks
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/285)
- **Changed**: Documented azure-identity requirement for AKS Managed Identity; workaround using AZURE_STORAGE_CONNECTION_STRING via extraEnvVars
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/423)
- **Security**: Automatic injection of MLFLOW_SERVER_CORS_ALLOWED_ORIGINS to prevent CORS-based cross-origin threats
- **Added**: New serverAllowedHosts and corsAllowedOrigins values for additional ingress customization; duplicates are removed
- **Fixed**: Auto-configuration of auth PostgreSQL backend from the Bitnami subchart when specific conditions are met
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/504)
- **Added**: Configurable serverHost value for MLflow server binding; defaults to 0.0.0.0 
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/230)
- **Added**: Support for Azure Active Directory and MSI authentication with backendStore.mssql.connectionUrl
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/248)
- **Added**: capability to store MSSQL connection URLs in a Kubernetes Secret for better security management 
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/248)
- **Fixed**: Resolved issues with ini-file-initializer init container regarding LDAP-only deployments
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/426)
- **Fixed**: Clarified usage of service.name and provided guidance for resource name overrides
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/468)
- **Added**: ExtraDeploy value to allow rendering of additional Kubernetes objects alongside the chart 
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/53)
- **Added**: Support for pod scheduling priority with priorityClassName value 
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/317)
- **Added**: capability to annotate deployment resource metadata 
    - [GitHub Issue](https://github.com/community-charts/helm-charts/issues/461)
- **Fixed**: Ensured mutual exclusivity for auth and ldapAuth settings; both cannot be enabled simultaneously
- **Fixed**: Corrected schema defaults for various service and security settings 

For the complete list of changes, check out the [release notes](https://github.com/community-charts/helm-charts/releases/tag/mlflow-1.10.0) on GitHub.

{/* truncate */}

## Getting Started with mlflow 1.10.0 chart

Are you ready to deploy mlflow 1.10.0? Our comprehensive [installation guides](https://community-charts.github.io/docs/category/mlflow) will provide you with step-by-step instructions to help you get started, including:

- Quick installations with default configurations.
- Tailoring settings to meet your unique environment.
- Best practices for ensuring smooth production deployments.

Explore the [mlflow documentation](https://community-charts.github.io/docs/category/mlflow) to discover all available options and launch your mlflow deployment today.

## Why Choose the mlflow Helm Chart?

The mlflow Helm chart, managed by [GitHub Community Charts](https://github.com/community-charts/helm-charts), is your go-to solution for leveraging Kubernetes for mlflow deployment. Key benefits include:

- **User-Friendly**: Simple installation and intuitive configuration.
- **Community-Driven**: Regular updates and enhancements contributed by community members.
- **Flexible**: A range of configurable options to suit diverse use cases.
- **Reliable**: Thoroughly tested to ensure stability within Kubernetes environments.

## Get Involved

We believe in the strength of community! The GitHub Community Charts project thrives on contributions, and we invite you to join us. Whether you are debugging, enhancing documentation, or proposing new features, here's how you can participate:

- **Explore the Chart**: Dive into the [mlflow documentation](https://community-charts.github.io/docs/category/mlflow) for configuration insights.
- **Contribute**: Share your expertise by submitting pull requests to our [GitHub repository](https://github.com/community-charts/helm-charts).
- **Report Issues**: Encountered a problem? [Let us know](https://github.com/community-charts/helm-charts/issues).
- **Request Features**: Share your ideas via our [issue tracker](https://github.com/community-charts/helm-charts/issues/new).

Thank you for your support of mlflow and GitHub Community Charts. Together, we can continue to simplify Kubernetes deployments for everyone!