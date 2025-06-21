---
id: usage
title: Actual Budget Chart Usage Guide
sidebar_label: Usage
sidebar_position: 1
description: Get started with Actual Budget Helm chart deployment and basic usage
keywords: [actual, actualbudget, personal finance, usage, deployment, helm, kubernetes, quickstart]
---

# Actual Budget Chart Usage Guide

[Actual Budget](https://actualbudget.org) is a self-hosted personal finance manager that helps you track your spending, set budgets, and gain control over your finances. This Helm chart makes it easy to deploy Actual Budget on Kubernetes.

- **Official Website:** [https://actualbudget.org](https://actualbudget.org)
- **GitHub Repository:** [https://github.com/actualbudget/actual](https://github.com/actualbudget/actual)
- **Documentation:** [https://actualbudget.org/docs](https://actualbudget.org/docs)
- **ArtifactHub:** [Actual Budget Helm Chart](https://artifacthub.io/packages/helm/community-charts/actualbudget)

## Why use this chart?

- Quick, reliable deployment of Actual Budget on any Kubernetes cluster
- Community-maintained and up-to-date
- Great for self-hosters and teams needing private finance management
- Supports multiple authentication methods including OpenID Connect
- Configurable persistence and resource management

## Prerequisites

- Kubernetes cluster (1.16+)
- Helm 3.x
- Ingress controller (optional, for external access)
- Storage class (for persistent data)

## Quick Start

### 1. Add the Helm Repository

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
```

### 2. Basic Installation

```bash
helm install my-actualbudget community-charts/actualbudget -n <your-namespace>
```

Replace `<your-namespace>` with your target namespace.

### 3. Access the Application

After installation, access Actual Budget:

```bash
# Port forward to access locally
kubectl port-forward svc/my-actualbudget 5006:5006

# Or access via ingress (if configured)
# Navigate to your configured domain
```

## Basic Configuration

### Enable Persistence

For production deployments, always enable persistence:

```yaml
persistence:
  enabled: true
  size: 20Gi
  storageClass: "standard"
```

### Configure Ingress

Enable external access via ingress:

```yaml
ingress:
  enabled: true
  className: nginx
  hosts:
    - host: actualbudget.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
    - secretName: actualbudget-tls
      hosts:
        - actualbudget.yourdomain.com
```

### Set Resource Limits

Configure appropriate resource allocation:

```yaml
resources:
  limits:
    cpu: 500m
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 512Mi
```

## Complete Example

Here's a complete configuration for a production deployment:

```yaml
# values.yaml
replicaCount: 1
strategy:
  type: Recreate

# Persistence
persistence:
  enabled: true
  size: 20Gi
  accessModes:
    - ReadWriteOnce

# File storage
files:
  dataDirectory: /data
  server: /data/server-files
  user: /data/user-files

# Ingress
ingress:
  enabled: true
  className: nginx
  hosts:
    - host: actualbudget.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific

# Resources
resources:
  limits:
    cpu: 500m
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 512Mi

# Authentication (password-based)
login:
  method: password
  allowedLoginMethods:
    - password
```

Install with custom values:

```bash
helm install my-actualbudget community-charts/actualbudget \
  -f values.yaml \
  -n <your-namespace>
```

## Common Operations

### Upgrade the Chart

```bash
helm repo update
helm upgrade my-actualbudget community-charts/actualbudget -n <your-namespace>
```

### Uninstall the Chart

```bash
helm uninstall my-actualbudget -n <your-namespace>
```

:::warning
Uninstalling will remove all Kubernetes resources. If persistence is enabled, PVC data will be retained based on your storage class reclaim policy.
:::

### Check Status

```bash
# Check release status
helm status my-actualbudget -n <your-namespace>

# Check resources
kubectl get all -l app.kubernetes.io/name=actualbudget -n <your-namespace>

# Check logs
kubectl logs -f deployment/my-actualbudget -n <your-namespace>
```

## First Time Setup

1. **Access the Application**: Navigate to your configured URL or use port-forward
2. **Create Account**: On first access, create your admin account
3. **Import Data**: Import your existing budget data or start fresh
4. **Configure Sync**: Set up synchronization with your devices

## Environment Variables

The chart automatically configures these environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `ACTUAL_PORT` | Server port | `5006` |
| `ACTUAL_DATA_DIR` | Data directory | `/data` |
| `ACTUAL_SERVER_FILES` | Server files path | `/data/server-files` |
| `ACTUAL_USER_FILES` | User files path | `/data/user-files` |
| `ACTUAL_LOGIN_METHOD` | Authentication method | `password` |

## Troubleshooting

### Common Issues

1. **Pod not starting**: Check resource limits and storage configuration
2. **Can't access application**: Verify ingress configuration and service
3. **Data not persisting**: Ensure persistence is enabled and PVC is bound

### Debug Commands

```bash
# Check pod status
kubectl get pods -n <your-namespace>

# Check pod events
kubectl describe pod <pod-name> -n <your-namespace>

# Check logs
kubectl logs <pod-name> -n <your-namespace>

# Check PVC status
kubectl get pvc -n <your-namespace>
```

For detailed troubleshooting, see the [troubleshooting guide](./troubleshooting.md).

## Next Steps

- Learn about [configuration options](./configuration.md)
- Set up [authentication methods](./authentication.md)
- Configure [storage and persistence](./storage.md)
- Explore [advanced configuration options](./advanced-configuration.md)
- Troubleshoot common issues in the [troubleshooting guide](./troubleshooting.md)
