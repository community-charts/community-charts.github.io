---
id: configuration
title: Configuration Guide
sidebar_label: Configuration
sidebar_position: 2
description: Learn how to configure the Actual Budget Helm chart for your deployment
keywords: [actual, actualbudget, personal finance, configuration, helm, kubernetes, deployment]
---

# Configuration Guide

This guide covers the essential configuration options for deploying Actual Budget using the Helm chart.

## Basic Configuration

### Image Configuration

```yaml
image:
  repository: actualbudget/actual-server
  tag: ""  # Uses chart appVersion by default
  pullPolicy: IfNotPresent
```

### Service Configuration

```yaml
service:
  type: ClusterIP
  port: 5006
  name: http
  annotations: {}
```

## File Storage Configuration

Actual Budget requires specific directory structure for data storage:

```yaml
files:
  dataDirectory: /data
  server: /data/server-files
  user: /data/user-files
```

:::info
- **`dataDirectory`**: Base directory where all data is stored
- **`server`**: Contains account.sqlite with user accounts and session tokens
- **`user`**: Stores budget files as binary blobs
:::

## Persistence Configuration

Enable persistent storage to retain data across pod restarts:

```yaml
persistence:
  enabled: true
  size: 10Gi
  accessModes:
    - ReadWriteOnce
  storageClass: ""
  existingClaim: ""
```

:::tip
For production deployments, always enable persistence to prevent data loss during pod restarts or updates.
:::

## Upload Limits

Configure file upload size limits:

```yaml
upload:
  fileSizeLimitMB: 20
  fileSizeSyncLimitMB: 20
  syncEncryptedFileSizeLimitMB: 50
```

## Deployment Strategy

Choose between RollingUpdate and Recreate strategies:

```yaml
strategy:
  type: Recreate  # Recommended for single-instance deployments
  rollingUpdate:
    maxSurge: "100%"
    maxUnavailable: 0
```

:::warning
Use `Recreate` strategy for single-instance deployments to avoid data corruption issues during updates.
:::

## Resource Management

Set resource requests and limits:

```yaml
resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi
```

## Health Checks

Configure liveness and readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /
    port: http

readinessProbe:
  httpGet:
    path: /
    port: http
```

## Ingress Configuration

Enable ingress for external access:

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    kubernetes.io/ingress.class: nginx
    kubernetes.io/tls-acme: "true"
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

## Complete Example

Here's a complete configuration example for a production deployment:

```yaml
# Basic deployment
replicaCount: 1
strategy:
  type: Recreate

# Image configuration
image:
  repository: actualbudget/actual-server
  pullPolicy: IfNotPresent

# File storage
files:
  dataDirectory: /data
  server: /data/server-files
  user: /data/user-files

# Persistence
persistence:
  enabled: true
  size: 20Gi
  accessModes:
    - ReadWriteOnce
  storageClass: ""

# Upload limits
upload:
  fileSizeLimitMB: 20
  fileSizeSyncLimitMB: 20
  syncEncryptedFileSizeLimitMB: 50

# Authentication
login:
  method: password
  allowedLoginMethods:
    - password
    - header
    - openid

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
    memory: 512Mi
  requests:
    cpu: 200m
    memory: 256Mi
```

## Next Steps

- Learn about [authentication setup](./authentication.md)
- Configure [storage and persistence](./storage.md)
- Explore [advanced configuration options](./advanced-configuration.md)
