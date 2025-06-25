---
id: storage
title: Outline Storage Configuration
sidebar_label: Storage
sidebar_position: 4
description: Configure file storage for Outline including local storage and S3-compatible storage
keywords: [outline, storage, s3, local, minio, file-storage, kubernetes, helm]
---

# Storage Configuration

Outline supports multiple file storage backends for storing documents, images, and other files. This guide covers all available storage options and their configuration.

## Storage Modes

Outline supports two storage modes:

- **Local**: Files stored on local filesystem with optional persistence
- **S3**: Files stored in S3-compatible object storage

## Local File Storage

Local storage stores files on the container's filesystem with optional Kubernetes persistence.

### Basic Local Storage

```yaml
fileStorage:
  mode: local
  local:
    rootDir: /var/lib/outline/data
    persistence:
      enabled: false
```

### Local Storage with Persistence

Enable persistent storage for local file storage:

```yaml
fileStorage:
  mode: local
  local:
    rootDir: /var/lib/outline/data
    persistence:
      enabled: true
      size: 8Gi
      accessModes:
        - ReadWriteOnce
      storageClass: "standard"
```

### Advanced Local Storage Configuration

```yaml
fileStorage:
  mode: local
  local:
    rootDir: /var/lib/outline/data
    persistence:
      enabled: true
      size: 20Gi
      accessModes:
        - ReadWriteOnce
      storageClass: "fast-ssd"
      existingClaim: ""  # Use existing PVC
      annotations:
        backup.kubernetes.io/enabled: "true"
```

## S3-Compatible Storage

S3 storage allows you to use any S3-compatible object storage service.

### Basic S3 Configuration

```yaml
fileStorage:
  mode: s3
  s3:
    bucket: outline
    region: us-east-1
    accessKeyId: "your-access-key"
    secretAccessKey: "your-secret-key"
    forcePathStyle: true
    acl: private
```

### S3 with Custom Endpoint

For S3-compatible services like MinIO, Backblaze B2, or DigitalOcean Spaces:

```yaml
fileStorage:
  mode: s3
  s3:
    bucket: outline
    region: us-east-1
    baseUrl: "https://your-s3-compatible-endpoint"
    accessKeyId: "your-access-key"
    secretAccessKey: "your-secret-key"
    forcePathStyle: true
    acl: private
```

### S3 with Existing Secret

Use an existing Kubernetes secret for S3 credentials:

```yaml
fileStorage:
  mode: s3
  s3:
    bucket: outline
    region: us-east-1
    existingSecret: "my-s3-secret"  # Must contain access-key-id and secret-access-key keys
    forcePathStyle: true
    acl: private
```

## MinIO Integration

The chart includes built-in MinIO support for S3-compatible storage.

### Enable MinIO

```yaml
minio:
  enabled: true
  rootUser: admin
  rootPassword: strongpassword

  persistence:
    enabled: true
    size: 40Gi
    storageClass: "standard"

  ingress:
    enabled: true
    hosts:
      - minio.yourdomain.com
```

### MinIO with Custom Configuration

```yaml
minio:
  enabled: true
  mode: standalone
  rootUser: admin
  rootPassword: strongpassword

  replicas: 1
  drivesPerNode: 1
  pools: 1

  persistence:
    enabled: true
    size: 100Gi
    storageClass: "fast-ssd"

  resources:
    requests:
      memory: 1Gi

  ingress:
    enabled: true
    hosts:
      - minio.yourdomain.com

  consoleIngress:
    enabled: true
    hosts:
      - minio-console.yourdomain.com
```

### MinIO Buckets and Policies

Configure MinIO buckets and access policies:

```yaml
minio:
  enabled: true
  rootUser: admin
  rootPassword: strongpassword

  buckets:
    - name: outline
      policy: none
      purge: false
      versioning: false

  policies:
    - name: outline-policy
      statements:
        - actions:
            - "s3:AbortMultipartUpload"
            - "s3:GetObject"
            - "s3:DeleteObject"
            - "s3:PutObject"
            - "s3:ListMultipartUploadParts"
          resources:
            - "arn:aws:s3:::outline/*"
        - actions:
            - "s3:GetBucketLocation"
            - "s3:ListBucket"
            - "s3:ListBucketMultipartUploads"
          resources:
            - "arn:aws:s3:::outline"

  users:
    - accessKey: outline
      secretKey: Change_Me
      policy: outline-policy
```

## File Upload Limits

Configure file upload size limits:

```yaml
fileStorage:
  mode: local  # or s3
  uploadMaxSize: "262144000"  # 250MB in bytes
  importMaxSize: "524288000"  # 500MB for imports
  workspaceImportMaxSize: "1048576000"  # 1GB for workspace imports
```

## Storage Recommendations

### Development Environment

```yaml
fileStorage:
  mode: local
  local:
    rootDir: /var/lib/outline/data
    persistence:
      enabled: true
      size: 5Gi
      storageClass: "standard"
```

### Production Environment

```yaml
fileStorage:
  mode: s3
  s3:
    bucket: outline-prod
    region: us-east-1
    existingSecret: "outline-s3-secret"
    forcePathStyle: true
    acl: private
```

### High Availability Setup

```yaml
fileStorage:
  mode: s3
  s3:
    bucket: outline-ha
    region: us-east-1
    existingSecret: "outline-s3-secret"
    forcePathStyle: true
    acl: private

minio:
  enabled: true
  mode: distributed
  replicas: 4
  drivesPerNode: 2
  pools: 2
  rootUser: admin
  rootPassword: strongpassword
```

## Environment Variables

The chart automatically sets these environment variables based on your storage configuration:

| Variable | Description | Source |
|----------|-------------|---------|
| `FILE_STORAGE` | Storage mode | `fileStorage.mode` |
| `FILE_STORAGE_UPLOAD_MAX_SIZE` | Upload size limit | `fileStorage.uploadMaxSize` |
| `FILE_STORAGE_IMPORT_MAX_SIZE` | Import size limit | `fileStorage.importMaxSize` |
| `FILE_STORAGE_WORKSPACE_IMPORT_MAX_SIZE` | Workspace import limit | `fileStorage.workspaceImportMaxSize` |
| `FILE_STORAGE_LOCAL_ROOT_DIR` | Local storage directory | `fileStorage.local.rootDir` |
| `AWS_ACCESS_KEY_ID` | S3 access key | `fileStorage.s3.accessKeyId` or MinIO |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key | `fileStorage.s3.secretAccessKey` or MinIO |
| `AWS_S3_UPLOAD_BUCKET_NAME` | S3 bucket name | `fileStorage.s3.bucket` or MinIO |
| `AWS_REGION` | S3 region | `fileStorage.s3.region` |
| `AWS_S3_UPLOAD_BUCKET_URL` | S3 endpoint URL | MinIO ingress or `fileStorage.s3.bucketUrl` |
| `AWS_S3_FORCE_PATH_STYLE` | Force path style | `fileStorage.s3.forcePathStyle` |
| `AWS_S3_ACL` | S3 ACL | `fileStorage.s3.acl` |

## Storage Migration

### From Local to S3

1. **Backup existing data**:
   ```bash
   kubectl exec -it <pod-name> -- tar czf /tmp/outline-backup.tar.gz /var/lib/outline/data
   kubectl cp <pod-name>:/tmp/outline-backup.tar.gz ./outline-backup.tar.gz
   ```

2. **Update configuration**:
   ```yaml
   fileStorage:
     mode: s3
     s3:
       bucket: outline
       region: us-east-1
       existingSecret: "outline-s3-secret"
   ```

3. **Restore data to S3**:
   ```bash
   # Extract and upload to S3 bucket
   tar xzf outline-backup.tar.gz
   aws s3 sync var/lib/outline/data/ s3://outline/
   ```

### From S3 to Local

1. **Download data from S3**:
   ```bash
   aws s3 sync s3://outline/ ./outline-data/
   ```

2. **Update configuration**:
   ```yaml
   fileStorage:
     mode: local
     local:
       rootDir: /var/lib/outline/data
       persistence:
         enabled: true
         size: 20Gi
   ```

3. **Upload data to pod**:
   ```bash
   kubectl cp ./outline-data/ <pod-name>:/var/lib/outline/data/
   ```

## Troubleshooting Storage Issues

### Common Problems

1. **Permission Denied**: Check file permissions and security context
2. **Storage Full**: Increase PVC size or S3 bucket capacity
3. **S3 Connection Issues**: Verify credentials and endpoint configuration
4. **MinIO Not Accessible**: Check MinIO ingress and service configuration

### Debug Commands

```bash
# Check storage configuration
kubectl exec -it <pod-name> -- env | grep -E "(FILE_STORAGE|AWS_)"

# Check local storage
kubectl exec -it <pod-name> -- ls -la /var/lib/outline/data

# Check S3 connectivity
kubectl exec -it <pod-name> -- aws s3 ls s3://outline

# Check MinIO status
kubectl get pods -l app.kubernetes.io/name=minio
```

### Storage Monitoring

Add monitoring annotations for storage tracking:

```yaml
fileStorage:
  local:
    persistence:
      annotations:
        monitoring.kubernetes.io/enabled: "true"
        backup.kubernetes.io/schedule: "daily"
```

## Security Considerations

:::warning
- Use existing secrets for S3 credentials instead of plain text
- Configure proper bucket policies and ACLs
- Enable encryption at rest for sensitive data
- Use IAM roles when possible instead of access keys
:::

## Next Steps

- Set up [database configuration](./database.md)
- Configure [authentication methods](./authentication.md)
- Explore [advanced configuration options](./advanced-configuration.md)
- Learn about [troubleshooting common issues](./troubleshooting.md)
