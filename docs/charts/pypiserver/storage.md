---
id: storage
title: PyPI Server Storage
sidebar_label: Storage
sidebar_position: 3
description: Configure persistent storage for PyPI Server packages, authentication files, and data persistence
keywords: [pypiserver storage, persistent volumes, volume mounts, kubernetes storage, python packages]
---

# Storage

PyPI Server requires persistent storage to maintain Python packages across pod restarts and deployments. This page covers storage configuration options and best practices.

## Storage Overview

PyPI Server stores packages in a directory structure that mirrors the PyPI format. The main storage requirements are:

- **Package Storage**: Python package files (`.whl`, `.tar.gz`, etc.)
- **Authentication Files**: Password files for protected packages
- **Configuration**: Server configuration and metadata

## Basic Storage Configuration

### Persistent Volume Claims

Create a PersistentVolumeClaim for package storage:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pypi-packages-pvc
  namespace: your-namespace
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: standard
```

### Chart Configuration

Configure the chart to use persistent storage:

```yaml
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
```

## Storage Classes

### Local Storage

For single-node deployments or development:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pypi-packages-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: local-storage
```

### Network Storage

For multi-node clusters, use network-attached storage:

```yaml
# NFS Example
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pypi-packages-pvc
spec:
  accessModes:
    - ReadWriteMany  # Allows multiple pods to access
  resources:
    requests:
      storage: 50Gi
  storageClassName: nfs-storage
```

### Cloud Storage

For cloud environments, use cloud-native storage:

```yaml
# AWS EBS Example
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pypi-packages-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
  storageClassName: gp3
```

## Authentication Storage

### Password File Storage

Store authentication credentials securely:

```yaml
# Create a secret with password file
apiVersion: v1
kind: Secret
metadata:
  name: pypi-auth
type: Opaque
stringData:
  .htpasswd: |
    admin:$apr1$xyz123$hashedpassword
    user:$apr1$abc456$hashedpassword
```

### Mount Authentication Files

```yaml
volumes:
  - name: auth
    secret:
      secretName: pypi-auth

volumeMounts:
  - name: auth
    mountPath: "/data/.htpasswd"
    subPath: ".htpasswd"
```

## High Availability Storage

### Shared Storage for Multiple Replicas

For high availability with multiple replicas:

```yaml
replicaCount: 3

volumes:
  - name: packages
    persistentVolumeClaim:
      claimName: pypi-packages-pvc

volumeMounts:
  - name: packages
    mountPath: "/data/packages"

# Use ReadWriteMany access mode
# storageClassName: nfs-storage
```

### Storage Backups

Implement regular backups for your package storage:

```yaml
# Example backup job
apiVersion: batch/v1
kind: CronJob
metadata:
  name: pypi-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: alpine:latest
            command:
            - /bin/sh
            - -c
            - |
              tar -czf /backup/pypi-packages-$(date +%Y%m%d).tar.gz /data/packages
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

## Storage Performance

### SSD Storage

For better performance with large package repositories:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pypi-packages-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
  storageClassName: ssd-storage  # Use SSD storage class
```

### Storage Monitoring

Monitor storage usage and performance:

```yaml
# Add storage monitoring annotations
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```

## Complete Storage Example

Here's a complete example with all storage components:

```yaml
# values.yaml
replicaCount: 1

volumes:
  - name: packages
    persistentVolumeClaim:
      claimName: pypi-packages-pvc
  - name: auth
    secret:
      secretName: pypi-auth
  - name: config
    configMap:
      name: pypi-config

volumeMounts:
  - name: packages
    mountPath: "/data/packages"
  - name: auth
    mountPath: "/data/.htpasswd"
    subPath: ".htpasswd"
  - name: config
    mountPath: "/data/config"
    readOnly: true

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
```

### Required Kubernetes Resources

```yaml
# pypi-storage.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pypi-packages-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi
  storageClassName: standard

---
apiVersion: v1
kind: Secret
metadata:
  name: pypi-auth
type: Opaque
stringData:
  .htpasswd: |
    admin:$apr1$xyz123$hashedpassword

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: pypi-config
data:
  server.conf: |
    [server]
    port = 8080
    interface = 0.0.0.0
```

## Storage Best Practices

### 1. Size Planning

- **Development**: 10-50 Gi
- **Production**: 100+ Gi (depending on package count)
- **Enterprise**: 500+ Gi with monitoring

### 2. Access Patterns

- **Single Instance**: `ReadWriteOnce`
- **Multiple Replicas**: `ReadWriteMany` with shared storage
- **Backup**: Separate storage for backups

### 3. Security

- Use secrets for authentication files
- Implement proper RBAC for storage access
- Encrypt storage at rest

### 4. Performance

- Use SSD storage for better I/O performance
- Implement caching strategies
- Monitor storage metrics

### 5. Backup Strategy

- Regular automated backups
- Test restore procedures
- Store backups in different locations

## Troubleshooting Storage Issues

### Common Issues

1. **Permission Denied**: Check security context and file permissions
2. **Storage Full**: Monitor usage and implement cleanup policies
3. **Mount Failures**: Verify PVC exists and is bound
4. **Performance Issues**: Consider SSD storage or caching

### Debug Commands

```bash
# Check PVC status
kubectl get pvc

# Check pod storage
kubectl exec -it <pod-name> -- df -h

# Check storage permissions
kubectl exec -it <pod-name> -- ls -la /data/

# Check storage usage
kubectl exec -it <pod-name> -- du -sh /data/packages/
```

## Next Steps

- Learn about [advanced configuration](./advanced-configuration.md) options
- Explore [troubleshooting](./troubleshooting.md) for storage issues
- Review [configuration](./configuration.md) for other settings
- Check the [usage guide](./usage.md) for deployment examples
