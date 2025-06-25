---
id: troubleshooting
title: Drone CI Troubleshooting Guide
sidebar_label: Troubleshooting
sidebar_position: 6
description: Troubleshooting common issues with the Drone Helm chart on Kubernetes.
keywords:
  - drone
  - troubleshooting
  - kubernetes
  - helm
---

# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with Drone deployments on Kubernetes.

## Common Issues

### 1. Drone Server Not Starting
- Check pod logs: `kubectl logs <drone-server-pod>`
- Ensure required environment variables are set (`DRONE_SERVER_HOST`, `DRONE_SERVER_PROTO`)
- Check persistent volume status: `kubectl get pvc`

### 2. Runner Not Connecting
- Ensure `DRONE_RPC_SECRET` matches between server and runner
- Check runner pod logs
- Verify network connectivity between runner and server

### 3. Authentication Failures
- Double-check OAuth client IDs/secrets
- Ensure callback URLs are correct in your OAuth provider

### 4. Database Issues
- Check DB connection string in `DRONE_DATABASE_DATASOURCE`
- Ensure DB is reachable from the cluster

## Useful Commands

```bash
kubectl get pods -n <namespace>
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace>
```

:::tip
For more help, check the [Drone community site](https://discourse.drone.io/).
:::

## Next Steps

- [Configuration](./configuration.md)
- [Authentication](./authentication.md)
- [Storage](./storage.md)
- [Advanced Configuration](./advanced-configuration.md)
