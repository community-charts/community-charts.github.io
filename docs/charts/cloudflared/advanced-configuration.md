---
id: advanced-configuration
title: Advanced Configuration
sidebar_label: Advanced Configuration
sidebar_position: 5
description: Advanced configuration options for Cloudflared Tunnel including high availability, monitoring, and customization
keywords: [cloudflared, advanced, high-availability, monitoring, customization, kubernetes, helm]
---

# Advanced Configuration

This guide covers advanced configuration options for production deployments and specialized use cases.

## High Availability Configuration

### Multi-Node Deployment

Deploy Cloudflared to all nodes for high availability:

```yaml
replica:
  allNodes: true

updateStrategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1

tolerations:
  - effect: NoSchedule
    operator: Exists
```

### Pod Anti-Affinity

Ensure pods are distributed across nodes:

```yaml
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
            - cloudflared
        topologyKey: kubernetes.io/hostname
```

### Node Affinity

Deploy to specific node types:

```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: node-type
          operator: In
          values:
          - edge
          - ingress
```

## Performance Optimization

### Resource Configuration

Optimize resource allocation for high-traffic scenarios:

```yaml
resources:
  limits:
    cpu: "1000m"
    memory: "512Mi"
  requests:
    cpu: "500m"
    memory: "256Mi"
```

### Connection Pooling

Configure connection pooling for better performance:

```yaml
tunnelConfig:
  protocol: "http2"  # Use HTTP/2 for better performance
  retries: 10
  connectTimeout: "15s"
  gracePeriod: "30s"
```

### Keep-Alive Settings

Optimize keep-alive connections:

```yaml
ingress:
  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80
    originRequest:
      keepAliveConnections: 200
      keepAliveTimeout: 120s
      connectTimeout: 10s
      readTimeout: 60s
```

## Security Enhancements

### Network Policies

Create restrictive network policies:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: cloudflared-network-policy
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: cloudflared
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: TCP
      port: 2000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: default
    ports:
    - protocol: TCP
      port: 80
    - protocol: TCP
      port: 443
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: TCP
      port: 53
```

### Pod Security Standards

Configure pod security standards:

```yaml
podSecurityContext:
  fsGroup: 65532
  fsGroupChangePolicy: "OnRootMismatch"
  runAsUser: 65532
  runAsGroup: 65532
  runAsNonRoot: true
  sysctls:
    - name: net.ipv4.ping_group_range
      value: "0 2147483647"

securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
    add:
      - NET_RAW
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  privileged: false
  runAsUser: 65532
  runAsGroup: 65532
```

### RBAC Configuration

Configure proper RBAC:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloudflared-tunnel-role
rules:
- apiGroups: [""]
  resources: ["services", "endpoints"]
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cloudflared-tunnel-binding
subjects:
- kind: ServiceAccount
  name: my-cloudflared
  namespace: default
roleRef:
  kind: ClusterRole
  name: cloudflared-tunnel-role
  apiGroup: rbac.authorization.k8s.io
```

## Monitoring and Observability

### Prometheus Integration

Enable Prometheus monitoring:

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "2000"
  prometheus.io/path: "/metrics"
  prometheus.io/scheme: "http"
```

### Custom Metrics

Configure custom metrics collection:

```yaml
tunnelConfig:
  metricsUpdateFrequency: "5s"
  logLevel: "info"
  transportLogLevel: "warn"
```

### Health Checks

Configure comprehensive health checks:

```yaml
livenessProbe:
  httpGet:
    path: /ready
    port: 2000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /ready
    port: 2000
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

### Log Aggregation

Configure log aggregation:

```yaml
podAnnotations:
  fluentbit.io/parser: "cloudflared"
  logging.kubernetes.io/format: "json"
```

## Custom Environment Variables

### Additional Environment Variables

```yaml
extraEnvVars:
  - name: TUNNEL_METRICS
    value: "0.0.0.0:2000"
  - name: TUNNEL_ORIGIN_CA_POOL
    value: "/etc/ssl/certs/ca-certificates.crt"
  - name: TUNNEL_PROTOCOL
    value: "http2"
```

### Using Existing Secrets

```yaml
extraSecretNamesForEnvFrom:
  - name: cloudflared-config
    optional: false
```

## Custom Volumes and Configurations

### Additional Volumes

```yaml
volumes:
  - name: custom-config
    configMap:
      name: cloudflared-custom-config
  - name: ssl-certs
    secret:
      secretName: ssl-certificates

volumeMounts:
  - name: custom-config
    mountPath: /etc/cloudflared/custom
    readOnly: true
  - name: ssl-certs
    mountPath: /etc/ssl/certs
    readOnly: true
```

### Custom Configuration Files

Create custom configuration files:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cloudflared-custom-config
data:
  custom-rules.yaml: |
    # Custom routing rules
    - hostname: custom.example.com
      service: http://custom-service.default.svc.cluster.local:8080
```

## Load Balancing and Traffic Management

### Multiple Tunnel Instances

Deploy multiple tunnel instances for load balancing:

```yaml
# Primary tunnel
replica:
  allNodes: false
  count: 3

# Secondary tunnel for backup
nameOverride: "cloudflared-backup"
fullnameOverride: "cloudflared-backup"

tunnelConfig:
  name: "backup-tunnel"
```

### Traffic Splitting

Configure traffic splitting between services:

```yaml
ingress:
  - hostname: example.com
    service: http://web-service-1.default.svc.cluster.local:80
    originRequest:
      loadBalancer:
        pool: web-pool-1

  - hostname: example.com
    service: http://web-service-2.default.svc.cluster.local:80
    originRequest:
      loadBalancer:
        pool: web-pool-2
```

## Disaster Recovery

### Backup Configuration

Create backup tunnel configurations:

```yaml
# Primary configuration
tunnelConfig:
  name: "primary-tunnel"
  retries: 5
  connectTimeout: "30s"

# Backup configuration
nameOverride: "cloudflared-backup"
tunnelConfig:
  name: "backup-tunnel"
  retries: 10
  connectTimeout: "60s"
```

### Geographic Distribution

Deploy tunnels across different regions:

```yaml
# US region
nodeSelector:
  region: us-west-1

# EU region
nameOverride: "cloudflared-eu"
nodeSelector:
  region: eu-west-1
```

## Custom Init Containers

### Pre-flight Checks

Add init containers for pre-flight checks:

```yaml
initContainers:
  - name: tunnel-check
    image: cloudflare/cloudflared:latest
    command:
      - /bin/sh
      - -c
      - |
        cloudflared tunnel info my-tunnel || exit 1
    env:
      - name: TUNNEL_TOKEN
        valueFrom:
          secretKeyRef:
            name: tunnel-credentials
            key: credentials.json
```

## Service Account Configuration

### Custom Service Account

```yaml
serviceAccount:
  create: true
  name: "cloudflared-service-account"
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/cloudflared-role"
    iam.gke.io/gcp-service-account: "cloudflared@project.iam.gserviceaccount.com"
```

## Custom Labels and Annotations

### Pod Labels

```yaml
podLabels:
  app.kubernetes.io/component: tunnel
  environment: production
  team: infrastructure
  cost-center: networking
```

### Pod Annotations

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "2000"
  prometheus.io/path: "/metrics"
  backup.kubernetes.io/enabled: "true"
  backup.kubernetes.io/schedule: "daily"
  monitoring.kubernetes.io/enabled: "true"
```

## Complete Production Example

Here's a comprehensive production configuration:

```yaml
# High availability deployment
replica:
  allNodes: true

# Image configuration
image:
  repository: cloudflare/cloudflared
  pullPolicy: IfNotPresent

# Update strategy
updateStrategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1

# Tunnel configuration
tunnelConfig:
  name: "production-tunnel"
  logLevel: "info"
  transportLogLevel: "warn"
  protocol: "http2"
  retries: 10
  connectTimeout: "15s"
  gracePeriod: "30s"
  metricsUpdateFrequency: "5s"
  autoUpdateFrequency: "24h"
  noAutoUpdate: true
  warpRouting: false

# Tunnel secrets
tunnelSecrets:
  base64EncodedConfigJsonFile: "your-base64-encoded-credentials"
  base64EncodedPemFile: "your-base64-encoded-certificate"

# Ingress rules
ingress:
  - hostname: app.example.com
    service: http://web-service.default.svc.cluster.local:80
    originRequest:
      connectTimeout: 10s
      readTimeout: 60s
      keepAliveConnections: 200
      keepAliveTimeout: 120s

  - hostname: api.example.com
    service: http://api-service.default.svc.cluster.local:8080
    originRequest:
      connectTimeout: 10s
      readTimeout: 30s

  - hostname: "*.example.com"
    service: http://wildcard-service.default.svc.cluster.local:80

  - service: http_status:404

# Resources
resources:
  limits:
    cpu: "1000m"
    memory: "512Mi"
  requests:
    cpu: "500m"
    memory: "256Mi"

# Security
podSecurityContext:
  fsGroup: 65532
  fsGroupChangePolicy: "OnRootMismatch"
  runAsUser: 65532
  runAsGroup: 65532
  runAsNonRoot: true
  sysctls:
    - name: net.ipv4.ping_group_range
      value: "0 2147483647"

securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
    add:
      - NET_RAW
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  privileged: false
  runAsUser: 65532
  runAsGroup: 65532

# Node selection
nodeSelector:
  kubernetes.io/os: linux
  node-type: edge

# Tolerations
tolerations:
  - effect: NoSchedule
    operator: Exists

# Affinity
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
            - cloudflared
        topologyKey: kubernetes.io/hostname

# Service account
serviceAccount:
  create: true
  name: "cloudflared-service-account"
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/cloudflared-role"

# Monitoring
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "2000"
  prometheus.io/path: "/metrics"
  backup.kubernetes.io/enabled: "true"
  backup.kubernetes.io/schedule: "daily"

# Labels
podLabels:
  app.kubernetes.io/component: tunnel
  environment: production
  team: infrastructure

# Termination
terminationGracePeriodSeconds: 30
```

## Next Steps

- Learn about [tunnel setup](./tunnel-setup.md)
- Configure [ingress rules](./ingress-configuration.md)
- Learn about [troubleshooting common issues](./troubleshooting.md)
- Review [configuration options](./configuration.md)
