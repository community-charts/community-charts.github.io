---
id: troubleshooting-and-monitoring
title: MLflow Troubleshooting and Monitoring
sidebar_label: Troubleshooting
sidebar_position: 10
description: Comprehensive troubleshooting guide for MLflow on Kubernetes. Learn about common issues, debugging techniques, monitoring setup, and performance optimization.
keywords: [mlflow, troubleshooting, monitoring, kubernetes, helm, debugging, performance, logs, metrics, prometheus]
---

# Troubleshooting and Monitoring

This guide provides comprehensive troubleshooting steps and monitoring setup for MLflow deployments on Kubernetes. Learn how to diagnose common issues, set up monitoring, and maintain production deployments.

:::info
**Production Support:** This guide covers the most common issues you'll encounter with MLflow deployments and provides systematic approaches to diagnose and resolve them.
:::

## Common Issues and Solutions

:::warning
**Critical Issues:** Database and authentication issues are the most common causes of MLflow deployment failures. Start troubleshooting here if your deployment isn't working.
:::

### Database Connection Issues

#### PostgreSQL Connection Problems

**Symptoms:**
- Pod stuck in `CrashLoopBackOff`
- Error messages: "connection refused", "authentication failed"
- Init container failures

**Diagnosis:**
```bash
# Check PostgreSQL service
kubectl get svc postgres -n mlflow

# Test network connectivity
kubectl exec -it deployment/mlflow -n mlflow -- \
  nc -zv postgres-service 5432

# Check PostgreSQL logs
kubectl logs -f deployment/postgres -n mlflow

# Verify database credentials
kubectl get secret postgres-database-secret -n mlflow -o yaml
```

**Solutions:**
1. **Connection Refused**: Check if PostgreSQL is running and accessible
2. **Authentication Failed**: Verify username/password and database permissions
3. **Database Not Found**: Ensure database exists and user has access
4. **SSL Issues**: Add `?sslmode=disable` to connection string if needed

:::tip
**Quick Check:** Always verify network connectivity first, then check credentials and permissions.
:::

#### MySQL Connection Problems

**Symptoms:**
- Similar to PostgreSQL issues
- PyMySQL driver errors
- Character set issues

**Diagnosis:**
```bash
# Test MySQL connection
kubectl exec -it deployment/mlflow -n mlflow -- \
  python -c "import pymysql; pymysql.connect(host='mysql-host', user='user', password='pass', database='mlflow')"

# Check MySQL logs
kubectl logs -f deployment/mysql -n mlflow
```

**Solutions:**
1. **Character Set**: Ensure UTF-8 encoding is configured
2. **Driver Issues**: Verify PyMySQL is installed
3. **SSL Connection**: Add `?ssl_mode=DISABLED` if needed

### Artifact Storage Issues

:::warning
**Storage Problems:** Artifact storage issues can prevent model tracking and deployment. These are often related to cloud provider permissions or network connectivity.
:::

#### S3/MinIO Problems

**Symptoms:**
- Artifact upload/download failures
- Access denied errors
- Endpoint connection issues

**Diagnosis:**
```bash
# Test S3 access
kubectl exec -it deployment/mlflow -n mlflow -- \
  aws s3 ls s3://your-bucket

# Check S3 credentials
kubectl exec -it deployment/mlflow -n mlflow -- env | grep AWS

# Test MinIO endpoint
kubectl exec -it deployment/mlflow -n mlflow -- \
  aws s3 ls s3://mlflow --endpoint-url http://minio-service:9000
```

**Solutions:**
1. **Access Denied**: Check IAM permissions or access keys
2. **Endpoint Issues**: Verify MinIO service endpoint
3. **Region Mismatch**: Ensure S3 bucket and MLflow region match

#### Azure Blob Storage Problems

**Symptoms:**
- WASBS connection failures
- Authentication errors
- Container access issues

**Diagnosis:**
```bash
# Test Azure CLI connectivity
kubectl exec -it deployment/mlflow -n mlflow -- \
  az storage account show --name your-storage-account

# Check Azure credentials
kubectl exec -it deployment/mlflow -n mlflow -- env | grep AZURE
```

**Solutions:**
1. **Authentication Failed**: Verify storage account key or service principal
2. **Container Not Found**: Ensure blob container exists
3. **Network Issues**: Check firewall rules and VPC access

### Authentication Issues

:::warning
**Security Issues:** Authentication problems can prevent access to MLflow entirely. These issues often relate to configuration or credential management.
:::

#### Basic Authentication Problems

**Symptoms:**
- Login failures
- Session timeout issues
- Permission denied errors

**Diagnosis:**
```bash
# Check authentication configuration
kubectl exec -it deployment/mlflow -n mlflow -- env | grep MLFLOW

# View authentication logs
kubectl logs deployment/mlflow -n mlflow | grep -i "auth\|login"

# Test authentication endpoint
kubectl port-forward svc/mlflow -n mlflow 5000:5000
curl -u admin:password http://localhost:5000/health
```

**Solutions:**
1. **Login Failed**: Verify admin credentials
2. **Session Issues**: Check session timeout settings
3. **Permission Issues**: Verify user permissions and roles

#### LDAP Authentication Problems

**Symptoms:**
- LDAP connection failures
- User lookup errors
- Group membership issues

**Diagnosis:**
```bash
# Test LDAP connectivity
kubectl exec -it deployment/mlflow -n mlflow -- \
  ldapsearch -H ldap://your-ldap-server:389 -D "uid=test,ou=people,dc=example,dc=com" -w password -b "dc=example,dc=com"

# Check LDAP configuration
kubectl get configmap mlflow -n mlflow -o yaml
```

**Solutions:**
1. **Connection Issues**: Verify LDAP server connectivity
2. **Certificate Issues**: Check TLS certificate configuration
3. **Search Issues**: Verify LDAP search base and filters

### Migration Issues

:::tip
**Migration Safety:** Database migrations are critical for schema updates. Always backup your database before enabling migrations in production.
:::

#### Database Migration Failures

**Symptoms:**
- Init container failures
- Schema migration errors
- Data corruption issues

**Diagnosis:**
```bash
# Check migration logs
kubectl logs deployment/mlflow -c init-mlflow -n mlflow

# Check database schema
kubectl exec -it deployment/mlflow -n mlflow -- \
  python -c "import mlflow; mlflow.db.get_sqlalchemy_engine().execute('SELECT version_num FROM alembic_version')"
```

**Solutions:**
1. **Migration Errors**: Enable `databaseMigration: true`
2. **Permission Issues**: Ensure database user has migration permissions
3. **Schema Conflicts**: Check for existing schema conflicts

## Monitoring Setup

:::info
**Production Monitoring:** Comprehensive monitoring is essential for production MLflow deployments to ensure reliability and performance.
:::

### Prometheus ServiceMonitor Configuration

Enable comprehensive monitoring with Prometheus:

```yaml
serviceMonitor:
  enabled: true
  namespace: monitoring
  interval: 30s
  telemetryPath: /metrics
  labels:
    release: prometheus
  timeout: 10s
  targetLabels: []
  metricRelabelings:
    - sourceLabels: [__name__]
      regex: 'mlflow_(.+)'
      targetLabel: mlflow_metric
      replacement: '${1}'
```

### Grafana Dashboard

Create a Grafana dashboard for MLflow monitoring:

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
  "editable": true,
  "fiscalYearStartMonth": 0,
  "gnetId": null,
  "graphTooltip": 0,
  "id": 32,
  "links": [],
  "liveNow": false,
  "panels": [
    {
      "datasource": "prometheus",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisLabel": "",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "legend": false,
              "tooltip": false,
              "viz": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": true,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
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
          "unit": "short"
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 9,
        "x": 0,
        "y": 0
      },
      "id": 2,
      "links": [],
      "options": {
        "legend": {
          "calcs": [
            "mean",
            "lastNotNull"
          ],
          "displayMode": "table",
          "placement": "right"
        },
        "tooltip": {
          "mode": "single"
        }
      },
      "pluginVersion": "8.2.7",
      "targets": [
        {
          "$$hashKey": "object:214",
          "exemplar": true,
          "expr": "rate(mlflow_http_request_duration_seconds_count{status=\"200\"}[2m])",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "{{ method }}",
          "refId": "A"
        }
      ],
      "timeFrom": null,
      "timeShift": null,
      "title": "Requests per second",
      "type": "timeseries"
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
        "w": 6,
        "x": 9,
        "y": 0
      },
      "hiddenSeries": false,
      "id": 4,
      "legend": {
        "avg": true,
        "current": true,
        "max": true,
        "min": false,
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
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 5,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [
        {
          "$$hashKey": "object:1922",
          "alias": "errors",
          "color": "#c15c17"
        }
      ],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "$$hashKey": "object:766",
          "exemplar": true,
          "expr": "sum(rate(mlflow_http_request_duration_seconds_count{status!=\"200\"}[2m]))",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "errors",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Errors per second",
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
          "$$hashKey": "object:890",
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "$$hashKey": "object:891",
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
      "bars": true,
      "dashLength": 10,
      "dashes": false,
      "datasource": "prometheus",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 8,
        "w": 9,
        "x": 15,
        "y": 0
      },
      "hiddenSeries": false,
      "id": 13,
      "legend": {
        "avg": true,
        "current": false,
        "max": true,
        "min": false,
        "rightSide": true,
        "show": true,
        "total": false,
        "values": true
      },
      "lines": false,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null",
      "options": {
        "alertThreshold": true
      },
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 5,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [
        {
          "$$hashKey": "object:255",
          "alias": "HTTP 500",
          "color": "#bf1b00"
        }
      ],
      "spaceLength": 10,
      "stack": true,
      "steppedLine": false,
      "targets": [
        {
          "$$hashKey": "object:140",
          "exemplar": true,
          "expr": "increase(mlflow_http_request_total[2m])",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "HTTP {{ status }} - {{ method }}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Total requests each 2 minutes",
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
          "$$hashKey": "object:211",
          "format": "short",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": "0",
          "show": true
        },
        {
          "$$hashKey": "object:212",
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
      "decimals": null,
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 6,
        "w": 13,
        "x": 0,
        "y": 8
      },
      "hiddenSeries": false,
      "id": 6,
      "legend": {
        "alignAsTable": true,
        "avg": false,
        "current": true,
        "max": false,
        "min": false,
        "rightSide": true,
        "show": true,
        "sort": "avg",
        "sortDesc": true,
        "total": false,
        "values": true
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null as zero",
      "options": {
        "alertThreshold": true
      },
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 5,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "$$hashKey": "object:146",
          "exemplar": true,
          "expr": "rate(mlflow_http_request_duration_seconds_sum{status=\"200\"}[2m])\n/\nrate(mlflow_http_request_duration_seconds_count{status=\"200\"}[2m])",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "{{ method }}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Average response time [2m]",
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
          "$$hashKey": "object:1004",
          "decimals": null,
          "format": "s",
          "label": "",
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "$$hashKey": "object:1005",
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
      "description": "",
      "fill": 1,
      "fillGradient": 0,
      "gridPos": {
        "h": 6,
        "w": 11,
        "x": 13,
        "y": 8
      },
      "hiddenSeries": false,
      "id": 15,
      "legend": {
        "alignAsTable": true,
        "avg": true,
        "current": true,
        "max": true,
        "min": true,
        "rightSide": true,
        "show": true,
        "sort": "avg",
        "sortDesc": true,
        "total": false,
        "values": true
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null as zero",
      "options": {
        "alertThreshold": true
      },
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 5,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "$$hashKey": "object:426",
          "exemplar": true,
          "expr": "histogram_quantile(0.5, rate(mlflow_http_request_duration_seconds_bucket{status=\"200\"}[2m]))",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "{{ method }}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Request duration [s] - p50",
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
          "$$hashKey": "object:1280",
          "format": "none",
          "label": null,
          "logBase": 1,
          "max": null,
          "min": null,
          "show": true
        },
        {
          "$$hashKey": "object:1281",
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
        "h": 6,
        "w": 13,
        "x": 0,
        "y": 14
      },
      "hiddenSeries": false,
      "id": 11,
      "legend": {
        "alignAsTable": true,
        "avg": false,
        "current": true,
        "max": false,
        "min": false,
        "rightSide": true,
        "show": true,
        "sort": "current",
        "sortDesc": true,
        "total": false,
        "values": true
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null as zero",
      "options": {
        "alertThreshold": true
      },
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 5,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "$$hashKey": "object:1079",
          "exemplar": true,
          "expr": "increase(mlflow_http_request_duration_seconds_bucket{status=\"200\",le=\"0.25\"}[2m]) \n/ ignoring (le) increase(mlflow_http_request_duration_seconds_count{status=\"200\"}[2m])",
          "format": "time_series",
          "instant": false,
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "{{ method }}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Requests under 250ms",
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
          "$$hashKey": "object:1137",
          "decimals": null,
          "format": "percentunit",
          "label": null,
          "logBase": 1,
          "max": "1",
          "min": "0",
          "show": true
        },
        {
          "$$hashKey": "object:1138",
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
        "h": 6,
        "w": 11,
        "x": 13,
        "y": 14
      },
      "hiddenSeries": false,
      "id": 16,
      "legend": {
        "alignAsTable": true,
        "avg": true,
        "current": true,
        "max": true,
        "min": true,
        "rightSide": true,
        "show": true,
        "sort": "avg",
        "sortDesc": true,
        "total": false,
        "values": true
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nullPointMode": "null as zero",
      "options": {
        "alertThreshold": true
      },
      "percentage": false,
      "pluginVersion": "8.2.7",
      "pointradius": 5,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": [
        {
          "$$hashKey": "object:426",
          "exemplar": true,
          "expr": "histogram_quantile(0.9, rate(mlflow_http_request_duration_seconds_bucket{status=\"200\"}[2m]))",
          "format": "time_series",
          "interval": "",
          "intervalFactor": 1,
          "legendFormat": "{{ method }}",
          "refId": "A"
        }
      ],
      "thresholds": [],
      "timeFrom": null,
      "timeRegions": [],
      "timeShift": null,
      "title": "Request duration [s] - p90",
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
    }
  ],
  "refresh": "1m",
  "schemaVersion": 32,
  "style": "dark",
  "tags": [
    "mlflow"
  ],
  "templating": {
    "list": []
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
  "title": "Mlflow Dashboard",
  "uid": "_eX4mpl4",
  "version": 1
}
```

### Health Checks and Alerts

Configure health checks and alerting:

```yaml
livenessProbe:
  initialDelaySeconds: 30
  periodSeconds: 20
  timeoutSeconds: 6
  failureThreshold: 3
  httpGet:
    path: /health
    port: 5000

readinessProbe:
  initialDelaySeconds: 30
  periodSeconds: 20
  timeoutSeconds: 6
  failureThreshold: 3
  httpGet:
    path: /health
    port: 5000
```

### Prometheus Alert Rules

Create alert rules for MLflow:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: mlflow-alerts
  namespace: monitoring
spec:
  groups:
  - name: mlflow
    rules:
    - alert: MLflowDown
      expr: up{job="mlflow"} == 0
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "MLflow is down"
        description: "MLflow instance has been down for more than 1 minute"

    - alert: MLflowHighErrorRate
      expr: rate(http_requests_total{job="mlflow",status=~"5.."}[5m]) > 0.1
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High error rate in MLflow"
        description: "MLflow is returning 5xx errors at a high rate"

    - alert: MLflowHighResponseTime
      expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="mlflow"}[5m])) > 2
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High response time in MLflow"
        description: "MLflow 95th percentile response time is above 2 seconds"
```

## Performance Optimization

### Resource Management

Configure appropriate resource limits:

```yaml
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2
    memory: 4Gi
```

### Database Connection Pooling

Optimize database connections:

```yaml
extraEnvVars:
  MLFLOW_SQLALCHEMY_POOL_SIZE: "20"
  MLFLOW_SQLALCHEMY_MAX_OVERFLOW: "30"
  MLFLOW_SQLALCHEMY_POOL_TIMEOUT: "30"
  MLFLOW_SQLALCHEMY_POOL_RECYCLE: "3600"
```

### Artifact Storage Optimization

Optimize artifact storage performance:

```yaml
# For S3
extraEnvVars:
  MLFLOW_S3_PRESIGNED_URLS: "true"
  MLFLOW_S3_UPLOAD_EXTRA_ARGS: '{"ServerSideEncryption": "aws:kms"}'

# For GCS
extraEnvVars:
  MLFLOW_GCS_DEFAULT_TIMEOUT: "120"
  MLFLOW_GCS_UPLOAD_CHUNK_SIZE: "209715200"
```

## Logging and Debugging

### Log Level Configuration

Configure appropriate log levels:

```yaml
extraEnvVars:
  MLFLOW_LOG_LEVEL: "INFO"
  MLFLOW_AUTH_LOGGING: "true"
  MLFLOW_AUDIT_ENABLED: "true"
```

### Centralized Logging

Set up centralized logging with Fluentd or similar:

```yaml
extraEnvVars:
  MLFLOW_LOG_FORMAT: "json"
  MLFLOW_LOG_FILE: "/var/log/mlflow/mlflow.log"
```

### Debug Mode

Enable debug mode for troubleshooting:

```yaml
extraEnvVars:
  MLFLOW_LOG_LEVEL: "DEBUG"
  MLFLOW_TRACKING_URI: "http://localhost:5000"
  MLFLOW_SERVE_ARTIFACTS: "true"
```

## Backup and Recovery

### Database Backup

Set up automated database backups:

```bash
# PostgreSQL backup script
#!/bin/bash
pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -d mlflow > /backup/mlflow_$(date +%Y%m%d_%H%M%S).sql

# MySQL backup script
#!/bin/bash
mysqldump -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD mlflow > /backup/mlflow_$(date +%Y%m%d_%H%M%S).sql
```

### Artifact Storage Backup

Configure artifact storage backup:

```yaml
# S3 backup configuration
extraEnvVars:
  MLFLOW_S3_BACKUP_BUCKET: "mlflow-backup-bucket"
  MLFLOW_S3_BACKUP_SCHEDULE: "0 2 * * *"  # Daily at 2 AM
```

## Security Monitoring

### Access Monitoring

Monitor access patterns and security events:

```yaml
extraEnvVars:
  MLFLOW_AUDIT_ENABLED: "true"
  MLFLOW_AUDIT_LOG_PATH: "/var/log/mlflow/audit.log"
  MLFLOW_SESSION_TIMEOUT: "3600"
  MLFLOW_MAX_SESSIONS_PER_USER: "5"
```

### Network Security

Monitor network access and security:

```yaml
# Network policy for MLflow
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: mlflow-network-policy
  namespace: mlflow
spec:
  podSelector:
    matchLabels:
      app: mlflow
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 5000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: database
    ports:
    - protocol: TCP
      port: 5432
```

## Maintenance Tasks

### Regular Maintenance

Set up regular maintenance tasks:

```bash
# Clean up old experiments (older than 90 days)
mlflow gc --older-than 90d

# Clean up old artifacts
mlflow artifacts cleanup --older-than 90d

# Database maintenance
mlflow db gc --older-than 90d
```

### Health Check Script

Create a comprehensive health check script:

```bash
#!/bin/bash
# MLflow Health Check Script

# Check pod status
kubectl get pods -n mlflow

# Check service status
kubectl get svc -n mlflow

# Check database connectivity
kubectl exec -it deployment/mlflow -n mlflow -- \
  python -c "import mlflow; print('Database OK')"

# Check artifact storage
kubectl exec -it deployment/mlflow -n mlflow -- \
  python -c "import mlflow; print('Artifact storage OK')"

# Check metrics endpoint
kubectl exec -it deployment/mlflow -n mlflow -- \
  curl -s http://localhost:5000/metrics | head -5
```

## Next Steps

- Set up monitoring with [ServiceMonitor](/docs/charts/mlflow/usage#monitoring)
- Configure [autoscaling](/docs/charts/mlflow/autoscaling-setup) for high availability
- Implement backup and disaster recovery strategies
- Set up [security monitoring](/docs/charts/mlflow/authentication-configuration) and alerting
