---
id: database-setup
title: "n8n Database Setup"
sidebar_label: "Database Setup"
sidebar_position: 3
description: "Complete guide to setting up and configuring databases for n8n on Kubernetes"
keywords: ["n8n", "database", "postgresql", "sqlite", "setup", "migration", "kubernetes"]
---

# n8n Database Setup

n8n supports multiple database backends for storing workflows, executions, and metadata. This guide covers all database options and their configuration.

:::info
**Database Selection:** Choose your database based on your deployment requirements. PostgreSQL is recommended for production environments.
:::

## Database Options

### SQLite (Default)
- **Use Case:** Development, testing, single-node deployments
- **Pros:** Simple setup, no external dependencies
- **Cons:** Not suitable for production, limited concurrency
- **Storage:** File-based, stored in persistent volume

### PostgreSQL (Recommended for Production)
- **Use Case:** Production deployments, high availability
- **Pros:** ACID compliance, high concurrency, backup support
- **Cons:** Requires external database setup
- **Storage:** External database server

:::warning
**Production Warning:** SQLite is not suitable for production deployments. Use PostgreSQL for any production environment.
:::

## SQLite Configuration

:::tip
**Development Use:** SQLite is perfect for development, testing, and single-user scenarios.
:::

### Basic SQLite Setup

```yaml
db:
  type: sqlite
  sqlite:
    database: "database.sqlite"
    poolSize: 0  # Disable connection pooling
    vacuum: false  # Disable VACUUM on startup
```

### SQLite with Custom Path

```yaml
db:
  type: sqlite
  sqlite:
    database: "n8n-data.sqlite"
    poolSize: 0
    vacuum: true  # Enable VACUUM for better performance

# Mount custom volume for database
main:
  volumes:
    - name: n8n-data
      persistentVolumeClaim:
        claimName: n8n-sqlite-pvc
  volumeMounts:
    - name: n8n-data
      mountPath: /home/node/.n8n
```

### SQLite Performance Tuning

```yaml
db:
  type: sqlite
  sqlite:
    database: "database.sqlite"
    poolSize: 0
    vacuum: true  # Rebuild database on startup

# Enable database logging for troubleshooting
db:
  logging:
    enabled: true
    options: error
    maxQueryExecutionTime: 1000
```

## PostgreSQL Configuration

:::tip
**Production Recommendation:** PostgreSQL is the recommended database for production deployments due to its reliability, performance, and feature set.
:::

### PostgreSQL with Bitnami Chart

```yaml
db:
  type: postgresdb
  logging:
    enabled: true
    options: error
    maxQueryExecutionTime: 1000

postgresql:
  enabled: true
  architecture: standalone
  
  auth:
    username: n8n
    password: your-secure-password
    database: n8n
  
  primary:
    service:
      ports:
        postgresql: 5432
    
    persistence:
      enabled: true
      existingClaim: ""
      storageClass: "fast-ssd"
      size: 20Gi
    
    resources:
      requests:
        cpu: 100m
        memory: 256Mi
      limits:
        cpu: 1000m
        memory: 1Gi
```

:::note
**Security:** Always use strong, unique passwords for database credentials. Consider using Kubernetes secrets for sensitive data.
:::

### PostgreSQL High Availability

```yaml
db:
  type: postgresdb

postgresql:
  enabled: true
  architecture: replication  # Enable replication
  
  auth:
    username: n8n
    password: your-secure-password
    database: n8n
  
  primary:
    persistence:
      enabled: true
      size: 20Gi
    
    service:
      type: ClusterIP
  
  readReplicas:
    persistence:
      enabled: true
      size: 20Gi
    
    resources:
      requests:
        cpu: 100m
        memory: 256Mi
      limits:
        cpu: 500m
        memory: 512Mi
```

:::info
**High Availability:** Use replication architecture for production environments that require high availability and read scaling.
:::

### External PostgreSQL

```yaml
db:
  type: postgresdb

externalPostgresql:
  host: your-postgres-host.com
  port: 5432
  username: n8n
  password: your-secure-password
  database: n8n
  existingSecret: postgres-secret  # Use Kubernetes secret
```

## Database Migration

:::danger
**Backup First:** Always create a complete backup of your existing database before attempting any migration.
:::

### SQLite to PostgreSQL Migration

1. **Backup SQLite Database**

```bash
# Get the SQLite database from the pod
kubectl cp <namespace>/<n8n-pod>:/home/node/.n8n/database.sqlite ./n8n-backup.sqlite
```

2. **Export Data from SQLite**

```bash
# Install sqlite3 if not available
sqlite3 n8n-backup.sqlite ".dump" > n8n-dump.sql
```

3. **Import to PostgreSQL**

```bash
# Connect to PostgreSQL and import
psql -h your-postgres-host -U n8n -d n8n -f n8n-dump.sql
```

4. **Update Helm Configuration**

```yaml
db:
  type: postgresdb

postgresql:
  enabled: true
  auth:
    username: n8n
    password: your-secure-password
    database: n8n
```

5. **Upgrade Helm Release**

```bash
helm upgrade my-n8n community-charts/n8n -f values.yaml -n <namespace>
```

### PostgreSQL to PostgreSQL Migration

1. **Backup Source Database**

```bash
pg_dump -h source-host -U n8n -d n8n > n8n-backup.sql
```

2. **Restore to Target Database**

```bash
psql -h target-host -U n8n -d n8n -f n8n-backup.sql
```

3. **Update Configuration**

```yaml
externalPostgresql:
  host: new-postgres-host.com
  port: 5432
  username: n8n
  password: your-secure-password
  database: n8n
```

## Database Performance Tuning

### PostgreSQL Performance

```yaml
db:
  type: postgresdb
  logging:
    enabled: true
    options: error
    maxQueryExecutionTime: 1000

postgresql:
  enabled: true
  auth:
    username: n8n
    password: your-secure-password
    database: n8n
  
  primary:
    persistence:
      enabled: true
      size: 50Gi  # Larger storage for better performance
    
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 2000m
        memory: 4Gi
    
    # PostgreSQL configuration
    configuration: |
      shared_buffers = 256MB
      effective_cache_size = 1GB
      maintenance_work_mem = 64MB
      checkpoint_completion_target = 0.9
      wal_buffers = 16MB
      default_statistics_target = 100
      random_page_cost = 1.1
      effective_io_concurrency = 200
      work_mem = 4MB
      min_wal_size = 1GB
      max_wal_size = 4GB
```

### Connection Pooling

```yaml
db:
  type: postgresdb
  sqlite:
    poolSize: 10  # Connection pool size for PostgreSQL
```

## Database Security

### Using Kubernetes Secrets

```yaml
# Create secret for database credentials
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
type: Opaque
data:
  postgres-password: <base64-encoded-password>
  postgres-username: <base64-encoded-username>
```

```yaml
# Use secret in configuration
externalPostgresql:
  host: your-postgres-host.com
  port: 5432
  existingSecret: postgres-secret
```

### Network Policies

```yaml
# Network policy to restrict database access
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: n8n-db-policy
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: n8n
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: postgresql
      ports:
        - protocol: TCP
          port: 5432
```

## Database Backup and Recovery

### Automated Backups

```yaml
# Add backup sidecar container
main:
  extraContainers:
    - name: backup
      image: postgres:15
      command:
        - /bin/sh
        - -c
        - |
          while true; do
            pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > /backup/n8n-$(date +%Y%m%d-%H%M%S).sql
            sleep 86400  # Daily backup
          done
      env:
        - name: PGPASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: postgres-password
        - name: DB_HOST
          value: "your-postgres-host"
        - name: DB_USER
          value: "n8n"
        - name: DB_NAME
          value: "n8n"
      volumeMounts:
        - name: backup-volume
          mountPath: /backup
  volumes:
    - name: backup-volume
      persistentVolumeClaim:
        claimName: n8n-backup-pvc
```

### Manual Backup Commands

```bash
# PostgreSQL backup
pg_dump -h your-postgres-host -U n8n -d n8n > n8n-backup-$(date +%Y%m%d).sql

# SQLite backup
kubectl cp <namespace>/<n8n-pod>:/home/node/.n8n/database.sqlite ./n8n-backup-$(date +%Y%m%d).sqlite

# Restore PostgreSQL
psql -h your-postgres-host -U n8n -d n8n < n8n-backup-20240101.sql

# Restore SQLite
kubectl cp ./n8n-backup-20240101.sqlite <namespace>/<n8n-pod>:/home/node/.n8n/database.sqlite
```

## Troubleshooting

### Common Database Issues

#### Performance Issues

```yaml
# Enable query logging for analysis
db:
  logging:
    enabled: true
    options: all
    maxQueryExecutionTime: 100

# Increase connection pool
db:
  sqlite:
    poolSize: 20
```

### Database Health Checks

```yaml
# Add database health check
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

### Database Monitoring

```yaml
# Enable database metrics
serviceMonitor:
  enabled: true
  include:
    defaultMetrics: true
    cacheMetrics: true
```

## Best Practices

### Security
- Use strong, unique passwords for database users
- Store credentials in Kubernetes secrets
- Enable SSL/TLS for database connections
- Use network policies to restrict access
- Regularly rotate database credentials

### Performance
- Use PostgreSQL for production workloads
- Configure appropriate connection pools
- Monitor database performance metrics
- Use SSD storage for database volumes
- Enable query logging for optimization

### Reliability
- Set up automated backups
- Test backup and recovery procedures
- Use high availability configurations
- Monitor database health
- Plan for disaster recovery

### Maintenance
- Regularly update database versions
- Monitor disk space usage
- Clean up old data and logs
- Optimize database queries
- Review and update security policies

## Next Steps

- [Usage Guide](./usage.md) - Quick start and basic deployment
- [Configuration Guide](./configuration.md) - Detailed configuration options
- [Queue Mode Setup](./queue-mode.md) - Distributed execution with Redis
- [Storage Configuration](./storage.md) - Binary data storage options
- [Monitoring Setup](./monitoring.md) - Metrics and observability
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
