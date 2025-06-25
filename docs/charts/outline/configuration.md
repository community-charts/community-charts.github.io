---
id: configuration
title: Outline Configuration Guide
sidebar_label: Configuration
sidebar_position: 2
description: Learn how to configure the Outline Helm chart for your deployment
keywords: [outline, configuration, helm, kubernetes, deployment, wiki, knowledge-base]
---

# Configuration Guide

This guide covers the essential configuration options for deploying Outline using the Helm chart.

## Basic Configuration

### Image Configuration

```yaml
image:
  repository: outlinewiki/outline
  tag: ""  # Uses chart appVersion by default
  pullPolicy: IfNotPresent
```

### Service Configuration

```yaml
service:
  type: ClusterIP
  port: 3000
  name: http
  annotations: {}
```

### Deployment Strategy

Choose between RollingUpdate and Recreate strategies:

```yaml
strategy:
  type: RollingUpdate  # Recommended for multi-replica deployments
  rollingUpdate:
    maxSurge: "25%"
    maxUnavailable: "25%"
```

:::tip
Use `RollingUpdate` for production deployments with multiple replicas to ensure zero-downtime updates.
:::

## Web Configuration

Configure web server settings:

```yaml
web:
  concurrency: 1
  forceHttps: true
  skipSSLVerification: false
```

:::info
- **`concurrency`**: Number of worker processes (1-10)
- **`forceHttps`**: Redirect HTTP to HTTPS
- **`skipSSLVerification`**: Allow insecure connections (development only)
:::

## URL Configuration

Set the application URL:

```yaml
url: "https://outline.yourdomain.com"
```

:::tip
If not set, the URL will be auto-generated from ingress configuration or service definition.
:::

## Language and Localization

Configure default language:

```yaml
defaultLanguage: en_US
```

Available languages: `en_US`, `en_GB`, `de_DE`, `fr_FR`, `es_ES`, `it_IT`, `ja_JP`, `ko_KR`, `pt_BR`, `ru_RU`, `tr_TR`, `zh_CN`, `zh_TW`

## Rate Limiting

Enable rate limiting for API protection:

```yaml
rateLimiter:
  enabled: true
  limit: 100
  window: 60
```

## Auto Update Configuration

Configure automatic updates:

```yaml
autoUpdate:
  enabled: false
  telemetry: false
```

:::warning
Disable auto updates in production to maintain control over your deployment.
:::

## Logging Configuration

Configure application logging:

```yaml
logging:
  level: info  # error, warn, info, http, verbose, debug, silly
  extraDebug: []  # Available modules: lifecycle, http, editor, router, collaboration, misc, store, plugins, policies
```

## Resource Management

Set resource requests and limits:

```yaml
resources:
  limits:
    cpu: 1000m
    memory: 2Gi
  requests:
    cpu: 500m
    memory: 1Gi
```

## Health Checks

Configure liveness and readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /_health
    port: http
  initialDelaySeconds: 10
  periodSeconds: 30
  timeoutSeconds: 3
  failureThreshold: 5

readinessProbe:
  httpGet:
    path: /_health
    port: http
  initialDelaySeconds: 10
  periodSeconds: 30
  timeoutSeconds: 3
  failureThreshold: 5
```

## Ingress Configuration

Enable ingress for external access:

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: outline.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
    - secretName: outline-tls
      hosts:
        - outline.yourdomain.com
```

## Security Context

Configure security settings:

```yaml
podSecurityContext:
  fsGroup: 1001
  fsGroupChangePolicy: OnRootMismatch

securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
  readOnlyRootFilesystem: false
  runAsNonRoot: true
  runAsUser: 1001
  runAsGroup: 1001
```

## Service Account

Configure service account settings:

```yaml
serviceAccount:
  create: true
  automount: true
  name: ""
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/outline-role"
```

## Complete Example

Here's a complete configuration example for a production deployment:

```yaml
# Basic deployment
replicaCount: 2
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: "25%"
    maxUnavailable: "25%"

# Image configuration
image:
  repository: outlinewiki/outline
  pullPolicy: IfNotPresent

# Web configuration
web:
  concurrency: 2
  forceHttps: true
  skipSSLVerification: false

# URL and language
url: "https://outline.yourdomain.com"
defaultLanguage: en_US

# Rate limiting
rateLimiter:
  enabled: true
  limit: 100
  window: 60

# Auto updates
autoUpdate:
  enabled: false
  telemetry: false

# Logging
logging:
  level: info
  extraDebug: []

# Resources
resources:
  limits:
    cpu: 1000m
    memory: 2Gi
  requests:
    cpu: 500m
    memory: 1Gi

# Ingress
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: outline.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
    - secretName: outline-tls
      hosts:
        - outline.yourdomain.com

# Security
podSecurityContext:
  fsGroup: 1001
  fsGroupChangePolicy: OnRootMismatch

securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
  runAsNonRoot: true
  runAsUser: 1001
  runAsGroup: 1001
```

## Environment Variables

The chart automatically sets these environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `SECRET_KEY` | Application secret key | Auto-generated |
| `UTILS_SECRET` | Utils secret key | Auto-generated |
| `PORT` | Application port | `3000` |
| `DEFAULT_LANGUAGE` | Default language | `en_US` |
| `URL` | Application URL | Auto-generated |
| `RATE_LIMITER_ENABLED` | Rate limiter enabled | `false` |
| `ENABLE_UPDATES` | Auto updates enabled | `false` |
| `TELEMETRY` | Telemetry enabled | `false` |
| `FORCE_HTTPS` | Force HTTPS redirect | `true` |
| `WEB_CONCURRENCY` | Worker processes | `1` |
| `LOG_LEVEL` | Logging level | `info` |

## Next Steps

- Learn about [authentication setup](./authentication.md)
- Configure [storage options](./storage.md)
- Set up [database configuration](./database.md)
- Explore [advanced configuration options](./advanced-configuration.md)
