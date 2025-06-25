---
id: autoscaling-setup
title: MLflow Autoscaling Setup
sidebar_label: Autoscaling
sidebar_position: 9
description: Complete guide to configuring autoscaling for MLflow on Kubernetes. Learn about Horizontal Pod Autoscaler (HPA), and cluster autoscaling strategies.
keywords: [mlflow, autoscaling, kubernetes, helm, hpa, horizontal pod autoscaler, production, scaling]
---

# Autoscaling Setup

This guide covers configuring autoscaling for MLflow to handle varying workloads efficiently. We'll cover Horizontal Pod Autoscaler (HPA), and cluster autoscaling strategies.

:::info
**Production Scaling:** Autoscaling is essential for production MLflow deployments to handle varying workloads and ensure optimal resource utilization.
:::

## Prerequisites

:::warning
**Critical Requirements:** Autoscaling requires specific backend configurations. Ensure all prerequisites are met before enabling autoscaling.
:::

- Kubernetes cluster with metrics server enabled
- MLflow deployed on Kubernetes
- Cluster autoscaler configured (for node scaling)
- Resource requests and limits defined for MLflow pods
- **Backend store enabled** (PostgreSQL or MySQL, not SQLite)
- **Artifact store enabled** (S3, Azure Blob, or GCS)
- **Authentication configured** (PostgreSQL auth backend or disabled)

:::tip
**Resource Planning:** Define appropriate resource requests and limits for your MLflow pods to enable effective autoscaling decisions.
:::

## Horizontal Pod Autoscaler (HPA)

### Prerequisites for HPA

:::warning
**HPA Requirements:** The HPA will only be created if all these conditions are met. Check your configuration carefully.
:::

The HPA is created only if:
- `autoscaling.enabled: true`
- A backend store is enabled (`backendStore.postgres.enabled` or `backendStore.mysql.enabled`)
- An artifact store is enabled (`artifactRoot.azureBlob.enabled`, `artifactRoot.s3.enabled`, or `artifactRoot.gcs.enabled`)
- Auth is either enabled with Postgres (`auth.enabled` and `auth.postgres.enabled`) or disabled (`auth.enabled: false`)

### 1. Basic HPA Configuration

Create `values-autoscaling.yaml`:

```yaml
backendStore:
  databaseMigration: true
  databaseConnectionCheck: true
  postgres:
    enabled: true
    host: postgresql-instance1.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
    port: 5432
    database: mlflow
    user: mlflowuser
    password: Pa33w0rd!

artifactRoot:
  s3:
    enabled: true
    bucket: my-mlflow-artifact-root-backend
    awsAccessKeyId: a1b2c3d4
    awsSecretAccessKey: a1b2c3d4

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
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

### 2. Deploy with Autoscaling

```bash
helm install mlflow community-charts/mlflow \
  --namespace mlflow \
  -f values-autoscaling.yaml
```

### 3. Custom Scaling Behavior

For more sophisticated scaling behavior (Kubernetes 1.18+):

```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 15
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 30
      policies:
        - type: Percent
          value: 100
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
```

:::tip
**Scaling Behavior:** Customize scaling behavior to prevent rapid scaling up/down and ensure stable performance during workload changes.
:::

### 4. Custom Metrics HPA

For more sophisticated scaling based on custom metrics:

```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 15
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Object
      object:
        metric:
          name: requests-per-second
        describedObject:
          apiVersion: networking.k8s.io/v1
          kind: Ingress
          name: mlflow-ingress
        target:
          type: AverageValue
          averageValue: 100
```

:::info
**Custom Metrics:** Use custom metrics for more precise scaling decisions based on application-specific workload indicators.
:::

## Complete Production Configuration

:::info
**Production Setup:** This example demonstrates a complete production-ready MLflow configuration with autoscaling enabled.
:::

### PostgreSQL with S3 and Autoscaling

```yaml
backendStore:
  databaseMigration: true
  databaseConnectionCheck: true
  postgres:
    enabled: true
    host: postgresql-instance1.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
    port: 5432
    database: mlflow
    user: mlflowuser
    password: Pa33w0rd!

artifactRoot:
  s3:
    enabled: true
    bucket: my-mlflow-artifact-root-backend
    awsAccessKeyId: a1b2c3d4
    awsSecretAccessKey: a1b2c3d4

auth:
  enabled: true
  adminUsername: admin
  adminPassword: S3cr3+
  postgres:
    enabled: true
    host: postgresql--auth-instance1.abcdef1234.eu-central-1.rds.amazonaws.com
    port: 5432
    database: auth
    user: mlflowauth
    password: A4m1nPa33w0rd!

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
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 30
      policies:
        - type: Percent
          value: 100
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60

# Resource management for autoscaling
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2
    memory: 4Gi

# Health probes for reliability
livenessProbe:
  initialDelaySeconds: 30
  periodSeconds: 20
  timeoutSeconds: 6
  failureThreshold: 3

readinessProbe:
  initialDelaySeconds: 30
  periodSeconds: 20
  timeoutSeconds: 6
  failureThreshold: 3

# Monitoring integration
serviceMonitor:
  enabled: true
  namespace: monitoring
  interval: 30s
  telemetryPath: /metrics
  labels:
    release: prometheus
  timeout: 10s
  targetLabels: []
```

### MinIO with MySQL and Autoscaling

```yaml
backendStore:
  databaseMigration: true
  databaseConnectionCheck: true
  mysql:
    enabled: true
    host: mysql-service
    port: 3306
    database: mlflow
    user: mlflow
    password: mlflow

artifactRoot:
  s3:
    enabled: true
    bucket: mlflow
    awsAccessKeyId: minioadmin
    awsSecretAccessKey: minioadmin

extraEnvVars:
  MLFLOW_S3_ENDPOINT_URL: http://minio-service:9000

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 75
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 85

resources:
  requests:
    cpu: 300m
    memory: 512Mi
  limits:
    cpu: 1
    memory: 2Gi
```

## Cluster Autoscaling

### 1. AWS EKS Cluster Autoscaler

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cluster-autoscaler
  namespace: kube-system
  labels:
    app: cluster-autoscaler
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cluster-autoscaler
  template:
    metadata:
      labels:
        app: cluster-autoscaler
    spec:
      serviceAccountName: cluster-autoscaler
      containers:
      - image: k8s.gcr.io/autoscaling/cluster-autoscaler:v1.24.0
        name: cluster-autoscaler
        resources:
          limits:
            cpu: 100m
            memory: 300Mi
          requests:
            cpu: 100m
            memory: 300Mi
        command:
        - ./cluster-autoscaler
        - --v=4
        - --stderrthreshold=info
        - --cloud-provider=aws
        - --skip-nodes-with-local-storage=false
        - --expander=least-waste
        - --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/your-cluster-name
        - --balance-similar-node-groups
        - --skip-nodes-with-system-pods=false
        volumeMounts:
        - name: ssl-certs
          mountPath: /etc/ssl/certs/ca-bundle.crt
          readOnly: true
      volumes:
      - name: ssl-certs
        hostPath:
          path: "/etc/ssl/certs/ca-bundle.crt"
```

### 2. GKE Cluster Autoscaling

Enable cluster autoscaling in GKE:

```bash
gcloud container clusters update your-cluster \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 10 \
  --zone your-zone
```

## MLflow-Specific Autoscaling Configuration

### 1. Resource Requirements

Update MLflow deployment with proper resource requests and limits:

```yaml
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2
    memory: 4Gi
```

### 2. Pod Disruption Budget

Create a Pod Disruption Budget for high availability:

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: mlflow-pdb
  namespace: mlflow
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: mlflow
```

### 3. Advanced HPA with Custom Metrics

Using Prometheus metrics for MLflow-specific scaling:

```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: External
      external:
        metric:
          name: mlflow_active_experiments
          selector:
            matchLabels:
              app: mlflow
        target:
          type: AverageValue
          averageValue: 10
```

## Monitoring and Alerting

### 1. HPA Metrics Monitoring

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-rules
  namespace: monitoring
data:
  mlflow-hpa-rules.yaml: |
    groups:
    - name: mlflow-hpa
      rules:
      - alert: MLflowHPAScaling
        expr: kube_horizontalpodautoscaler_status_current_replicas > 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "MLflow HPA is scaling"
          description: "MLflow HPA has {{ $value }} replicas"
```

### 2. Resource Usage Alerts

```yaml
- alert: MLflowHighCPU
  expr: container_cpu_usage_seconds_total{container="mlflow"} > 0.8
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "MLflow high CPU usage"
    description: "MLflow container CPU usage is {{ $value }}"

- alert: MLflowHighMemory
  expr: container_memory_usage_bytes{container="mlflow"} > 3.5e9
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "MLflow high memory usage"
    description: "MLflow container memory usage is {{ $value }}"
```

## Performance Optimization

### 1. Pod Anti-Affinity

Ensure MLflow pods are distributed across nodes:

```yaml
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      podAffinityTerm:
        labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - mlflow
        topologyKey: kubernetes.io/hostname
```

### 2. Resource Quotas

Set resource quotas for the MLflow namespace:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: mlflow-quota
  namespace: mlflow
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "10"
```

### 3. Network Policies

Restrict network access for security:

```yaml
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

## Troubleshooting

### Common Issues

1. **HPA not scaling**: Check metrics server and resource requests/limits
2. **Cluster autoscaler issues**: Verify node groups and IAM permissions
3. **Resource starvation**: Monitor cluster capacity and quotas
4. **Prerequisites not met**: Ensure backend store, artifact store, and auth are properly configured

### Debug Commands

```bash
# Check HPA status
kubectl get hpa -n mlflow
kubectl describe hpa mlflow-hpa -n mlflow

# Check cluster autoscaler logs
kubectl logs -f deployment/cluster-autoscaler -n kube-system

# Check resource usage
kubectl top pods -n mlflow
kubectl top nodes

# Check metrics server
kubectl get apiservice v1beta1.metrics.k8s.io

# Verify prerequisites
kubectl get configmap -n mlflow mlflow -o yaml | grep -A 10 -B 10 "backend\|artifact\|auth"
```

## Best Practices

### 1. Gradual Scaling

- Use appropriate stabilization windows
- Implement gradual scale-down policies
- Monitor scaling behavior and adjust thresholds

### 2. Resource Management

- Set realistic resource requests and limits
- Monitor and adjust based on actual usage patterns

### 3. Cost Optimization

- Set appropriate min/max replica counts
- Use spot instances where possible
- Monitor and optimize resource utilization

### 4. High Availability

- Deploy across multiple availability zones
- Use pod disruption budgets
- Implement proper health checks and readiness probes

## Next Steps

- Set up comprehensive monitoring with Prometheus and Grafana
- Configure alerting for autoscaling events
- Implement cost monitoring and optimization
- Set up backup and disaster recovery strategies
- Configure [ServiceMonitor](/docs/charts/mlflow/usage#monitoring) for metrics collection
