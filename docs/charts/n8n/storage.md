---
id: storage
title: n8n Storage Configuration
sidebar_label: Storage
sidebar_position: 6
description: Complete guide to configuring binary data storage for n8n including filesystem, S3-compatible storage, and MinIO integration
keywords: [n8n, storage, binary data, s3, filesystem, minio, blob, object storage, kubernetes]
---

# n8n Storage Configuration

n8n stores binary data (files, images, documents) separately from workflow metadata. This guide covers all storage options and their configuration for different deployment scenarios.

:::info
**Binary Data Storage:** Binary data includes files uploaded through workflows, images, documents, and other binary content. Choose the storage option that best fits your deployment architecture.
:::

## Storage Options Overview

### Default Storage (In-Memory)
- **Use Case:** Development, testing, small deployments
- **Pros:** Simple setup, no external dependencies
- **Cons:** Data lost on pod restart, limited by memory
- **Storage:** In-memory storage

### Filesystem Storage
- **Use Case:** Single-node deployments, local storage
- **Pros:** Persistent data, simple configuration
- **Cons:** Not suitable for multi-node deployments
- **Storage:** Local filesystem with persistent volumes

### S3-Compatible Storage
- **Use Case:** Production, multi-node, cloud deployments
- **Pros:** Scalable, reliable, cloud-native
- **Cons:** Requires external storage service
- **Storage:** Object storage (AWS S3, MinIO, etc.)

:::warning
**Production Storage:** Default in-memory storage is not suitable for production. Use filesystem storage for single-node deployments or S3-compatible storage for multi-node deployments.
:::

## Default Storage Configuration

:::tip
**Development Use:** Default storage is perfect for development and testing environments where data persistence is not critical.
:::

### Basic Default Storage

```yaml
binaryData:
  mode: "default"
```

## Filesystem Storage Configuration

:::note
**Single Node Only:** Filesystem storage is only suitable for single-node deployments. For queue mode or multi-node setups, use S3-compatible storage.
:::

### Basic Filesystem Storage

```yaml
binaryData:
  mode: "filesystem"
  localStoragePath: "/data/n8n"
```

### Filesystem with Persistent Volume

```yaml
binaryData:
  mode: "filesystem"
  localStoragePath: "/data/n8n"

# Mount persistent volume
main:
  volumes:
    - name: n8n-binary-data
      persistentVolumeClaim:
        claimName: n8n-binary-pvc
  volumeMounts:
    - name: n8n-binary-data
      mountPath: /data
```

### Filesystem with Custom Storage Class

```yaml
binaryData:
  mode: "filesystem"
  localStoragePath: "/data/n8n"

# Create PVC with specific storage class
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: n8n-binary-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 100Gi
```

## S3-Compatible Storage Configuration

:::tip
**Production Recommendation:** S3-compatible storage is the recommended option for production deployments, especially for queue mode or multi-node setups.
:::

### AWS S3 Configuration

```yaml
binaryData:
  mode: "s3"
  s3:
    host: s3.amazonaws.com
    bucketName: n8n-binary-data
    bucketRegion: us-east-1
    accessKey: your-access-key
    accessSecret: your-secret-key
```

:::warning
**Security:** Never hardcode S3 credentials in your values file. Use Kubernetes secrets or IAM roles for secure credential management.
:::

### AWS S3 with IAM Roles (EKS)

```yaml
binaryData:
  mode: "s3"
  s3:
    host: s3.amazonaws.com
    bucketName: n8n-binary-data
    bucketRegion: us-east-1

# Use IAM role instead of access keys
main:
  serviceAccount:
    annotations:
      eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/n8n-s3-role
```

:::info
**IAM Best Practice:** Using IAM roles is the recommended approach for AWS EKS deployments as it eliminates the need to manage access keys.
:::

### Google Cloud Storage

```yaml
binaryData:
  mode: "s3"
  s3:
    host: storage.googleapis.com
    bucketName: n8n-binary-data
    bucketRegion: us-central1
    accessKey: your-gcs-access-key
    accessSecret: your-gcs-secret-key
```

### Azure Blob Storage

```yaml
binaryData:
  mode: "s3"
  s3:
    host: your-storage-account.blob.core.windows.net
    bucketName: n8n-binary-data
    bucketRegion: eastus
    accessKey: your-storage-account-name
    accessSecret: your-storage-account-key
```

### DigitalOcean Spaces

```yaml
binaryData:
  mode: "s3"
  s3:
    host: nyc3.digitaloceanspaces.com
    bucketName: n8n-binary-data
    bucketRegion: nyc3
    accessKey: your-spaces-access-key
    accessSecret: your-spaces-secret-key
```

### S3 with Kubernetes Secrets

```yaml
# Create secret for S3 credentials
apiVersion: v1
kind: Secret
metadata:
  name: s3-credentials
type: Opaque
data:
  access-key-id: <base64-encoded-access-key>
  secret-access-key: <base64-encoded-secret-key>
```

```yaml
# Use secret in configuration
binaryData:
  mode: "s3"
  s3:
    host: s3.amazonaws.com
    bucketName: n8n-binary-data
    bucketRegion: us-east-1
    existingSecret: s3-credentials
```

### S3 with Custom Endpoint

```yaml
binaryData:
  mode: "s3"
  s3:
    host: s3.yourcompany.com
    bucketName: n8n-binary-data
    bucketRegion: us-east-1
    accessKey: your-access-key
    accessSecret: your-secret-key
```

## MinIO Integration

### MinIO with Chart

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
  users:
    - accessKey: n8n-user
      secretKey: your-secret-key
      policy: n8n-policy
  policies:
    - name: n8n-policy
      statements:
        - actions:
            - "s3:AbortMultipartUpload"
            - "s3:GetObject"
            - "s3:DeleteObject"
            - "s3:PutObject"
            - "s3:ListMultipartUploadParts"
          resources:
            - "arn:aws:s3:::n8n-bucket/*"
        - actions:
            - "s3:GetBucketLocation"
            - "s3:ListBucket"
            - "s3:ListBucketMultipartUploads"
          resources:
            - "arn:aws:s3:::n8n-bucket"
```

### MinIO High Availability

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
  mode: distributed
  rootUser: minioadmin
  rootPassword: minioadmin123
  replicas: 4
  drivesPerNode: 1
  persistence:
    enabled: true
    size: 20Gi
  buckets:
    - name: n8n-bucket
      policy: none
      versioning: false
  users:
    - accessKey: n8n-user
      secretKey: your-secret-key
      policy: n8n-policy
```

### MinIO with Ingress

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
  ingress:
    enabled: true
    hosts:
      - minio.yourdomain.com
    path: /
  consoleIngress:
    enabled: true
    hosts:
      - minio-console.yourdomain.com
    path: /
```

## Storage Migration

### From Default to Filesystem

1. **Backup current data** (if any)
2. **Update configuration**:

```yaml
binaryData:
  mode: "filesystem"
  localStoragePath: "/data/n8n"
```

3. **Create persistent volume**:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: n8n-binary-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

4. **Mount volume**:

```yaml
main:
  volumes:
    - name: n8n-binary-data
      persistentVolumeClaim:
        claimName: n8n-binary-pvc
  volumeMounts:
    - name: n8n-binary-data
      mountPath: /data
```

### From Filesystem to S3

1. **Backup filesystem data**:

```bash
# Copy data from pod
kubectl cp <namespace>/<n8n-pod>:/data/n8n ./n8n-backup
```

2. **Upload to S3**:

```bash
# Upload to S3 bucket
aws s3 sync ./n8n-backup s3://n8n-binary-data/
```

3. **Update configuration**:

```yaml
binaryData:
  mode: "s3"
  s3:
    host: s3.amazonaws.com
    bucketName: n8n-binary-data
    bucketRegion: us-east-1
    accessKey: your-access-key
    accessSecret: your-secret-key
```

### From S3 to Different S3

1. **Sync between buckets**:

```bash
# Sync from old to new bucket
aws s3 sync s3://old-n8n-bucket s3://new-n8n-bucket
```

2. **Update configuration**:

```yaml
binaryData:
  mode: "s3"
  s3:
    host: s3.amazonaws.com
    bucketName: new-n8n-bucket
    bucketRegion: us-east-1
    accessKey: your-access-key
    accessSecret: your-secret-key
```

## Performance Tuning

### Filesystem Performance

```yaml
binaryData:
  mode: "filesystem"
  localStoragePath: "/data/n8n"

# Use high-performance storage
main:
  volumes:
    - name: n8n-binary-data
      persistentVolumeClaim:
        claimName: n8n-binary-pvc
  volumeMounts:
    - name: n8n-binary-data
      mountPath: /data
```

## Security Configuration

### S3 Security Best Practices

```yaml
binaryData:
  mode: "s3"
  s3:
    host: s3.amazonaws.com
    bucketName: n8n-binary-data
    bucketRegion: us-east-1
    existingSecret: s3-credentials

# Use IAM roles for EKS
main:
  serviceAccount:
    annotations:
      eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/n8n-s3-role
```

### MinIO Security

```yaml
minio:
  enabled: true
  mode: standalone
  rootUser: minioadmin
  rootPassword: minioadmin123
  persistence:
    enabled: true
    size: 20Gi
  users:
    - accessKey: n8n-user
      secretKey: your-secret-key
      policy: n8n-policy
  policies:
    - name: n8n-policy
      statements:
        - actions:
            - "s3:AbortMultipartUpload"
            - "s3:GetObject"
            - "s3:DeleteObject"
            - "s3:PutObject"
            - "s3:ListMultipartUploadParts"
          resources:
            - "arn:aws:s3:::n8n-bucket/*"
        - actions:
            - "s3:GetBucketLocation"
            - "s3:ListBucket"
            - "s3:ListBucketMultipartUploads"
          resources:
            - "arn:aws:s3:::n8n-bucket"
```

### Network Policies

```yaml
# Network policy for S3 access
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: n8n-s3-policy
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: n8n
  policyTypes:
    - Egress
  egress:
    - to: []
      ports:
        - protocol: TCP
          port: 443  # HTTPS for S3
        - protocol: TCP
          port: 80   # HTTP for S3
```

## Monitoring and Observability

### Storage Metrics

```yaml
serviceMonitor:
  enabled: true
  include:
    defaultMetrics: true
    cacheMetrics: true
```

### Storage Health Checks

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

## Pod Affinity and Anti-Affinity

:::tip
**Storage Affinity:** Proper affinity configuration can optimize storage performance by ensuring pods are placed on nodes with optimal storage access.
:::

:::warning
**Deprecation Notice:** The top-level `affinity` field is deprecated. Use the specific affinity configurations under `main`, `worker`, and `webhook` blocks instead.
:::

### Affinity for Storage Optimization

#### Co-locate with Storage Nodes

```yaml
# Place pods on nodes with fast storage
main:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: storage-type
            operator: In
            values:
            - ssd
            - nvme

worker:
  mode: queue
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: storage-type
            operator: In
            values:
            - ssd
            - nvme
```

#### Spread Pods for Storage Load Distribution

```yaml
# Distribute storage load across nodes
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

#### Zone Distribution for Storage Resilience

```yaml
# Distribute pods across zones for storage availability
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

#### Node Affinity for Local Storage

```yaml
# Use local storage nodes when available
main:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: local-storage
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
          - key: local-storage
            operator: In
            values:
            - "true"
```

:::info
**Storage Benefits:** Proper affinity configuration ensures optimal storage performance by placing pods on nodes with appropriate storage capabilities and distributing storage load effectively.
:::

## Troubleshooting

### Common Storage Issues

#### S3 Connection Issues

```bash
# Check S3 credentials
kubectl get secret s3-credentials -o yaml

# Test S3 connectivity
kubectl exec -it <n8n-pod> -- curl -I https://s3.amazonaws.com

# Check n8n logs for S3 errors
kubectl logs -l app.kubernetes.io/name=n8n | grep -i s3
```

#### Filesystem Permission Issues

```bash
# Check volume permissions
kubectl exec -it <n8n-pod> -- ls -la /data

# Fix permissions if needed
kubectl exec -it <n8n-pod> -- chown -R 1000:1000 /data
```

#### MinIO Issues

```bash
# Check MinIO pod status
kubectl get pods -l app.kubernetes.io/name=minio

# Check MinIO logs
kubectl logs -l app.kubernetes.io/name=minio

# Test MinIO connectivity
kubectl exec -it <n8n-pod> -- curl -I http://minio-service:9000
```

### Storage Performance Issues

#### Filesystem Performance

```yaml
# Use high-performance storage class
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: n8n-binary-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd  # Use SSD storage
  resources:
    requests:
      storage: 100Gi
```

## Best Practices

### Security
- Use IAM roles instead of access keys when possible
- Store credentials in Kubernetes secrets
- Enable bucket encryption for sensitive data
- Use network policies to restrict access
- Regularly rotate access keys

### Performance
- Use S3 for production workloads
- Configure appropriate file size limits
- Enable cleanup to prevent storage bloat
- Use high-performance storage for filesystem mode
- Monitor storage usage and costs

### Reliability
- Use S3 for multi-node deployments
- Enable versioning for critical data
- Set up backup strategies
- Monitor storage health
- Test disaster recovery procedures

### Cost Optimization
- Configure appropriate TTL for binary data
- Use lifecycle policies for S3 buckets
- Monitor storage usage and costs
- Clean up unused data regularly
- Use appropriate storage classes

## Next Steps

- [Usage Guide](./usage.md) - Quick start and basic deployment
- [Configuration Guide](./configuration.md) - Detailed configuration options
- [Database Setup](./database-setup.md) - PostgreSQL and external database configuration
- [Queue Mode Setup](./queue-mode.md) - Distributed execution with Redis
- [Monitoring Setup](./monitoring.md) - Metrics and observability
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
