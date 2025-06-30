---
id: troubleshooting
title: n8n Troubleshooting Guide
sidebar_label: Troubleshooting
sidebar_position: 8
description: Common issues and solutions for n8n Helm chart deployments
keywords: [n8n, helm, kubernetes, troubleshooting, errors, debug, issues, faq]
---

# n8n Troubleshooting Guide

This guide covers common issues and solutions when deploying n8n using the Helm chart.

:::info
**Troubleshooting Approach:** Always start with the quick diagnostics section to gather basic information about your deployment before diving into specific issues.
:::

## Quick Diagnostics

:::tip
**Diagnostic Order:** Follow this order for systematic troubleshooting: Pod Status → Services → ConfigMaps/Secrets → Application Logs.
:::

### Check Pod Status

```bash
# Check all n8n-related pods
kubectl get pods -l app.kubernetes.io/name=n8n

# Check pod details
kubectl describe pod <pod-name>

# Check pod logs
kubectl logs <pod-name>
```

### Check Services

```bash
# Check service status
kubectl get svc -l app.kubernetes.io/name=n8n

# Check service endpoints
kubectl get endpoints -l app.kubernetes.io/name=n8n
```

### Check ConfigMaps and Secrets

```bash
# Check ConfigMaps
kubectl get configmap -l app.kubernetes.io/name=n8n

# Check Secrets
kubectl get secret -l app.kubernetes.io/name=n8n
```

## Common Issues

:::warning
**Issue Resolution:** Always check the logs first when troubleshooting. Most issues can be identified from application logs.
:::

### Pod Startup Issues

#### Pod Stuck in Pending State

**Symptoms:**
- Pod remains in `Pending` state
- No events in pod description

**Solutions:**

1. **Check Resource Requests:**
```bash
kubectl describe pod <pod-name> | grep -A 10 "Events:"
```

2. **Check Node Resources:**
```bash
kubectl top nodes
kubectl describe node <node-name>
```

3. **Check Storage:**
```bash
kubectl get pvc
kubectl describe pvc <pvc-name>
```

:::note
**Resource Issues:** Pods stuck in Pending state are usually due to insufficient cluster resources or storage issues.
:::

#### Pod Stuck in CrashLoopBackOff

**Symptoms:**
- Pod repeatedly crashes and restarts
- Exit code 1 or 137

**Solutions:**

1. **Check Application Logs:**
```bash
kubectl logs <pod-name> --previous
```

2. **Check Resource Limits:**
```bash
kubectl describe pod <pod-name> | grep -A 5 "Containers:"
```

3. **Check Configuration:**
```bash
kubectl get configmap <configmap-name> -o yaml
```

:::danger
**CrashLoopBackOff:** This indicates a serious configuration or resource issue. Check logs immediately and verify all configuration values.
:::

### Database Connection Issues

:::warning
**Database Issues:** Database connection problems are among the most common issues. Always verify database credentials and connectivity.
:::

#### PostgreSQL Connection Failures

**Symptoms:**
- Database connection timeout errors
- Authentication failures
- Cloud SQL Proxy sidecar errors (if using GKE/Cloud SQL)

**Solutions:**

1. **Check Database Pod:**
```bash
kubectl get pods -l app.kubernetes.io/name=postgresql
kubectl logs -l app.kubernetes.io/name=postgresql
```

2. **Test Database Connection:**
```bash
kubectl exec -it <n8n-pod> -- nc -zv <db-host> <db-port>
```

3. **Check Database Credentials:**
```bash
kubectl get secret <db-secret> -o yaml
```

4. **Verify Database Configuration:**
```yaml
# Check values.yaml
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
```

5. **If using Cloud SQL Proxy (GKE/Cloud SQL):**
   - Check the Cloud SQL Proxy sidecar logs:
     ```bash
     kubectl logs <n8n-pod> -c cloudsql-proxy
     ```
   - Ensure the service account has the `Cloud SQL Client` role.
   - Verify the instance connection name is correct.
   - Make sure the proxy port matches `externalPostgresql.port`.
   - See [Cloud SQL Proxy docs](https://cloud.google.com/sql/docs/postgres/connect-run#kubernetes-engine) for more troubleshooting.

#### SQLite Issues

**Symptoms:**
- Database lock errors
- Permission denied errors

**Solutions:**

1. **Check File Permissions:**
```bash
kubectl exec -it <n8n-pod> -- ls -la /home/node/.n8n/
```

2. **Check Disk Space:**
```bash
kubectl exec -it <n8n-pod> -- df -h
```

3. **Enable SQLite Logging:**
```yaml
db:
  type: sqlite
  sqlite:
    database: "database.sqlite"
    poolSize: 0
    vacuum: true
```

:::tip
**SQLite Debugging:** Enable SQLite logging and VACUUM operations to identify and resolve database issues.
:::

### Queue Mode Issues

:::info
**Queue Mode:** Queue mode issues often involve Redis connectivity or configuration problems. Verify Redis is running and accessible.
:::

#### Redis Connection Problems

**Symptoms:**
- Queue mode not working
- Redis connection errors

**Solutions:**

1. **Check Redis Pod:**
```bash
kubectl get pods -l app.kubernetes.io/name=redis
kubectl logs -l app.kubernetes.io/name=redis
```

2. **Test Redis Connection:**
```bash
kubectl exec -it <n8n-pod> -- redis-cli -h <redis-host> ping
```

3. **Check Redis Configuration:**
```yaml
redis:
  enabled: true
  architecture: standalone
  master:
    persistence:
      enabled: true
      size: 5Gi
```

#### Worker Node Issues

**Symptoms:**
- Workers not processing jobs
- Queue backlog

**Solutions:**

1. **Check Worker Pods:**
```bash
kubectl get pods -l app.kubernetes.io/component=worker
kubectl logs -l app.kubernetes.io/component=worker
```

2. **Check Worker Configuration:**
```yaml
worker:
  mode: queue
  count: 2
  concurrency: 10
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 2000m
      memory: 2Gi
```

3. **Check Queue Status:**
```bash
kubectl exec -it <n8n-pod> -- curl -s http://localhost:5678/metrics | grep queue
```

### MCP and Form Endpoint Issues

:::info
**Advanced Endpoints:** MCP and Form endpoints are only available in queue mode with PostgreSQL database. Verify your configuration meets these requirements.
:::

#### MCP Endpoint Problems

**Symptoms:**
- MCP endpoints not accessible
- AI model integration failures
- MCP authentication errors

**Solutions:**

1. **Verify Queue Mode Configuration:**
```yaml
# Ensure queue mode is enabled
webhook:
  mode: queue
  url: "https://yourdomain.com"

# Ensure PostgreSQL is configured
db:
  type: postgresdb
```

2. **Check MCP Endpoint Accessibility:**
```bash
# Test MCP endpoint
curl -I https://yourdomain.com/mcp/

# Test MCP test endpoint
curl -I https://yourdomain.com/mcp-test/
```

3. **Check Ingress Configuration:**
```bash
# Verify ingress includes MCP paths
kubectl get ingress -o yaml | grep -A 10 -B 5 mcp
```

4. **Check Webhook Node Logs:**
```bash
# MCP endpoints are handled by webhook nodes
kubectl logs -l app.kubernetes.io/component=webhook
```

5. **Verify MCP Authentication:**
```yaml
# If using MCP authentication
ingress:
  annotations:
    nginx.ingress.kubernetes.io/auth-type: basic
    nginx.ingress.kubernetes.io/auth-secret: mcp-auth
```

:::warning
**MCP Requirements:** MCP endpoints require PostgreSQL database and queue mode. They are not available with SQLite or single-node deployments.
:::

#### Form Endpoint Problems

**Symptoms:**
- Form endpoints not accessible
- Form submission failures
- Form waiting workflows not working

**Solutions:**

1. **Verify Form Endpoint Configuration:**
```yaml
# Ensure queue mode is enabled
webhook:
  mode: queue
  url: "https://yourdomain.com"
```

2. **Check Form Endpoint Accessibility:**
```bash
# Test form endpoint
curl -I https://yourdomain.com/form/

# Test form test endpoint
curl -I https://yourdomain.com/form-test/

# Test form waiting endpoint
curl -I https://yourdomain.com/form-waiting/
```

3. **Check Form Trigger Node Configuration:**
```bash
# Verify form trigger is properly configured in n8n UI
# Check workflow execution logs
kubectl logs -l app.kubernetes.io/name=n8n | grep -i form
```

4. **Test Form Submission:**
```bash
# Test form submission
curl -X POST https://yourdomain.com/form/ \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

5. **Check Webhook Node Status:**
```bash
# Form endpoints are handled by webhook nodes
kubectl get pods -l app.kubernetes.io/component=webhook
kubectl logs -l app.kubernetes.io/component=webhook
```

:::tip
**Form Testing:** Use the `/form-test/` endpoint to test form functionality before deploying to production.
:::

#### Endpoint Routing Issues

**Symptoms:**
- Endpoints routed to wrong nodes
- Performance issues with specific endpoints

**Solutions:**

1. **Verify Endpoint Routing:**
```bash
# Check which nodes handle which endpoints
kubectl get pods -l app.kubernetes.io/name=n8n -o wide
```

2. **Check Service Configuration:**
```bash
# Verify service endpoints
kubectl get endpoints -l app.kubernetes.io/name=n8n
```

3. **Monitor Endpoint Performance:**
```bash
# Check metrics for endpoint performance
kubectl exec -it <n8n-pod> -- curl -s http://localhost:5678/metrics | grep api
```

:::info
**Routing Logic:** In queue mode, test endpoints (`/mcp-test/`, `/form-test/`) are handled by main nodes, while production endpoints (`/mcp/`, `/form/`) are handled by webhook nodes.
:::

### Storage Issues

#### S3 Connection Problems

**Symptoms:**
- Binary data upload failures
- S3 authentication errors

**Solutions:**

1. **Check S3 Credentials:**
```bash
kubectl get secret <s3-secret> -o yaml
```

2. **Test S3 Connectivity:**
```bash
kubectl exec -it <n8n-pod> -- curl -I https://s3.amazonaws.com
```

3. **Check S3 Configuration:**
```yaml
binaryData:
  mode: "s3"
  s3:
    host: s3.amazonaws.com
    bucketName: n8n-binary-data
    bucketRegion: us-east-1
    accessKey: your-access-key
    accessSecret: your-secret-key
```

#### Filesystem Storage Issues

**Symptoms:**
- Permission denied errors
- Disk space issues

**Solutions:**

1. **Check Volume Permissions:**
```bash
kubectl exec -it <n8n-pod> -- ls -la /data
```

2. **Check Disk Space:**
```bash
kubectl exec -it <n8n-pod> -- df -h
```

3. **Fix Permissions:**
```bash
kubectl exec -it <n8n-pod> -- chown -R 1000:1000 /data
```

### Network Issues

#### Ingress Problems

**Symptoms:**
- Cannot access n8n from outside
- 404 or 502 errors

**Solutions:**

1. **Check Ingress Status:**
```bash
kubectl get ingress
kubectl describe ingress <ingress-name>
```

2. **Check Ingress Controller:**
```bash
kubectl get pods -n ingress-nginx
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

3. **Test Service:**
```bash
kubectl port-forward svc/<n8n-service> 8080:5678
curl http://localhost:8080
```

#### Service Connectivity

**Symptoms:**
- Pods cannot communicate
- Service discovery issues

**Solutions:**

1. **Check Service Endpoints:**
```bash
kubectl get endpoints <service-name>
```

2. **Test Pod-to-Pod Communication:**
```bash
kubectl exec -it <pod1> -- nc -zv <pod2-ip> <port>
```

3. **Check Network Policies:**
```bash
kubectl get networkpolicy
kubectl describe networkpolicy <policy-name>
```

### Performance Issues

#### High Memory Usage

**Symptoms:**
- Pods being OOM killed
- Slow response times

**Solutions:**

1. **Check Memory Usage:**
```bash
kubectl top pods -l app.kubernetes.io/name=n8n
```

2. **Increase Memory Limits:**
```yaml
main:
  resources:
    requests:
      memory: 512Mi
    limits:
      memory: 2Gi
```

3. **Enable Memory Monitoring:**
```yaml
serviceMonitor:
  enabled: true
  include:
    defaultMetrics: true
```

#### High CPU Usage

**Symptoms:**
- Slow workflow execution
- High CPU utilization

**Solutions:**

1. **Check CPU Usage:**
```bash
kubectl top pods -l app.kubernetes.io/name=n8n
```

2. **Increase CPU Limits:**
```yaml
main:
  resources:
    requests:
      cpu: 500m
    limits:
      cpu: 2000m
```

3. **Scale Workers:**
```yaml
worker:
  mode: queue
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
```

## Debugging Commands

### General Debugging

```bash
# Get detailed pod information
kubectl describe pod <pod-name>

# Get pod logs with timestamps
kubectl logs <pod-name> --timestamps

# Get logs from previous container
kubectl logs <pod-name> --previous

# Execute commands in pod
kubectl exec -it <pod-name> -- /bin/sh

# Check environment variables
kubectl exec -it <pod-name> -- env | grep N8N
```

### Database Debugging

```bash
# Connect to PostgreSQL
kubectl exec -it <postgres-pod> -- psql -U n8n -d n8n

# Check SQLite database
kubectl exec -it <n8n-pod> -- sqlite3 /home/node/.n8n/database.sqlite ".tables"

# Check database logs
kubectl logs <n8n-pod> | grep -i database
```

### Network Debugging

```bash
# Check DNS resolution
kubectl exec -it <pod-name> -- nslookup <service-name>

# Test network connectivity
kubectl exec -it <pod-name> -- nc -zv <host> <port>

# Check network policies
kubectl get networkpolicy
kubectl describe networkpolicy <policy-name>
```

### Storage Debugging

```bash
# Check volume mounts
kubectl exec -it <pod-name> -- mount | grep n8n

# Check file permissions
kubectl exec -it <pod-name> -- ls -la /data

# Check disk usage
kubectl exec -it <pod-name> -- df -h
```

### Affinity Debugging

:::tip
**Affinity Issues:** Pod affinity and anti-affinity rules can cause scheduling issues. Check affinity configuration when pods are stuck in Pending state.
:::

#### Check Affinity Configuration

```bash
# Check current affinity settings
kubectl get pod <pod-name> -o yaml | grep -A 20 affinity

# Check node labels
kubectl get nodes --show-labels

# Check pod labels
kubectl get pods -l app.kubernetes.io/name=n8n --show-labels
```

#### Common Affinity Issues

**Symptoms:**
- Pods stuck in Pending state
- "0/1 nodes are available" errors
- Scheduling failures due to affinity rules

**Solutions:**

1. **Check Node Availability:**
```bash
# Check if nodes match affinity requirements
kubectl get nodes -l node-type=compute-optimized
kubectl get nodes -l storage-type=ssd
```

2. **Verify Topology Keys:**
```bash
# Check available topology keys
kubectl get nodes -o jsonpath='{.items[*].metadata.labels.topology\.kubernetes\.io/zone}' | tr ' ' '\n' | sort | uniq
kubectl get nodes -o jsonpath='{.items[*].metadata.labels.kubernetes\.io/hostname}' | tr ' ' '\n' | sort | uniq
```

3. **Check Affinity Rules:**
```yaml
# Example: Debug affinity configuration
main:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: node-type
            operator: In
            values:
            - compute-optimized  # Verify this label exists
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app.kubernetes.io/name: n8n
        topologyKey: kubernetes.io/hostname  # Verify this topology key exists
```

4. **Troubleshoot Anti-Affinity Conflicts:**
```bash
# Check if anti-affinity rules are too restrictive
kubectl get pods -l app.kubernetes.io/name=n8n -o wide

# Check node capacity
kubectl describe node <node-name> | grep -A 10 "Allocated resources"
```

#### Affinity Configuration Examples

**Fix: Relax Anti-Affinity Rules**
```yaml
# Change from required to preferred
worker:
  mode: queue
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:  # Changed from requiredDuringSchedulingIgnoredDuringExecution
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: n8n
              app.kubernetes.io/component: worker
          topologyKey: kubernetes.io/hostname
```

**Fix: Use Correct Topology Keys**
```yaml
# Use available topology keys
worker:
  mode: queue
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: n8n
              app.kubernetes.io/component: worker
          topologyKey: topology.kubernetes.io/zone  # Use available topology key
```

:::warning
**Deprecation Notice:** The top-level `affinity` field is deprecated. Use the specific affinity configurations under `main`, `worker`, and `webhook` blocks instead.
:::

:::info
**Affinity Debugging:** When troubleshooting scheduling issues, always check if affinity rules are preventing pod placement and verify that required node labels and topology keys exist.
:::

## Log Analysis

### Common Log Patterns

#### Database Connection Errors
```
Error: connect ECONNREFUSED
Error: timeout acquiring a connection
Error: authentication failed
```

#### Queue Mode Errors
```
Error: Redis connection failed
Error: Queue processing failed
Error: Worker not responding
```

#### Storage Errors
```
Error: S3 upload failed
Error: Permission denied
Error: Disk space full
```

### Log Filtering

```bash
# Filter for errors
kubectl logs <pod-name> | grep -i error

# Filter for specific components
kubectl logs <pod-name> | grep -i database
kubectl logs <pod-name> | grep -i redis
kubectl logs <pod-name> | grep -i s3

# Filter by time
kubectl logs <pod-name> --since=1h
kubectl logs <pod-name> --since-time="2024-01-01T00:00:00Z"
```

## Recovery Procedures

### Pod Recovery

```bash
# Restart deployment
kubectl rollout restart deployment <deployment-name>

# Scale down and up
kubectl scale deployment <deployment-name> --replicas=0
kubectl scale deployment <deployment-name> --replicas=1

# Delete and recreate pod
kubectl delete pod <pod-name>
```

### Database Recovery

```bash
# Backup database
kubectl exec -it <n8n-pod> -- pg_dump -h <db-host> -U n8n -d n8n > backup.sql

# Restore database
kubectl exec -it <n8n-pod> -- psql -h <db-host> -U n8n -d n8n < backup.sql
```

### Configuration Recovery

```bash
# Check current configuration
kubectl get configmap <configmap-name> -o yaml

# Update configuration
kubectl patch configmap <configmap-name> --patch '{"data":{"key":"value"}}'

# Restart to apply changes
kubectl rollout restart deployment <deployment-name>
```

## Prevention

### Best Practices

1. **Resource Planning:**
   - Set appropriate resource requests and limits
   - Monitor resource usage regularly
   - Plan for scaling needs

2. **Monitoring:**
   - Enable comprehensive monitoring
   - Set up alerting for critical metrics
   - Regular log analysis

3. **Backup Strategy:**
   - Regular database backups
   - Configuration backups
   - Disaster recovery testing

4. **Security:**
   - Use Kubernetes secrets for sensitive data
   - Enable RBAC
   - Regular security updates

5. **Documentation:**
   - Document custom configurations
   - Maintain runbooks for common issues
   - Regular review and updates

## Getting Help

### Community Resources

- **GitHub Issues:** [Report bugs or request features](https://github.com/community-charts/helm-charts/issues)
- **Discussions:** [Community discussions](https://github.com/community-charts/helm-charts/discussions)
- **n8n Documentation:** [Official n8n docs](https://docs.n8n.io)

### Support Information

When seeking help, please provide:

1. **Environment Details:**
   - Kubernetes version
   - Helm version
   - Chart version
   - n8n version

2. **Configuration:**
   - Relevant parts of values.yaml
   - Custom configurations

3. **Error Information:**
   - Complete error messages
   - Pod logs
   - Events from `kubectl describe`

4. **Steps to Reproduce:**
   - Exact commands used
   - Expected vs actual behavior

## Next Steps

- [Usage Guide](./usage.md) - Quick start and basic deployment
- [Configuration Guide](./configuration.md) - Detailed configuration options
- [Database Setup](./database-setup.md) - PostgreSQL and external database configuration
- [Queue Mode Setup](./queue-mode.md) - Distributed execution with Redis
- [Storage Configuration](./storage.md) - Binary data storage options
- [Monitoring Setup](./monitoring.md) - Metrics and observability
