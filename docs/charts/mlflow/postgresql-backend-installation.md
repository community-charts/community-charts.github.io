---
id: postgresql-backend-installation
title: MLflow PostgreSQL Backend Installation
sidebar_label: PostgreSQL Installation
sidebar_position: 3
description: Complete guide to setting up MLflow with PostgreSQL backend on Kubernetes. Learn about database migrations, connection health checks, and production-ready configurations.
keywords: [mlflow, postgresql, kubernetes, helm, database, migration, production, rds, connection pooling]
---

# PostgreSQL Backend Installation

This guide covers setting up MLflow with PostgreSQL as the backend database. This configuration is recommended for production deployments as it provides better performance, scalability, and data integrity compared to SQLite.

:::info
**Production Database:** PostgreSQL is the recommended database backend for production MLflow deployments, offering better performance, scalability, and concurrent access capabilities.
:::

```mermaid
architecture-beta
  group k8s(cloud)[Kubernetes Cluster]

  service ui(internet)[User]

  service db(database)[PostgreSQL DB]
  service server(server)[MLflow Server] in k8s

  server:R --> L:db
  ui:R --> L:server
```

## Prerequisites

:::warning
**Requirements:** Ensure you have all prerequisites installed and configured before proceeding with PostgreSQL setup.
:::

- Kubernetes cluster (v1.16+)
- Helm 3.x installed
- kubectl configured
- PostgreSQL database (can be deployed in-cluster or external)
- Storage class for PVC (if using in-cluster PostgreSQL)

## Option 1: Using External PostgreSQL

:::tip
**External Database:** Using external PostgreSQL (like RDS, Cloud SQL, or Azure Database) is recommended for production as it provides managed backups, high availability, and easier maintenance.
:::

### 1. Prepare PostgreSQL Database

Create a database and user for MLflow:

```sql
CREATE DATABASE mlflow;
CREATE USER mlflow_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE mlflow TO mlflow_user;
\c mlflow mlflow_user
CREATE SCHEMA mlflow;
ALTER ROLE mlflow_user IN DATABASE mlflow
SET search_path = mlflow;
```

### 2. Install MLflow with External PostgreSQL

```bash
helm install mlflow community-charts/mlflow \
  --namespace mlflow \
  --set backendStore.databaseMigration=true \
  --set backendStore.postgres.enabled=true \
  --set backendStore.postgres.host=your-postgres-host \
  --set backendStore.postgres.port=5432 \
  --set backendStore.postgres.database=mlflow \
  --set backendStore.postgres.user=mlflow_user \
  --set backendStore.postgres.password=your_secure_password
```

:::warning
**Security:** Never hardcode database passwords in command line arguments. Use Kubernetes secrets or environment variables for sensitive data.
:::

## Option 2: Deploy PostgreSQL in Kubernetes

:::info
**In-Cluster Database:** Deploying PostgreSQL in Kubernetes is suitable for development and testing environments, but external managed databases are recommended for production.
:::

### 1. Install PostgreSQL using Bitnami Chart

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

helm install postgres bitnami/postgresql \
  --namespace mlflow \
  --set auth.postgresPassword=mlflow_password \
  --set auth.database=mlflow \
  --set primary.persistence.size=10Gi
```

### 2. Get PostgreSQL Connection Details

```bash
export POSTGRES_PASSWORD=$(kubectl get secret --namespace mlflow postgres -o jsonpath="{.data.postgres-password}" | base64 -d)
export POSTGRES_HOST=$(kubectl get svc --namespace mlflow postgres -o jsonpath="{.spec.clusterIP}")
```

### 3. Install MLflow with In-Cluster PostgreSQL

```bash
helm install mlflow community-charts/mlflow \
  --namespace mlflow \
  --set backendStore.databaseMigration=true \
  --set backendStore.postgres.enabled=true \
  --set backendStore.postgres.host=$POSTGRES_HOST \
  --set backendStore.postgres.port=5432 \
  --set backendStore.postgres.database=mlflow \
  --set backendStore.postgres.user=postgres \
  --set backendStore.postgres.password=$POSTGRES_PASSWORD
```

## Option 3: Using Existing Database Secret

:::tip
**Secret Management:** Using Kubernetes secrets for database credentials is a security best practice that keeps sensitive data out of configuration files.
:::

### 1. Create Database Secret

```bash
kubectl create secret generic postgres-database-secret \
  --namespace mlflow \
  --from-literal=username=mlflow_user \
  --from-literal=password=your_secure_password
```

### 2. Configure MLflow with Existing Secret

```yaml
backendStore:
  databaseMigration: true
  postgres:
    enabled: true
    host: postgresql-instance1.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
    port: 5432
    database: mlflow

  existingDatabaseSecret:
    name: postgres-database-secret
    usernameKey: username
    passwordKey: password
```

## Configuration with Values File

```mermaid
architecture-beta
  group k8s(cloud)[Kubernetes Cluster]

  service ui(internet)[User]

  service db(database)[PostgreSQL DB]
  service server(server)[MLflow Server] in k8s
  service volume(disk)[PVC] in k8s

  ui:R --> L:server
  server:R --> L:volume
  server:B --> T:db
```

:::info
**Complete Setup:** This configuration demonstrates a production-ready MLflow setup with PostgreSQL backend and proper resource management.
:::

Create a `values.yaml` file:

```yaml
backendStore:
  databaseMigration: true
  databaseConnectionCheck: true
  postgres:
    enabled: true
    host: postgresql-instance1.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
    port: 5432
    database: mlflow
    user: mlflowuser
    password: Pa33w0rd!

artifactRoot:
  defaultArtifactRoot: ./mlruns
  defaultArtifactsDestination: ./mlartifacts

service:
  type: ClusterIP
  port: 5000

ingress:
  enabled: false

persistence:
  enabled: true
  size: 10Gi

# Optional: Configure PostgreSQL connection pooling
extraEnvVars:
  MLFLOW_SQLALCHEMYSTORE_POOL_SIZE: "10"  # SQLAlchemy connection pool size
  MLFLOW_SQLALCHEMYSTORE_MAX_OVERFLOW: "20"  # SQLAlchemy max overflow connections
  MLFLOW_SQLALCHEMYSTORE_POOL_RECYCLE: "3600"  # SQLAlchemy pool recycle time
  MLFLOW_SQLALCHEMYSTORE_ECHO: "false"  # Enable SQLAlchemy query logging
```

Install with the configuration:

```bash
helm install mlflow community-charts/mlflow \
  --namespace mlflow \
  -f values.yaml
```

## Database Migration Features

:::tip
**Migration Safety:** Database migrations are disabled by default. Enable them only when you're ready to update your database schema.
:::

### Automatic Schema Migrations

The chart supports automatic database schema migrations using init containers:

```yaml
backendStore:
  databaseMigration: true  # Enable automatic migrations
  postgres:
    enabled: true
    host: your-postgres-host
    database: mlflow
    user: mlflowuser
    password: your-password
```

### Database Connection Health Checks

Add database availability checks before starting MLflow:

```yaml
backendStore:
  databaseConnectionCheck: true  # Enable connection checks
  postgres:
    enabled: true
    host: your-postgres-host
    database: mlflow
    user: mlflowuser
    password: your-password
```

### Migration from SQLite

When migrating from SQLite to PostgreSQL:

```yaml
backendStore:
  databaseMigration: true
  postgres:
    enabled: true
    host: postgresql-instance1.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
    port: 5432
    database: mlflow
    user: mlflowuser
    password: Pa33w0rd!
```

## Bitnami PostgreSQL Integration

### Complete Bitnami PostgreSQL Setup

```mermaid
architecture-beta
  group k8s(cloud)[Kubernetes Cluster]

  service ui(internet)[User]

  service db(database)[PostgreSQL DB] in k8s
  service server(server)[MLflow Server] in k8s

  ui:R --> L:server
  server:R --> L:db
```

```yaml
backendStore:
  databaseMigration: true
  databaseConnectionCheck: true

postgresql:
  enabled: true
  architecture: standalone

  primary:
    service:
      ports:
        postgresql: 5432

    persistence:
      enabled: true
      existingClaim: ""

  auth:
    username: mlflowuser
    password: Pa33w0rd!
    database: mlflow
```

## Database Migration

MLflow will automatically create the required tables on first startup when `databaseMigration: true` is enabled. The init container will handle schema migrations.

### Manual Migration (if needed)

If you need to run migrations manually:

```bash
# Export data from SQLite (if migrating from SQLite)
mlflow db export-sqlite mlflow.db > mlflow_export.sql

# Run migrations on PostgreSQL
mlflow db upgrade postgresql://mlflow_user:password@host:5432/mlflow
```

## Verification

### Check MLflow Pod Status

```bash
kubectl get pods -n mlflow
```

### Verify Database Connection

```bash
kubectl logs deployment/mlflow -n mlflow | grep -i "database\|postgres"
```

### Check Migration Status

```bash
kubectl logs deployment/mlflow -c init-mlflow -n mlflow
```

### Test PostgreSQL Connection

```bash
# Test from within the cluster
kubectl run postgres-test --rm -it --image=postgres:13 --restart=Never -- \
  psql -h $POSTGRES_HOST -U postgres -d mlflow
```

### Access MLflow UI

```bash
kubectl port-forward svc/mlflow -n mlflow 5000:5000
```

Visit `http://localhost:5000` in your browser.

## Troubleshooting

:::tip
**Log Level:** Set `log.level: debug` in your values to get more detailed logs for troubleshooting PostgreSQL connection or migration issues.
:::

### Common PostgreSQL Issues

1. **Connection refused**: Check PostgreSQL service and network policies
2. **Authentication failed**: Verify username/password and database permissions
3. **Database not found**: Ensure database exists and user has access
4. **Migration failures**: Check init container logs for migration errors

### Debug Commands

```bash
# Check PostgreSQL logs
kubectl logs -f deployment/postgres -n mlflow

# Test PostgreSQL connection from MLflow pod
kubectl exec -it deployment/mlflow -n mlflow -- \
  psql -h $POSTGRES_HOST -U postgres -d mlflow -c "SELECT version();"

# Check MLflow logs
kubectl logs -f deployment/mlflow -n mlflow

# Check init container logs
kubectl logs deployment/mlflow -c init-mlflow -n mlflow
```

### Connection Issues

```bash
# Test network connectivity
kubectl exec -it deployment/mlflow -n mlflow -- \
  nc -zv $POSTGRES_HOST 5432

# Check PostgreSQL service
kubectl get svc postgres -n mlflow

# Verify database credentials
kubectl get secret postgres-database-secret -n mlflow -o yaml
```

## Production Considerations

- Use managed PostgreSQL services (AWS RDS, Google Cloud SQL, Azure Database)
- Configure automated backups
- Set up monitoring and alerting
- Use connection pooling for high-traffic deployments
- Consider read replicas for scaling
- Enable SSL/TLS for database connections

### High Availability Setup

```yaml
backendStore:
  databaseMigration: true
  databaseConnectionCheck: true
  postgres:
    enabled: true
    host: your-postgres-cluster-endpoint
    port: 5432
    database: mlflow
    user: mlflowuser
    password: your-password

# Configure connection pooling for HA
extraEnvVars:
  MLFLOW_SQLALCHEMYSTORE_POOL_SIZE: "20"  # SQLAlchemy connection pool size
  MLFLOW_SQLALCHEMYSTORE_MAX_OVERFLOW: "30"  # SQLAlchemy max overflow connections
  MLFLOW_SQLALCHEMYSTORE_POOL_RECYCLE: "3600"  # SQLAlchemy pool recycle time
  MLFLOW_HTTP_REQUEST_TIMEOUT: "120"  # HTTP request timeout in seconds
  MLFLOW_HTTP_REQUEST_MAX_RETRIES: "7"  # Maximum HTTP retries
```

## Next Steps

- Configure [artifact storage](/docs/charts/mlflow/aws-s3-integration) for production
- Set up [authentication](/docs/charts/mlflow/authentication-configuration)
- Configure [autoscaling](/docs/charts/mlflow/autoscaling-setup) for high availability
- Set up monitoring with [ServiceMonitor](/docs/charts/mlflow/usage#monitoring)
