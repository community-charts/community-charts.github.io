---
id: usage
title: MLflow Chart Usage Guide
sidebar_label: Usage Guide
sidebar_position: 1
description: Complete guide to deploying and configuring MLflow on Kubernetes using the community-maintained Helm chart. Learn about databases, cloud storage, authentication, autoscaling, and monitoring.
keywords: [mlflow, kubernetes, helm, machine learning, mlops, experiment tracking, model management]
---

# MLflow Chart Usage

[MLflow](https://mlflow.org) is an open-source platform for managing the end-to-end machine learning lifecycle, including experiment tracking, model management, and deployment. This Helm chart helps you deploy MLflow on Kubernetes with enterprise-grade features.

:::info
**Quick Links:**
- **Official Website:** [https://mlflow.org](https://mlflow.org)
- **GitHub Repository:** [https://github.com/mlflow/mlflow](https://github.com/mlflow/mlflow)
- **Documentation:** [https://mlflow.org/docs/latest/index.html](https://mlflow.org/docs/latest/index.html)
- **ArtifactHub:** [MLflow Helm Chart](https://artifacthub.io/packages/helm/community-charts/mlflow)
:::

## Why use this chart?

:::tip
**Enterprise Ready:** This chart provides production-grade features that make MLflow suitable for enterprise environments and team collaboration.
:::

- **Production Ready**: Deploy MLflow with PostgreSQL, MySQL, or SQLite backends
- **Cloud Storage Integration**: Support for AWS S3, Google Cloud Storage, and Azure Blob Storage
- **Enterprise Features**: Built-in authentication, LDAP integration, and autoscaling
- **Database Migrations**: Automatic database schema migrations with init containers
- **Monitoring Ready**: Prometheus ServiceMonitor integration
- **Community Maintained**: Regularly updated and tested

## Supported Databases

:::tip
**Database Selection:** Choose your database based on your deployment requirements. PostgreSQL is recommended for production environments.
:::

The chart supports multiple database backends for MLflow:

- **PostgreSQL**: Production-ready with connection pooling and migrations
- **MySQL**: Alternative database with PyMySQL driver support
- **SQLite**: Development and testing (in-memory or file-based)

:::warning
**Production Database:** SQLite is not suitable for production deployments. Use PostgreSQL or MySQL for production environments.
:::

:::danger
**Data Loss Risk:** SQLite stores data in files that can be lost if the pod is deleted. Always use persistent volumes for SQLite in any environment.
:::

## Supported Cloud Providers

:::info
**Enterprise Storage:** Cloud storage integration is essential for production MLflow deployments to handle large model artifacts and datasets.
:::

Enterprise artifact storage integration:

- **AWS S3**: IAM roles, access keys, and MinIO compatibility
- **Google Cloud Storage**: GCS bucket integration with service accounts
- **Azure Blob Storage**: Azure Storage Account with managed identities

:::tip
**Storage Strategy:** Use cloud storage for artifacts to enable team collaboration and ensure data persistence across deployments.
:::

## Quick Start

:::note
**Getting Started:** Follow these steps to get MLflow running quickly. For production deployments, see the detailed configuration examples below.
:::

### 1. Add the Helm Repository

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
```

### 2. Basic Installation with SQLite

```bash
helm install mlflow community-charts/mlflow \
  --namespace mlflow \
  --create-namespace
```

:::tip
**Development Use:** SQLite installation is perfect for development, testing, and single-user scenarios.
:::

### 3. Production Installation with PostgreSQL and S3

```bash
helm install mlflow community-charts/mlflow \
  --namespace mlflow \
  --create-namespace \
  --set backendStore.databaseMigration=true \
  --set backendStore.postgres.enabled=true \
  --set backendStore.postgres.host=your-postgres-host \
  --set backendStore.postgres.database=mlflow \
  --set backendStore.postgres.user=mlflow \
  --set backendStore.postgres.password=your-password \
  --set artifactRoot.s3.enabled=true \
  --set artifactRoot.s3.bucket=your-mlflow-bucket \
  --set artifactRoot.s3.awsAccessKeyId=your-access-key \
  --set artifactRoot.s3.awsSecretAccessKey=your-secret-key
```

:::warning
**Security:** Never hardcode credentials in command line arguments. Use Kubernetes secrets or environment variables for sensitive data.
:::

:::danger
**Production Security:** Always use strong passwords, enable authentication, and configure TLS for production deployments.
:::

## Key Features

:::info
**Enterprise Features:** These features make MLflow production-ready and suitable for enterprise environments.
:::

### Logging Level Control

Configure the verbosity of MLflow logs using the `log.level` value:

```yaml
log:
  enabled: true
  level: info  # Set to debug, info, warning, error, or critical
```

:::tip
**Debugging:** Set `log.level: debug` to get more detailed logs for troubleshooting. Use `info` or higher for production.
:::

### Database Migrations

Enable automatic database schema migrations:

```yaml
backendStore:
  databaseMigration: true
```

:::tip
**Migration Safety:** Database migrations are disabled by default. Enable them only when you're ready to update your database schema.
:::

:::warning
**Migration Backup:** Always backup your database before enabling migrations in production environments.
:::

### Connection Health Checks
Add database availability checks:
```yaml
backendStore:
  databaseConnectionCheck: true
```

:::tip
**Health Monitoring:** Enable connection checks to ensure your MLflow instance can detect database connectivity issues early.
:::

### Authentication

Basic authentication with admin credentials:

```yaml
auth:
  enabled: true
  adminUsername: admin
  adminPassword: your-secure-password
```

:::warning
**Authentication:** Always enable authentication in production environments to secure your MLflow instance.
:::

:::danger
**Default Credentials:** Change default admin credentials immediately after installation. Never use default passwords in production.
:::

### LDAP Integration
Enterprise LDAP authentication:
```yaml
ldapAuth:
  enabled: true
  uri: ldap://your-ldap-server:389
  lookupBind: uid=%s,ou=people,dc=example,dc=com
  searchBaseDistinguishedName: ou=groups,dc=example,dc=com
  adminGroupDistinguishedName: cn=admins,ou=groups,dc=example,dc=com
```

:::info
**Enterprise Integration:** LDAP authentication enables centralized user management and integration with existing enterprise identity systems.
:::

### Autoscaling
Horizontal Pod Autoscaler for production workloads:
```yaml
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
```

:::tip
**Scaling Strategy:** Use autoscaling for dynamic workloads and manual scaling for predictable, steady-state workloads.
:::

:::warning
**Resource Limits:** Set appropriate resource limits when using autoscaling to prevent resource exhaustion.
:::

### Monitoring
Prometheus ServiceMonitor integration:
```yaml
serviceMonitor:
  enabled: true
  interval: 30s
  labels:
    release: prometheus
```

:::tip
**Observability:** Enable monitoring to track MLflow performance, usage patterns, and identify potential issues.
:::

## Configuration Examples

:::info
**Production Examples:** These examples demonstrate common production deployment patterns for different cloud providers and databases.
:::

### PostgreSQL with S3 Artifacts

```yaml
backendStore:
  databaseMigration: true
  postgres:
    enabled: true
    host: postgresql-instance.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
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
```

### MySQL with Azure Blob Storage

```yaml
backendStore:
  databaseMigration: true
  mysql:
    enabled: true
    host: mysql-instance.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
    port: 3306
    database: mlflow
    user: mlflowuser
    password: Pa33w0rd!

artifactRoot:
  azureBlob:
    enabled: true
    container: mlflow
    storageAccount: mystorageaccount
    accessKey: your-access-key
```

:::tip
**Production Setup:** This configuration provides a robust production environment with external database and cloud storage.
:::

### EKS with IAM Roles

:::info
**IAM Best Practice:** Using IAM roles is the recommended approach for AWS EKS deployments as it eliminates the need to manage access keys.
:::

```yaml
serviceAccount:
  create: true
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::account-id:role/iam-role-name

backendStore:
  databaseMigration: true
  postgres:
    enabled: true
    host: postgresql-instance.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
    port: 5432
    database: mlflow
    user: mlflowuser
    password: Pa33w0rd!

artifactRoot:
  s3:
    enabled: true
    bucket: my-mlflow-artifact-root-backend
    # No access keys needed with IAM roles
```

### MinIO Integration (S3-Compatible Storage)

```yaml
backendStore:
  databaseMigration: true
  databaseConnectionCheck: true
  postgres:
    enabled: true
    host: postgres-service
    port: 5432
    database: postgres
    user: postgres
    password: postgres

artifactRoot:
  s3:
    enabled: true
    bucket: mlflow
    awsAccessKeyId: minioadmin
    awsSecretAccessKey: minioadmin

extraEnvVars:
  MLFLOW_S3_ENDPOINT_URL: http://minio-service:9000
  MLFLOW_S3_IGNORE_TLS: "true"

ingress:
  enabled: true
  hosts:
    - host: mlflow.your-domain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
```

:::tip
**Self-Hosted Storage:** MinIO provides S3-compatible storage for environments where you need to keep data on-premises.
:::

### Production Monitoring Setup

```yaml
backendStore:
  databaseMigration: true
  databaseConnectionCheck: true
  postgres:
    enabled: true
    host: postgresql-instance.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
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

serviceMonitor:
  enabled: true
  namespace: monitoring
  interval: 30s
  telemetryPath: /metrics
  labels:
    release: prometheus
  timeout: 10s
  targetLabels: []

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
```

:::info
**Production Monitoring:** This configuration includes comprehensive monitoring and health checks for production environments.
:::

### Proxied Artifact Storage Access

```yaml
backendStore:
  postgres:
    enabled: true
    host: postgres-service
    port: 5432
    database: postgres
    user: postgres
    password: postgres

artifactRoot:
  proxiedArtifactStorage: true
  s3:
    enabled: true
    bucket: mlflow
    awsAccessKeyId: minioadmin
    awsSecretAccessKey: minioadmin

extraEnvVars:
  MLFLOW_S3_ENDPOINT_URL: http://minio-service:9000

extraFlags:
  - serveArtifacts
```

:::tip
**Proxied Storage:** Enable proxied artifact storage when you want MLflow to serve artifacts directly instead of redirecting to storage URLs.
:::

### Static Prefix Configuration

```yaml
extraArgs:
  staticPrefix: /mlflow

ingress:
  enabled: true
  hosts:
    - host: your-domain.com
      paths:
        - path: /mlflow
          pathType: ImplementationSpecific
```

:::info
**URL Customization:** Use static prefix to customize the base URL path for your MLflow instance.
:::

### PVC Usage with SQLite

```yaml
strategy:
  type: Recreate

extraVolumes:
  - name: mlflow-volume
    persistentVolumeClaim:
      claimName: mlflow-pvc

extraVolumeMounts:
  - name: mlflow-volume
    mountPath: /mlflow/data

backendStore:
  defaultSqlitePath: /mlflow/data/mlflow.db

artifactRoot:
  proxiedArtifactStorage: true
  defaultArtifactsDestination: /mlflow/data/mlartifacts

ingress:
  enabled: true
  hosts:
    - host: mlflow.your-domain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
```

:::warning
**SQLite Limitations:** While this setup works, consider PostgreSQL for production environments with multiple users or high data volumes.
:::

## Advanced Configuration

:::info
**Advanced Features:** These configurations provide fine-grained control over MLflow behavior and performance.
:::

### Logging Level

You can control the MLflow logging level via the `log.level` value:

```yaml
log:
  enabled: true
  level: info  # debug, info, warning, error, critical
```

This sets the logging verbosity for the MLflow server. Use `debug` for troubleshooting and `info` or higher for normal operation.

### Custom Environment Variables

```yaml
extraEnvVars:
  # S3 Configuration
  MLFLOW_S3_IGNORE_TLS: "true"  # Skip TLS certificate verification for S3
  MLFLOW_S3_UPLOAD_EXTRA_ARGS: '{"ServerSideEncryption": "aws:kms", "SSEKMSKeyId": "1234"}'  # Extra S3 upload arguments
  MLFLOW_S3_ENDPOINT_URL: "http://minio-service:9000"  # Custom S3 endpoint URL

  # AWS Configuration
  AWS_DEFAULT_REGION: "us-east-1"  # AWS default region
  AWS_CA_BUNDLE: "/some/ca/bundle.pem"  # Custom CA bundle for AWS

  # Google Cloud Storage Configuration
  MLFLOW_GCS_DEFAULT_TIMEOUT: "60"  # GCS transfer timeout in seconds
  MLFLOW_GCS_UPLOAD_CHUNK_SIZE: "104857600"  # GCS upload chunk size (100MB)
  MLFLOW_GCS_DOWNLOAD_CHUNK_SIZE: "104857600"  # GCS download chunk size (100MB)

  # Database Connection Pooling
  MLFLOW_SQLALCHEMYSTORE_POOL_SIZE: "10"  # SQLAlchemy connection pool size
  MLFLOW_SQLALCHEMYSTORE_MAX_OVERFLOW: "20"  # SQLAlchemy max overflow connections
  MLFLOW_SQLALCHEMYSTORE_POOL_RECYCLE: "3600"  # SQLAlchemy pool recycle time

  # Logging and Monitoring
  MLFLOW_LOGGING_LEVEL: "INFO"  # MLflow logging level
  MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING: "true"  # Enable system metrics logging
  MLFLOW_SYSTEM_METRICS_SAMPLING_INTERVAL: "1.0"  # System metrics sampling interval
```

:::tip
**Environment Variables:** Use environment variables to customize MLflow behavior without modifying the container image.
:::

### Resource Management

```yaml
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2
    memory: 4Gi
```

:::warning
**Resource Planning:** Set appropriate resource limits to prevent resource exhaustion and ensure stable performance.
:::

### Ingress Configuration

```yaml
ingress:
  enabled: true
  className: nginx
  hosts:
    - host: mlflow.your-domain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: mlflow-tls
      hosts:
        - mlflow.your-domain.com
```

:::danger
**TLS Security:** Always use TLS certificates in production to encrypt traffic between clients and MLflow.
:::

## Troubleshooting

:::info
**Common Issues:** This section covers the most frequently encountered problems and their solutions.
:::

### Common Issues

1. **Database Connection**: Ensure database credentials and network connectivity
2. **S3 Access**: Verify IAM permissions or access keys
3. **Authentication**: Check admin credentials and LDAP configuration
4. **Migrations**: Enable `databaseMigration: true` for schema updates

### Debug Commands

```bash
# Check pod status
kubectl get pods -n mlflow

# View logs
kubectl logs -f deployment/mlflow -n mlflow

# Check database connectivity
kubectl exec -it deployment/mlflow -n mlflow -- \
  python -c "import mlflow; print(mlflow.get_tracking_uri())"

# Test S3 access
kubectl exec -it deployment/mlflow -n mlflow -- \
  aws s3 ls s3://your-bucket
```

:::tip
**Debugging:** Use these commands to diagnose common issues with MLflow deployments.
:::

## Next Steps

:::tip
**Getting Started:** Follow these guides in order for a complete MLflow setup experience.
:::

- [Basic Installation with SQLite](/docs/charts/mlflow/basic-installation) - Get started quickly
- [PostgreSQL Backend Installation](/docs/charts/mlflow/postgresql-backend-installation) - Production database setup
- [MySQL Backend Installation](/docs/charts/mlflow/mysql-backend-installation) - Alternative database setup
- [AWS S3 Integration](/docs/charts/mlflow/aws-s3-integration) - Cloud artifact storage
- [Azure Blob Storage Integration](/docs/charts/mlflow/azure-blob-storage-integration) - Azure storage setup
- [Authentication Configuration](/docs/charts/mlflow/authentication-configuration) - Secure access
- [Autoscaling Setup](/docs/charts/mlflow/autoscaling-setup) - Handle high workloads
