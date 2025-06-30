---
id: monitoring
title: n8n Monitoring Setup
sidebar_label: Monitoring
sidebar_position: 7
description: Complete guide to setting up monitoring and observability for n8n including Prometheus metrics, logging, health checks, and alerting
keywords: [n8n, monitoring, prometheus, metrics, logging, health checks, alerting, observability]
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

#### Queue Mode Endpoint Metrics
- **MCP Endpoints**: Monitor `/mcp/` and `/mcp-test/` endpoint performance
- **Form Endpoints**: Monitor `/form/`, `/form-test/`, and `/form-waiting/` endpoint performance
- **Webhook Endpoints**: Monitor `/webhook/` and `/webhook-test/` endpoint performance

:::tip
**Endpoint Monitoring:** In queue mode, different endpoints are handled by different node types. Monitor webhook nodes for MCP and Form endpoint performance.
:::

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

:::info
**Dashboard Templates:** These dashboard examples are based on actual n8n metrics and can be imported directly into Grafana. Customize them based on your specific monitoring needs.
:::

### Comprehensive n8n Dashboard

```json
{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": "-- Grafana --",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "target": {
          "limit": 100,
          "matchAny": false,
          "tags": [],
          "type": "dashboard"
        },
        "type": "dashboard"
      }
    ]
  },
  "description": "n8n prometheus client basic metrics",
  "editable": true,
  "fiscalYearStartMonth": 0,
  "gnetId": 11159,
  "graphTooltip": 0,
  "iteration": 1750529070188,
  "links": [],
  "liveNow": false,
  "panels": [
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 7,
        "w": 9,
        "x": 0,
        "y": 0
      },
      "hiddenSeries": false,
      "id": 6,
      "legend": {
        "alignAsTable": true,
        "avg": true,
        "current": true,
        "max": true,
        "min": true,
        "show": true,
        "total": false,
        "values": true
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null",
      "options": {
        "alertThreshold": true
      },
      "paceLength": 10,
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "exemplar": true,
          "expr": "irate(n8n_process_cpu_user_seconds_total{instance=~\"$instance\"}[2m]) * 100",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "User CPU - {{instance}}",
          "refId": "A"
        },
        {
          "exemplar": true,
          "expr": "irate(n8n_process_cpu_system_seconds_total{instance=~\"$instance\"}[2m]) * 100",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "Sys CPU - {{instance}}",
          "refId": "B"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Process CPU Usage",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "percent",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    },
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 7,
        "w": 8,
        "x": 9,
        "y": 0
      },
      "hiddenSeries": false,
      "id": 8,
      "legend": {
        "alignAsTable": true,
        "avg": true,
        "current": true,
        "max": true,
        "min": true,
        "show": true,
        "total": false,
        "values": true
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null",
      "options": {
        "alertThreshold": true
      },
      "paceLength": 10,
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "exemplar": true,
          "expr": "n8n_nodejs_eventloop_lag_seconds{instance=~\"$instance\"}",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "{{role}}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Event Loop Lag",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "s",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    },
    {
      "datasource": "prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "thresholds"
          },
          "decimals": 0,
          "mappings": [],
          "noValue": "0",
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          },
          "unit": "none"
        },
        "overrides": []
      },
      "gridPos": {
        "h": 7,
        "w": 3,
        "x": 17,
        "y": 0
      },
      "id": 14,
      "options": {
        "colorMode": "value",
        "graphMode": "none",
        "justifyMode": "auto",
        "orientation": "auto",
        "reduceOptions": {
          "calcs": [
            "last"
          ],
          "fields": "",
          "values": false
        },
        "text": {},
        "textMode": "value"
      },
      "pluginVersion": "8.2.7",
      "targets": [
        {
          "exemplar": true,
          "expr": "sum(increase(n8n_scaling_mode_queue_jobs_completed[1w]))",
          "interval": "",
          "legendFormat": "",
          "refId": "A"
        }
      ],
      "title": "Last Week Completed Jobs",
      "type": "stat"
    },
    {
      "cacheTimeout": null,
      "datasource": "prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "thresholds"
          },
          "mappings": [
            {
              "options": {
                "match": "null",
                "result": {
                  "text": "N/A"
                }
              },
              "type": "special"
            }
          ],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          },
          "unit": "none"
        },
        "overrides": []
      },
      "gridPos": {
        "h": 3,
        "w": 4,
        "x": 20,
        "y": 0
      },
      "id": 2,
      "interval": "",
      "links": [],
      "maxDataPoints": 100,
      "options": {
        "colorMode": "none",
        "graphMode": "none",
        "justifyMode": "auto",
        "orientation": "horizontal",
        "reduceOptions": {
          "calcs": [
            "lastNotNull"
          ],
          "fields": "",
          "values": false
        },
        "text": {},
        "textMode": "name"
      },
      "pluginVersion": "8.2.7",
      "targets": [
        {
          "exemplar": true,
          "expr": "sum(n8n_nodejs_version_info{instance=~\"$instance\"}) by (version)",
          "format": "time_series",
          "instant": false,
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "{{version}}",
          "refId": "A"
        }
      ],
      "timeFrom": null,
      "timeShift": null,
      "title": "Node.js Version",
      "type": "stat"
    },
    {
      "cacheTimeout": null,
      "datasource": "prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "fixedColor": "#F2495C",
            "mode": "fixed"
          },
          "mappings": [
            {
              "options": {
                "match": "null",
                "result": {
                  "text": "N/A"
                }
              },
              "type": "special"
            }
          ],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          },
          "unit": "none"
        },
        "overrides": []
      },
      "gridPos": {
        "h": 4,
        "w": 4,
        "x": 20,
        "y": 3
      },
      "id": 4,
      "interval": null,
      "links": [],
      "maxDataPoints": 100,
      "options": {
        "colorMode": "none",
        "graphMode": "none",
        "justifyMode": "auto",
        "orientation": "horizontal",
        "reduceOptions": {
          "calcs": [
            "lastNotNull"
          ],
          "fields": "",
          "values": false
        },
        "text": {},
        "textMode": "name"
      },
      "pluginVersion": "8.2.7",
      "targets": [
        {
          "exemplar": true,
          "expr": "sum(n8n_version_info{instance=~\"$instance\"}) by (version)",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "{{version}}",
          "refId": "A"
        }
      ],
      "timeFrom": null,
      "timeShift": null,
      "title": "n8n version",
      "type": "stat"
    },
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 7,
        "w": 16,
        "x": 0,
        "y": 7
      },
      "hiddenSeries": false,
      "id": 7,
      "legend": {
        "alignAsTable": true,
        "avg": true,
        "current": true,
        "max": true,
        "min": true,
        "rightSide": true,
        "show": true,
        "total": false,
        "values": true
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null",
      "options": {
        "alertThreshold": true
      },
      "paceLength": 10,
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "exemplar": true,
          "expr": "n8n_process_resident_memory_bytes{instance=~\"$instance\"}",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "Process Memory - {{role}}",
          "refId": "A"
        },
        {
          "exemplar": true,
          "expr": "n8n_nodejs_heap_size_total_bytes{instance=~\"$instance\"}",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "Heap Total - {{role}}",
          "refId": "B"
        },
        {
          "exemplar": true,
          "expr": "n8n_nodejs_heap_size_used_bytes{instance=~\"$instance\"}",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "Heap Used - {{role}}",
          "refId": "C"
        },
        {
          "exemplar": true,
          "expr": "n8n_nodejs_external_memory_bytes{instance=~\"$instance\"}",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "External Memory - {{role}}",
          "refId": "D"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Process Memory Usage",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "bytes",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    },
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 7,
        "w": 8,
        "x": 16,
        "y": 7
      },
      "hiddenSeries": false,
      "id": 9,
      "legend": {
        "alignAsTable": true,
        "avg": true,
        "current": true,
        "max": true,
        "min": true,
        "show": true,
        "total": false,
        "values": true
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null",
      "options": {
        "alertThreshold": true
      },
      "paceLength": 10,
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "exemplar": true,
          "expr": "n8n_nodejs_active_handles_total{instance=~\"$instance\"}",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "Active Handler - {{role}}",
          "refId": "A"
        },
        {
          "exemplar": true,
          "expr": "n8n_nodejs_active_requests_total{instance=~\"$instance\"}",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "Active Request - {{role}}",
          "refId": "B"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Active Handlers/Requests Total",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    },
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 8,
        "w": 8,
        "x": 0,
        "y": 14
      },
      "hiddenSeries": false,
      "id": 10,
      "legend": {
        "alignAsTable": true,
        "avg": true,
        "current": true,
        "max": true,
        "min": true,
        "rightSide": false,
        "show": true,
        "total": false,
        "values": true
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null",
      "options": {
        "alertThreshold": true
      },
      "paceLength": 10,
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "exemplar": true,
          "expr": "n8n_nodejs_heap_space_size_total_bytes{instance=~\"$instance\"}",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "Heap Total - {{role}} - {{space}}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Heap Total Detail",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "bytes",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    },
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 8,
        "w": 8,
        "x": 8,
        "y": 14
      },
      "hiddenSeries": false,
      "id": 11,
      "legend": {
        "alignAsTable": true,
        "avg": true,
        "current": true,
        "max": true,
        "min": true,
        "rightSide": false,
        "show": true,
        "total": false,
        "values": true
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null",
      "options": {
        "alertThreshold": true
      },
      "paceLength": 10,
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "exemplar": true,
          "expr": "n8n_nodejs_heap_space_size_used_bytes{instance=~\"$instance\"}",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "Heap Used - {{role}} - {{space}}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Heap Used Detail",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "bytes",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    },
    {
      "aliasColors": {},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": "prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 8,
        "w": 8,
        "x": 16,
        "y": 14
      },
      "hiddenSeries": false,
      "id": 12,
      "legend": {
        "alignAsTable": true,
        "avg": true,
        "current": true,
        "max": true,
        "min": true,
        "rightSide": false,
        "show": true,
        "total": false,
        "values": true
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null",
      "options": {
        "alertThreshold": true
      },
      "paceLength": 10,
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 2,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "exemplar": true,
          "expr": "n8n_nodejs_heap_space_size_available_bytes{instance=~\"$instance\"}",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "Heap Used - {{role}} - {{space}}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Heap Available Detail",
      "tooltip": {
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": {
        "buckets": null,
        "mode": "time",
        "name": null,
        "show": true,
        "values": []
      },
      "yaxes": [
        {
          "format": "bytes",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        }
      ],
      "yaxis": {
        "align": false,
        "alignLevel": null
      }
    }
  ],
  "refresh": "30s",
  "schemaVersion": 32,
  "style": "dark",
  "tags": [
    "n8n"
  ],
  "templating": {
    "list": [
      {
        "allValue": null,
        "current": {
          "selected": true,
          "text": [
            "All"
          ],
          "value": [
            "$__all"
          ]
        },
        "datasource": "prometheus",
        "definition": "label_values(n8n_nodejs_version_info, instance)",
        "description": null,
        "error": null,
        "hide": 0,
        "includeAll": true,
        "label": "instance",
        "multi": true,
        "name": "instance",
        "options": [],
        "query": {
          "query": "label_values(n8n_nodejs_version_info, instance)",
          "refId": "StandardVariableQuery"
        },
        "refresh": 1,
        "regex": "",
        "skipUrlSync": false,
        "sort": 1,
        "tagValuesQuery": "",
        "tagsQuery": "",
        "type": "query",
        "useTags": false
      }
    ]
  },
  "time": {
    "from": "now-1h",
    "to": "now"
  },
  "timepicker": {
    "refresh_intervals": [
      "5s",
      "10s",
      "30s",
      "1m",
      "5m",
      "15m",
      "30m",
      "1h",
      "2h",
      "1d"
    ],
    "time_options": [
      "5m",
      "15m",
      "1h",
      "6h",
      "12h",
      "24h",
      "2d",
      "7d",
      "30d"
    ]
  },
  "timezone": "browser",
  "title": "N8N Application Dashboard",
  "uid": "PTSqcpJWk",
  "version": 1
}
```

### Enhanced Prometheus Queries

:::tip
**Query Optimization:** These queries are optimized for production use and include proper rate calculations and aggregations.
:::

#### System Performance Queries

```promql
# CPU Usage (per instance)
irate(n8n_process_cpu_user_seconds_total{instance=~"$instance"}[2m]) * 100

# Memory Usage (per instance)
n8n_process_resident_memory_bytes{instance=~"$instance"}

# Event Loop Lag (critical for performance)
n8n_nodejs_eventloop_lag_seconds{instance=~"$instance"}

# Active Handles and Requests
n8n_nodejs_active_handles_total{instance=~"$instance"}
n8n_nodejs_active_requests_total{instance=~"$instance"}
```

#### Workflow Execution Queries

```promql
# Execution Rate (per instance)
rate(n8n_execution_total{instance=~"$instance"}[5m])

# Success Rate (per instance)
(
  rate(n8n_execution_total{instance=~"$instance"}[5m]) -
  rate(n8n_execution_failed_total{instance=~"$instance"}[5m])
) / rate(n8n_execution_total{instance=~"$instance"}[5m]) * 100

# Execution Duration Percentiles
histogram_quantile(0.50, rate(n8n_execution_duration_seconds_bucket{instance=~"$instance"}[5m]))
histogram_quantile(0.95, rate(n8n_execution_duration_seconds_bucket{instance=~"$instance"}[5m]))
histogram_quantile(0.99, rate(n8n_execution_duration_seconds_bucket{instance=~"$instance"}[5m]))

# Error Rate
rate(n8n_execution_failed_total{instance=~"$instance"}[5m])
```

#### Queue Mode Queries

```promql
# Queue Depth by Status
n8n_queue_bull_queue_waiting{instance=~"$instance"}
n8n_queue_bull_queue_active{instance=~"$instance"}
n8n_queue_bull_queue_delayed{instance=~"$instance"}

# Queue Processing Rate
rate(n8n_queue_bull_queue_completed{instance=~"$instance"}[5m])
rate(n8n_queue_bull_queue_failed{instance=~"$instance"}[5m])

# Worker Utilization
n8n_queue_bull_queue_active{role="worker"} /
(n8n_queue_bull_queue_waiting{role="worker"} + n8n_queue_bull_queue_active{role="worker"}) * 100

# Queue Stuck Detection
n8n_queue_bull_queue_active{instance=~"$instance"} > 0 and
rate(n8n_queue_bull_queue_completed{instance=~"$instance"}[5m]) == 0
```

#### API Performance Queries

```promql
# API Request Rate
rate(n8n_api_requests_total{instance=~"$instance"}[5m])

# API Response Time Percentiles
histogram_quantile(0.50, rate(n8n_api_request_duration_seconds_bucket{instance=~"$instance"}[5m]))
histogram_quantile(0.95, rate(n8n_api_request_duration_seconds_bucket{instance=~"$instance"}[5m]))

# API Error Rate
rate(n8n_api_requests_failed_total{instance=~"$instance"}[5m])
```

#### Memory and Heap Queries

```promql
# Heap Memory Usage
n8n_nodejs_heap_size_used_bytes{instance=~"$instance"}
n8n_nodejs_heap_size_total_bytes{instance=~"$instance"}

# Heap Space Details
n8n_nodejs_heap_space_size_used_bytes{instance=~"$instance"}
n8n_nodejs_heap_space_size_available_bytes{instance=~"$instance"}

# External Memory
n8n_nodejs_external_memory_bytes{instance=~"$instance"}
```

#### Advanced Analytics Queries

```promql
# Execution Trends (hourly)
increase(n8n_execution_total{instance=~"$instance"}[1h])

# Success Rate Trends (hourly)
(
  increase(n8n_execution_total{instance=~"$instance"}[1h]) -
  increase(n8n_execution_failed_total{instance=~"$instance"}[1h])
) / increase(n8n_execution_total{instance=~"$instance"}[1h]) * 100

# Queue Processing Efficiency
rate(n8n_queue_bull_queue_completed{instance=~"$instance"}[5m]) /
(n8n_queue_bull_queue_waiting{instance=~"$instance"} + n8n_queue_bull_queue_active{instance=~"$instance"})

# Resource Utilization Score
(
  irate(n8n_process_cpu_user_seconds_total{instance=~"$instance"}[2m]) * 100 +
  (n8n_process_resident_memory_bytes{instance=~"$instance"} /
   n8n_nodejs_heap_size_total_bytes{instance=~"$instance"}) * 100
) / 2
```

:::warning
**Query Performance:** Use appropriate time ranges and consider using recording rules for complex queries that are frequently executed.
:::

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

## Pod Affinity and Anti-Affinity

:::tip
**Monitoring Affinity:** Proper affinity configuration can improve monitoring performance and reliability by ensuring pods are distributed optimally across your cluster.
:::

:::warning
**Deprecation Notice:** The top-level `affinity` field is deprecated. Use the specific affinity configurations under `main`, `worker`, and `webhook` blocks instead.
:::

### Affinity for Monitoring Optimization

#### Spread Monitoring Pods

```yaml
# Spread pods to avoid monitoring bottlenecks
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

#### Zone Distribution for High Availability

```yaml
# Distribute pods across availability zones for monitoring resilience
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

#### Node Affinity for Monitoring Nodes

```yaml
# Place pods on nodes with monitoring capabilities
main:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: monitoring-enabled
            operator: In
            values:
            - "true"

worker:
  mode: queue
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: monitoring-enabled
            operator: In
            values:
            - "true"
```

:::info
**Monitoring Benefits:** Proper affinity configuration ensures that monitoring data collection is distributed across your cluster, preventing bottlenecks and improving overall monitoring performance.
:::

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

## Next Steps

- [Usage Guide](./usage.md) - Quick start and basic deployment
- [Configuration Guide](./configuration.md) - Detailed configuration options
- [Database Setup](./database-setup.md) - PostgreSQL and external database configuration
- [Queue Mode Setup](./queue-mode.md) - Distributed execution with Redis
- [Storage Configuration](./storage.md) - Binary data storage options
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
