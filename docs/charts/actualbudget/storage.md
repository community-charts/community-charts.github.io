---
id: storage
title: Storage and Persistence
sidebar_label: Storage
sidebar_position: 4
description: Configure persistent storage and data management for Actual Budget deployments
keywords: [actual, actualbudget, personal finance, storage, persistence, pvc, kubernetes, data]
---

# Storage and Persistence

Proper storage configuration is crucial for Actual Budget deployments to ensure data persistence across pod restarts and updates.

## Storage Architecture

Actual Budget uses a specific directory structure for data storage:

```
/data/
├── server-files/     # Server configuration and user accounts
│   └── account.sqlite
└── user-files/       # Budget files and user data
    └── *.blob
```

## Basic Persistence Configuration

Enable persistent storage with default settings:

```yaml
persistence:
  enabled: true
  size: 10Gi
  accessModes:
    - ReadWriteOnce
  storageClass: ""
```

## Advanced Persistence Options

### Storage Class Configuration

Specify a custom storage class for your cluster:

```yaml
persistence:
  enabled: true
  size: 20Gi
  storageClass: "fast-ssd"
  accessModes:
    - ReadWriteOnce
```

### Using Existing PVC

Attach to an existing PersistentVolumeClaim:

```yaml
persistence:
  enabled: true
  existingClaim: "my-actualbudget-data"
  # Other settings are ignored when using existingClaim
```

### Multiple Access Modes

For shared storage scenarios:

```yaml
persistence:
  enabled: true
  size: 50Gi
  accessModes:
    - ReadWriteMany  # For NFS or similar shared storage
  storageClass: "nfs-storage"
```

### Subpath Configuration

Mount to a subdirectory within the PVC:

```yaml
persistence:
  enabled: true
  size: 100Gi
  subPath: "actualbudget"
  accessModes:
    - ReadWriteOnce
```

## File Storage Configuration

Configure the directory structure for data storage:

```yaml
files:
  dataDirectory: /data
  server: /data/server-files
  user: /data/user-files
```

:::info
The `dataDirectory` is the base mount point, while `server` and `user` are subdirectories within it.
:::

## Storage Recommendations

### Development Environment

```yaml
persistence:
  enabled: true
  size: 5Gi
  accessModes:
    - ReadWriteOnce
  storageClass: "standard"
```

### Production Environment

```yaml
persistence:
  enabled: true
  size: 50Gi
  accessModes:
    - ReadWriteOnce
  storageClass: "fast-ssd"
  annotations:
    backup.kubernetes.io/enabled: "true"
```

### High Availability Setup

```yaml
persistence:
  enabled: true
  size: 100Gi
  accessModes:
    - ReadWriteMany  # For shared storage
  storageClass: "nfs-storage"
```

## Backup and Recovery

### Manual Backup

Create a backup of your data:

```bash
# Create a backup pod
kubectl run backup-actualbudget --rm -it --image=busybox --restart=Never --overrides='
{
  "spec": {
    "volumes": [
      {
        "name": "data",
        "persistentVolumeClaim": {
          "claimName": "actualbudget-data"
        }
      }
    ],
    "containers": [
      {
        "name": "backup",
        "image": "busybox",
        "command": ["tar", "czf", "/backup/actualbudget-backup.tar.gz", "/data"],
        "volumeMounts": [
          {
            "name": "data",
            "mountPath": "/data"
          }
        ]
      }
    ]
  }
}'

# Copy backup from pod
kubectl cp backup-actualbudget:/backup/actualbudget-backup.tar.gz ./actualbudget-backup.tar.gz
```

### Automated Backup with CronJob

Create a CronJob for automated backups:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: actualbudget-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: busybox
            command:
            - /bin/sh
            - -c
            - |
              tar czf /backup/actualbudget-$(date +%Y%m%d).tar.gz /data
            volumeMounts:
            - name: data
              mountPath: /data
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: data
            persistentVolumeClaim:
              claimName: actualbudget-data
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-storage
          restartPolicy: OnFailure
```

## Storage Performance Optimization

### Resource Allocation

Ensure adequate resources for storage operations:

```yaml
resources:
  limits:
    cpu: 500m
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 512Mi
```

### Volume Mounts

For additional storage volumes:

```yaml
volumeMounts:
  - name: additional-storage
    mountPath: /data/exports
    subPath: exports

volumes:
  - name: additional-storage
    persistentVolumeClaim:
      claimName: additional-storage-pvc
```

## Troubleshooting Storage Issues

### Common Problems

1. **PVC Pending**: Check storage class availability and capacity
2. **Permission Denied**: Verify security context and file permissions
3. **Storage Full**: Monitor disk usage and increase PVC size
4. **Data Loss**: Ensure persistence is enabled and properly configured

### Debug Commands

```bash
# Check PVC status
kubectl get pvc

# Check pod storage
kubectl exec -it actualbudget-pod -- df -h

# Check file permissions
kubectl exec -it actualbudget-pod -- ls -la /data

# View storage events
kubectl get events --sort-by='.lastTimestamp' | grep -i storage
```

### Storage Monitoring

Add monitoring annotations for storage tracking:

```yaml
persistence:
  enabled: true
  annotations:
    monitoring.kubernetes.io/enabled: "true"
    backup.kubernetes.io/schedule: "daily"
```

## Migration and Scaling

### PVC Expansion

Expand existing PVC (if supported by storage class):

```bash
# Patch PVC to increase size
kubectl patch pvc actualbudget-data -p '{"spec":{"resources":{"requests":{"storage":"50Gi"}}}}'
```

### Data Migration

Migrate data between storage classes:

```bash
# Create new PVC with different storage class
kubectl apply -f new-storage-pvc.yaml

# Copy data using a migration pod
kubectl run migration --rm -it --image=busybox --restart=Never --overrides='
{
  "spec": {
    "volumes": [
      {"name": "old", "persistentVolumeClaim": {"claimName": "old-pvc"}},
      {"name": "new", "persistentVolumeClaim": {"claimName": "new-pvc"}}
    ],
    "containers": [{
      "name": "migration",
      "image": "busybox",
      "command": ["cp", "-r", "/old", "/new"],
      "volumeMounts": [
        {"name": "old", "mountPath": "/old"},
        {"name": "new", "mountPath": "/new"}
      ]
    }]
  }
}'
```

## Next Steps

- Configure [advanced configuration options](./advanced-configuration.md)
- Learn about [troubleshooting common issues](./troubleshooting.md)
- Set up [authentication methods](./authentication.md)
