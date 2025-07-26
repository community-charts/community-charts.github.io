---
id: database
title: Outline Database Configuration
sidebar_label: Database
sidebar_position: 5
description: Configure PostgreSQL database for Outline including built-in and external database options
keywords: [outline, database, postgresql, external, built-in, kubernetes, helm]
---

# Database Configuration

Outline requires a PostgreSQL database for storing application data. This guide covers both built-in and external database configuration options.

## Database Options

Outline supports two database deployment modes:

- **Built-in PostgreSQL**: Deploy PostgreSQL as part of the Helm chart
- **External PostgreSQL**: Connect to an existing PostgreSQL instance

## Built-in PostgreSQL

The chart includes a built-in PostgreSQL deployment using Bitnami's PostgreSQL chart.

### Basic Built-in PostgreSQL

```yaml
postgresql:
  enabled: true
  architecture: standalone

  auth:
    username: outline
    password: strongpassword
    database: outline

  primary:
    persistence:
      enabled: true
      size: 8Gi
```

### Advanced Built-in PostgreSQL

```yaml
postgresql:
  enabled: true
  architecture: standalone

  auth:
    username: outline
    password: strongpassword
    database: outline

  primary:
    persistence:
      enabled: true
      size: 20Gi
      storageClass: "fast-ssd"
      existingClaim: ""  # Use existing PVC

    service:
      ports:
        postgresql: 5432
```

### High Availability PostgreSQL

For production deployments with high availability:

```yaml
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
```

## External PostgreSQL

Connect to an existing PostgreSQL instance outside the cluster.

### Basic External PostgreSQL

```yaml
postgresql:
  enabled: false

externalPostgresql:
  host: "your-postgresql-host"
  port: 5432
  database: outline
  username: outline
  password: strongpassword
```

### External PostgreSQL with Existing Secret

Use an existing Kubernetes secret for database credentials:

```yaml
postgresql:
  enabled: false

externalPostgresql:
  host: "your-postgresql-host"
  port: 5432
  database: outline
  username: outline
  existingSecret: "my-postgresql-secret"
  passwordSecretKey: "postgres-password"
```

### External PostgreSQL Examples

#### AWS RDS

```yaml
postgresql:
  enabled: false

externalPostgresql:
  host: "outline-db.cluster-xyz.us-east-1.rds.amazonaws.com"
  port: 5432
  database: outline
  username: outline
  existingSecret: "outline-rds-secret"
  passwordSecretKey: "postgres-password"
```

#### Google Cloud SQL

```yaml
postgresql:
  enabled: false

externalPostgresql:
  host: "outline-db.xyz.us-central1.sql.goog"
  port: 5432
  database: outline
  username: outline
  existingSecret: "outline-cloudsql-secret"
  passwordSecretKey: "postgres-password"
```

#### Azure Database for PostgreSQL

```yaml
postgresql:
  enabled: false

externalPostgresql:
  host: "outline-db.postgres.database.azure.com"
  port: 5432
  database: outline
  username: "outline@outline-db"
  existingSecret: "outline-azure-secret"
  passwordSecretKey: "postgres-password"
```

## Database Configuration

Configure database connection settings:

```yaml
database:
  connectionPoolMin: "5"
  connectionPoolMax: "20"
  sslMode: "require"  # disable, allow, require, prefer, verify-ca, verify-full
```

### SSL Configuration

Configure SSL for database connections:

```yaml
database:
  connectionPoolMin: "5"
  connectionPoolMax: "20"
  sslMode: "verify-full"  # For production with SSL certificates
```

:::info
SSL modes:
- `disable`: No SSL
- `allow`: Try SSL, fallback to non-SSL
- `require`: Require SSL
- `prefer`: Prefer SSL, fallback to non-SSL
- `verify-ca`: Verify server certificate
- `verify-full`: Verify server certificate and hostname
:::

## Redis Configuration

Outline uses Redis for caching and session storage.

### Built-in Redis

```yaml
redis:
  enabled: true
  architecture: standalone

  auth:
    enabled: true

  master:
    persistence:
      enabled: true
      size: 8Gi
```

### External Redis

```yaml
redis:
  enabled: false

externalRedis:
  host: "your-redis-host"
  port: 6379
  username: "default"
  password: "your-password"
  existingSecret: "my-redis-secret"
  usernameSecretKey: "redis-username"
  passwordSecretKey: "redis-password"
```

## Environment Variables

The chart automatically sets these environment variables based on your database configuration:

| Variable | Description | Source |
|----------|-------------|---------|
| `PGUSER` | PostgreSQL username | `postgresql.auth.username` or `externalPostgresql.username` |
| `PGPASSWORD` | PostgreSQL password | Secret reference |
| `PGPORT` | PostgreSQL port | `postgresql.primary.service.ports.postgresql` or `externalPostgresql.port` |
| `PGHOST` | PostgreSQL host | `postgresql.primary.service.name` or `externalPostgresql.host` |
| `PGDATABASE` | PostgreSQL database | `postgresql.auth.database` or `externalPostgresql.database` |
| `DATABASE_URL` | Full database URL | Auto-generated from above variables |
| `DATABASE_CONNECTION_POOL_MIN` | Min connections | `database.connectionPoolMin` |
| `DATABASE_CONNECTION_POOL_MAX` | Max connections | `database.connectionPoolMax` |
| `PGSSLMODE` | SSL mode | `database.sslMode` |
| `REDIS_USERNAME` | Redis username | `externalRedis.username` |
| `REDIS_PASSWORD` | Redis password | Secret reference |
| `REDIS_HOST` | Redis host | `redis.master.service.name` or `externalRedis.host` |
| `REDIS_PORT` | Redis port | `redis.master.service.ports.redis` or `externalRedis.port` |
| `REDIS_URL` | Redis URL | Auto-generated (when auth disabled) |

## Database Migration

### From Built-in to External

1. **Backup existing data**:
   ```bash
   # Backup from built-in PostgreSQL
   kubectl exec -it <postgresql-pod> -- pg_dump -U outline outline > outline-backup.sql
   ```

2. **Restore to external database**:
   ```bash
   # Restore to external PostgreSQL
   psql -h external-host -U outline -d outline < outline-backup.sql
   ```

3. **Update configuration**:
   ```yaml
   postgresql:
     enabled: false

   externalPostgresql:
     host: "external-host"
     port: 5432
     database: outline
     username: outline
     existingSecret: "external-postgresql-secret"
     passwordSecretKey: "postgres-password"
   ```

### From External to Built-in

1. **Backup external database**:
   ```bash
   pg_dump -h external-host -U outline outline > outline-backup.sql
   ```

2. **Update configuration**:
   ```yaml
   postgresql:
     enabled: true
     auth:
       username: outline
       password: strongpassword
       database: outline

   externalPostgresql:
     host: ""
   ```

3. **Restore to built-in database**:
   ```bash
   kubectl exec -i <postgresql-pod> -- psql -U outline outline < outline-backup.sql
   ```

## Database Backup and Recovery

### Automated Backups

Create a CronJob for automated database backups:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: outline-db-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15
            command:
            - /bin/sh
            - -c
            - |
              pg_dump -h $PGHOST -U $PGUSER -d $PGDATABASE > /backup/outline-$(date +%Y%m%d).sql
            env:
            - name: PGHOST
              value: "outline-postgresql"
            - name: PGUSER
              value: "outline"
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: outline-postgresql
                  key: password
            - name: PGDATABASE
              value: "outline"
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: outline-backup-storage
          restartPolicy: OnFailure
```

### Manual Backup

```bash
# Backup built-in PostgreSQL
kubectl exec -it outline-postgresql-0 -- pg_dump -U outline outline > outline-backup.sql

# Backup external PostgreSQL
pg_dump -h your-host -U outline outline > outline-backup.sql
```

### Restore from Backup

```bash
# Restore to built-in PostgreSQL
kubectl exec -i outline-postgresql-0 -- psql -U outline outline < outline-backup.sql

# Restore to external PostgreSQL
psql -h your-host -U outline outline < outline-backup.sql
```

## Troubleshooting Database Issues

### Common Problems

1. **Connection Refused**: Check database host, port, and network connectivity
2. **Authentication Failed**: Verify username, password, and database name
3. **SSL Issues**: Check SSL mode and certificate configuration
4. **Connection Pool Exhausted**: Increase connection pool limits

### Debug Commands

```bash
# Check database environment variables
kubectl exec -it <pod-name> -- env | grep -E "(PG|DATABASE)"

# Test database connectivity
kubectl exec -it <pod-name> -- psql $DATABASE_URL -c "SELECT version();"

# Check Redis connectivity
kubectl exec -it <pod-name> -- redis-cli -h $REDIS_HOST -p $REDIS_PORT ping

# Check PostgreSQL logs
kubectl logs -f deployment/outline-postgresql

# Check Redis logs
kubectl logs -f deployment/outline-redis-master
```

### Database Monitoring

Add monitoring annotations for database tracking:

```yaml
postgresql:
  primary:
    persistence:
      annotations:
        monitoring.kubernetes.io/enabled: "true"
        backup.kubernetes.io/schedule: "daily"
```

## Performance Optimization

### Connection Pooling

Optimize connection pool settings based on your workload:

```yaml
database:
  connectionPoolMin: "10"  # For high-traffic applications
  connectionPoolMax: "50"  # Adjust based on database capacity
```

### PostgreSQL Tuning

For built-in PostgreSQL, consider these optimizations:

```yaml
postgresql:
  primary:
    extraEnvVars:
      POSTGRES_SHARED_PRELOAD_LIBRARIES: "pg_stat_statements"

    extraVolumes:
      - name: postgresql-config
        configMap:
          name: postgresql-config

    extraVolumeMounts:
      - name: postgresql-config
        mountPath: /opt/bitnami/postgresql/conf/postgresql.conf
        subPath: postgresql.conf
```

## Security Considerations

:::warning
- Use strong passwords for database users
- Enable SSL for database connections in production
- Use existing secrets for database credentials
- Implement proper network policies
- Regular database backups
- Monitor database access logs
:::

## Next Steps

- Configure [authentication methods](./authentication.md)
- Set up [storage options](./storage.md)
- Explore [advanced configuration options](./advanced-configuration.md)
- Learn about [troubleshooting common issues](./troubleshooting.md)
