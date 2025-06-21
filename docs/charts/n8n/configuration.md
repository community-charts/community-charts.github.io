---
id: configuration
title: "n8n Configuration Guide"
sidebar_label: "Configuration"
sidebar_position: 2
description: "Complete configuration reference for the n8n Helm chart with examples and best practices"
keywords: ["n8n", "configuration", "helm", "values", "settings", "options"]
---

# n8n Configuration Guide

This guide covers all configuration options available in the n8n Helm chart, organized by category with examples and best practices.

:::info
**Configuration Reference:** This guide provides comprehensive coverage of all available configuration options. Use the table of contents to navigate to specific sections.
:::

## Table of Contents

- [Image Configuration](#image-configuration)
- [Service Configuration](#service-configuration)
- [Ingress Configuration](#ingress-configuration)
- [Resources and Scaling](#resources-and-scaling)
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
**Image Selection:** Choose the appropriate image tag for your environment. Use specific versions for production stability.
:::

### Basic Image Settings

```yaml
image:
  repository: n8nio/n8n
  tag: "1.0.0"  # Specify version or leave empty for appVersion
  pullPolicy: IfNotPresent
```

### Private Registry

```yaml
image:
  repository: your-registry.com/n8nio/n8n
  tag: "1.0.0"
  pullPolicy: Always

imagePullSecrets:
  - name: registry-secret
```

## Service Configuration

:::note
**Service Types:** Choose the service type based on your networking requirements and infrastructure.
:::

### Basic Service

```yaml
service:
  type: ClusterIP
  port: 5678
  name: http
  annotations: {}
```

### LoadBalancer Service

```yaml
service:
  type: LoadBalancer
  port: 5678
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-internal: "true"
```

## Ingress Configuration

:::warning
**Security:** Always use HTTPS in production. Configure TLS certificates and security headers appropriately.
:::

### Basic Ingress

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

### Multiple Hosts

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
          name: cpu
          target:
            type: Utilization
            averageUtilization: 80
      - type: Resource
        resource:
          name: memory
          target:
            type: Utilization
            averageUtilization: 80
```

## Database Configuration

:::warning
**Production Database:** Use PostgreSQL for production deployments. SQLite is suitable only for development and testing.
:::

### SQLite (Default)

```yaml
db:
  type: sqlite
  sqlite:
    database: "database.sqlite"
    poolSize: 0
    vacuum: false
```

### PostgreSQL with Bitnami

```yaml
db:
  type: postgresdb
  logging:
    enabled: true
    options: error
    maxQueryExecutionTime: 1000

postgresql:
  enabled: true
  architecture: standalone
  auth:
    username: n8n
    password: your-secure-password
    database: n8n
  primary:
    persistence:
      enabled: true
      size: 10Gi
```

### External PostgreSQL

```yaml
db:
  type: postgresdb

externalPostgresql:
  host: your-postgres-host.com
  port: 5432
  username: n8n
  password: your-secure-password
  database: n8n
  existingSecret: postgres-secret  # Optional: use Kubernetes secret
```

## Queue Mode Configuration

### Redis Setup

```yaml
redis:
  enabled: true
  architecture: standalone
  master:
    persistence:
      enabled: true
      size: 5Gi

# Or use external Redis
externalRedis:
  host: your-redis-host.com
  port: 6379
  password: your-redis-password
  existingSecret: redis-secret  # Optional: use Kubernetes secret
```

### Worker Configuration

```yaml
worker:
  mode: queue
  count: 3
  concurrency: 10
  allNodes: false  # Set to true to deploy one worker per node
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
```

### Webhook Configuration

```yaml
webhook:
  mode: queue
  url: "https://webhook.yourdomain.com"
  count: 2
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 5
```

## Storage Configuration

### Default (In-Memory)

```yaml
binaryData:
  mode: "default"
```

### Filesystem Storage

```yaml
binaryData:
  mode: "filesystem"
  localStoragePath: "/data/n8n"
```

### S3-Compatible Storage

```yaml
binaryData:
  mode: "s3"
  s3:
    host: s3.amazonaws.com
    bucketName: n8n-binary-data
    bucketRegion: us-east-1
    accessKey: your-access-key
    accessSecret: your-secret-key
    existingSecret: s3-credentials  # Optional: use Kubernetes secret
```

### MinIO Integration

```yaml
binaryData:
  mode: "s3"
  s3:
    host: minio.yourdomain.com
    bucketName: n8n-bucket
    bucketRegion: us-east-1
    accessKey: n8n-user
    accessSecret: your-secret-key

minio:
  enabled: true
  mode: standalone
  rootUser: minioadmin
  rootPassword: minioadmin123
  persistence:
    enabled: true
    size: 20Gi
  buckets:
    - name: n8n-bucket
      policy: none
      versioning: false
```

## Node Configuration

:::tip
**🎯 Unique Feature:** This chart provides **exceptional npm package installation capabilities** that set it apart from other n8n Helm charts. You can install custom npm packages and community nodes directly in main and worker pods, making it the most flexible n8n deployment option available.
:::

### Built-in Node Modules

```yaml
nodes:
  builtin:
    enabled: true
    modules:
      - crypto
      - fs
      - http
      - https
      - querystring
      - url
```

:::note
**Security Consideration:** Only enable the built-in modules you actually need. This reduces the attack surface of your Code nodes.
:::

### External npm Packages

```yaml
nodes:
  external:
    allowAll: false
    reinstallMissingPackages: true
    packages:
      - "moment@2.29.4"
      - "lodash@4.17.21"
      - "n8n-nodes-python@0.1.4"
```

:::warning
**Package Security:** Be cautious with `allowAll: true` as it can install any npm package. Prefer explicit package lists for better security control.
:::

### Private npm Registry

```yaml
npmRegistry:
  enabled: true
  url: "https://npm.yourcompany.com"
  secretName: "npm-registry-secret"
  secretKey: "npmrc"
```

## Monitoring Configuration

:::info
**Observability:** Proper monitoring is crucial for production deployments. Configure metrics and logging based on your infrastructure.
:::

### ServiceMonitor

```yaml
serviceMonitor:
  enabled: true
  interval: 30s
  timeout: 10s
  labels:
    release: prometheus
  include:
    defaultMetrics: true
    cacheMetrics: false
    messageEventBusMetrics: false
    workflowIdLabel: false
    nodeTypeLabel: false
    credentialTypeLabel: false
    apiEndpoints: false
    queueMetrics: true
```

### Logging Configuration

```yaml
log:
  level: info
  output:
    - console
    - file
  scopes:
    - concurrency
    - external-secrets
    - license
    - multi-main-setup
    - pubsub
    - redis
    - scaling
    - waiting-executions
  file:
    location: "logs/n8n.log"
    maxsize: 16
    maxcount: "100"
```

## Security Configuration

:::warning
**Security First:** These settings are crucial for production deployments. Never run containers as root and always use proper security contexts.
:::

### Security Contexts

```yaml
podSecurityContext:
  fsGroup: 1000
  fsGroupChangePolicy: "OnRootMismatch"

securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
  readOnlyRootFilesystem: false
  runAsNonRoot: true
  privileged: false
  runAsUser: 1000
  runAsGroup: 1000
```

### Service Account

```yaml
serviceAccount:
  create: true
  automount: true
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/n8n-role
  name: ""
```

### Encryption Key

```yaml
# Auto-generated on first install (recommended)
encryptionKey: ""

# Or use existing secret
existingEncryptionKeySecret: "n8n-encryption-key"
```

:::danger
**Encryption Key:** Never lose your encryption key! It's used to encrypt sensitive data like credentials. If lost, you cannot decrypt existing data.
:::

## Task Runners

:::tip
**🚀 Exclusive Feature:** This is the **only n8n Helm chart** that supports external task runners, providing enhanced security and performance through isolated execution environments.
:::

### Internal Task Runners (Default)

```yaml
taskRunners:
  mode: internal
  taskTimeout: 60
  taskHeartbeatInterval: 30
  maxConcurrency: 5
```

### External Task Runners

```yaml
taskRunners:
  mode: external
  taskTimeout: 300
  taskHeartbeatInterval: 30
  maxConcurrency: 10
  broker:
    address: "127.0.0.1"
    port: 5679
  external:
    mainNodeAuthToken: "your-auth-token"
    workerNodeAuthToken: "your-auth-token"
    autoShutdownTimeout: 15
    port: 5680
    nodeOptions:
      - "--max-semi-space-size=16"
      - "--max-old-space-size=300"
    resources:
      requests:
        cpu: 100m
        memory: 32Mi
      limits:
        cpu: 2000m
        memory: 512Mi
```

:::warning
**Enterprise Feature:** External task runners require n8n Enterprise license. Make sure you have the appropriate license before enabling this feature.
:::

## Workflow History

```yaml
workflowHistory:
  enabled: true
  pruneTime: 336  # 14 days in hours
```

## API Configuration

```yaml
api:
  enabled: true
  path: api
  swagger:
    enabled: true
```

## Diagnostics and Telemetry

### Sentry Integration

```yaml
sentry:
  enabled: true
  backendDsn: "https://your-sentry-dsn@sentry.io/project"
  frontendDsn: "https://your-sentry-dsn@sentry.io/project"
  externalTaskRunnersDsn: "https://your-sentry-dsn@sentry.io/project"
```

### Diagnostics

```yaml
diagnostics:
  enabled: false  # Set to true for troubleshooting
  frontendConfig: "1zPn9bgWPzlQc0p8Gj1uiK6DOTn;https://telemetry.n8n.io"
  backendConfig: "1zPn7YoGC3ZXE9zLeTKLuQCB4F6;https://telemetry.n8n.io"
  postHog:
    apiKey: "phc_4URIAm1uYfJO7j8kWSe0J8lc8IqnstRLS7Jx8NcakHo"
    apiHost: "https://ph.n8n.io"
```

### Version Notifications

```yaml
versionNotifications:
  enabled: false
  endpoint: "https://api.n8n.io/api/versions/"
  infoUrl: "https://docs.n8n.io/hosting/installation/updating/"
```

## DNS Configuration

```yaml
dnsPolicy: "ClusterFirst"
dnsConfig:
  nameservers:
    - 8.8.8.8
    - 8.8.4.4
  searches:
    - yourdomain.com
  options:
    - name: ndots
      value: "2"
```

## Complete Production Example

```yaml
# Production-ready configuration
image:
  repository: n8nio/n8n
  tag: "1.0.0"
  pullPolicy: IfNotPresent

db:
  type: postgresdb
  logging:
    enabled: true
    options: error
    maxQueryExecutionTime: 1000

postgresql:
  enabled: true
  auth:
    username: n8n
    password: your-secure-password
    database: n8n
  primary:
    persistence:
      enabled: true
      size: 20Gi

redis:
  enabled: true
  architecture: standalone
  master:
    persistence:
      enabled: true
      size: 10Gi

worker:
  mode: queue
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 2000m
      memory: 2Gi

webhook:
  mode: queue
  url: "https://webhook.yourdomain.com"
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 5

binaryData:
  mode: "s3"
  s3:
    host: s3.amazonaws.com
    bucketName: n8n-binary-data
    bucketRegion: us-east-1
    accessKey: your-access-key
    accessSecret: your-secret-key

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

serviceMonitor:
  enabled: true
  interval: 30s
  labels:
    release: prometheus

log:
  level: info
  output:
    - console
  scopes:
    - concurrency
    - redis
    - scaling

encryptionKey: ""  # Auto-generated
timezone: "UTC"
defaultLocale: en
gracefulShutdownTimeout: 30
```

## Best Practices

### Security
- Always use strong passwords for databases
- Enable RBAC and use dedicated service accounts
- Use Kubernetes secrets for sensitive data
- Enable security contexts
- Use HTTPS with valid certificates

### Performance
- Use PostgreSQL for production workloads
- Enable Redis for queue mode
- Configure appropriate resource limits
- Use autoscaling for variable workloads
- Monitor and tune database performance

### Reliability
- Use persistent storage for databases
- Configure health checks and probes
- Set up proper backup strategies
- Use multiple replicas for high availability
- Monitor application metrics

### Maintenance
- Keep n8n updated regularly
- Monitor resource usage
- Review and rotate secrets
- Clean up old workflow history
- Monitor logs for issues

## Next Steps

- [Usage Guide](./usage.md) - Quick start and basic deployment
- [Database Setup](./database-setup.md) - PostgreSQL and external database configuration
- [Queue Mode Setup](./queue-mode.md) - Distributed execution with Redis
- [Storage Configuration](./storage.md) - Binary data storage options
- [Monitoring Setup](./monitoring.md) - Metrics and observability
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
