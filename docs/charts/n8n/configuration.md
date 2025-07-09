---
id: configuration
title: n8n Configuration Reference
sidebar_label: Configuration
sidebar_position: 2
description: Comprehensive configuration reference for the n8n Helm chart with detailed examples and enterprise best practices
keywords: [n8n, configuration, helm, kubernetes, values, settings, options, environment, secrets, enterprise]
---

# n8n Configuration Reference

This comprehensive guide provides detailed coverage of all configuration options available in the n8n Helm chart, systematically organized by functional category with practical examples and enterprise-grade best practices.

:::info
**Configuration Reference:** This guide serves as the definitive reference for all available configuration options. Utilize the table of contents for efficient navigation to specific sections.
:::

:::tip
**Enterprise Best Practices:** Follow the recommendations outlined in this guide to ensure a secure, performant, and reliable n8n deployment suitable for production environments.
:::

## Table of Contents

- [Image Configuration](#image-configuration)
- [Service Configuration](#service-configuration)
- [Ingress Configuration](#ingress-configuration)
- [Resources and Scaling](#resources-and-scaling)
- [Pod Affinity and Anti-Affinity](#pod-affinity-and-anti-affinity)
- [Persistence Configuration](#persistence-configuration)
- [Database Configuration](#database-configuration)
- [Queue Mode Configuration](#queue-mode-configuration)
- [Storage Configuration](#storage-configuration)
- [Node Configuration](#node-configuration)
- [Monitoring Configuration](#monitoring-configuration)
- [Security Configuration](#security-configuration)
- [Task Runners](#task-runners)
- [Workflow History](#workflow-history)
- [API Configuration](#api-configuration)
- [Diagnostics and Telemetry](#diagnostics-and-telemetry)
- [DNS Configuration](#dns-configuration)

## Image Configuration

:::tip
**Image Selection Strategy:** Choose the appropriate image tag for your environment. Implement specific versions for production stability and security.
:::

### Standard Image Configuration

```yaml
image:
  repository: n8nio/n8n
  tag: "1.0.0"  # Specify version or leave empty for appVersion
  pullPolicy: IfNotPresent
```

:::warning
**Production Image Security:** Always utilize specific image tags in production environments to prevent unexpected updates and mitigate potential security vulnerabilities.
:::

### Private Registry Integration

```yaml
image:
  repository: your-registry.com/n8nio/n8n
  tag: "1.0.0"
  pullPolicy: Always

imagePullSecrets:
  - name: registry-secret
```

:::info
**Private Registry Benefits:** Implement private registries for enhanced security posture and centralized control over image distribution.
:::

## Service Configuration

:::note
**Service Architecture:** Select the service type based on your networking requirements and infrastructure architecture.
:::

### Service Disabling

```yaml
service:
  enabled: false
```

:::info
**Service Disabling:** Disable service creation when using external load balancers, ingress-only access, or when services are managed externally.
:::

:::warning
**Access Considerations:** When services are disabled, ensure alternative access methods (ingress, external load balancers) are properly configured.
:::

### Standard Service Configuration

```yaml
service:
  enabled: true
  type: ClusterIP
  port: 5678
  name: http
  annotations: {}
```

:::tip
**Service Selection:** ClusterIP is optimal for internal access scenarios. Implement LoadBalancer or NodePort for external access without ingress configuration.
:::

### LoadBalancer Service Configuration

```yaml
service:
  enabled: true
  type: LoadBalancer
  port: 5678
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-internal: "true"
```

:::warning
**Cost Considerations:** LoadBalancer services may incur additional costs in cloud environments. Consider ingress implementation for cost optimization.
:::

## Ingress Configuration

:::warning
**Security Implementation:** Always implement HTTPS in production environments. Configure TLS certificates and security headers appropriately for enhanced protection.
:::

### Standard Ingress Configuration

This configuration sets up a basic Ingress for n8n using the NGINX Ingress controller, with TLS enabled for secure communication.

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: n8n.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: n8n-tls
      hosts:
        - n8n.yourdomain.com
```

:::danger
**TLS Security Requirement:** Never expose n8n without TLS in production environments. Implement cert-manager or similar solutions for automated certificate management.
:::

### Multi-Host Ingress Configuration

For enhanced security and access control, you can configure separate hosts for the n8n UI and API. This approach allows for granular management of traffic.

```yaml
ingress:
  enabled: true
  className: nginx
  hosts:
    - host: n8n.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
    - host: n8n-api.yourdomain.com
      paths:
        - path: /api
          pathType: Prefix
```

:::tip
**Host Separation Strategy:** Implement separate API and UI hosts for enhanced security posture and granular access control.
:::

### Webhook Subdomain Ingress Configuration

You can configure webhook endpoints with or without SSL, depending on your needs. Below are examples for both scenarios.

:::tip
Ensure the correct certificate secret is defined in the `ingress.tls` section when using SSL for webhook endpoints.
:::

#### Without SSL

```yaml
ingress:
  enabled: true
  hosts:
    - host: n8n.yourdomain.com
      paths:
        - path: /
          pathType: Prefix

webhook:
  ...
  url: "http://webhook.yourdomain.com"
  ...
```

#### With SSL

```yaml
ingress:
  enabled: true
  hosts:
    - host: n8n.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: n8n-tls
      hosts:
        - n8n.yourdomain.com
        - webhook.yourdomain.com

webhook:
  ...
  url: "https://webhook.yourdomain.com"
  ...
```

### Different Webhook Domain Ingress Configuration

For setups using different domains for n8n and webhooks, you can configure Ingress accordingly. Below are examples with and without SSL.

:::tip
When using SSL, verify that the certificate secret in `ingress.tls` matches the correct hostnames.
:::

#### Without SSL

```yaml
ingress:
  enabled: true
  hosts:
    - host: n8n.firstdomain.local
      paths:
        - path: /
          pathType: Prefix

webhook:
  ...
  url: "http://webhook.seconddomain.com"
  ...
```

#### With SSL

```yaml
ingress:
  enabled: true
  hosts:
    - host: n8n.firstdomain.local
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: n8n-tls
      hosts:
        - n8n.firstdomain.local
        - webhook.seconddomain.com

webhook:
  ...
  url: "https://webhook.seconddomain.com"
  ...
```

### Queue Mode Advanced Endpoints

:::info
**Advanced Endpoint Capabilities:** Queue mode with PostgreSQL database enables sophisticated endpoints for MCP and Form functionality.
:::

#### MCP (Model Context Protocol) Endpoints

When implementing queue mode with PostgreSQL, the following MCP endpoints are automatically configured:

- `/mcp/` — Main MCP endpoint for AI assistants, LLMs, and tool clients
- `/mcp-test/` — Test endpoint for MCP
- **MCP Webhook Service** — Dedicated deployment for MCP traffic (enabled when `webhook.count` bigger than 1 or `webhook.autoscaling.enabled=true` or `webhook.allNodes=true`)

##### Example values.yaml for MCP

```yaml
webhook:
  mode: queue
  url: "https://webhook.yourdomain.com"
  count: 2
  mcp:
    enabled: true
    # Customize resources, affinity, env, etc. under webhook.mcp
```

##### MCP Client Integration (Claude Desktop, Cursor, etc.)

Set the following in your client (Claude Desktop, Cursor, etc.):

```json
{
  "mcpServers": {
    "command": "npx",
    "args": [
      "-y",
      "supergateway",
      "--sse",
      "https://webhook.myhost/mcp/ab123c45-d678-9d0e-fg1a-2345bcd6ef7g"
    ]
  }
}
```

With header authentication:

```json
{
  "mcpServers": {
    "command": "npx",
    "args": [
      "-y",
      "supergateway",
      "--sse",
      "https://webhook.myhost/mcp/ab123c45-d678-9d0e-fg1a-2345bcd6ef7g",
      "--header",
      "mykey:myvalue"
    ]
  }
}
```

:::tip
**MCP Scaling:**
- Customize resources, affinity, and environment variables under `webhook.mcp`.
:::

#### Form Endpoints

Queue mode also provides dedicated form endpoints for interactive web form generation:

```yaml
webhook:
  mode: queue
  url: "https://n8n.yourdomain.com"

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: n8n.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
        # Form endpoints are automatically added when webhook.mode=queue
        # - path: /form/
        # - path: /form-test/
        # - path: /form-waiting/
```

**Available Form Endpoints:**
- `/form/` - Main form submission endpoint
- `/form-test/` - Testing endpoint for forms
- `/form-waiting/` - Endpoint for form waiting workflows

:::warning
**Queue Mode Required:** MCP and Form endpoints are only available when `webhook.mode=queue` and `db.type=postgresdb` are configured.
:::

#### Endpoint Routing

In queue mode, different endpoints are routed to appropriate node types:

- **Main Node**: Handles UI, API, and test endpoints (`/mcp-test/`, `/form-test/`)
- **Webhook Nodes**: Process webhook, form, and MCP endpoints (`/webhook/`, `/form/`, `/mcp/`)
- **Worker Nodes**: Execute workflows triggered by any endpoint

:::info
**Load Distribution:** This routing ensures optimal performance by directing traffic to the appropriate node types based on the request type.
:::

## Resources and Scaling

:::tip
**Resource Planning:** Monitor your n8n usage and adjust resources accordingly. Start with conservative limits and scale up as needed.
:::

### Main Node Resources

```yaml
main:
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 1000m
      memory: 1Gi
```

:::warning
**Resource Limits:** Set appropriate limits to prevent resource exhaustion and ensure stable performance.
:::

### Worker Node Resources

```yaml
worker:
  mode: queue
  count: 3
  concurrency: 10
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 2000m
      memory: 2Gi
```

:::info
**Worker Scaling:** Worker nodes handle workflow execution. Allocate more resources to workers for better performance.
:::

### Autoscaling

```yaml
worker:
  mode: queue
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
    metrics:
      - type: Resource
        resource:
          name: memory
          target:
            type: Utilization
            averageUtilization: 80
      - type: Resource
        resource:
          name: cpu
          target:
            type: Utilization
            averageUtilization: 80
```

:::tip
**Autoscaling Strategy:** Use autoscaling for dynamic workloads. Monitor scaling behavior and adjust thresholds as needed.
:::

## Pod Affinity and Anti-Affinity

:::tip
**Advanced Scheduling:** Pod affinity and anti-affinity rules allow you to control where n8n pods are scheduled based on node labels, pod labels, and other criteria.
:::

:::warning
**Deprecation Notice:** The top-level `affinity` field is deprecated. Use the specific affinity configurations under `main`, `worker`, and `webhook` blocks instead.
:::

### Main Node Affinity

Configure affinity rules for the main n8n node to control its placement:

```yaml
main:
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
              - n8n
          topologyKey: kubernetes.io/hostname
```

### Worker Node Affinity

Configure affinity rules for worker nodes to optimize their distribution:

```yaml
worker:
  mode: queue
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app.kubernetes.io/name: n8n
            app.kubernetes.io/component: worker
        topologyKey: kubernetes.io/hostname
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: node-role.kubernetes.io/worker
            operator: Exists
```

### Webhook Node Affinity

Configure affinity rules for webhook nodes to ensure proper distribution:

```yaml
webhook:
  mode: queue
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app.kubernetes.io/name: n8n
            app.kubernetes.io/component: webhook
        topologyKey: kubernetes.io/hostname
```

### Common Affinity Patterns

#### Spread Pods Across Nodes

```yaml
# Spread worker pods across different nodes
worker:
  mode: queue
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app.kubernetes.io/name: n8n
            app.kubernetes.io/component: worker
        topologyKey: kubernetes.io/hostname
```

#### Zone Distribution

```yaml
# Distribute pods across availability zones
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
```

## Persistence Configuration

:::info
**Persistence:** Configure persistent storage for each node type independently. Persistence is used to store workflows, configuration, and npm packages. Configure independently from hostAliases.
:::

### Main Node Persistence Example
```yaml
main:
  persistence:
    enabled: true
    volumeName: "n8n-main-data"
    mountPath: "/home/node/.n8n"
    size: 8Gi
    accessMode: ReadWriteOnce
    storageClass: "fast-ssd"
    annotations:
      helm.sh/resource-policy: keep
```

### Worker Node Persistence Example
```yaml
worker:
  mode: queue
  persistence:
    enabled: true
    volumeName: "n8n-worker-data"
    mountPath: "/home/node/.n8n"
    size: 5Gi
    accessMode: ReadWriteMany  # For autoscaling
    storageClass: "fast-ssd"
```

---

## Host Aliases Configuration

:::info
**Host Aliases:** Host aliases provide custom DNS mappings for all node types. Configure hostAliases independently from persistence settings.
:::

### Main Node Host Aliases Example
```yaml
main:
  hostAliases:
    - ip: "127.0.0.1"
      hostnames:
        - "foo.local"
        - "bar.local"
    - ip: "10.1.2.3"
      hostnames:
        - "internal-api.local"
        - "database.local"
```

### Worker Node Host Aliases Example
```yaml
worker:
  mode: queue
  hostAliases:
    - ip: "192.168.1.100"
      hostnames:
        - "worker-api.local"
    - ip: "10.0.0.50"
      hostnames:
        - "redis.local"
        - "postgres.local"
```

### Webhook Node Host Aliases Example
```yaml
webhook:
  mode: queue
  hostAliases:
    - ip: "10.0.0.50"
      hostnames:
        - "webhook-service.local"
    - ip: "172.16.0.10"
      hostnames:
        - "external-api.local"
```

:::tip
**Separation of Concerns:** Persistence and hostAliases are configured independently and can be used together or separately as needed.
:::

## Environment Variables

:::info
**Environment Variables:** Configure environment variables for all node types to customize behavior and integrate with external systems.
:::

## Database Configuration

:::warning
**Production Database:** Use PostgreSQL for production deployments. SQLite is suitable only for development and testing.
:::

:::info
**Cloud Databases:** For AWS RDS/Aurora, Azure Database for PostgreSQL, or Google Cloud SQL, see [Database Setup](./database-setup.md) for cloud-specific instructions.
:::

### SQLite (Default)

```yaml
db:
  type: sqlite
  sqlite:
    database: database.sqlite
    poolSize: 0
    vacuum: false
```

:::danger
**SQLite Limitations:** SQLite is not suitable for production. It lacks concurrent access support and can cause data corruption under load.
:::

### Bitnami's PostgreSQL Chart Configuration

```yaml
db:
  type: postgresdb

postgresql:
  enabled: true
  auth:
    database: n8n
    username: n8n
    password: your-secure-password
  primary:
    persistence:
      enabled: true
      size: 10Gi
```

:::tip
**PostgreSQL Benefits:** PostgreSQL provides better performance, concurrent access, and supports all n8n features including queue mode.
:::

### External PostgreSQL Configuration

```yaml
db:
  type: postgresdb

externalPostgresql:
  host: your-postgres-host
  port: 5432
  database: n8n
  username: n8n
  password: your-secure-password
  existingSecret: postgres-secret  # Optional: use existing secret
```

:::info
**External Database:** Use external databases for better resource isolation and management flexibility.
:::

## Queue Mode Configuration

:::info
**Queue Mode Benefits:** Queue mode enables distributed execution, better resource utilization, and improved reliability.
:::

### Bitnami's Redis Chart Configuration

```yaml
redis:
  enabled: true
  architecture: standalone
  auth:
    enabled: true
    password: your-redis-password
```

:::warning
**Redis Security:** Always enable Redis authentication in production environments.
:::

### External Redis Configuration

```yaml
externalRedis:
  host: your-redis-host
  port: 6379
  username: default
  password: your-redis-password
  existingSecret: redis-secret  # Optional: use existing secret
```

:::tip
**Redis Planning:** Ensure Redis has sufficient memory and persistence configuration for your workload.
:::

### Worker Configuration

```yaml
worker:
  mode: queue
  count: 3
  concurrency: 10
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
```

:::info
**Worker Tuning:** Adjust worker count and concurrency based on your workflow complexity and resource availability.
:::

### Webhook Configuration

```yaml
webhook:
  mode: queue
  count: 2
  url: https://webhook.yourdomain.com
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 5
```

:::tip
**Webhook Scaling:** Dedicated webhook nodes improve performance for high-volume webhook processing.
:::

## Storage Configuration

:::info
**Storage Strategy:** Choose storage options based on your data persistence and performance requirements.
:::

### Binary Data Storage

```yaml
binaryData:
  mode: default  # default, filesystem, s3
  localStoragePath: /n8n/data
```

:::warning
**Data Persistence:** Default mode stores data in memory and will be lost on pod restart. Use filesystem or S3 for persistence.
:::

### S3 Storage

:::warning
**Enterprise License:** Enterprise n8n license required for s3 binary data storage capability.
:::

```yaml
binaryData:
  mode: s3
  s3:
    host: s3.amazonaws.com
    bucketName: n8n-binary-data
    bucketRegion: us-east-1
    accessKey: your-access-key
    accessSecret: your-secret-key
    existingSecret: s3-secret  # Optional: use existing secret
```

:::tip
**S3 Benefits:** S3 storage provides scalability, durability, and enables team collaboration.
:::

### MinIO Integration

```yaml
minio:
  enabled: true
  rootUser: minioadmin
  rootPassword: minioadmin
  buckets:
    - name: n8n-bucket
      policy: none
```

:::info
**Self-Hosted Storage:** MinIO provides S3-compatible storage for on-premises deployments.
:::

## Node Configuration

:::info
**Node Management:** Configure npm package installation and built-in module access for enhanced workflow capabilities.
:::

### External npm Packages

```yaml
nodes:
  external:
    allowAll: false
    packages:
      - "moment@2.29.4"
      - "lodash@4.17.21"
    reinstallMissingPackages: true
```

:::warning
**Package Security:** Only install trusted npm packages. Review packages for security vulnerabilities before installation.
:::

### Built-in Modules

```yaml
nodes:
  builtin:
    enabled: true
    modules:
      - crypto
      - fs
      - path
```

:::tip
**Module Access:** Enable built-in modules to enhance Code node capabilities while maintaining security.
:::

### Private npm Registry

```yaml
npmRegistry:
  enabled: true
  url: https://your-registry.com
  secretName: npm-registry-secret
  secretKey: npmrc
```

:::info
**Private Registry:** Use private registries for internal packages and enhanced security.
:::

## Monitoring Configuration

:::tip
**Observability:** Enable monitoring to track n8n performance, identify issues, and optimize resource usage.
:::

### ServiceMonitor

```yaml
serviceMonitor:
  enabled: true
  interval: 30s
  labels:
    release: prometheus
  include:
    defaultMetrics: true
    apiEndpoints: true
    queueMetrics: true
```

:::info
**Prometheus Integration:** ServiceMonitor enables automatic metric collection by Prometheus Operator.
:::

### Metrics Configuration

```yaml
serviceMonitor:
  metricsPrefix: n8n_
  include:
    defaultMetrics: true
    apiEndpoints: true
    apiMethodLabel: true
    apiPathLabel: true
    apiStatusCodeLabel: true
    cacheMetrics: true
    credentialTypeLabel: true
    messageEventBusMetrics: true
    nodeTypeLabel: true
    queueMetrics: true
    workflowIdLabel: true
```

:::tip
**Metric Granularity:** Enable specific metrics based on your monitoring needs and resource constraints.
:::

## Security Configuration

:::warning
**Security Best Practices:** Implement these security measures to protect your n8n deployment.
:::

### Security Context

UID `1000` and GID `1000` default node user and group IDs.

```yaml
securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
  readOnlyRootFilesystem: false
  runAsNonRoot: true
  runAsUser: 1000
  runAsGroup: 1000

podSecurityContext:
  fsGroup: 1000
  fsGroupChangePolicy: OnRootMismatch
```

:::danger
**Security Context:** Always run containers as non-root users and drop unnecessary capabilities.
:::

### RBAC Configuration

```yaml
serviceAccount:
  create: true
  automount: true
  annotations: {}
  name: ""
```

:::tip
**RBAC Best Practices:** Use dedicated service accounts and implement least-privilege access policies.
:::

### Encryption Key

```yaml
encryptionKey: your-32-character-encryption-key
existingEncryptionKeySecret: n8n-encryption-key
```

:::warning
**Encryption Security:** Use strong encryption keys and store them securely in Kubernetes secrets.
:::

## Task Runners

:::info
**Task Runner Modes:** Choose between internal and external task runners based on your security and performance requirements.
:::

### Internal Task Runners

```yaml
taskRunners:
  mode: internal
  maxConcurrency: 5
  taskTimeout: 60
  taskHeartbeatInterval: 30
```

:::tip
**Internal Runners:** Internal task runners are simpler to configure and suitable for most use cases.
:::

### External Task Runners

```yaml
taskRunners:
  mode: external
  broker:
    address: 127.0.0.1
    port: 5679
  external:
    port: 5680
    autoShutdownTimeout: 15
    resources:
      requests:
        cpu: 100m
        memory: 32Mi
      limits:
        cpu: 2000m
        memory: 512Mi
```

:::warning
**Enterprise Feature:** External task runners require n8n Enterprise license.
:::

:::danger
**License Requirement:** Verify your n8n Enterprise license before enabling external task runners.
:::

## Workflow History

:::info
**History Management:** Configure workflow history to track changes and enable rollback capabilities.
:::

### History Configuration

```yaml
workflowHistory:
  enabled: true
  pruneTime: 336  # in hours (14 days)
```

:::tip
**History Retention:** Set appropriate retention periods to balance storage usage with audit requirements.
:::

## API Configuration

:::info
**API Access:** Configure the public API for external integrations and automation.
:::

### Public API

```yaml
api:
  enabled: true
  path: api
  swagger:
    enabled: true
```

:::warning
**API Security:** Secure API access with proper authentication and authorization mechanisms.
:::

## Diagnostics and Telemetry

:::note
**Telemetry Configuration:** Configure diagnostics and telemetry based on your privacy and monitoring requirements.
:::

### Diagnostics

```yaml
diagnostics:
  enabled: false
  frontendConfig: "1zPn9bgWPzlQc0p8Gj1uiK6DOTn;https://telemetry.n8n.io"
  backendConfig: "1zPn7YoGC3ZXE9zLeTKLuQCB4F6;https://telemetry.n8n.io"
```

:::tip
**Privacy Control:** Disable diagnostics if you prefer not to share usage data with n8n.
:::

### Sentry Integration

```yaml
sentry:
  enabled: true
  backendDsn: your-backend-dsn
  frontendDsn: your-frontend-dsn
  externalTaskRunnersDsn: your-external-runners-dsn
```

:::info
**Error Tracking:** Sentry integration helps track and resolve application errors in production environments.
:::

## DNS Configuration

:::info
**DNS Settings:** Configure DNS policies and settings for advanced networking requirements.
:::

### DNS Policy

```yaml
dnsPolicy: ClusterFirst
```

### DNS Config

```yaml
dnsConfig:
  nameservers:
    - 8.8.8.8
    - 8.8.4.4
  searches:
    - your-domain.com
  options:
    - name: ndots
      value: "2"
```

:::tip
**DNS Optimization:** Configure DNS settings for better network performance and reliability.
:::

## Best Practices

:::tip
**Production Recommendations:** Follow these best practices for secure and reliable n8n deployments.
:::

### Security Checklist

- [ ] Enable authentication
- [ ] Use TLS certificates
- [ ] Configure RBAC policies
- [ ] Set resource limits
- [ ] Use secrets for sensitive data
- [ ] Enable monitoring
- [ ] Regular backups

### Performance Optimization

- [ ] Use PostgreSQL for production
- [ ] Enable queue mode for high workloads
- [ ] Configure appropriate resource limits
- [ ] Use S3 storage for binary data
- [ ] Monitor and tune autoscaling

:::warning
**Regular Maintenance:** Perform regular updates, security patches, and performance monitoring.
:::

## Troubleshooting

:::info
**Common Issues:** This section covers frequently encountered configuration problems and solutions.
:::

### Configuration Validation

```bash
# Validate Helm values
helm template my-n8n community-charts/n8n -f values.yaml --dry-run

# Check for configuration errors
helm lint my-n8n community-charts/n8n -f values.yaml
```

### Common Configuration Issues

1. **Resource Limits Too Low**: Increase CPU/memory limits
2. **Database Connection Issues**: Verify database credentials and connectivity
3. **Storage Problems**: Check PVC status and permissions
4. **Ingress Issues**: Verify ingress controller and TLS configuration

:::tip
**Debug Commands:** Use these commands to validate and troubleshoot configuration issues.
:::

## Next Steps

:::tip
**Configuration Guide:** Follow these guides to implement specific features and configurations.
:::

- [Database Setup](./database-setup.md) - PostgreSQL and external database configuration
- [Queue Mode Setup](./queue-mode.md) - Distributed execution with Redis
- [Storage Configuration](./storage.md) - Binary data storage options
- [Monitoring Setup](./monitoring.md) - Metrics and observability
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions

:::info
**Advanced Configuration:** Explore advanced features like external task runners, custom nodes, and enterprise integrations.
:::

:::tip
**Cloud Redis:** For managed Redis on GCP, AWS, or Azure, see [Cloud Redis Setup](./cloud-redis.md).
:::
