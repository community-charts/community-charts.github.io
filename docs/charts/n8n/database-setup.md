---
id: database-setup
title: n8n Database Setup
sidebar_label: Database Setup
sidebar_position: 3
description: Complete guide to setting up and configuring databases for n8n on Kubernetes
keywords: [n8n, database, postgresql, sqlite, setup, migration, kubernetes, aws, azure, rds, aurora, cloud-sql, managed-database]
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

# Enable persistence for data durability
main:
  persistence:
    enabled: true
    volumeName: "n8n-sqlite-data"
    mountPath: "/home/node/.n8n"
    size: 5Gi
    accessMode: ReadWriteOnce
```

:::warning
**Data Persistence:** Without persistence enabled, SQLite data will be lost when the pod is terminated. Enable persistence for any deployment where data retention is important.
:::

### SQLite with Persistence

:::tip
**SQLite Persistence:** Enable persistence to store SQLite database in a persistent volume, ensuring data survives pod restarts and deployments.
:::

```yaml
db:
  type: sqlite
  sqlite:
    database: "n8n-data.sqlite"
    poolSize: 0
    vacuum: true  # Enable VACUUM for better performance

# Enable persistence for SQLite storage
main:
  persistence:
    enabled: true
    volumeName: "n8n-sqlite-data"
    mountPath: "/home/node/.n8n"
    size: 5Gi
    accessMode: ReadWriteOnce
    storageClass: "fast-ssd"
    annotations:
      helm.sh/resource-policy: keep
```

:::info
**Persistence Benefits:** With persistence enabled, your SQLite database will be stored in a persistent volume, providing data durability across pod restarts and deployments.
:::

### SQLite with Custom Path and Existing PVC

```yaml
db:
  type: sqlite
  sqlite:
    database: "n8n-data.sqlite"
    poolSize: 0
    vacuum: true  # Enable VACUUM for better performance

# Use existing PVC for SQLite storage
main:
  persistence:
    enabled: true
    existingClaim: "n8n-sqlite-pvc"
    mountPath: "/home/node/.n8n"
```

:::warning
**Data Persistence:** Without persistence, SQLite data is ephemeral and will be lost when the pod is terminated. Always enable persistence for production deployments.
:::

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

### Google Cloud SQL (GCP) with Cloud SQL Proxy

:::tip
**GKE + Cloud SQL:** If you are running n8n on Google Kubernetes Engine (GKE) and want to use Google Cloud SQL (PostgreSQL), you must use the Cloud SQL Auth Proxy as a sidecar container. This is required because Cloud SQL is not directly accessible from GKE nodes.
:::

#### Example: Add Cloud SQL Proxy Sidecar to n8n Main Pod

```yaml
db:
  type: postgresdb

externalPostgresql:
  host: 127.0.0.1  # Cloud SQL Proxy listens on localhost
  port: 5432       # Default proxy port
  username: n8n
  password: your-secure-password
  database: n8n
  existingSecret: postgres-secret

main:
  extraContainers:
    - name: cloudsql-proxy
      image: gcr.io/cloudsql-docker/gce-proxy:1.36.2
      command:
        - "/cloud_sql_proxy"
        - "-instances=YOUR_PROJECT:YOUR_REGION:YOUR_INSTANCE=tcp:5432"
        # Use one of the following for authentication:
        # - "-credential_file=/secrets/cloudsql/credentials.json"  # Service Account Key
        # OR (for Workload Identity, omit -credential_file)
      securityContext:
        runAsNonRoot: true
        allowPrivilegeEscalation: false
      volumeMounts:
        - name: cloudsql-instance-credentials
          mountPath: /secrets/cloudsql
          readOnly: true
  volumes:
    - name: cloudsql-instance-credentials
      secret:
        secretName: cloudsql-instance-credentials
```

- Replace `YOUR_PROJECT:YOUR_REGION:YOUR_INSTANCE` with your Cloud SQL instance connection name.
- If using a service account key, create a Kubernetes secret named `cloudsql-instance-credentials` with the key as `credentials.json`.
- If using Workload Identity, you can omit the `-credential_file` flag and the volume mount.

:::info
**Workload Identity:** For production, prefer [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity) over service account keys for better security.
:::

#### Troubleshooting Cloud SQL Proxy
- Check Cloud SQL Proxy logs in the n8n main pod: `kubectl logs <n8n-pod> -c cloudsql-proxy`
- Ensure the service account has the `Cloud SQL Client` role.
- Verify the instance connection name is correct.
- Make sure the proxy port matches `externalPostgresql.port`.
- Network policies/firewall must allow egress to Cloud SQL.

For more, see [Cloud SQL Auth Proxy docs](https://cloud.google.com/sql/docs/postgres/connect-run#kubernetes-engine).

## AWS RDS/Aurora PostgreSQL

:::info
Amazon RDS and Aurora PostgreSQL are fully managed database services on AWS. They are recommended for production deployments due to their reliability, scalability, and security features.
:::

### Connecting n8n to AWS RDS/Aurora

- Ensure your EKS cluster can reach the RDS/Aurora instance (VPC, subnet, and security group settings).
- Enable SSL for secure connections (recommended).
- Use IAM authentication for advanced security (optional, see AWS docs).

#### Example `values.yaml` for External PostgreSQL

```yaml
db:
  type: postgresdb
externalPostgresql:
  host: "<rds-endpoint>.rds.amazonaws.com"
  port: 5432
  username: "n8nuser"
  password: "<your-password>"
  database: "n8n"
```

:::tip
You can use `externalPostgresql.existingSecret` to reference a Kubernetes secret for your password.
:::

#### Security Group & Networking Tips
- The RDS instance must allow inbound connections from your EKS nodes (check security group rules).
- Prefer private subnets and VPC peering for security.
- If using IAM authentication, see [IAM DB Auth for PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html).

#### Troubleshooting
- **Timeouts:** Check VPC/subnet routing and security groups.
- **SSL errors:** Ensure `rds.force_ssl=1` and use the correct SSL mode in n8n.
- **Auth errors:** Double-check username/password and DB user privileges.

:::note
See the [AWS RDS PostgreSQL documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html) for more details.
:::

## Azure Database for PostgreSQL

:::info
Azure Database for PostgreSQL is a fully managed database service on Microsoft Azure. It supports both Single Server and Flexible Server deployments.
:::

### Connecting n8n to Azure Database for PostgreSQL

- Ensure your AKS cluster can reach the Azure Database (VNet, firewall, and subnet settings).
- Use the full username format: `<username>@<server-name>`.
- SSL is required by default.

#### Example `values.yaml` for External PostgreSQL

```yaml
db:
  type: postgresdb
externalPostgresql:
  host: "<server-name>.postgres.database.azure.com"
  port: 5432
  username: "n8nuser@<server-name>"
  password: "<your-password>"
  database: "n8n"
```

:::tip
You can use `externalPostgresql.existingSecret` to reference a Kubernetes secret for your password.
:::

#### Firewall & Networking Tips
- Add your AKS node subnet to the Azure Database firewall rules.
- For private access, use VNet integration.
- Ensure SSL is enabled (default for Azure).

#### Troubleshooting
- **FATAL: no pg_hba.conf entry:** Check firewall and username format.
- **SSL required:** Ensure SSL mode is enabled in n8n.
- **Auth errors:** Double-check username/password and DB user privileges.

:::note
See the [Azure Database for PostgreSQL documentation](https://learn.microsoft.com/en-us/azure/postgresql/) for more details.
:::

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
db:
  type: postgresdb

externalPostgresql:
  host: new-postgres-host.com
  port: 5432
  username: n8n
  password: your-secure-password
  database: n8n
```

## Persistence for Database Configuration

:::info
**Persistence:** Use persistence to store database configuration and credentials securely for main and worker nodes. Configure independently from hostAliases.
:::

### Main Node Persistence Example
```yaml
main:
  count: 1
  persistence:
    enabled: true
    volumeName: "n8n-main-data"
    mountPath: "/home/node/.n8n"
    size: 8Gi
    accessMode: ReadWriteOnce
    storageClass: "fast-ssd"
    annotations:
      helm.sh/resource-policy: keep
```

### Worker Node Persistence Example
```yaml
worker:
  mode: queue
  persistence:
    enabled: true
    volumeName: "n8n-worker-data"
    mountPath: "/home/node/.n8n"
    size: 5Gi
    accessMode: ReadWriteMany  # For autoscaling
    storageClass: "fast-ssd"
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

## Pod Affinity and Anti-Affinity

:::tip
**Database Affinity:** Proper affinity configuration can optimize database performance by ensuring pods are placed optimally relative to database resources.
:::

:::warning
**Deprecation Notice:** The top-level `affinity` field is deprecated. Use the specific affinity configurations under `main`, `worker`, and `webhook` blocks instead.
:::

### Affinity for Database Optimization

#### Co-locate with Database Nodes

```yaml
# Place pods on nodes close to database
main:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: database-zone
            operator: In
            values:
            - "primary"

worker:
  mode: queue
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: database-zone
            operator: In
            values:
            - "primary"
```

#### Spread Pods for Database Load Distribution

```yaml
# Distribute database connections across nodes
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

#### Zone Distribution for Database Resilience

```yaml
# Distribute pods across zones for database availability
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

#### Node Affinity for Database Performance

```yaml
# Use nodes optimized for database workloads
main:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: node-type
            operator: In
            values:
            - database-optimized

worker:
  mode: queue
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: node-type
            operator: In
            values:
            - database-optimized
```

:::info
**Database Benefits:** Proper affinity configuration ensures optimal database performance by placing pods on nodes with good database connectivity and distributing database load effectively.
:::

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
