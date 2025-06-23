---
id: configuration
title: Configuration Guide
sidebar_label: Configuration
sidebar_position: 2
description: Learn how to configure the Cloudflared Tunnel Helm chart for your deployment
keywords: [cloudflared, tunnel, configuration, helm, kubernetes, deployment, cloudflare]
---

# Configuration Guide

This guide covers the essential configuration options for deploying Cloudflared Tunnel using the Helm chart.

## Basic Configuration

### Image Configuration

```yaml
image:
  repository: cloudflare/cloudflared
  tag: ""  # Uses chart appVersion by default
  pullPolicy: IfNotPresent
```

### Replica Configuration

Choose between DaemonSet and Deployment modes:

```yaml
replica:
  allNodes: true  # Use DaemonSet to deploy to all nodes
  count: 1        # Number of replicas (used when allNodes: false)
```

:::tip
Use `allNodes: true` for high availability across all cluster nodes, or `allNodes: false` with `count: N` for specific replica count.
:::

### Update Strategy

Configure how updates are applied:

```yaml
updateStrategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1
```

## Tunnel Configuration

### Basic Tunnel Settings

```yaml
tunnelConfig:
  name: "your-tunnel-name"
  logLevel: "info"  # info, warn, error, fatal, panic
  protocol: "auto"  # auto, http2, h2mux, quic
  retries: 5
  connectTimeout: "30s"
  gracePeriod: "30s"
```

### Advanced Tunnel Settings

```yaml
tunnelConfig:
  name: "your-tunnel-name"
  logLevel: "info"
  transportLogLevel: "warn"  # debug, info, warn, error, fatal
  protocol: "auto"
  retries: 5
  connectTimeout: "30s"
  gracePeriod: "30s"
  metricsUpdateFrequency: "5s"
  autoUpdateFrequency: "24h"
  noAutoUpdate: true
  warpRouting: false
```

:::info
- **`protocol`**: Choose between `auto`, `http2`, `h2mux`, or `quic` for connection protocol
- **`logLevel`**: Set logging verbosity for the tunnel
- **`transportLogLevel`**: Set logging verbosity for transport layer
- **`warpRouting`**: Enable Cloudflare WARP routing features
:::

## Tunnel Secrets

Configure tunnel credentials and certificates:

```yaml
tunnelSecrets:
  base64EncodedConfigJsonFile: "base64-encoded-credentials-json"
  base64EncodedPemFile: "base64-encoded-certificate-pem"
```

:::warning
These secrets are required and must be base64-encoded versions of your Cloudflare tunnel files.
:::

### Encoding Tunnel Files

Encode your tunnel files using these commands:

```bash
# Encode credentials JSON file
base64 -b 0 -i ~/.cloudflared/*.json

# Encode certificate PEM file
base64 -b 0 -i ~/.cloudflared/cert.pem
```

## Ingress Configuration

### Basic Ingress Rules

```yaml
ingress:
  - hostname: example.com
    service: http://your-service.namespace.svc.cluster.local:80

  - hostname: api.example.com
    service: http://api-service.namespace.svc.cluster.local:8080

  - service: http_status:404
```

### Advanced Ingress Rules

```yaml
ingress:
  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80
    originRequest:
      connectTimeout: 10s
      disableChunkedEncoding: true

  - hostname: "*.example.com"
    service: http://wildcard-service.default.svc.cluster.local:80

  - path: "\\.(jpg|png|css|js)$"
    service: http://static-service.default.svc.cluster.local:80

  - service: http_status:404
```

:::tip
The last rule with `http_status:404` is required to handle unmatched requests.
:::

## Resource Management

### Resource Limits

```yaml
resources:
  limits:
    cpu: "400m"
    memory: "128Mi"
  requests:
    cpu: "100m"
    memory: "64Mi"
```

### Recommended Resources

For production deployments:

```yaml
resources:
  limits:
    cpu: "500m"
    memory: "256Mi"
  requests:
    cpu: "200m"
    memory: "128Mi"
```

## Security Configuration

### Pod Security Context

```yaml
podSecurityContext:
  fsGroup: 65532
  fsGroupChangePolicy: "OnRootMismatch"
  sysctls:
    - name: net.ipv4.ping_group_range
      value: "0 2147483647"
```

### Container Security Context

```yaml
securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
    add:
      - NET_RAW
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  privileged: false
  runAsUser: 65532
  runAsGroup: 65532
```

:::info
The `NET_RAW` capability is required for Cloudflared to function properly.
:::

## Node Selection and Scheduling

### Node Selector

```yaml
nodeSelector:
  kubernetes.io/os: linux
  node-type: edge
```

### Tolerations

```yaml
tolerations:
  - effect: NoSchedule
    operator: Exists
```

### Affinity Rules

```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/os
          operator: In
          values:
          - linux
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      podAffinityTerm:
        labelSelector:
          matchExpressions:
          - key: app.kubernetes.io/name
            operator: In
            values:
            - cloudflared
        topologyKey: kubernetes.io/hostname
```

## Service Account Configuration

```yaml
serviceAccount:
  create: true
  automount: true
  name: ""
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/cloudflared-role"
```

## Pod Annotations and Labels

### Pod Annotations

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "2000"
  prometheus.io/path: "/ready"
  backup.kubernetes.io/enabled: "true"
```

### Pod Labels

```yaml
podLabels:
  app.kubernetes.io/component: tunnel
  environment: production
```

## Termination Grace Period

```yaml
terminationGracePeriodSeconds: 30
```

## Complete Example

Here's a complete configuration example for a production deployment:

```yaml
# Basic deployment
replica:
  allNodes: true

# Image configuration
image:
  repository: cloudflare/cloudflared
  pullPolicy: IfNotPresent

# Update strategy
updateStrategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1

# Tunnel configuration
tunnelConfig:
  name: "production-tunnel"
  logLevel: "info"
  transportLogLevel: "warn"
  protocol: "auto"
  retries: 5
  connectTimeout: "30s"
  gracePeriod: "30s"
  metricsUpdateFrequency: "5s"
  autoUpdateFrequency: "24h"
  noAutoUpdate: true
  warpRouting: false

# Tunnel secrets (base64 encoded)
tunnelSecrets:
  base64EncodedConfigJsonFile: "your-base64-encoded-credentials"
  base64EncodedPemFile: "your-base64-encoded-certificate"

# Ingress rules
ingress:
  - hostname: app.example.com
    service: http://web-service.default.svc.cluster.local:80
    originRequest:
      connectTimeout: 10s
      disableChunkedEncoding: true

  - hostname: api.example.com
    service: http://api-service.default.svc.cluster.local:8080

  - hostname: "*.example.com"
    service: http://wildcard-service.default.svc.cluster.local:80

  - service: http_status:404

# Resources
resources:
  limits:
    cpu: "500m"
    memory: "256Mi"
  requests:
    cpu: "200m"
    memory: "128Mi"

# Security
podSecurityContext:
  fsGroup: 65532
  fsGroupChangePolicy: "OnRootMismatch"
  sysctls:
    - name: net.ipv4.ping_group_range
      value: "0 2147483647"

securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
    add:
      - NET_RAW
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  privileged: false
  runAsUser: 65532
  runAsGroup: 65532

# Node selection
nodeSelector:
  kubernetes.io/os: linux
  node-type: edge

# Tolerations
tolerations:
  - effect: NoSchedule
    operator: Exists

# Service account
serviceAccount:
  create: true
  automount: true
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/cloudflared-role"

# Monitoring
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "2000"
  prometheus.io/path: "/ready"

# Termination
terminationGracePeriodSeconds: 30
```

## Environment Variables

The chart automatically sets these environment variables:

| Variable | Description | Source |
|----------|-------------|---------|
| `TUNNEL_NAME` | Tunnel name | `tunnelConfig.name` |
| `TUNNEL_PROTOCOL` | Connection protocol | `tunnelConfig.protocol` |
| `TUNNEL_LOGLEVEL` | Logging level | `tunnelConfig.logLevel` |
| `TUNNEL_TRANSPORT_LOGLEVEL` | Transport logging | `tunnelConfig.transportLogLevel` |
| `TUNNEL_RETRIES` | Connection retries | `tunnelConfig.retries` |
| `TUNNEL_CONNECT_TIMEOUT` | Connection timeout | `tunnelConfig.connectTimeout` |
| `TUNNEL_GRACE_PERIOD` | Grace period | `tunnelConfig.gracePeriod` |

## Next Steps

- Learn about [tunnel setup](./tunnel-setup.md)
- Configure [ingress rules](./ingress-configuration.md)
- Explore [advanced configuration options](./advanced-configuration.md)
- Learn about [troubleshooting common issues](./troubleshooting.md)
