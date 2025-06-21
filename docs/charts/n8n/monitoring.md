---
id: monitoring
title: "n8n Monitoring Setup"
sidebar_label: "Monitoring"
sidebar_position: 6
description: "Complete guide to setting up monitoring and observability for n8n including Prometheus metrics, logging, health checks, and alerting"
keywords: ["n8n", "monitoring", "prometheus", "metrics", "logging", "health checks", "alerting", "observability"]
---

# n8n Monitoring Setup

Comprehensive monitoring and observability are essential for production n8n deployments. This guide covers all monitoring options including Prometheus metrics, logging, health checks, and alerting.

:::info
**Production Monitoring:** Proper monitoring is crucial for production deployments. It helps you identify issues early, track performance, and ensure system reliability.
:::

## Monitoring Overview

:::tip
**Monitoring Strategy:** Implement monitoring at multiple levels: application metrics, infrastructure metrics, and business metrics for comprehensive observability.
:::

### Available Metrics
- **Application Metrics**: Workflow executions, API calls, performance
- **Queue Metrics**: Job processing, queue depths, worker utilization
- **System Metrics**: CPU, memory, disk usage
- **Custom Metrics**: Business-specific KPIs

### Monitoring Components
- **Prometheus**: Metrics collection and storage
- **ServiceMonitor**: Kubernetes-native monitoring
- **Logging**: Structured logging with configurable levels
- **Health Checks**: Liveness and readiness probes
- **Alerting**: Prometheus alerting rules

## Prometheus Metrics Configuration

:::note
**Prometheus Operator:** This guide assumes you have Prometheus Operator installed. If not, you'll need to set up Prometheus separately.
:::

### Basic ServiceMonitor Setup

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
    queueMetrics: false
```

### Advanced ServiceMonitor Configuration

```yaml
serviceMonitor:
  enabled: true
  namespace: monitoring
  interval: 15s
  timeout: 10s
  labels:
    release: prometheus
    team: platform
  targetLabels:
    - app.kubernetes.io/name
    - app.kubernetes.io/instance
  metricRelabelings:
    - sourceLabels: [prometheus_replica]
      regex: (.*)
      targetLabel: another_prometheus_replica
      action: replace
  include:
    defaultMetrics: true
    cacheMetrics: true
    messageEventBusMetrics: true
    workflowIdLabel: true
    nodeTypeLabel: true
    credentialTypeLabel: true
    apiEndpoints: true
    apiPathLabel: true
    apiMethodLabel: true
    apiStatusCodeLabel: true
    queueMetrics: true
```

:::warning
**Metric Volume:** Be cautious with enabling all metrics in high-traffic environments as it can increase Prometheus storage requirements and query latency.
:::

### Available Metrics

#### Default Metrics
- `n8n_execution_total` - Total workflow executions
- `n8n_execution_duration_seconds` - Execution duration histogram
- `n8n_execution_failed_total` - Failed executions
- `n8n_workflow_total` - Total workflows
- `n8n_credential_total` - Total credentials
- `n8n_node_total` - Total nodes

#### Queue Metrics (Queue Mode)
- `n8n_queue_bull_queue_waiting` - Jobs waiting in queue
- `n8n_queue_bull_queue_active` - Active jobs
- `n8n_queue_bull_queue_completed` - Completed jobs
- `n8n_queue_bull_queue_failed` - Failed jobs
- `n8n_queue_bull_queue_delayed` - Delayed jobs

#### API Metrics
- `n8n_api_requests_total` - Total API requests
- `n8n_api_request_duration_seconds` - API request duration
- `n8n_api_requests_failed_total` - Failed API requests

#### Cache Metrics
- `n8n_cache_hits_total` - Cache hits
- `n8n_cache_misses_total` - Cache misses
- `n8n_cache_size_bytes` - Cache size

### Prometheus Queries

:::tip
**Query Optimization:** Use appropriate time ranges and aggregation functions to optimize query performance in Prometheus.
:::

#### Basic Queries

```promql
# Execution rate (executions per second)
rate(n8n_execution_total[5m])

# Average execution duration
histogram_quantile(0.95, rate(n8n_execution_duration_seconds_bucket[5m]))

# Error rate
rate(n8n_execution_failed_total[5m])

# Queue depth (queue mode)
n8n_queue_bull_queue_waiting

# API request rate
rate(n8n_api_requests_total[5m])
```

#### Advanced Queries

```promql
# Success rate
(
  rate(n8n_execution_total[5m]) - rate(n8n_execution_failed_total[5m])
) / rate(n8n_execution_total[5m]) * 100

# 95th percentile execution time
histogram_quantile(0.95, rate(n8n_execution_duration_seconds_bucket[5m]))

# Queue utilization (queue mode)
n8n_queue_bull_queue_active / (n8n_queue_bull_queue_waiting + n8n_queue_bull_queue_active) * 100

# Cache hit ratio
rate(n8n_cache_hits_total[5m]) / (rate(n8n_cache_hits_total[5m]) + rate(n8n_cache_misses_total[5m])) * 100
```

## Logging Configuration

:::info
**Log Management:** Configure appropriate log levels and outputs based on your environment. Use structured logging for better log analysis.
:::

### Basic Logging

```yaml
log:
  level: info
  output:
    - console
  scopes: []
```

### Advanced Logging

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

### Structured Logging

```yaml
log:
  level: info
  output:
    - console
  scopes:
    - concurrency
    - redis
    - scaling

# Enable structured logging
main:
  extraEnvVars:
    N8N_LOG_FORMAT: "json"
    N8N_LOG_LEVEL: "info"
```

### Log Aggregation

```yaml
# Configure log forwarding to external systems
main:
  extraContainers:
    - name: fluentd
      image: fluent/fluentd-kubernetes-daemonset:v1-debian-elasticsearch
      volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
  volumes:
    - name: varlog
      hostPath:
        path: /var/log
    - name: varlibdockercontainers
      hostPath:
        path: /var/lib/docker/containers
```

## Health Checks

### Basic Health Checks

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
```

### Advanced Health Checks

```yaml
main:
  livenessProbe:
    httpGet:
      path: /healthz
      port: http
      httpHeaders:
        - name: X-Custom-Header
          value: health-check
    initialDelaySeconds: 60
    periodSeconds: 30
    timeoutSeconds: 10
    failureThreshold: 3
    successThreshold: 1
  
  readinessProbe:
    httpGet:
      path: /healthz/readiness
      port: http
    initialDelaySeconds: 10
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 3
    successThreshold: 1
  
  startupProbe:
    httpGet:
      path: /healthz
      port: http
    initialDelaySeconds: 30
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 30
```

### Queue Mode Health Checks

```yaml
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
  
  startupProbe:
    exec:
      command: ["/bin/sh", "-c", "ps aux | grep '[n]8n'"]
    initialDelaySeconds: 10
    periodSeconds: 5
    failureThreshold: 30

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

## Alerting Rules

### Basic Alerting Rules

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: n8n-alerts
  namespace: monitoring
  labels:
    release: prometheus
spec:
  groups:
    - name: n8n
      rules:
        - alert: N8NHighErrorRate
          expr: rate(n8n_execution_failed_total[5m]) > 0.1
          for: 2m
          labels:
            severity: warning
          annotations:
            summary: "High n8n execution error rate"
            description: "n8n is experiencing a high error rate of {{ $value }} errors per second"
        
        - alert: N8NHighExecutionTime
          expr: histogram_quantile(0.95, rate(n8n_execution_duration_seconds_bucket[5m])) > 300
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "High n8n execution time"
            description: "95th percentile execution time is {{ $value }} seconds"
        
        - alert: N8NQueueDepth
          expr: n8n_queue_bull_queue_waiting > 100
          for: 2m
          labels:
            severity: warning
          annotations:
            summary: "High n8n queue depth"
            description: "Queue depth is {{ $value }} jobs"
```

### Advanced Alerting Rules

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: n8n-advanced-alerts
  namespace: monitoring
  labels:
    release: prometheus
spec:
  groups:
    - name: n8n.advanced
      rules:
        - alert: N8NLowSuccessRate
          expr: (
            rate(n8n_execution_total[5m]) - rate(n8n_execution_failed_total[5m])
          ) / rate(n8n_execution_total[5m]) < 0.95
          for: 5m
          labels:
            severity: critical
          annotations:
            summary: "Low n8n success rate"
            description: "Success rate is {{ $value | humanizePercentage }}"
        
        - alert: N8NHighMemoryUsage
          expr: (container_memory_usage_bytes{container="n8n"} / container_spec_memory_limit_bytes{container="n8n"}) > 0.8
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "High n8n memory usage"
            description: "Memory usage is {{ $value | humanizePercentage }}"
        
        - alert: N8NHighCPUUsage
          expr: rate(container_cpu_usage_seconds_total{container="n8n"}[5m]) > 0.8
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "High n8n CPU usage"
            description: "CPU usage is {{ $value | humanizePercentage }}"
        
        - alert: N8NQueueStuck
          expr: n8n_queue_bull_queue_active > 0 and rate(n8n_queue_bull_queue_completed[5m]) == 0
          for: 10m
          labels:
            severity: critical
          annotations:
            summary: "n8n queue appears stuck"
            description: "Active jobs: {{ $value }}, no completions in 5m"
        
        - alert: N8NHighAPILatency
          expr: histogram_quantile(0.95, rate(n8n_api_request_duration_seconds_bucket[5m])) > 5
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "High n8n API latency"
            description: "95th percentile API latency is {{ $value }} seconds"
```

## Grafana Dashboards

### Basic Dashboard

```json
{
  "dashboard": {
    "title": "n8n Overview",
    "panels": [
      {
        "title": "Execution Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(n8n_execution_total[5m])",
            "legendFormat": "executions/sec"
          }
        ]
      },
      {
        "title": "Success Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "(
              rate(n8n_execution_total[5m]) - rate(n8n_execution_failed_total[5m])
            ) / rate(n8n_execution_total[5m]) * 100",
            "legendFormat": "success rate"
          }
        ]
      },
      {
        "title": "Execution Duration",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(n8n_execution_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      }
    ]
  }
}
```

### Queue Mode Dashboard

```json
{
  "dashboard": {
    "title": "n8n Queue Mode",
    "panels": [
      {
        "title": "Queue Depth",
        "type": "graph",
        "targets": [
          {
            "expr": "n8n_queue_bull_queue_waiting",
            "legendFormat": "waiting"
          },
          {
            "expr": "n8n_queue_bull_queue_active",
            "legendFormat": "active"
          }
        ]
      },
      {
        "title": "Queue Processing Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(n8n_queue_bull_queue_completed[5m])",
            "legendFormat": "completed/sec"
          }
        ]
      },
      {
        "title": "Worker Utilization",
        "type": "stat",
        "targets": [
          {
            "expr": "n8n_queue_bull_queue_active / (n8n_queue_bull_queue_waiting + n8n_queue_bull_queue_active) * 100",
            "legendFormat": "utilization"
          }
        ]
      }
    ]
  }
}
```

## Sentry Integration

### Basic Sentry Setup

```yaml
sentry:
  enabled: true
  backendDsn: "https://your-sentry-dsn@sentry.io/project"
  frontendDsn: "https://your-sentry-dsn@sentry.io/project"
```

### Advanced Sentry Configuration

```yaml
sentry:
  enabled: true
  backendDsn: "https://your-sentry-dsn@sentry.io/project"
  frontendDsn: "https://your-sentry-dsn@sentry.io/project"
  externalTaskRunnersDsn: "https://your-sentry-dsn@sentry.io/project"

# Add Sentry environment variables
main:
  extraEnvVars:
    N8N_SENTRY_ENVIRONMENT: "production"
    N8N_SENTRY_TRACES_SAMPLE_RATE: "0.1"
    N8N_SENTRY_PROFILES_SAMPLE_RATE: "0.1"
```

## Database Monitoring

### PostgreSQL Monitoring

```yaml
# Enable PostgreSQL metrics
postgresql:
  enabled: true
  metrics:
    enabled: true
    serviceMonitor:
      enabled: true
      interval: 30s
      labels:
        release: prometheus

# Add database monitoring queries
main:
  extraEnvVars:
    N8N_DB_LOGGING_ENABLED: "true"
    N8N_DB_LOGGING_OPTIONS: "error"
    N8N_DB_LOGGING_MAX_QUERY_EXECUTION_TIME: "1000"
```

### Redis Monitoring (Queue Mode)

```yaml
# Enable Redis metrics
redis:
  enabled: true
  metrics:
    enabled: true
    serviceMonitor:
      enabled: true
      interval: 30s
      labels:
        release: prometheus
```

## Storage Monitoring

### S3 Storage Monitoring

```yaml
# Add S3 monitoring
main:
  extraEnvVars:
    N8N_BINARY_DATA_S3_MONITORING_ENABLED: "true"
    N8N_BINARY_DATA_S3_MONITORING_INTERVAL: "300"
```

### Filesystem Storage Monitoring

```yaml
# Monitor filesystem usage
main:
  extraContainers:
    - name: storage-monitor
      image: busybox
      command:
        - /bin/sh
        - -c
        - |
          while true; do
            df -h /data | tail -1 | awk '{print $5}' | sed 's/%//' > /tmp/disk-usage
            sleep 60
          done
      volumeMounts:
        - name: n8n-binary-data
          mountPath: /data
```

## Troubleshooting

### Common Monitoring Issues

#### ServiceMonitor Not Scraping

```bash
# Check ServiceMonitor status
kubectl get servicemonitor -n monitoring

# Check Prometheus targets
kubectl port-forward svc/prometheus-operated 9090:9090 -n monitoring

# Check n8n metrics endpoint
kubectl exec -it <n8n-pod> -- curl -s http://localhost:5678/metrics
```

#### High Memory Usage

```bash
# Check memory usage
kubectl top pods -l app.kubernetes.io/name=n8n

# Check memory limits
kubectl describe pod <n8n-pod>

# Check for memory leaks
kubectl logs <n8n-pod> | grep -i memory
```

#### High CPU Usage

```bash
# Check CPU usage
kubectl top pods -l app.kubernetes.io/name=n8n

# Check for CPU-intensive operations
kubectl logs <n8n-pod> | grep -i cpu

# Check execution metrics
kubectl exec -it <n8n-pod> -- curl -s http://localhost:5678/metrics | grep execution
```

### Performance Optimization

#### Metrics Collection Optimization

```yaml
serviceMonitor:
  enabled: true
  interval: 60s  # Increase interval for high-volume deployments
  timeout: 30s
  include:
    defaultMetrics: true
    cacheMetrics: false  # Disable if not needed
    messageEventBusMetrics: false
    queueMetrics: true
```

#### Logging Optimization

```yaml
log:
  level: warn  # Reduce log level in production
  output:
    - console
  scopes:
    - redis
    - scaling
  file:
    maxsize: 32  # Increase file size
    maxcount: "50"  # Reduce file count
```

## Next Steps

- [Usage Guide](./usage.md) - Quick start and basic deployment
- [Configuration Guide](./configuration.md) - Detailed configuration options
- [Database Setup](./database-setup.md) - PostgreSQL and external database configuration
- [Queue Mode Setup](./queue-mode.md) - Distributed execution with Redis
- [Storage Configuration](./storage.md) - Binary data storage options
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions

## Best Practices

### Monitoring Strategy
- Start with basic metrics and expand gradually
- Use appropriate alert thresholds
- Monitor both application and infrastructure metrics
- Set up dashboards for different user roles
- Regular review and tuning of alerts

### Performance
- Use appropriate scrape intervals
- Filter metrics to reduce cardinality
- Optimize Prometheus queries
- Use recording rules for complex queries
- Monitor monitoring system performance

### Reliability
- Set up monitoring for the monitoring system
- Use multiple alerting channels
- Test alerting rules regularly
- Document alert procedures
- Set up escalation policies

### Security
- Secure Prometheus endpoints
- Use RBAC for monitoring access
- Encrypt sensitive metrics
- Audit monitoring access
- Regular security updates
