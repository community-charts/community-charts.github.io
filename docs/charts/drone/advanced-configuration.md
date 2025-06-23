---
id: advanced-configuration
title: Drone Chart Advanced Configuration
sidebar_label: Advanced Configuration
sidebar_position: 5
description: Advanced configuration options for Drone Helm chart, including runners, RBAC, and custom Kubernetes settings.
keywords:
  - drone
  - advanced
  - rbac
  - runner
  - kubernetes
---

# Drone Chart Advanced Configuration

This guide covers advanced options for customizing your Drone deployment on Kubernetes.

## Kubernetes Runner

- Enable/disable runner: `kubeRunner.enabled`
- Set runner replicas: `kubeRunner.replicaCount`
- Set default build namespace: `kubeRunner.env.DRONE_NAMESPACE_DEFAULT`
- Custom runner image:

  ```yaml
  kubeRunner:
    image:
      repository: drone/drone-runner-kube
      tag: 1.0.0-rc.3
  ```

## RBAC and Namespaces

- Control which namespaces the runner can build in:

  ```yaml
  kubeRunner:
    rbac:
      buildNamespaces:
        - default
        - ci-builds
  ```

## Customizing Pod Specs

- Node selectors, tolerations, affinity:
  - `server.nodeSelector`, `server.tolerations`, `server.affinity`
  - `kubeRunner.nodeSelector`, `kubeRunner.tolerations`, `kubeRunner.affinity`
- Extra volumes and mounts:
  - `server.extraVolumes`, `server.extraVolumeMounts`
  - `kubeRunner.extraVolumes`, `kubeRunner.extraVolumeMounts`

## Service and Ingress

- Customize service type/port:
  - `server.service.type`, `server.service.port`
  - `kubeRunner.service.type`, `kubeRunner.service.port`
- Ingress options for both server and runner

## Security Contexts

- Harden containers with `securityContext` and `podSecurityContext` for both server and runner

## Example: Customizing Security Context

```yaml
server:
  securityContext:
    runAsNonRoot: true
    readOnlyRootFilesystem: true
kubeRunner:
  securityContext:
    runAsNonRoot: true
    readOnlyRootFilesystem: true
```

## Next Steps

- [Configuration](./configuration.md)
- [Authentication](./authentication.md)
- [Storage](./storage.md)
- [Troubleshooting](./troubleshooting.md)
