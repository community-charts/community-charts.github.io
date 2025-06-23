---
id: configuration
title: Configuration Guide
sidebar_label: Configuration
sidebar_position: 2
description: Detailed guide to configuring the Drone Helm chart for production and custom use cases.
keywords:
  - drone
  - helm
  - configuration
  - ci
  - cd
  - kubernetes
---

# Configuration Guide

This guide covers all major configuration options for the Drone Helm chart, including server and runner settings, environment variables, and best practices for production deployments.

## Basic Configuration

Set the most important values in your `values.yaml` or via `--set`:

```yaml
server:
  env:
    DRONE_SERVER_HOST: drone.example.com
    DRONE_SERVER_PROTO: https
  ingress:
    enabled: true
    hosts:
      - host: drone.example.com
        paths:
          - path: /
            pathType: ImplementationSpecific
```

## Common Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `server.env.DRONE_SERVER_HOST` | Drone server hostname (no protocol) | `drone.example.com` |
| `server.env.DRONE_SERVER_PROTO` | Protocol for Drone server (`http` or `https`) | `http` |
| `server.replicaCount` | Number of Drone server replicas | `1` |
| `server.image.repository` | Drone server image | `drone/drone` |
| `server.image.tag` | Drone server image tag | Chart app version |
| `server.persistentVolume.enabled` | Enable persistent storage | `true` |
| `server.persistentVolume.size` | PVC size | `8Gi` |
| `kubeRunner.enabled` | Enable Kubernetes runner | `true` |
| `kubeRunner.replicaCount` | Number of runner replicas | `1` |

## Advanced Configuration

- **Node selectors, tolerations, affinity:**
  - `server.nodeSelector`, `server.tolerations`, `server.affinity`
  - `kubeRunner.nodeSelector`, `kubeRunner.tolerations`, `kubeRunner.affinity`
- **Resource requests/limits:**
  - `server.resources`, `kubeRunner.resources`
- **Custom ServiceAccount:**
  - `server.serviceAccount.*`, `kubeRunner.serviceAccount.*`
- **Ingress TLS:**
  - `server.ingress.tls`, `kubeRunner.ingress.tls`

## Example: Customizing the Runner

```yaml
kubeRunner:
  enabled: true
  replicaCount: 2
  env:
    DRONE_NAMESPACE_DEFAULT: ci-builds
  ingress:
    enabled: true
    hosts:
      - host: runner.example.com
        paths:
          - path: /
            pathType: ImplementationSpecific
```

:::tip
For a full list of options, see the chart's `values.yaml` and `values.schema.json`.
:::

## Next Steps

- [Authentication](./authentication.md)
- [Storage](./storage.md)
- [Advanced Configuration](./advanced-configuration.md)
- [Troubleshooting](./troubleshooting.md)
