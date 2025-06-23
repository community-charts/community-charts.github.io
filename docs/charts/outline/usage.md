---
id: usage
title: Outline Chart Usage Guide
sidebar_label: Usage
sidebar_position: 1
description: Get started with Outline Helm chart deployment and basic usage
keywords: [outline, usage, deployment, helm, kubernetes, quickstart, wiki, knowledge-base]
---

# Outline Chart Usage Guide

[Outline](https://www.getoutline.com) is a modern team knowledge base and wiki. This chart lets you deploy Outline on Kubernetes for collaborative documentation and knowledge sharing.

- **Official Website:** [https://www.getoutline.com](https://www.getoutline.com)
- **GitHub Repository:** [https://github.com/outline/outline](https://github.com/outline/outline)
- **Documentation:** [https://docs.getoutline.com/s/guide](https://docs.getoutline.com/s/guide)
- **ArtifactHub:** [Outline Helm Chart](https://artifacthub.io/packages/helm/community-charts/outline)

## Why use this chart?

- Deploy Outline for your team or organization on Kubernetes
- Community-maintained and up-to-date
- Modern, user-friendly wiki platform
- Support for multiple authentication providers
- Flexible storage options (local and S3)
- Built-in PostgreSQL and Redis support

## Quick Start

### Prerequisites

- Kubernetes cluster (v1.23+)
- Helm 3.x
- Ingress controller (optional, for external access)
- Storage class (for persistent storage)

### Installation

1. **Add the Helm repository**:
   ```bash
   helm repo add community-charts https://community-charts.github.io/helm-charts
   helm repo update
   ```

2. **Install Outline**:
   ```bash
   helm install my-outline community-charts/outline -n <your-namespace>
   ```

3. **Check the deployment**:
   ```bash
   kubectl get pods -l app.kubernetes.io/name=outline
   kubectl get svc -l app.kubernetes.io/name=outline
   ```

## Basic Configuration

### Minimal Configuration

Create a `values.yaml` file with basic settings:

```yaml
# Basic deployment
replicaCount: 1

# Enable built-in PostgreSQL
postgresql:
  enabled: true
  auth:
    username: outline
    password: strongpassword
    database: outline
  primary:
    persistence:
      enabled: true
      size: 8Gi

# Enable built-in Redis
redis:
  enabled: true
  auth:
    enabled: true
  master:
    persistence:
      enabled: true
      size: 8Gi

# Local file storage
fileStorage:
  mode: local
  local:
    persistence:
      enabled: true
      size: 8Gi

# Ingress for external access
ingress:
  enabled: true
  className: nginx
  hosts:
    - host: outline.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
```

### Install with Custom Values

```bash
helm install my-outline community-charts/outline \
  -f values.yaml \
  -n <your-namespace>
```

## First-Time Setup

### 1. Access the Application

After installation, access Outline through your configured ingress or port-forward:

```bash
# Port-forward for local access
kubectl port-forward svc/my-outline 3000:3000
```

Then visit `http://localhost:3000` in your browser.

### 2. Create Your First User

On first access, you'll be prompted to create an admin user:

1. Enter your email address
2. Choose a password
3. Complete the setup process

### 3. Configure Authentication

Outline supports multiple authentication methods. Configure them in your `values.yaml`:

```yaml
auth:
  google:
    enabled: true
    clientId: "your-google-client-id"
    clientSecret: "your-google-client-secret"

  github:
    enabled: true
    clientId: "your-github-client-id"
    clientSecret: "your-github-client-secret"
```

### 4. Set Up Email Notifications

Configure SMTP for user invitations and notifications:

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

## Common Operations

### Upgrading Outline

```bash
# Update the repository
helm repo update

# Upgrade the release
helm upgrade my-outline community-charts/outline -n <your-namespace>
```

### Scaling the Application

```bash
# Scale to multiple replicas
helm upgrade my-outline community-charts/outline \
  --set replicaCount=3 \
  -n <your-namespace>
```

### Backup and Restore

#### Database Backup

```bash
# Backup PostgreSQL
kubectl exec -it my-outline-postgresql-0 -- pg_dump -U outline outline > outline-backup.sql
```

#### File Storage Backup

```bash
# Backup local files
kubectl exec -it <outline-pod> -- tar czf /tmp/outline-data.tar.gz /var/lib/outline/data
kubectl cp <outline-pod>:/tmp/outline-data.tar.gz ./outline-data-backup.tar.gz
```

### Uninstalling Outline

```bash
# Uninstall the release
helm uninstall my-outline -n <your-namespace>

# Remove persistent data (optional)
kubectl delete pvc -l app.kubernetes.io/name=outline
```

## Environment Variables

The chart automatically configures these key environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Application port | `3000` |
| `URL` | Application URL | Auto-generated |
| `DATABASE_URL` | PostgreSQL connection | Auto-generated |
| `REDIS_URL` | Redis connection | Auto-generated |
| `FILE_STORAGE` | Storage mode | `local` |
| `SECRET_KEY` | Application secret | Auto-generated |
| `UTILS_SECRET` | Utils secret | Auto-generated |

## Health Checks

Outline provides health check endpoints:

```bash
# Check application health
curl http://localhost:3000/_health

# Check via kubectl
kubectl exec -it <pod-name> -- curl -f http://localhost:3000/_health
```

## Monitoring

### Basic Monitoring

```bash
# Check pod status
kubectl get pods -l app.kubernetes.io/name=outline

# Check resource usage
kubectl top pods -l app.kubernetes.io/name=outline

# Check logs
kubectl logs -f deployment/my-outline
```

### Prometheus Monitoring

Enable Prometheus monitoring:

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "3000"
  prometheus.io/path: "/_health"
```

## Troubleshooting

### Common Issues

1. **Pod not starting**: Check resource limits and database connectivity
2. **Cannot access application**: Verify ingress configuration and DNS
3. **Authentication issues**: Check OAuth provider configuration
4. **File upload failures**: Verify storage configuration and permissions

### Debug Commands

```bash
# Check pod events
kubectl describe pod <pod-name>

# Check application logs
kubectl logs <pod-name>

# Check environment variables
kubectl exec -it <pod-name> -- env | sort

# Test database connectivity
kubectl exec -it <pod-name> -- psql $DATABASE_URL -c "SELECT 1;"
```

### Enable Debug Logging

```yaml
logging:
  level: debug
  extraDebug:
    - http
    - router
    - store
```

## Production Considerations

### Security

- Use strong passwords for database and Redis
- Enable SSL/TLS for all connections
- Configure proper RBAC
- Use existing secrets for sensitive data

### Performance

- Configure appropriate resource limits
- Use SSD storage for database
- Enable connection pooling
- Consider using external databases for high availability

### Backup Strategy

- Regular database backups
- File storage backups
- Test restore procedures
- Monitor backup success

## Configuration Examples

### Development Environment

```yaml
replicaCount: 1
postgresql:
  enabled: true
  auth:
    username: outline
    password: devpassword
    database: outline
  primary:
    persistence:
      enabled: true
      size: 5Gi
redis:
  enabled: true
  auth:
    enabled: true
  master:
    persistence:
      enabled: true
      size: 5Gi
fileStorage:
  mode: local
  local:
    persistence:
      enabled: true
      size: 5Gi
```

### Production Environment

```yaml
replicaCount: 1
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
redis:
  enabled: true
  architecture: standalone
  auth:
    enabled: true
  master:
    persistence:
      enabled: true
      size: 8Gi
fileStorage:
  mode: s3
  s3:
    bucket: outline-prod
    region: us-east-1
    existingSecret: "outline-s3-secret"
    forcePathStyle: true
    acl: private
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: outline.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
    - secretName: outline-tls
      hosts:
        - outline.yourdomain.com
```

## Next Steps

- Learn about [configuration options](./configuration.md)
- Set up [authentication methods](./authentication.md)
- Configure [storage options](./storage.md)
- Set up [database configuration](./database.md)
- Explore [advanced configuration options](./advanced-configuration.md)
- Learn about [troubleshooting common issues](./troubleshooting.md)
