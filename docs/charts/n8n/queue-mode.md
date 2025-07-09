---
id: queue-mode
title: n8n Queue Mode Setup
sidebar_label: Queue Mode
sidebar_position: 5
description: Complete guide to setting up n8n in queue mode for distributed execution with Redis, worker nodes, and webhook nodes
keywords: [n8n, queue mode, redis, worker, worker nodes, webhook, webhook nodes, distributed execution, scalability]
---

# n8n Queue Mode Setup

Queue mode enables distributed execution in n8n by separating the main node (UI/API) from worker nodes (execution) and webhook nodes (webhook processing). This architecture provides better scalability, reliability, and performance for production workloads.

:::tip
**Production Architecture:** Queue mode is the recommended architecture for production deployments. It provides better scalability, reliability, and performance compared to single-node deployments.
:::

## Architecture Overview

:::info
**Distributed Execution:** Queue mode separates concerns by dedicating specific nodes to different tasks, improving overall system performance and reliability.
:::

### Queue Mode Components

```mermaid
architecture-beta
  group k8s(cloud)[Kubernetes Cluster]

  service ui(internet)[Editor Access]
  service request(internet)[Webhook Request]

  service main(server)[Main Node] in k8s
  service worker(server)[Worker Nodes] in k8s
  service webhook(server)[Webhook Nodes] in k8s

  service db(database)[PostgreSQL DB]
  service queue(database)[Redis Queue]

  junction junctionCenter in k8s
  junction junctionLeft in k8s
  junction junctionRight in k8s
  junction junctionBottom

  ui:R --> L:main
  request:L --> R:webhook
  main:B -- T:junctionLeft
  junctionLeft:R -- L:junctionCenter
  worker:B -- T:junctionCenter
  webhook:B -- T:junctionRight
  junctionRight:L -- R:junctionCenter
  junctionCenter:B -- T:junctionBottom
  junctionBottom:L --> R:db
  junctionBottom:R --> L:queue
```

### Component Roles

- **Main Node**: Handles UI, API requests, workflow management
- **Worker Nodes**: Execute workflows and process tasks
- **Webhook Nodes**: Process incoming webhook requests
- **Redis**: Message broker for communication between nodes

## Queue Mode Endpoints

:::info
**Enhanced Endpoints:** Queue mode supports additional endpoints for advanced workflow automation and AI integration capabilities.
:::

### MCP (Model Context Protocol) Endpoints

Queue mode includes support for MCP (Model Context Protocol) endpoints, enabling n8n to act as an MCP server for AI model integration:

- **MCP Endpoint**: `https://yourdomain.com/mcp/` - Main MCP server endpoint
- **MCP Test Endpoint**: `https://yourdomain.com/mcp-test/` - Testing endpoint for MCP functionality

:::tip
**AI Integration:** MCP endpoints allow AI models and assistants to interact with n8n workflows through the Model Context Protocol, enabling advanced AI-powered automation scenarios.
:::

#### MCP Server Trigger Node

The MCP Server Trigger node allows n8n to expose workflows as tools to MCP clients:

- **Server-Sent Events (SSE)**: Supports long-lived connections for real-time communication
- **Streamable HTTP**: Alternative transport method for MCP communication
- **Authentication**: Bearer token and header-based authentication support
- **Tool Integration**: Connect workflows with AI assistants and language models

:::warning
**MCP Requirements:** MCP endpoints require PostgreSQL database and queue mode configuration. They are not available in single-node deployments with SQLite.
:::

#### MCP Configuration Example

```yaml
# Enable MCP endpoints in queue mode
webhook:
  mode: queue
  url: "https://yourdomain.com"
  count: 2
  mcp:
    enabled: true
    # You can add extra env vars, affinity, resources, etc. under webhook.mcp

ingress:
  enabled: true
  hosts:
    - host: yourdomain.com
      paths:
        - path: /
          pathType: Prefix
```

### MCP Client Integration (Claude Desktop, Cursor, etc.)

[Supergateway](https://github.com/supercorp-ai/supergateway) runs MCP stdio-based servers over SSE (Server-Sent Events) with one command. Please download your MCP client ([Claude Desktop](https://claude.ai/download), [Cursor](https://cursor.com/downloads), etc.) and apply the following configuration from client settings.

:::tip
`https://webhook.myhost/mcp/ab123c45-d678-9d0e-fg1a-2345bcd6ef7g` url must be replaced with your `MCP Server Trigger Production URL`.
:::

#### Basic MCP Client Settings

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

#### With Header Authentication

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

- You can set these in Claude Desktop, Cursor, or any compatible MCP client.
- Header authentication is supported for secure access.

:::info
**Authentication:**
- Use `--header` to pass custom authentication headers (e.g., API keys, tokens).
- You can also use Bearer tokens if your n8n instance is configured for it.
:::

:::info
**MCP Documentation:** For detailed MCP setup and usage, see the [official n8n MCP documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.mcptrigger/).
:::

### Form Endpoints

Queue mode supports dedicated form endpoints for the n8n Form Trigger node:

- **Form Endpoint**: `https://yourdomain.com/form/` - Main form submission endpoint
- **Form Test Endpoint**: `https://yourdomain.com/form-test/` - Testing endpoint for forms
- **Form Waiting Endpoint**: `https://yourdomain.com/form-waiting/` - Endpoint for form waiting workflows

:::tip
**Form Automation:** Form endpoints enable the creation of interactive forms that can trigger n8n workflows, allowing users to submit data through web forms.
:::

#### Form Trigger Node

The Form Trigger node creates web forms that can:

- **Collect User Input**: Gather data through customizable web forms
- **Trigger Workflows**: Automatically start workflows when forms are submitted
- **Data Processing**: Process form submissions and route data to other nodes
- **User Experience**: Provide a user-friendly interface for workflow interaction

#### Form Configuration Example

```yaml
# Enable form endpoints in queue mode
webhook:
  mode: queue
  url: "https://yourdomain.com"
  count: 2

ingress:
  enabled: true
  hosts:
    - host: yourdomain.com
      paths:
        - path: /
          pathType: Prefix
```

:::info
**Form Documentation:** For detailed form setup and usage, see the [official n8n Form Trigger documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.formtrigger/).
:::

### Endpoint Routing

In queue mode, different endpoints are routed to appropriate nodes:

- **Main Node**: Handles UI, API, and test endpoints
- **Webhook Nodes**: Process webhook, form, and MCP endpoints
- **Worker Nodes**: Execute workflows triggered by any endpoint

:::tip
**Load Distribution:** This routing ensures optimal performance by directing traffic to the appropriate node types based on the request type.
:::

## Prerequisites

:::warning
**Requirements:** Queue mode requires PostgreSQL and Redis. SQLite is not supported for queue mode deployments.
:::

### Required Components

1. **PostgreSQL Database** (required for queue mode)
2. **Redis Instance** (message broker)
3. **Kubernetes Cluster** with sufficient resources
4. **Storage Class** for persistent volumes

### Resource Requirements

- **Main Node**: 100m CPU, 128Mi memory minimum
- **Worker Nodes**: 500m CPU, 512Mi memory minimum per node
- **Webhook Nodes**: 100m CPU, 128Mi memory minimum per node
- **Redis**: 100m CPU, 128Mi memory minimum

## Basic Queue Mode Setup

:::note
**Getting Started:** Start with a basic queue mode setup and scale up as needed based on your workload requirements.
:::

### 1. Enable PostgreSQL

```yaml
db:
  type: postgresdb

postgresql:
  enabled: true
  auth:
    username: n8n
    password: your-secure-password
    database: n8n
  primary:
    persistence:
      enabled: true
      size: 10Gi
```

### 2. Enable Redis

```yaml
redis:
  enabled: true
  architecture: standalone
  master:
    persistence:
      enabled: true
      size: 5Gi
```

### 3. Configure Worker Nodes

```yaml
worker:
  mode: queue
  count: 2
  concurrency: 10
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 2000m
      memory: 2Gi
```

### 4. Configure Webhook Nodes

```yaml
webhook:
  mode: queue
  url: "https://webhook.yourdomain.com"
  count: 2
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 512m
      memory: 512Mi
```

### 5. Complete Basic Configuration

```yaml
# Basic queue mode setup
db:
  type: postgresdb

postgresql:
  enabled: true
  auth:
    username: n8n
    password: your-secure-password
    database: n8n
  primary:
    persistence:
      enabled: true
      size: 10Gi

redis:
  enabled: true
  architecture: standalone
  master:
    persistence:
      enabled: true
      size: 5Gi

worker:
  mode: queue
  count: 2
  concurrency: 10
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
  count: 2
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 512m
      memory: 512Mi

ingress:
  enabled: true
  hosts:
    - host: n8n.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
```

## Advanced Queue Mode Configuration

:::tip
**Scaling Strategy:** Use autoscaling for dynamic workloads and manual scaling for predictable, steady-state workloads.
:::

### Autoscaling Workers (HPA)

Worker nodes execute workflows and process tasks from the Redis queue. Autoscaling worker pods ensures optimal performance during high workflow execution periods while reducing resource costs during low activity.

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
    behavior:
      scaleDown:
        stabilizationWindowSeconds: 300
        policies:
        - type: Percent
          value: 100
          periodSeconds: 15
      scaleUp:
        stabilizationWindowSeconds: 0
        policies:
        - type: Percent
          value: 100
          periodSeconds: 15
        - type: Pods
          value: 4
          periodSeconds: 15
        selectPolicy: Max
```

:::info
**Worker Autoscaling:** Horizontal Pod Autoscaler (HPA) automatically scales worker pods based on CPU and memory utilization metrics. Workers handle workflow execution, so scaling them ensures optimal performance during high workload periods while reducing costs during low activity. The behavior configuration controls scaling aggressiveness and stabilization periods.
:::

### Autoscaling Webhooks (HPA)

Webhook nodes handle incoming webhook requests and form submissions. Autoscaling webhook pods ensures optimal performance during high webhook traffic while reducing resource usage during low activity periods.

```yaml
webhook:
  mode: queue
  url: "https://webhook.yourdomain.com"
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
      - type: Pods
        pods:
          metric:
            name: packets-per-second
          target:
            type: AverageValue
            averageValue: 1k
```

:::info
**Webhook Autoscaling:** Horizontal Pod Autoscaler (HPA) automatically scales webhook pods based on CPU utilization and network traffic metrics. Webhook nodes are lightweight and handle HTTP requests, making them ideal for autoscaling based on incoming traffic patterns.
:::

### Deploy on All Nodes

```yaml
worker:
  mode: queue
  allNodes: true  # Deploy one worker per node
  autoscaling:
    enabled: false  # Disable autoscaling when using allNodes

webhook:
  mode: queue
  url: "https://webhook.yourdomain.com"
  allNodes: true  # Deploy one webhook per node
  autoscaling:
    enabled: false  # Disable autoscaling when using allNodes
```

## Persistence in Queue Mode

:::info
**Persistence:** Configure persistent storage for main and worker nodes independently. Persistence is used to store workflows, configuration, and npm packages. Configure independently from hostAliases.
:::

### Main Node Persistence Example
```yaml
main:
  count: 1
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
  count: 3
  persistence:
    enabled: true
    volumeName: "n8n-worker-data"
    mountPath: "/home/node/.n8n"
    size: 5Gi
    accessMode: ReadWriteOnce
```

:::warning
**Autoscaling Limitations:** Worker nodes with `ReadWriteOnce` persistence cannot use autoscaling. Use `ReadWriteMany` for autoscaling or `ReadWriteOnce` with StatefulSets for fixed scaling.
:::

### Worker Persistence with Autoscaling
```yaml
worker:
  mode: queue
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
  persistence:
    enabled: true
    volumeName: "n8n-worker-data"
    mountPath: "/home/node/.n8n"
    size: 5Gi
    accessMode: ReadWriteMany  # For autoscaling
    storageClass: "fast-ssd"
```

### Worker Persistence with StatefulSet
```yaml
worker:
  mode: queue
  count: 3
  persistence:
    enabled: true
    mountPath: "/home/node/.n8n"
    size: 5Gi
    accessMode: ReadWriteOnce
```

:::info
**Automatic StatefulSet:** When persistence is enabled with `ReadWriteOnce` access mode, the chart automatically deploys worker nodes as StatefulSets. Each pod gets its own persistent volume with a unique name.
:::

## Resource Management

### Pod Affinity and Anti-Affinity

:::tip
**Advanced Scheduling:** Use affinity rules to control pod placement and optimize resource utilization in queue mode deployments.
:::

:::warning
**Deprecation Notice:** The top-level `affinity` field is deprecated. Use the specific affinity configurations under `main`, `worker`, and `webhook` blocks instead.
:::

#### Spread Worker Pods Across Nodes

```yaml
worker:
  mode: queue
  count: 3
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app.kubernetes.io/name: n8n
            app.kubernetes.io/component: worker
        topologyKey: kubernetes.io/hostname
```

#### Spread Webhook Pods Across Zones

```yaml
webhook:
  mode: queue
  url: "https://webhook.yourdomain.com"
  count: 2
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: n8n
              app.kubernetes.io/component: webhook
          topologyKey: topology.kubernetes.io/zone
```

#### Co-locate Main and Worker Pods

```yaml
main:
  affinity:
    podAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: n8n
          topologyKey: kubernetes.io/hostname

worker:
  mode: queue
  affinity:
    podAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: n8n
              app.kubernetes.io/component: main
          topologyKey: kubernetes.io/hostname
```

#### Node Affinity for Specific Node Types

```yaml
worker:
  mode: queue
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: node-type
            operator: In
            values:
            - compute-optimized
          - key: kubernetes.io/os
            operator: In
            values:
            - linux

webhook:
  mode: queue
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: node-role.kubernetes.io/worker
            operator: Exists
```

:::info
**Affinity Benefits:** Proper affinity configuration improves availability, resource utilization, and performance in queue mode deployments.
:::

### External Redis Configuration

```yaml
# Disable built-in Redis
redis:
  enabled: false

# Configure external Redis
externalRedis:
  host: your-redis-host.com
  port: 6379
  username: default
  password: your-redis-password
  existingSecret: redis-secret  # Use Kubernetes secret
```

### High Availability Redis

```yaml
redis:
  enabled: true
  architecture: replication  # Master-slave replication

  master:
    persistence:
      enabled: true
      size: 10Gi
    resources:
      requests:
        cpu: 100m
        memory: 256Mi
      limits:
        cpu: 500m
        memory: 512Mi

  replica:
    replicaCount: 2
    persistence:
      enabled: true
      size: 10Gi
    resources:
      requests:
        cpu: 100m
        memory: 256Mi
      limits:
        cpu: 500m
        memory: 512Mi
```

## Production Queue Mode Examples

### Small Production Setup

```yaml
# Small production (2-5 users)
db:
  type: postgresdb

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
  count: 3
  concurrency: 10
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
  count: 2
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 512m
      memory: 512Mi

ingress:
  enabled: true
  hosts:
    - host: n8n.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
```

### Medium Production Setup

```yaml
# Medium production (5-20 users)
db:
  type: postgresdb

postgresql:
  enabled: true
  auth:
    username: n8n
    password: your-secure-password
    database: n8n
  primary:
    persistence:
      enabled: true
      size: 50Gi
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 2000m
        memory: 4Gi

redis:
  enabled: true
  architecture: replication
  master:
    persistence:
      enabled: true
      size: 20Gi
    resources:
      requests:
        cpu: 200m
        memory: 512Mi
      limits:
        cpu: 1000m
        memory: 1Gi
  replica:
    replicaCount: 2
    persistence:
      enabled: true
      size: 20Gi

worker:
  mode: queue
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 15
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
  resources:
    requests:
      cpu: 1000m
      memory: 1Gi
    limits:
      cpu: 4000m
      memory: 4Gi

webhook:
  mode: queue
  url: "https://webhook.yourdomain.com"
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 10
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 1Gi

ingress:
  enabled: true
  hosts:
    - host: n8n.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
```

### Large Production Setup

```yaml
# Large production (20+ users)
db:
  type: postgresdb

externalPostgresql:
  host: your-postgres-host.com
  port: 5432
  username: n8n
  password: your-secure-password
  database: n8n
  existingSecret: postgres-secret

externalRedis:
  host: your-redis-host.com
  port: 6379
  password: your-redis-password
  existingSecret: redis-secret

worker:
  mode: queue
  autoscaling:
    enabled: true
    minReplicas: 5
    maxReplicas: 50
    metrics:
      - type: Resource
        resource:
          name: memory
          target:
            type: Utilization
            averageUtilization: 70
      - type: Resource
        resource:
          name: cpu
          target:
            type: Utilization
            averageUtilization: 70
      - type: Pods
        pods:
          metric:
            name: executions-per-second
          target:
            type: AverageValue
            averageValue: 100
  resources:
    requests:
      cpu: 2000m
      memory: 2Gi
    limits:
      cpu: 8000m
      memory: 8Gi

webhook:
  mode: queue
  url: "https://webhook.yourdomain.com"
  autoscaling:
    enabled: true
    minReplicas: 5
    maxReplicas: 20
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 2000m
      memory: 2Gi

ingress:
  enabled: true
  hosts:
    - host: n8n.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
```

## Monitoring and Observability

### ServiceMonitor Configuration

```yaml
serviceMonitor:
  enabled: true
  interval: 30s
  timeout: 10s
  labels:
    release: prometheus
  include:
    defaultMetrics: true
    cacheMetrics: true
    messageEventBusMetrics: true
    queueMetrics: true
    workflowIdLabel: true
    nodeTypeLabel: true
```

### Logging Configuration

```yaml
log:
  level: info
  output:
    - console
  scopes:
    - concurrency
    - pubsub
    - redis
    - scaling
    - waiting-executions
```

### Health Checks

```yaml
main:
  livenessProbe:
    httpGet:
      path: /healthz
      port: http
    initialDelaySeconds: 30
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 3

  readinessProbe:
    httpGet:
      path: /healthz/readiness
      port: http
    initialDelaySeconds: 5
    periodSeconds: 5
    timeoutSeconds: 3
    failureThreshold: 3

worker:
  livenessProbe:
    httpGet:
      path: /healthz
      port: http
    initialDelaySeconds: 30
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 3

  readinessProbe:
    httpGet:
      path: /healthz/readiness
      port: http
    initialDelaySeconds: 5
    periodSeconds: 5
    timeoutSeconds: 3
    failureThreshold: 3

webhook:
  livenessProbe:
    httpGet:
      path: /healthz
      port: http
    initialDelaySeconds: 30
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 3

  readinessProbe:
    httpGet:
      path: /healthz/readiness
      port: http
    initialDelaySeconds: 5
    periodSeconds: 5
    timeoutSeconds: 3
    failureThreshold: 3
```

## Troubleshooting

### Common Issues

#### Redis Connection Issues

```bash
# Check Redis pod status
kubectl get pods -l app.kubernetes.io/name=redis

# Check Redis logs
kubectl logs -l app.kubernetes.io/name=redis

# Test Redis connection
kubectl exec -it <redis-pod> -- redis-cli ping
```

#### Worker Node Issues

```bash
# Check worker pod status
kubectl get pods -l app.kubernetes.io/component=worker

# Check worker logs
kubectl logs -l app.kubernetes.io/component=worker

# Check worker metrics
kubectl top pods -l app.kubernetes.io/component=worker
```

#### Webhook Node Issues

```bash
# Check webhook pod status
kubectl get pods -l app.kubernetes.io/component=webhook

# Check webhook logs
kubectl logs -l app.kubernetes.io/component=webhook

# Test webhook endpoint
curl -X POST https://webhook.yourdomain.com/webhook-test/18ca0dba-fd0f-415a-abb5-8fb65d10653b/webhook
```

### Performance Optimization

#### Worker Concurrency Tuning

```yaml
worker:
  mode: queue
  concurrency: 5  # Start with lower value, increase based on performance
  resources:
    requests:
      cpu: 1000m
      memory: 1Gi
    limits:
      cpu: 4000m
      memory: 4Gi
```

#### Redis Performance

```yaml
redis:
  enabled: true
  architecture: replication
  master:
    persistence:
      enabled: true
      size: 20Gi
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 2000m
        memory: 2Gi
    configuration: |
      maxmemory 1gb
      maxmemory-policy allkeys-lru
      save 900 1
      save 300 10
      save 60 10000
```

#### Database Performance

```yaml
db:
  type: postgresdb
  logging:
    enabled: true
    options: error
    maxQueryExecutionTime: 1000

postgresql:
  enabled: true
  primary:
    configuration: |
      shared_buffers = 256MB
      effective_cache_size = 1GB
      maintenance_work_mem = 64MB
      checkpoint_completion_target = 0.9
      wal_buffers = 16MB
      default_statistics_target = 100
      random_page_cost = 1.1
      effective_io_concurrency = 200
      work_mem = 4MB
      min_wal_size = 1GB
      max_wal_size = 4GB
```

## Best Practices

### Scaling
- Start with 2-3 worker nodes and scale based on demand
- Use autoscaling for variable workloads
- Monitor CPU and memory usage for scaling decisions
- Consider deploying workers on all nodes for high availability

### Performance
- Use PostgreSQL for production workloads
- Configure appropriate Redis memory limits
- Monitor queue depths and processing times
- Tune worker concurrency based on workload

### Reliability
- Use Redis replication for high availability
- Configure proper health checks and probes
- Set up monitoring and alerting
- Use persistent storage for databases and Redis

### Security
- Use Kubernetes secrets for sensitive data
- Enable network policies to restrict communication
- Use HTTPS for webhook endpoints
- Regularly update Redis and PostgreSQL versions

## Next Steps

- [Usage Guide](./usage.md) - Quick start and basic deployment
- [Configuration Guide](./configuration.md) - Detailed configuration options
- [Database Setup](./database-setup.md) - PostgreSQL and external database configuration
- [Storage Configuration](./storage.md) - Binary data storage options
- [Monitoring Setup](./monitoring.md) - Metrics and observability
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
