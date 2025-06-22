---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 7
description: Common issues and solutions for Outline Helm chart deployments
keywords: [outline, troubleshooting, issues, problems, kubernetes, helm, debug]
---

# Troubleshooting

This guide covers common issues and their solutions when deploying Outline using the Helm chart.

## Pod Issues

### Pod Stuck in Pending State

**Symptoms**: Pod remains in `Pending` status

**Common Causes**:
- Insufficient cluster resources
- PVC binding issues
- Node selector constraints

**Solutions**:

```bash
# Check pod events
kubectl describe pod <pod-name>

# Check resource availability
kubectl get nodes -o custom-columns="NAME:.metadata.name,CPU:.status.capacity.cpu,MEMORY:.status.capacity.memory"

# Check PVC status
kubectl get pvc

# Check storage class
kubectl get storageclass
```

### Pod CrashLoopBackOff

**Symptoms**: Pod repeatedly crashes and restarts

**Common Causes**:
- Database connection issues
- Configuration errors
- Resource constraints

**Solutions**:

```bash
# Check pod logs
kubectl logs <pod-name> --previous

# Check pod events
kubectl describe pod <pod-name>

# Check resource usage
kubectl top pod <pod-name>
```

### Pod Not Ready

**Symptoms**: Pod is running but not ready

**Common Causes**:
- Health check failures
- Database connectivity issues
- Application startup problems

**Solutions**:

```bash
# Check readiness probe
kubectl describe pod <pod-name> | grep -A 10 "Readiness"

# Check application logs
kubectl logs <pod-name> | grep -i "ready\|health"

# Test health endpoint
kubectl exec -it <pod-name> -- curl -f http://localhost:3000/_health
```

## Database Issues

### Database Connection Failed

**Symptoms**: Application cannot connect to PostgreSQL

**Common Causes**:
- Database not running
- Incorrect credentials
- Network connectivity issues

**Solutions**:

```bash
# Check database pod status
kubectl get pods -l app.kubernetes.io/name=postgresql

# Check database logs
kubectl logs -f deployment/outline-postgresql

# Test database connectivity
kubectl exec -it <outline-pod> -- psql $DATABASE_URL -c "SELECT 1;"

# Check database environment variables
kubectl exec -it <outline-pod> -- env | grep -E "(PG|DATABASE)"
```

### Redis Connection Issues

**Symptoms**: Application cannot connect to Redis

**Common Causes**:
- Redis not running
- Authentication issues
- Network connectivity problems

**Solutions**:

```bash
# Check Redis pod status
kubectl get pods -l app.kubernetes.io/name=redis

# Check Redis logs
kubectl logs -f deployment/outline-redis-master

# Test Redis connectivity
kubectl exec -it <outline-pod> -- redis-cli -h $REDIS_HOST -p $REDIS_PORT ping

# Check Redis environment variables
kubectl exec -it <outline-pod> -- env | grep -E "(REDIS)"
```

## Storage Issues

### PVC Binding Issues

**Symptoms**: PersistentVolumeClaim remains in `Pending` status

**Common Causes**:
- No available storage class
- Insufficient storage capacity
- Storage class configuration issues

**Solutions**:

```bash
# Check PVC status
kubectl get pvc

# Check available storage classes
kubectl get storageclass

# Check persistent volumes
kubectl get pv

# Check storage class events
kubectl describe pvc <pvc-name>
```

### S3 Storage Issues

**Symptoms**: File uploads fail or S3 connectivity issues

**Common Causes**:
- Incorrect S3 credentials
- Network connectivity issues
- S3 bucket permissions

**Solutions**:

```bash
# Check S3 environment variables
kubectl exec -it <pod-name> -- env | grep -E "(AWS_)"

# Test S3 connectivity
kubectl exec -it <pod-name> -- aws s3 ls s3://your-bucket

# Check S3 credentials
kubectl get secret <release-name>-s3-secret -o yaml

# Verify bucket permissions
kubectl exec -it <pod-name> -- aws s3api get-bucket-acl --bucket your-bucket
```

### MinIO Issues

**Symptoms**: MinIO not accessible or configuration problems

**Common Causes**:
- MinIO pod not running
- Ingress configuration issues
- Credential problems

**Solutions**:

```bash
# Check MinIO pod status
kubectl get pods -l app.kubernetes.io/name=minio

# Check MinIO logs
kubectl logs -f deployment/outline-minio

# Check MinIO service
kubectl get svc -l app.kubernetes.io/name=minio

# Test MinIO connectivity
kubectl exec -it <outline-pod> -- curl -f http://outline-minio:9000
```

## Authentication Issues

### OAuth Provider Problems

**Symptoms**: Users cannot authenticate via OAuth providers

**Common Causes**:
- Incorrect OAuth credentials
- Redirect URI mismatches
- Provider configuration issues

**Solutions**:

```bash
# Check authentication environment variables
kubectl exec -it <pod-name> -- env | grep -E "(GOOGLE|AZURE|OIDC|SLACK|GITHUB)"

# Check authentication secrets
kubectl get secret <release-name>-auth-secret -o yaml

# Check application logs for auth errors
kubectl logs <pod-name> | grep -i "auth\|oauth\|login"

# Verify redirect URIs in OAuth provider
# Ensure they match: https://your-domain.com/auth/provider.callback
```

### SAML Configuration Issues

**Symptoms**: SAML authentication fails

**Common Causes**:
- Incorrect SAML endpoint
- Certificate issues
- Configuration mismatches

**Solutions**:

```bash
# Check SAML environment variables
kubectl exec -it <pod-name> -- env | grep -E "(SAML)"

# Verify SAML certificate
kubectl get secret <release-name>-auth-secret -o yaml | grep SAML_CERT

# Check SAML endpoint configuration
kubectl exec -it <pod-name> -- env | grep SAML_SSO_ENDPOINT
```

## Network and Ingress Issues

### Ingress Not Working

**Symptoms**: Cannot access Outline via ingress

**Common Causes**:
- Ingress controller not installed
- Incorrect ingress configuration
- DNS resolution issues

**Solutions**:

```bash
# Check ingress status
kubectl get ingress

# Check ingress controller
kubectl get pods -n ingress-nginx

# Check ingress events
kubectl describe ingress <ingress-name>

# Test ingress connectivity
curl -I https://your-domain.com/_health

# Check DNS resolution
nslookup your-domain.com
```

### SSL Certificate Issues

**Symptoms**: SSL certificate errors or HTTPS not working

**Common Causes**:
- Certificate not issued
- Incorrect certificate configuration
- cert-manager issues

**Solutions**:

```bash
# Check certificate status
kubectl get certificate

# Check cert-manager pods
kubectl get pods -n cert-manager

# Check certificate events
kubectl describe certificate <certificate-name>

# Check TLS secret
kubectl get secret <tls-secret-name> -o yaml
```

## Application Issues

### Application Not Starting

**Symptoms**: Outline application fails to start

**Common Causes**:
- Missing environment variables
- Configuration errors
- Resource constraints

**Solutions**:

```bash
# Check application logs
kubectl logs <pod-name>

# Check environment variables
kubectl exec -it <pod-name> -- env | sort

# Check configuration
kubectl get configmap <release-name>-entrypoint -o yaml

# Check resource usage
kubectl top pod <pod-name>
```

### Performance Issues

**Symptoms**: Slow application performance

**Common Causes**:
- Insufficient resources
- Database performance issues
- Network latency

**Solutions**:

```bash
# Check resource usage
kubectl top pod <pod-name>
kubectl top node

# Check database performance
kubectl exec -it <postgresql-pod> -- psql -U outline -d outline -c "SELECT * FROM pg_stat_activity;"

# Check Redis performance
kubectl exec -it <redis-pod> -- redis-cli info memory

# Enable debug logging
kubectl patch deployment <deployment-name> -p '{"spec":{"template":{"spec":{"containers":[{"name":"outline","env":[{"name":"LOG_LEVEL","value":"debug"}]}]}}}}'
```

## Common Error Messages

### "Database connection failed"

```bash
# Check database connectivity
kubectl exec -it <pod-name> -- psql $DATABASE_URL -c "SELECT 1;"

# Check database credentials
kubectl get secret <release-name>-postgresql -o yaml

# Verify database URL
kubectl exec -it <pod-name> -- echo $DATABASE_URL
```

### "Redis connection failed"

```bash
# Check Redis connectivity
kubectl exec -it <pod-name> -- redis-cli -h $REDIS_HOST -p $REDIS_PORT ping

# Check Redis credentials
kubectl get secret <release-name>-redis -o yaml

# Verify Redis URL
kubectl exec -it <pod-name> -- echo $REDIS_URL
```

### "File upload failed"

```bash
# Check storage configuration
kubectl exec -it <pod-name> -- env | grep -E "(FILE_STORAGE|AWS_)"

# Check S3 connectivity
kubectl exec -it <pod-name> -- aws s3 ls s3://your-bucket

# Check local storage permissions
kubectl exec -it <pod-name> -- ls -la /var/lib/outline/data
```

### "Authentication failed"

```bash
# Check authentication configuration
kubectl exec -it <pod-name> -- env | grep -E "(GOOGLE|AZURE|OIDC|SLACK|GITHUB)"

# Check authentication secrets
kubectl get secret <release-name>-auth-secret -o yaml

# Check application logs
kubectl logs <pod-name> | grep -i "auth"
```

## Debug Mode

Enable debug logging for troubleshooting:

```yaml
logging:
  level: debug
  extraDebug:
    - http
    - router
    - store
    - policies
```

Apply debug configuration:

```bash
# Update deployment with debug logging
kubectl patch deployment <deployment-name> -p '{"spec":{"template":{"spec":{"containers":[{"name":"outline","env":[{"name":"LOG_LEVEL","value":"debug"},{"name":"DEBUG","value":"http,router,store,policies"}]}]}}}}'

# Check debug logs
kubectl logs -f <pod-name>
```

## Monitoring and Logging

### Enable Application Monitoring

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "3000"
  prometheus.io/path: "/_health"
```

### Log Aggregation

Configure log aggregation for better debugging:

```yaml
# Add logging sidecar
extraContainers:
  - name: log-aggregator
    image: fluent/fluent-bit:latest
    volumeMounts:
      - name: varlog
        mountPath: /var/log
      - name: varlibdockercontainers
        mountPath: /var/lib/docker/containers
        readOnly: true
    resources:
      requests:
        memory: "64Mi"
        cpu: "50m"
      limits:
        memory: "128Mi"
        cpu: "100m"
```

## Recovery Procedures

### Database Recovery

```bash
# Backup database
kubectl exec -it <postgresql-pod> -- pg_dump -U outline outline > outline-backup.sql

# Restore database
kubectl exec -i <postgresql-pod> -- psql -U outline outline < outline-backup.sql
```

### Application Recovery

```bash
# Restart application
kubectl rollout restart deployment <deployment-name>

# Check rollout status
kubectl rollout status deployment <deployment-name>

# Rollback if needed
kubectl rollout undo deployment <deployment-name>
```

### Storage Recovery

```bash
# Backup local storage
kubectl exec -it <pod-name> -- tar czf /tmp/outline-data.tar.gz /var/lib/outline/data
kubectl cp <pod-name>:/tmp/outline-data.tar.gz ./outline-data-backup.tar.gz

# Restore local storage
kubectl cp ./outline-data-backup.tar.gz <pod-name>:/tmp/
kubectl exec -it <pod-name> -- tar xzf /tmp/outline-data-backup.tar.gz -C /
```

## Getting Help

### Collecting Debug Information

```bash
# Collect all relevant information
kubectl get all -l app.kubernetes.io/name=outline
kubectl get pvc -l app.kubernetes.io/name=outline
kubectl get secrets -l app.kubernetes.io/name=outline
kubectl describe pod <pod-name>
kubectl logs <pod-name> --previous
kubectl exec -it <pod-name> -- env | sort
```

### Useful Commands

```bash
# Check all resources
kubectl get all -l app.kubernetes.io/name=outline

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Check resource usage
kubectl top pods -l app.kubernetes.io/name=outline

# Check configuration
kubectl get configmap -l app.kubernetes.io/name=outline
kubectl get secret -l app.kubernetes.io/name=outline
```

## Next Steps

- Review [configuration options](./configuration.md)
- Check [authentication setup](./authentication.md)
- Verify [storage configuration](./storage.md)
- Confirm [database settings](./database.md)
- Explore [advanced configuration](./advanced-configuration.md)
