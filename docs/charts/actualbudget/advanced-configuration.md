---
id: advanced-configuration
title: Advanced Configuration
sidebar_label: Advanced Configuration
sidebar_position: 5
description: Advanced configuration options for Actual Budget including security, networking, and customization
keywords: [actual, actualbudget, personal finance, advanced, security, networking, customization, kubernetes]
---

# Advanced Configuration

This guide covers advanced configuration options for production deployments and specialized use cases.

## Security Configuration

### Pod Security Context

Configure security context for enhanced security:

```yaml
podSecurityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: OnRootMismatch
  supplementalGroups: []

securityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  runAsUser: 1000
  capabilities:
    drop:
      - ALL
```

### Service Account Configuration

Customize service account settings:

```yaml
serviceAccount:
  create: true
  automount: true
  name: ""
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/actualbudget-role"
```

## Networking Configuration

### Service Configuration

Advanced service configuration:

```yaml
service:
  type: ClusterIP
  port: 5006
  name: http
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-internal: "true"
```

### Ingress Advanced Configuration

Complex ingress setup with multiple hosts and TLS:

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
  hosts:
    - host: actualbudget.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
    - host: budget.internal.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
    - secretName: actualbudget-tls
      hosts:
        - actualbudget.yourdomain.com
        - budget.internal.yourdomain.com
```

### Load Balancer Configuration

For cloud providers with load balancers:

```yaml
service:
  type: LoadBalancer
  port: 5006
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internet-facing"
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: "ip"
```

## Resource Management

### Advanced Resource Configuration

Fine-tune resource allocation:

```yaml
resources:
  limits:
    cpu: "1"
    memory: "2Gi"
    ephemeral-storage: "1Gi"
  requests:
    cpu: "500m"
    memory: "1Gi"
    ephemeral-storage: "512Mi"
```

### Horizontal Pod Autoscaling

Configure HPA for high availability:

```yaml
# values.yaml
replicaCount: 1

# Create HPA separately
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: actualbudget-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: actualbudget
  minReplicas: 1
  maxReplicas: 3
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

## Node Selection and Affinity

### Node Selector

Deploy to specific nodes:

```yaml
nodeSelector:
  node-type: application
  storage: ssd
```

### Affinity and Anti-Affinity

Configure pod placement rules:

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
            - actualbudget
        topologyKey: kubernetes.io/hostname
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: node-type
          operator: In
          values:
          - application
```

### Tolerations

Deploy to tainted nodes:

```yaml
tolerations:
- key: "dedicated"
  operator: "Equal"
  value: "actualbudget"
  effect: "NoSchedule"
```

## Volume and Volume Mounts

### Additional Volumes

Mount additional volumes for configuration or data:

```yaml
volumes:
  - name: config-volume
    configMap:
      name: actualbudget-config
  - name: certs-volume
    secret:
      secretName: actualbudget-certs
  - name: logs-volume
    persistentVolumeClaim:
      claimName: actualbudget-logs

volumeMounts:
  - name: config-volume
    mountPath: /app/config
    readOnly: true
  - name: certs-volume
    mountPath: /app/certs
    readOnly: true
  - name: logs-volume
    mountPath: /app/logs
```

## Init Containers

Configure init containers for setup tasks:

```yaml
initContainers:
  - name: init-db
    image: busybox
    command:
      - /bin/sh
      - -c
      - |
        echo "Initializing database..."
        mkdir -p /data/server-files /data/user-files
        chown -R 1000:3000 /data
    volumeMounts:
      - name: data
        mountPath: /data
```

## Sidecar Containers

Add sidecar containers for monitoring or logging:

```yaml
extraContainers:
  - name: nginx-sidecar
    image: nginx:alpine
    ports:
      - name: nginx
        containerPort: 80
    volumeMounts:
      - name: nginx-config
        mountPath: /etc/nginx/conf.d
    resources:
      limits:
        cpu: 100m
        memory: 128Mi
      requests:
        cpu: 50m
        memory: 64Mi

volumes:
  - name: nginx-config
    configMap:
      name: nginx-config
```

## Image Pull Secrets

Configure private registry access:

```yaml
imagePullSecrets:
  - name: registry-secret
```

## Pod Annotations and Labels

Add custom metadata:

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "5006"
  prometheus.io/path: "/metrics"
  backup.kubernetes.io/enabled: "true"
  backup.kubernetes.io/schedule: "daily"

podLabels:
  app.kubernetes.io/component: "application"
  app.kubernetes.io/part-of: "finance"
  environment: "production"
```

## Deployment Strategy

Advanced deployment strategies:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: "25%"
    maxUnavailable: "25%"
```

For zero-downtime deployments with multiple replicas:

```yaml
replicaCount: 2
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: "50%"
    maxUnavailable: "0"
```

## Health Check Configuration

Customize health checks:

```yaml
livenessProbe:
  httpGet:
    path: /
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /
    port: http
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

## Next Steps

- Learn about [troubleshooting common issues](./troubleshooting.md)
- Configure [authentication methods](./authentication.md)
- Set up [storage and persistence](./storage.md)
