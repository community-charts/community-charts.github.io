---
id: authentication
title: Authentication Guide
sidebar_label: Authentication
sidebar_position: 3
description: How to configure authentication providers for Drone using the Helm chart.
keywords:
  - drone
  - authentication
  - oauth
  - github
  - gitlab
  - gitea
  - kubernetes
---

# Authentication Guide

Drone supports multiple authentication providers (GitHub, GitLab, Gitea, Bitbucket, etc). This guide explains how to configure them securely using the Helm chart.

## Supported Providers

- GitHub / GitHub Enterprise
- GitLab
- Gitea
- Bitbucket Cloud / Server
- Gitee
- Gogs

## Example: GitHub OAuth

Set the following secrets (via `values.yaml` or `--set`):

```yaml
server:
  secrets:
    DRONE_GITHUB_CLIENT_ID: <your-client-id>
    DRONE_GITHUB_CLIENT_SECRET: <your-client-secret>
```

## Example: Gitea

```yaml
server:
  secrets:
    DRONE_GITEA_CLIENT_ID: <your-client-id>
    DRONE_GITEA_CLIENT_SECRET: <your-client-secret>
    DRONE_GITEA_SERVER: https://gitea.example.com
```

## User Management

- Create an initial admin user:

  ```yaml
  server:
    secrets:
      DRONE_USER_CREATE: "username:adminuser,admin:true"
  ```

- Restrict user access:

  ```yaml
  server:
    secrets:
      DRONE_USER_FILTER: adminuser
  ```

:::warning
Never store secrets in your git repository. Use Kubernetes secrets or Helm `--set` for sensitive values.
:::

## Next Steps

- [Configuration](./configuration.md)
- [Storage](./storage.md)
- [Advanced Configuration](./advanced-configuration.md)
- [Troubleshooting](./troubleshooting.md)
