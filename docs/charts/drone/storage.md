---
id: storage
title: Drone CI Storage Guide
sidebar_label: Storage
sidebar_position: 4
description: Guide to persistent storage and database configuration for Drone Helm chart deployments.
keywords:
  - drone
  - storage
  - persistence
  - database
  - kubernetes
---

# Storage Guide

This guide covers persistent storage and database configuration for Drone deployments on Kubernetes.

## Persistent Volume (PVC)

By default, Drone uses a PersistentVolumeClaim (PVC) for stateful data (e.g., SQLite database, logs):

```yaml
server:
  persistentVolume:
    enabled: true
    size: 8Gi
    storageClass: ""
    accessModes:
      - ReadWriteOnce
```

- Set `enabled: false` if using an external database (Postgres, MySQL).
- Use `existingClaim` to use a pre-created PVC.

## Database Backend

Drone supports SQLite (default), Postgres, and MySQL. To use an external DB:

```yaml
server:
  env:
    DRONE_DATABASE_DRIVER: postgres
  secrets:
    DRONE_DATABASE_DATASOURCE: "postgres://user:pass@host:5432/dbname?sslmode=disable"
```

- Supported drivers: `sqlite3`, `postgres`, `mysql`
- For production, use Postgres or MySQL.

## Encryption Secret

Set a database encryption secret for sensitive data:

```yaml
server:
  secrets:
    DRONE_DATABASE_SECRET: <random-hex>
```

Generate with: `openssl rand -hex 16`

:::tip
Never store secrets in git. Use Kubernetes secrets or Helm `--set` for sensitive values.
:::

## Next Steps

- [Configuration](./configuration.md)
- [Authentication](./authentication.md)
- [Advanced Configuration](./advanced-configuration.md)
- [Troubleshooting](./troubleshooting.md)
