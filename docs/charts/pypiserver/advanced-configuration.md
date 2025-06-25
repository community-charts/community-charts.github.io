---
id: advanced-configuration
title: PyPI Server Advanced Configuration
sidebar_label: Advanced Configuration
sidebar_position: 4
description: Advanced PyPI Server configuration for production deployments, high availability, monitoring, and security
keywords: [pypiserver advanced config, production deployment, high availability, monitoring, security, kubernetes]
---

# Advanced Configuration

This page covers advanced configuration options for production-ready PyPI Server deployments, including high availability, monitoring, security, and performance optimization.

## High Availability

### Multi-Replica Deployment

For high availability, deploy multiple replicas with shared storage:

```yaml
replicaCount: 3

strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: "100%"
    maxUnavailable: 0

volumes:
  - name: packages
    persistentVolumeClaim:
      claimName: pypi-packages-pvc

volumeMounts:
  - name: packages
    mountPath: "/data/packages"

# Use ReadWriteMany storage class
# storageClassName: nfs-storage
```

### Pod Anti-Affinity

Ensure replicas are distributed across nodes:

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
                  - pypiserver
          topologyKey: kubernetes.io/hostname
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
                - pypiserver
        topologyKey: kubernetes.io/hostname
```

### Load Balancer Configuration

Configure service for load balancing:

```yaml
service:
  type: LoadBalancer
  port: 8080
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
```

## Monitoring and Observability

### Prometheus Metrics

Enable Prometheus metrics collection:

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"

podArgs:
  - "run"
  - "-a"
  - "."
  - "-P"
  - "/data/.htpasswd"
  - "--overwrite"
  - "--fallback-url"
  - "https://pypi.org/simple/"
  - "--root"
  - "/data/packages"
  - "--server"
  - "gunicorn"
  - "--workers"
  - "4"
```

### Health Check Configuration

Enhanced health checks for better monitoring:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 60
  periodSeconds: 30
  timeoutSeconds: 10
  failureThreshold: 3
  successThreshold: 1

readinessProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
  successThreshold: 1

startupProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 30
```

### Logging Configuration

Configure structured logging:

```yaml
podArgs:
  - "run"
  - "-a"
  - "."
  - "-P"
  - "/data/.htpasswd"
  - "--overwrite"
  - "--fallback-url"
  - "https://pypi.org/simple/"
  - "--root"
  - "/data/packages"
  - "--server"
  - "gunicorn"
  - "--workers"
  - "4"
  - "--log-level"
  - "info"
  - "--access-logfile"
  - "-"
  - "--error-logfile"
  - "-"
```

## Security Hardening

### Pod Security Standards

Implement Pod Security Standards:

```yaml
podSecurityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: OnRootMismatch
  supplementalGroups: [2000]
  seccompProfile:
    type: RuntimeDefault

securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
  seccompProfile:
    type: RuntimeDefault
```

### Network Policies

Restrict network access:

```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: pypi-network-policy
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: pypiserver
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
          port: 8080
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: kube-system
      ports:
        - protocol: TCP
          port: 53
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
      ports:
        - protocol: TCP
          port: 443
        - protocol: TCP
          port: 80
```

### RBAC Configuration

Fine-grained access control:

```yaml
serviceAccount:
  create: true
  automount: true
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::ACCOUNT:role/pypi-service-role

# rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pypi-role
rules:
  - apiGroups: [""]
    resources: ["pods", "services", "endpoints"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["configmaps", "secrets"]
    verbs: ["get", "list", "watch"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pypi-role-binding
subjects:
  - kind: ServiceAccount
    name: pypi-service-account
    namespace: default
roleRef:
  kind: Role
  name: pypi-role
  apiGroup: rbac.authorization.k8s.io
```

## Performance Optimization

### Resource Optimization

Optimize resource allocation:

```yaml
resources:
  limits:
    cpu: 1000m
    memory: 4Gi
  requests:
    cpu: 500m
    memory: 2Gi

# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pypi-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pypi-deployment
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

### Caching Configuration

Implement caching for better performance:

```yaml
podArgs:
  - "run"
  - "-a"
  - "."
  - "-P"
  - "/data/.htpasswd"
  - "--overwrite"
  - "--fallback-url"
  - "https://pypi.org/simple/"
  - "--root"
  - "/data/packages"
  - "--server"
  - "gunicorn"
  - "--workers"
  - "4"
  - "--worker-connections"
  - "1000"
  - "--max-requests"
  - "1000"
  - "--max-requests-jitter"
  - "100"
```

## Backup and Disaster Recovery

### Automated Backups

Implement automated backup strategy:

```yaml
# backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: pypi-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: pypi-backup-sa
          containers:
          - name: backup
            image: alpine:latest
            command:
            - /bin/sh
            - -c
            - |
              apk add --no-cache rsync
              BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
              BACKUP_FILE="pypi-packages-${BACKUP_DATE}.tar.gz"

              # Create backup
              tar -czf /backup/${BACKUP_FILE} -C /data packages/

              # Upload to S3 (if configured)
              if [ -n "$S3_BUCKET" ]; then
                aws s3 cp /backup/${BACKUP_FILE} s3://${S3_BUCKET}/backups/
              fi

              # Clean old backups (keep last 7 days)
              find /backup -name "pypi-packages-*.tar.gz" -mtime +7 -delete
            env:
            - name: S3_BUCKET
              value: "pypi-backups"
            volumeMounts:
            - name: packages
              mountPath: /data/packages
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: packages
            persistentVolumeClaim:
              claimName: pypi-packages-pvc
          - name: backup-storage
            persistentVolumeClaim:
              claimName: pypi-backup-pvc
          restartPolicy: OnFailure
```

### Disaster Recovery Plan

Create a disaster recovery configuration:

```yaml
# disaster-recovery.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: pypi-dr-config
data:
  restore-script.sh: |
    #!/bin/sh
    set -e

    echo "Starting PyPI Server disaster recovery..."

    # Restore from latest backup
    LATEST_BACKUP=$(ls -t /backup/pypi-packages-*.tar.gz | head -1)

    if [ -z "$LATEST_BACKUP" ]; then
      echo "No backup found!"
      exit 1
    fi

    echo "Restoring from: $LATEST_BACKUP"

    # Stop PyPI Server
    kubectl scale deployment pypi-deployment --replicas=0

    # Wait for pods to terminate
    kubectl wait --for=delete pod -l app.kubernetes.io/name=pypiserver --timeout=300s

    # Restore packages
    tar -xzf "$LATEST_BACKUP" -C /data/

    # Restart PyPI Server
    kubectl scale deployment pypi-deployment --replicas=3

    echo "Disaster recovery completed successfully"
```

## Production Deployment Example

Complete production-ready configuration:

```yaml
# values-production.yaml
replicaCount: 3

image:
  repository: pypiserver/pypiserver
  tag: ""
  pullPolicy: IfNotPresent

service:
  type: LoadBalancer
  port: 8080
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"

ingress:
  enabled: true
  className: nginx
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
  hosts:
    - host: pypi.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: pypi-tls
      hosts:
        - pypi.yourdomain.com

podArgs:
  - "run"
  - "-a"
  - "."
  - "-P"
  - "/data/.htpasswd"
  - "--overwrite"
  - "--fallback-url"
  - "https://pypi.org/simple/"
  - "--root"
  - "/data/packages"
  - "--server"
  - "gunicorn"
  - "--workers"
  - "4"
  - "--worker-connections"
  - "1000"
  - "--max-requests"
  - "1000"
  - "--max-requests-jitter"
  - "100"
  - "--log-level"
  - "info"

resources:
  limits:
    cpu: 1000m
    memory: 4Gi
  requests:
    cpu: 500m
    memory: 2Gi

securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL

podSecurityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: OnRootMismatch
  supplementalGroups: [2000]
  seccompProfile:
    type: RuntimeDefault

livenessProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 60
  periodSeconds: 30
  timeoutSeconds: 10
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

startupProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 30

strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: "100%"
    maxUnavailable: 0

affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
                - pypiserver
        topologyKey: kubernetes.io/hostname

volumes:
  - name: packages
    persistentVolumeClaim:
      claimName: pypi-packages-pvc
  - name: auth
    secret:
      secretName: pypi-auth

volumeMounts:
  - name: packages
    mountPath: "/data/packages"
  - name: auth
    mountPath: "/data/.htpasswd"
    subPath: ".htpasswd"

podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"

serviceAccount:
  create: true
  automount: true
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::ACCOUNT:role/pypi-service-role
```

## Next Steps

- Learn about [storage configuration](./storage.md) for persistent data
- Explore [troubleshooting](./troubleshooting.md) for common issues
- Review [configuration](./configuration.md) for basic settings
- Check the [usage guide](./usage.md) for deployment examples
