---
id: configuration
title: Configuration
sidebar_label: Configuration
sidebar_position: 2
description: Learn how to configure PyPI Server chart with custom values, environment variables, and deployment options
keywords: [pypiserver configuration, helm values, kubernetes deployment, python package server]
---

# Configuration

This page covers all configuration options available for the PyPI Server Helm chart. You can customize the deployment by creating a custom `values.yaml` file or passing values directly to the Helm command.

## Basic Configuration

### Image Configuration

```yaml
image:
  repository: pypiserver/pypiserver
  tag: ""  # Uses chart appVersion by default
  pullPolicy: IfNotPresent
```

### Replica Configuration

```yaml
replicaCount: 1
```

:::note
PyPI Server is designed to be lightweight and typically runs as a single instance. For high availability, consider using multiple replicas with proper volume sharing.
:::

### Service Configuration

```yaml
service:
  type: ClusterIP
  port: 8080
  name: http
  annotations: {}
```

## PyPI Server Arguments

The chart allows you to customize PyPI Server startup arguments:

```yaml
podArgs:
  - "run"
  - "-a"
  - "."
  - "-P"
  - "."
  - "--overwrite"
```

### Common PyPI Server Arguments

| Argument | Description | Example |
|----------|-------------|---------|
| `-a, --authenticate` | Comma-separated list of package names that require authentication | `-a "my-package,private-package"` |
| `-P, --passwords` | Path to password file | `-P "/data/.htpasswd"` |
| `--overwrite` | Allow overwriting existing packages | `--overwrite` |
| `--fallback-url` | Fallback URL for packages not found locally | `--fallback-url "https://pypi.org/simple/"` |
| `--server` | Server method (auto, cherrypy, paste, twisted, gunicorn, gevent, tornado, waitress) | `--server "gunicorn"` |
| `--port` | Port to listen on | `--port "8080"` |
| `--interface` | Interface to bind to | `--interface "0.0.0.0"` |

## Ingress Configuration

Enable and configure ingress for external access:

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: pypi.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: pypi-tls
      hosts:
        - pypi.yourdomain.com
```

## Resource Management

Configure resource limits and requests:

```yaml
resources:
  limits:
    cpu: 500m
    memory: 2Gi
  requests:
    cpu: 200m
    memory: 1Gi
```

## Security Configuration

### Pod Security Context

```yaml
podSecurityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: OnRootMismatch
```

### Container Security Context

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
```

## Health Checks

Configure liveness and readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

## Deployment Strategy

```yaml
strategy:
  type: Recreate
  # Alternative: RollingUpdate
  # rollingUpdate:
  #   maxSurge: "100%"
  #   maxUnavailable: 0
```

## Node Scheduling

### Node Selector

```yaml
nodeSelector:
  kubernetes.io/os: linux
  node-role.kubernetes.io/worker: "true"
```

### Affinity Rules

```yaml
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
              - key: app.kubernetes.io/name
                operator: In
                values:
                  - pypiserver
          topologyKey: kubernetes.io/hostname
```

### Tolerations

```yaml
tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "pypiserver"
    effect: "NoSchedule"
```

## Service Account

```yaml
serviceAccount:
  create: true
  automount: true
  annotations: {}
  name: ""
```

## Complete Example

Here's a complete example of a production-ready configuration:

```yaml
# values.yaml
replicaCount: 1

image:
  repository: pypiserver/pypiserver
  tag: ""
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 8080
  name: http

ingress:
  enabled: true
  className: nginx
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: pypi.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: pypi-tls
      hosts:
        - pypi.yourdomain.com

podArgs:
  - "run"
  - "-a"
  - "."
  - "-P"
  - "/data/.htpasswd"
  - "--overwrite"
  - "--fallback-url"
  - "https://pypi.org/simple/"

resources:
  limits:
    cpu: 500m
    memory: 2Gi
  requests:
    cpu: 200m
    memory: 1Gi

securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false

podSecurityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000

volumes:
  - name: packages
    persistentVolumeClaim:
      claimName: pypi-packages-pvc
  - name: auth
    secret:
      secretName: pypi-auth

volumeMounts:
  - name: packages
    mountPath: "/data/packages"
  - name: auth
    mountPath: "/data/.htpasswd"
    subPath: ".htpasswd"
```

## Environment Variables

The chart automatically sets the following environment variables:

- `PYPISERVER_PORT`: Set to the service port (default: 8080)

You can add custom environment variables using the `env` section in the deployment template or by modifying the chart.

## Next Steps

- Learn about [storage configuration](./storage.md) for persistent package storage
- Explore [advanced configuration](./advanced-configuration.md) options
- Check [troubleshooting](./troubleshooting.md) for common issues
- Review the [usage guide](./usage.md) for deployment examples
