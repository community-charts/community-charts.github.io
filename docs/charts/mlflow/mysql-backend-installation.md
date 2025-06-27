---
id: mysql-backend-installation
title: MLflow MySQL Backend Installation
sidebar_label: MySQL Installation
sidebar_position: 4
description: Complete guide to setting up MLflow with MySQL backend on Kubernetes. Learn about database migrations, PyMySQL driver, and production-ready configurations.
keywords: [mlflow, mysql, kubernetes, helm, database, migration, production, pymysql, connection pooling]
---

# MySQL Backend Installation

This guide covers setting up MLflow with MySQL as the backend database. MySQL is a popular alternative to PostgreSQL and provides good performance for MLflow deployments.

:::info
**Alternative Database:** MySQL is a viable alternative to PostgreSQL for MLflow deployments, offering good performance and wide compatibility with existing infrastructure.
:::

```mermaid
architecture-beta
  group k8s(cloud)[Kubernetes Cluster]

  service ui(internet)[User]

  service db(database)[MySQL DB]
  service server(server)[MLflow Server] in k8s

  ui:R --> L:server
  server:R --> L:db
```

## Prerequisites

:::warning
**Requirements:** Ensure you have all prerequisites installed and configured before proceeding with MySQL setup.
:::

- Kubernetes cluster (v1.16+)
- Helm 3.x installed
- kubectl configured
- MySQL database (can be deployed in-cluster or external)
- Storage class for PVC (if using in-cluster MySQL)

## Option 1: Using External MySQL

:::tip
**External Database:** Using external MySQL (like RDS, Cloud SQL, or Azure Database) is recommended for production as it provides managed backups, high availability, and easier maintenance.
:::

### 1. Prepare MySQL Database

Create a database and user for MLflow:

```sql
CREATE DATABASE mlflow;
CREATE USER 'mlflow_user'@'%' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON mlflow.* TO 'mlflow_user'@'%';
FLUSH PRIVILEGES;
```

### 2. Install MLflow with External MySQL

```bash
helm install mlflow community-charts/mlflow \
  --namespace mlflow \
  --set backendStore.databaseMigration=true \
  --set backendStore.mysql.enabled=true \
  --set backendStore.mysql.host=your-mysql-host \
  --set backendStore.mysql.port=3306 \
  --set backendStore.mysql.database=mlflow \
  --set backendStore.mysql.user=mlflow_user \
  --set backendStore.mysql.password=your_secure_password
```

:::warning
**Security:** Never hardcode database passwords in command line arguments. Use Kubernetes secrets or environment variables for sensitive data.
:::

## Option 2: Deploy MySQL in Kubernetes

:::info
**In-Cluster Database:** Deploying MySQL in Kubernetes is suitable for development and testing environments, but external managed databases are recommended for production.
:::

### 1. Install MySQL using Bitnami Chart

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

helm install mysql bitnami/mysql \
  --namespace mlflow \
  --set auth.rootPassword=root_password \
  --set auth.database=mlflow \
  --set primary.persistence.size=10Gi
```

### 2. Get MySQL Connection Details

```bash
export MYSQL_ROOT_PASSWORD=$(kubectl get secret --namespace mlflow mysql -o jsonpath="{.data.mysql-root-password}" | base64 -d)
export MYSQL_HOST=$(kubectl get svc --namespace mlflow mysql -o jsonpath="{.spec.clusterIP}")
```

### 3. Create MLflow User

```bash
kubectl run mysql-client --rm -it --restart=Never --image=mysql:8.0 --namespace mlflow -- \
  mysql -h $MYSQL_HOST -u root -p$MYSQL_ROOT_PASSWORD -e "
CREATE USER 'mlflow_user'@'%' IDENTIFIED BY 'mlflow_password';
GRANT ALL PRIVILEGES ON mlflow.* TO 'mlflow_user'@'%';
FLUSH PRIVILEGES;
"
```

### 4. Install MLflow with In-Cluster MySQL

```bash
helm install mlflow community-charts/mlflow \
  --namespace mlflow \
  --set backendStore.databaseMigration=true \
  --set backendStore.mysql.enabled=true \
  --set backendStore.mysql.host=$MYSQL_HOST \
  --set backendStore.mysql.port=3306 \
  --set backendStore.mysql.database=mlflow \
  --set backendStore.mysql.user=mlflow_user \
  --set backendStore.mysql.password=mlflow_password
```

## Option 3: Using Existing Database Secret

:::tip
**Secret Management:** Using Kubernetes secrets for database credentials is a security best practice that keeps sensitive data out of configuration files.
:::

### 1. Create Database Secret

```bash
kubectl create secret generic mysql-database-secret \
  --namespace mlflow \
  --from-literal=username=mlflow_user \
  --from-literal=password=your_secure_password
```

### 2. Configure MLflow with Existing Secret

```yaml
backendStore:
  databaseMigration: true
  mysql:
    enabled: true
    host: mysql-instance1.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
    port: 3306
    database: mlflow

  existingDatabaseSecret:
    name: mysql-database-secret
    usernameKey: username
    passwordKey: password
```

## Configuration with Values File

```mermaid
architecture-beta
  group k8s(cloud)[Kubernetes Cluster]

  service ui(internet)[User]

  service db(database)[MySQL DB]
  service server(server)[MLflow Server] in k8s
  service volume(disk)[PVC] in k8s

  ui:R --> L:server
  server:R --> L:db
  server:B --> T:volume
```

:::info
**Complete Setup:** This configuration demonstrates a production-ready MLflow setup with MySQL backend and proper resource management.
:::

Create a `values.yaml` file:

```yaml
backendStore:
  databaseMigration: true
  databaseConnectionCheck: true
  mysql:
    enabled: true
    host: mysql-instance1.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
    port: 3306
    database: mlflow
    user: mlflowuser
    password: Pa33w0rd!
    driver: pymysql

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

# Optional: Configure MySQL connection pooling and SSL
extraEnvVars:
  MLFLOW_SQLALCHEMYSTORE_POOL_SIZE: "10"  # SQLAlchemy connection pool size
  MLFLOW_SQLALCHEMYSTORE_MAX_OVERFLOW: "20"  # SQLAlchemy max overflow connections
  MLFLOW_SQLALCHEMYSTORE_POOL_RECYCLE: "3600"  # SQLAlchemy pool recycle time
  MLFLOW_SQLALCHEMYSTORE_ECHO: "false"  # Enable SQLAlchemy query logging
  MLFLOW_MYSQL_SSL_CA: "/path/to/ca-cert.pem"  # MySQL SSL CA certificate path
  MLFLOW_MYSQL_SSL_CERT: "/path/to/client-cert.pem"  # MySQL SSL client certificate path
  MLFLOW_MYSQL_SSL_KEY: "/path/to/client-key.pem"  # MySQL SSL client key path
```

Install with the configuration:

```bash
helm install mlflow community-charts/mlflow \
  --namespace mlflow \
  -f values.yaml
```

## Database Migration Features

### Automatic Schema Migrations

The chart supports automatic database schema migrations using init containers:

```yaml
backendStore:
  databaseMigration: true  # Enable automatic migrations
  mysql:
    enabled: true
    host: your-mysql-host
    database: mlflow
    user: mlflowuser
    password: your-password
    driver: pymysql
```

### Database Connection Health Checks

Add database availability checks before starting MLflow:

```yaml
backendStore:
  databaseConnectionCheck: true  # Enable connection checks
  mysql:
    enabled: true
    host: your-mysql-host
    database: mlflow
    user: mlflowuser
    password: your-password
    driver: pymysql
```

### Migration from SQLite

When migrating from SQLite to MySQL:

```yaml
backendStore:
  databaseMigration: true
  mysql:
    enabled: true
    host: mysql-instance1.cg034hpkmmjt.eu-central-1.rds.amazonaws.com
    port: 3306
    database: mlflow
    user: mlflowuser
    password: Pa33w0rd!
    driver: pymysql
```

## Bitnami MySQL Integration

### Complete Bitnami MySQL Setup

```mermaid
architecture-beta
  group k8s(cloud)[Kubernetes Cluster]

  service ui(internet)[User]

  service db(database)[MySQL DB] in k8s
  service server(server)[MLflow Server] in k8s

  ui:R --> L:server
  server:R --> L:db
```

```yaml
backendStore:
  databaseMigration: true
  databaseConnectionCheck: true

mysql:
  enabled: true
  architecture: standalone

  primary:
    service:
      ports:
        mysql: 3306

    persistence:
      enabled: true
      existingClaim: ""

  auth:
    username: mlflowuser
    password: Pa33w0rd!
    database: mlflow
```

## MySQL-Specific Considerations

### Character Set and Collation

Ensure your MySQL database uses UTF-8 encoding:

```sql
ALTER DATABASE mlflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Connection String Format

The MySQL connection string format for MLflow is:
```
mysql+pymysql://username:password@host:port/database
```

### Required Python Dependencies

The MLflow container includes `pymysql` for MySQL connectivity. If you're using a custom image, ensure it includes:

```dockerfile
RUN pip install pymysql
```

## Database Migration

MLflow will automatically create the required tables on first startup when `databaseMigration: true` is enabled. The init container will handle schema migrations.

### Manual Migration (if needed)

If you need to run migrations manually:

```bash
# Export data from SQLite (if migrating from SQLite)
mlflow db export-sqlite mlflow.db > mlflow_export.sql

# Run migrations on MySQL
mlflow db upgrade mysql+pymysql://mlflow_user:password@host:3306/mlflow
```

## Verification

### Check MLflow Pod Status

```bash
kubectl get pods -n mlflow
```

### Verify Database Connection

```bash
kubectl logs deployment/mlflow -n mlflow | grep -i "mysql\|database"
```

### Check Migration Status

```bash
kubectl logs deployment/mlflow -c init-mlflow -n mlflow
```

### Test MySQL Connection

```bash
kubectl run mysql-test --rm -it --image=mysql:8.0 --restart=Never --namespace mlflow -- \
  mysql -h $MYSQL_HOST -u mlflow_user -pmlflow_password mlflow -e "SHOW TABLES;"
```

### Access MLflow UI

```bash
kubectl port-forward svc/mlflow -n mlflow 5000:5000
```

Visit `http://localhost:5000` in your browser.

## Troubleshooting

:::tip
**Log Level:** Set `log.level: debug` in your values to get more detailed logs for troubleshooting MySQL connection or migration issues.
:::

### Common MySQL Issues

1. **Connection refused**: Check MySQL service and network policies
2. **Authentication failed**: Verify username/password and host permissions
3. **Character set issues**: Ensure UTF-8 encoding is configured
4. **SSL connection errors**: Add `?ssl_mode=DISABLED` to connection string if needed
5. **Migration failures**: Check init container logs for migration errors

### Debug Commands

```bash
# Check MySQL logs
kubectl logs -f deployment/mysql -n mlflow

# Test connection from MLflow pod
kubectl exec -it deployment/mlflow -n mlflow -- \
  python -c "import pymysql; pymysql.connect(host='$MYSQL_HOST', user='mlflow_user', password='mlflow_password', database='mlflow')"

# Check MLflow logs
kubectl logs -f deployment/mlflow -n mlflow

# Check init container logs
kubectl logs deployment/mlflow -c init-mlflow -n mlflow
```

### Connection Issues

```bash
# Test network connectivity
kubectl exec -it deployment/mlflow -n mlflow -- \
  nc -zv $MYSQL_HOST 3306

# Check MySQL service
kubectl get svc mysql -n mlflow

# Verify database credentials
kubectl get secret mysql-database-secret -n mlflow -o yaml
```

## Production Considerations

- Use managed MySQL services (AWS RDS, Google Cloud SQL, Azure Database)
- Configure automated backups and point-in-time recovery
- Set up monitoring and alerting
- Use connection pooling for high-traffic deployments
- Consider read replicas for scaling
- Enable SSL/TLS for database connections

### High Availability Setup

```yaml
backendStore:
  databaseMigration: true
  databaseConnectionCheck: true
  mysql:
    enabled: true
    host: your-mysql-cluster-endpoint
    port: 3306
    database: mlflow
    user: mlflowuser
    password: your-password
    driver: pymysql

# Configure connection pooling for HA
extraEnvVars:
  MLFLOW_SQLALCHEMY_POOL_SIZE: "20"
  MLFLOW_SQLALCHEMY_MAX_OVERFLOW: "30"
  MLFLOW_SQLALCHEMY_POOL_TIMEOUT: "30"
  MLFLOW_SQLALCHEMY_POOL_RECYCLE: "3600"
```

## Migration from Other Databases

### From SQLite

1. Export data from SQLite:
```bash
mlflow db export-sqlite mlflow.db > mlflow_export.sql
```

2. Convert and import to MySQL (requires manual conversion of SQLite-specific syntax)

### From PostgreSQL

Use MLflow's built-in migration tools or export/import functionality.

## Next Steps

- Configure [artifact storage](/docs/charts/mlflow/aws-s3-integration) for production
- Set up [authentication](/docs/charts/mlflow/authentication-configuration)
- Configure [autoscaling](/docs/charts/mlflow/autoscaling-setup) for high availability
- Set up monitoring with [ServiceMonitor](/docs/charts/mlflow/usage#monitoring)
