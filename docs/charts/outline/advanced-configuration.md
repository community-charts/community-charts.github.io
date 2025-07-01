---
id: advanced-configuration
title: Outline Advanced Configuration
sidebar_label: Advanced Configuration
sidebar_position: 6
description: Advanced configuration options for Outline including integrations, SMTP, monitoring, and customization
keywords: [outline, advanced, integrations, smtp, monitoring, customization, kubernetes, helm]
---

# Advanced Configuration

This guide covers advanced configuration options for production deployments and specialized use cases.

## Integrations

Outline supports various third-party integrations for enhanced functionality.

### OpenAI Integration

Enable AI-powered features with OpenAI:

```yaml
integrations:
  openAI:
    enabled: true
    url: "https://api.openai.com/v1"
    apiKey: "your-openai-api-key"
    vectorDatabaseUrl: "postgresql://user:pass@host:port/db"
```

### Slack Integration

Enable Slack notifications and message actions:

```yaml
integrations:
  slack:
    enabled: true
    verificationToken: "your-slack-verification-token"
    appId: "your-slack-app-id"
    messageActions: true
```

### Sentry Integration

Enable error tracking and monitoring:

```yaml
integrations:
  sentry:
    enabled: true
    dsn: "https://your-sentry-dsn"
    tunnel: "https://your-sentry-tunnel"
```

### PDF Export Integration

Enable PDF export functionality:

```yaml
integrations:
  pdfExport:
    enabled: true
    gotenbergUrl: "http://gotenberg:3000"
```

### Iframely Integration

Enable link previews and metadata extraction:

```yaml
integrations:
  iframely:
    enabled: true
    url: "https://iframely.yourdomain.com"
    apiKey: "your-iframely-api-key"
```

### Dropbox Integration

Enable Dropbox file integration:

```yaml
integrations:
  dropbox:
    enabled: true
    appKey: "your-dropbox-app-key"
```

## SMTP Configuration

Configure email notifications and user invitations.

### Basic SMTP Setup

```yaml
smtp:
  host: "smtp.gmail.com"
  port: 587
  username: "your-email@gmail.com"
  password: "your-app-password"
  fromEmail: "outline@yourdomain.com"
  replyEmail: "no-reply@yourdomain.com"
  secure: true
```

### SMTP with Existing Secret

```yaml
smtp:
  host: "smtp.yourdomain.com"
  port: 587
  username: "outline"
  existingSecret: "outline-smtp-secret"  # Must contain smtp-password key
  fromEmail: "outline@yourdomain.com"
  replyEmail: "no-reply@yourdomain.com"
  secure: true
```

### Advanced SMTP Configuration

```yaml
smtp:
  host: "smtp.yourdomain.com"
  port: 587
  username: "outline"
  password: "strongpassword"
  fromEmail: "outline@yourdomain.com"
  replyEmail: "no-reply@yourdomain.com"
  secure: true
  tlsCiphers: "TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384"
```

## Monitoring and Observability

### Health Checks

Configure custom health check endpoints:

```yaml
livenessProbe:
  httpGet:
    path: /_health
    port: http
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /_health
    port: http
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

### Prometheus Monitoring

Add Prometheus annotations for monitoring:

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "3000"
  prometheus.io/path: "/_health"
```

### Resource Monitoring

Configure resource requests and limits:

```yaml
resources:
  limits:
    cpu: "2000m"
    memory: "4Gi"
  requests:
    cpu: "1000m"
    memory: "2Gi"
```

## Security Configuration

### Pod Security Context

Configure security context for enhanced security:

```yaml
podSecurityContext:
  runAsUser: 1001
  runAsGroup: 1001
  fsGroup: 1001
  fsGroupChangePolicy: OnRootMismatch
  supplementalGroups: []
  sysctls: []

securityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: false
  runAsNonRoot: true
  runAsUser: 1001
  runAsGroup: 1001
  capabilities:
    drop:
      - ALL
```

### Network Policies

Create network policies for enhanced security:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: outline-network-policy
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: outline
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
      port: 3000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: postgresql
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - namespaceSelector:
        matchLabels:
          name: redis
    ports:
    - protocol: TCP
      port: 6379
```

## High Availability Configuration

### Multi-Replica Deployment

```yaml
replicaCount: 3

strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: "25%"
    maxUnavailable: "25%"

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
            - outline
        topologyKey: kubernetes.io/hostname
```

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: outline-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: outline
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
          averageUtilization: 70
```

## Custom Environment Variables

Add custom environment variables:

```yaml
extraEnvVars:
  NODE_ENV: "production"
  TZ: "UTC"
  DEBUG: "false"
  CUSTOM_FEATURE_FLAG: "enabled"
```

### Using Existing Secrets

Reference existing secrets for environment variables:

```yaml
extraSecretNamesForEnvFrom:
  - my-custom-secret
  - another-secret
```

## Custom Volumes and Volume Mounts

Add custom volumes and mounts:

```yaml
volumes:
  - name: custom-config
    configMap:
      name: outline-custom-config
  - name: shared-storage
    persistentVolumeClaim:
      claimName: outline-shared-storage

volumeMounts:
  - name: custom-config
    mountPath: /app/custom-config
    readOnly: true
  - name: shared-storage
    mountPath: /app/shared
```

## Node Selection and Tolerations

### Node Selector

```yaml
nodeSelector:
  node-type: application
  environment: production
```

### Tolerations

```yaml
tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "outline"
    effect: "NoSchedule"
```

### Affinity Rules

```yaml
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
            - outline
        topologyKey: kubernetes.io/hostname
```

## Custom Init Containers

Add custom init containers:

```yaml
initContainers:
  - name: wait-for-database
    image: postgres:15
    command:
      - /bin/sh
      - -c
      - |
        until pg_isready -h $PGHOST -p $PGPORT -U $PGUSER; do
          echo "Waiting for database..."
          sleep 2
        done
    env:
      - name: PGHOST
        value: "outline-postgresql"
      - name: PGPORT
        value: "5432"
      - name: PGUSER
        value: "outline"
      - name: PGPASSWORD
        valueFrom:
          secretKeyRef:
            name: outline-postgresql
            key: password
```

## Custom Sidecar Containers

Add sidecar containers for additional functionality:

```yaml
extraContainers:
  - name: nginx-sidecar
    image: nginx:alpine
    ports:
      - name: nginx
        containerPort: 80
    volumeMounts:
      - name: nginx-config
        mountPath: /etc/nginx/nginx.conf
        subPath: nginx.conf
    resources:
      requests:
        memory: "64Mi"
        cpu: "50m"
      limits:
        memory: "128Mi"
        cpu: "100m"
```

## Service Account Configuration

### Custom Service Account

```yaml
serviceAccount:
  create: true
  name: "outline-service-account"
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/outline-role"
    iam.gke.io/gcp-service-account: "outline@project.iam.gserviceaccount.com"
```

## Ingress Advanced Configuration

### Multiple Hosts and Paths

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"

  hosts:
    - host: outline.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
    - host: wiki.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific

  tls:
    - secretName: outline-tls
      hosts:
        - outline.yourdomain.com
        - wiki.yourdomain.com
```

### Custom Ingress Annotations

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "300"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
```

## Complete Production Example

Here's a comprehensive production configuration:

```yaml
# Production deployment
replicaCount: 3
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: "25%"
    maxUnavailable: "25%"

# Image configuration
image:
  repository: outlinewiki/outline
  pullPolicy: IfNotPresent

# Web configuration
web:
  concurrency: 2
  forceHttps: true
  skipSSLVerification: false

# URL and language
url: "https://outline.yourdomain.com"
defaultLanguage: en_US

# Rate limiting
rateLimiter:
  enabled: true
  limit: 100
  window: 60

# Auto updates
autoUpdate:
  enabled: false
  telemetry: false

# Logging
logging:
  level: info
  extraDebug: []

# Resources
resources:
  limits:
    cpu: 2000m
    memory: 4Gi
  requests:
    cpu: 1000m
    memory: 2Gi

# Security
podSecurityContext:
  runAsUser: 1001
  runAsGroup: 1001
  fsGroup: 1001
  fsGroupChangePolicy: OnRootMismatch

securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
  runAsNonRoot: true
  runAsUser: 1001
  runAsGroup: 1001

# Ingress
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
  hosts:
    - host: outline.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
    - secretName: outline-tls
      hosts:
        - outline.yourdomain.com

# Database
postgresql:
  enabled: true
  architecture: replication
  auth:
    username: outline
    password: strongpassword
    database: outline
  primary:
    persistence:
      enabled: true
      size: 50Gi
      storageClass: "fast-ssd"
  readReplicas:
    persistence:
      enabled: true
      size: 50Gi
      storageClass: "fast-ssd"

# Redis
redis:
  enabled: true
  architecture: standalone
  auth:
    enabled: true
  master:
    persistence:
      enabled: true
      size: 8Gi

# Storage
fileStorage:
  mode: s3
  s3:
    bucket: outline-prod
    region: us-east-1
    existingSecret: "outline-s3-secret"
    forcePathStyle: true
    acl: private

# Authentication
auth:
  google:
    enabled: true
    clientId: "your-google-client-id"
    clientSecret: "your-google-client-secret"

# SMTP
smtp:
  host: "smtp.yourdomain.com"
  port: 587
  username: "outline"
  existingSecret: "outline-smtp-secret"
  fromEmail: "outline@yourdomain.com"
  replyEmail: "no-reply@yourdomain.com"
  secure: true

# Integrations
integrations:
  sentry:
    enabled: true
    dsn: "https://your-sentry-dsn"
  slack:
    enabled: true
    verificationToken: "your-slack-token"
    appId: "your-slack-app-id"

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
            - outline
        topologyKey: kubernetes.io/hostname

# Monitoring
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "3000"
```

## Next Steps

- Learn about [troubleshooting common issues](./troubleshooting.md)
- Configure [authentication methods](./authentication.md)
- Set up [storage options](./storage.md)
- Configure [database settings](./database.md)
