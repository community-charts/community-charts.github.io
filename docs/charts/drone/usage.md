---
id: usage
title: Drone Chart Usage Guide
sidebar_label: Usage
sidebar_position: 1
description: How to install, upgrade, and use the Drone Helm chart for CI/CD on Kubernetes.
keywords:
  - drone
  - helm
  - usage
  - ci
  - cd
  - kubernetes
---

# Drone Chart Usage Guide

[Drone](https://drone.io) is a modern Continuous Integration and Continuous Deployment (CI/CD) platform built on container technology. This chart lets you deploy Drone on Kubernetes easily.

- **Official Website:** [https://drone.io](https://drone.io)
- **GitHub Repository:** [https://github.com/harness/drone](https://github.com/harness/drone)
- **Documentation:** [https://docs.drone.io](https://docs.drone.io)
- **ArtifactHub:** [Drone Helm Chart](https://artifacthub.io/packages/helm/community-charts/drone)

## Why use this chart?

- Run CI/CD pipelines in your own Kubernetes cluster
- Community-maintained and up-to-date
- Supports plugins and custom runners

## Installation

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
helm install my-drone community-charts/drone -n <your-namespace>
```

Replace `<your-namespace>` with your target namespace.

:::tip
For advanced configuration, see the [Configuration](./configuration.md) page.
:::

## Upgrading

```bash
helm upgrade my-drone community-charts/drone -n <your-namespace>
```

## Uninstalling

```bash
helm uninstall my-drone -n <your-namespace>
```

This removes all Kubernetes resources created by the chart.

## Example: Install with Gitea and Postgres

```yaml
server:
  ingress:
    enabled: true
    hosts:
      - host: drone.example.com
        paths:
          - path: /
            pathType: ImplementationSpecific
  env:
    DRONE_SERVER_HOST: drone.example.com
    DRONE_SERVER_PROTO: http
    DRONE_DATABASE_DRIVER: postgres
    DRONE_GITEA_SERVER: http://gitea.example.com
  secrets:
    DRONE_DATABASE_DATASOURCE: "postgres://postgres:postgres@postgres-service:5432/postgres?sslmode=disable"
    DRONE_GITEA_CLIENT_ID: <client-id>
    DRONE_GITEA_CLIENT_SECRET: <client-secret>
    DRONE_USER_CREATE: "username:testuser,admin:true"
    DRONE_USER_FILTER: testuser
```

:::warning
Never store secrets in your git repository. Use Kubernetes secrets or Helm `--set` for sensitive values.
:::

## Next Steps

- [Configuration](./configuration.md)
- [Authentication](./authentication.md)
- [Storage](./storage.md)
- [Advanced Configuration](./advanced-configuration.md)
- [Troubleshooting](./troubleshooting.md)
