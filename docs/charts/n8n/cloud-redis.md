---
id: cloud-redis
title: n8n Cloud Redis Setup
sidebar_label: Cloud Redis
sidebar_position: 4
description: Configure n8n to use managed Redis services on GCP, AWS, and Azure for queue mode and production deployments.
keywords: [n8n, helm, kubernetes, redis, cloud, gcp, aws, azure, elasticache, memorystore, cache-for-redis, managed-redis]
---

# Managed Redis Setup for n8n

n8n queue mode requires a Redis backend. This guide explains how to connect n8n to managed Redis services on Google Cloud (Memorystore), AWS (ElastiCache), and Azure (Cache for Redis).

## GCP Memorystore for Redis

:::info
Google Cloud Memorystore provides a fully managed Redis service. Use private IP for secure access from GKE.
:::

### Example `values.yaml`
```yaml
externalRedis:
  host: "<memorystore-ip>"
  port: 6379
  # Memorystore does not use password by default
```

:::tip
Ensure your GKE nodes are in the same VPC and region as your Memorystore instance. Use private IP connectivity.
:::

#### Networking & Security
- Memorystore must be provisioned with private IP.
- GKE nodes must be in the same VPC/subnet or have VPC peering.
- No password by default; enable AUTH if needed.

#### Troubleshooting
- **Timeouts:** Check VPC/subnet and firewall rules.
- **Auth errors:** If AUTH is enabled, set the password in `externalRedis.password`.

:::note
See [GCP Memorystore for Redis docs](https://cloud.google.com/memorystore/docs/redis) for more details.
:::

### Next Steps
- [GCP Memorystore Docs](https://cloud.google.com/memorystore/docs/redis)
- [n8n Queue Mode Guide](./queue-mode.md)

---

## AWS ElastiCache for Redis

:::info
AWS ElastiCache for Redis is a fully managed Redis service. Use VPC/subnet groups for secure access from EKS.
:::

### Example `values.yaml`
```yaml
externalRedis:
  host: "<primary-endpoint>.cache.amazonaws.com"
  port: 6379
  # Set password if AUTH is enabled
  password: "<your-password>"
```

:::tip
Ensure your EKS nodes are in the same VPC/subnet as your ElastiCache cluster. Use security groups to control access.
:::

#### Networking & Security
- ElastiCache must be in a VPC accessible to EKS nodes.
- Use security groups to allow inbound traffic from EKS nodes.
- Enable AUTH for password protection (optional).
- TLS/SSL is supported (see AWS docs).

#### Troubleshooting
- **Timeouts:** Check VPC/subnet and security group rules.
- **Auth errors:** Set the correct password if AUTH is enabled.
- **TLS errors:** Ensure n8n supports Redis TLS if enabled.

:::note
See [AWS ElastiCache for Redis docs](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html) for more details.
:::

### Next Steps
- [AWS ElastiCache Docs](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html)
- [n8n Queue Mode Guide](./queue-mode.md)

---

## Azure Cache for Redis

:::info
Azure Cache for Redis is a fully managed Redis service. Use VNet integration for secure access from AKS.
:::

### Example `values.yaml`
```yaml
externalRedis:
  host: "<redis-name>.redis.cache.windows.net"
  port: 6380
  password: "<access-key>"
  # Azure requires SSL (port 6380)
```

:::tip
Use the access key from the Azure portal as the Redis password. Use SSL (port 6380) for connections.
:::

#### Networking & Security
- Use VNet integration for private access from AKS.
- Add AKS subnet to the Redis firewall rules.
- Use SSL (port 6380) for all connections.

#### Troubleshooting
- **Timeouts:** Check VNet/firewall rules.
- **Auth errors:** Use the correct access key as password.
- **SSL errors:** Ensure n8n is configured for SSL (port 6380).

:::note
See [Azure Cache for Redis docs](https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/) for more details.
:::

### Next Steps
- [Azure Cache for Redis Docs](https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/)
- [n8n Queue Mode Guide](./queue-mode.md)

---

## Pod Affinity and Anti-Affinity

:::tip
**Redis Affinity:** Proper affinity configuration can optimize Redis performance by ensuring pods are placed optimally relative to Redis resources.
:::

:::warning
**Deprecation Notice:** The top-level `affinity` field is deprecated. Use the specific affinity configurations under `main`, `worker`, and `webhook` blocks instead.
:::

### Affinity for Redis Optimization

#### Co-locate with Redis Nodes

```yaml
# Place pods on nodes close to Redis
main:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: redis-zone
            operator: In
            values:
            - "primary"

worker:
  mode: queue
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: redis-zone
            operator: In
            values:
            - "primary"
```

#### Spread Pods for Redis Load Distribution

```yaml
# Distribute Redis connections across nodes
main:
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
              - n8n
          topologyKey: kubernetes.io/hostname

worker:
  mode: queue
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app.kubernetes.io/name
            operator: In
            values:
            - n8n
          - key: app.kubernetes.io/component
            operator: In
            values:
            - worker
        topologyKey: kubernetes.io/hostname
```

#### Zone Distribution for Redis Resilience

```yaml
# Distribute pods across zones for Redis availability
main:
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
              - n8n
          topologyKey: topology.kubernetes.io/zone

webhook:
  mode: queue
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
              - n8n
            - key: app.kubernetes.io/component
              operator: In
              values:
              - webhook
          topologyKey: topology.kubernetes.io/zone
```

#### Node Affinity for Redis Performance

```yaml
# Use nodes optimized for Redis workloads
main:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: node-type
            operator: In
            values:
            - redis-optimized

worker:
  mode: queue
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: node-type
            operator: In
            values:
            - redis-optimized
```

:::info
**Redis Benefits:** Proper affinity configuration ensures optimal Redis performance by placing pods on nodes with good Redis connectivity and distributing Redis load effectively.
:::

---

## Next Steps

- [Database Setup](./database-setup.md)
- [n8n Queue Mode Guide](./queue-mode.md)
- [Troubleshooting](./troubleshooting.md)
