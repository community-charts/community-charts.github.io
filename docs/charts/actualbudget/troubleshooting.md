---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 6
description: Common issues and solutions for Actual Budget Helm chart deployments
keywords: [actual, actualbudget, personal finance, troubleshooting, issues, problems, kubernetes, helm]
---

# Troubleshooting

This guide covers common issues and their solutions when deploying Actual Budget using the Helm chart.

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
kubectl describe pvc <pvc-name>
```

### Pod CrashLoopBackOff

**Symptoms**: Pod repeatedly crashes and restarts

**Solutions**:

```bash
# Check pod logs
kubectl logs <pod-name> --previous

# Check pod events
kubectl describe pod <pod-name>

# Check resource limits
kubectl top pod <pod-name>
```

**Common Fixes**:

```yaml
# Increase resource limits
resources:
  limits:
    cpu: "1"
    memory: "2Gi"
  requests:
    cpu: "500m"
    memory: "1Gi"

# Add startup probe for slow startup
startupProbe:
  httpGet:
    path: /
    port: http
  initialDelaySeconds: 60
  periodSeconds: 10
  failureThreshold: 30
```

## Storage Issues

### PVC Binding Failures

**Symptoms**: PVC remains in `Pending` status

**Solutions**:

```bash
# Check storage classes
kubectl get storageclass

# Check PVC details
kubectl describe pvc <pvc-name>

# Check cluster capacity
kubectl get nodes -o custom-columns="NAME:.metadata.name,STORAGE:.status.capacity.ephemeral-storage"
```

**Common Fixes**:

```yaml
# Specify available storage class
persistence:
  enabled: true
  storageClass: "standard"  # Use available storage class
  size: 10Gi

# Or disable persistence for testing
persistence:
  enabled: false
```

### Permission Denied Errors

**Symptoms**: Application can't write to storage

**Solutions**:

```bash
# Check file permissions
kubectl exec -it <pod-name> -- ls -la /data

# Check security context
kubectl get pod <pod-name> -o yaml | grep -A 10 securityContext
```

**Fix**:

```yaml
# Configure proper security context
podSecurityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: OnRootMismatch

securityContext:
  runAsNonRoot: true
  runAsUser: 1000
```

## Authentication Issues

### OpenID Connect Problems

**Symptoms**: OIDC authentication fails

**Debug Steps**:

```bash
# Check OIDC secret
kubectl get secret <release-name>-openid-secret -o yaml

# Check pod environment variables
kubectl exec -it <pod-name> -- env | grep ACTUAL_OPENID

# Check application logs
kubectl logs <pod-name> | grep -i oidc
```

**Common Issues**:

1. **Invalid Discovery URL**:
   ```yaml
   login:
     openid:
       discoveryUrl: "https://your-provider.com/.well-known/openid_configuration"
   ```

2. **Wrong Redirect URI**:
   - Configure redirect URI in OIDC provider as: `https://your-domain.com/oauth/callback`

3. **SSL Certificate Issues**:
   ```yaml
   login:
     skipSSLVerification: true  # Only for development
   ```

### Password Authentication Issues

**Symptoms**: Can't create account or login

**Solutions**:

```bash
# Check if multi-user mode is enabled
kubectl exec -it <pod-name> -- env | grep ACTUAL_MULTIUSER

# Reset by deleting server files (WARNING: loses all data)
kubectl exec -it <pod-name> -- rm -rf /data/server-files/*
```

## Networking Issues

### Ingress Not Working

**Symptoms**: Can't access application via ingress

**Debug Steps**:

```bash
# Check ingress status
kubectl get ingress
kubectl describe ingress <ingress-name>

# Check ingress controller logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller

# Test service directly
kubectl port-forward svc/<service-name> 5006:5006
```

**Common Fixes**:

```yaml
# Ensure proper ingress configuration
ingress:
  enabled: true
  className: nginx
  annotations:
    kubernetes.io/ingress.class: nginx
  hosts:
    - host: actualbudget.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
```

### Service Connection Issues

**Symptoms**: Can't connect to service

**Debug Steps**:

```bash
# Check service
kubectl get svc
kubectl describe svc <service-name>

# Test service from within cluster
kubectl run test-pod --rm -it --image=busybox --restart=Never -- wget -O- http://<service-name>:5006

# Check endpoints
kubectl get endpoints <service-name>
```

## Resource Issues

### Out of Memory

**Symptoms**: Pod crashes with OOM errors

**Solutions**:

```bash
# Check memory usage
kubectl top pod <pod-name>

# Check memory limits
kubectl get pod <pod-name> -o jsonpath='{.spec.containers[0].resources}'
```

**Fix**:

```yaml
# Increase memory limits
resources:
  limits:
    memory: "2Gi"
  requests:
    memory: "1Gi"
```

### High CPU Usage

**Symptoms**: Slow performance, high CPU usage

**Solutions**:

```bash
# Check CPU usage
kubectl top pod <pod-name>

# Check CPU limits
kubectl get pod <pod-name> -o jsonpath='{.spec.containers[0].resources}'
```

**Fix**:

```yaml
# Increase CPU limits
resources:
  limits:
    cpu: "1"
  requests:
    cpu: "500m"
```

## Health Check Issues

### Liveness Probe Failures

**Symptoms**: Pod restarts due to failed health checks

**Debug Steps**:

```bash
# Check probe configuration
kubectl get pod <pod-name> -o jsonpath='{.spec.containers[0].livenessProbe}'

# Test endpoint manually
kubectl exec -it <pod-name> -- wget -O- http://localhost:5006/
```

**Fix**:

```yaml
# Adjust probe settings
livenessProbe:
  httpGet:
    path: /
    port: http
  initialDelaySeconds: 60
  periodSeconds: 30
  timeoutSeconds: 10
  failureThreshold: 3
```

## Upgrade Issues

### Helm Upgrade Failures

**Symptoms**: `helm upgrade` fails

**Solutions**:

```bash
# Check upgrade status
helm status <release-name>

# Rollback to previous version
helm rollback <release-name> <revision>

# Check values compatibility
helm template <release-name> . --debug
```

### Breaking Changes

**Version 1.5.x Upgrade**:

```yaml
# Update deprecated field
login:
  openid:
    discoveryUrl: "https://your-provider.com/.well-known/openid_configuration"
    # Remove: dicovertUrl (deprecated)
```

## Data Issues

### Data Loss

**Symptoms**: Budget data missing after restart

**Causes**:
- Persistence not enabled
- Wrong PVC configuration
- Storage class issues

**Prevention**:

```yaml
# Always enable persistence in production
persistence:
  enabled: true
  size: 20Gi
  storageClass: "reliable-storage"
```

### Data Corruption

**Symptoms**: Application errors or corrupted data

**Solutions**:

```bash
# Check data integrity
kubectl exec -it <pod-name> -- ls -la /data/

# Backup before attempting fixes
kubectl run backup --rm -it --image=busybox --restart=Never -- tar czf /backup/data.tar.gz /data
kubectl cp backup:/backup/data.tar.gz ./backup.tar.gz
```

## Monitoring and Logging

### Check Application Logs

```bash
# Follow logs
kubectl logs -f <pod-name>

# Check previous logs
kubectl logs <pod-name> --previous

# Check specific time range
kubectl logs <pod-name> --since=1h
```

### Monitor Resources

```bash
# Check resource usage
kubectl top pod <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp' | grep <pod-name>

# Check pod status
kubectl get pods -w
```

## Common Error Messages

### "ImagePullBackOff"

```bash
# Check image availability
kubectl describe pod <pod-name> | grep -A 10 Events

# Fix: Use correct image or configure imagePullSecrets
image:
  repository: actualbudget/actual-server
  tag: "25.6.1"
```

### "CrashLoopBackOff"

```bash
# Check logs for root cause
kubectl logs <pod-name> --previous

# Common causes: resource limits, configuration errors, missing dependencies
```

### "Pending" Status

```bash
# Check scheduling events
kubectl describe pod <pod-name> | grep -A 20 Events

# Common causes: resource constraints, node selectors, PVC issues
```

## Getting Help

### Collect Debug Information

```bash
# Create debug bundle
kubectl get all -l app.kubernetes.io/name=actualbudget -o yaml > debug.yaml
kubectl describe pod <pod-name> > pod-description.txt
kubectl logs <pod-name> > pod-logs.txt
kubectl get events --sort-by='.lastTimestamp' > events.txt
```

### Useful Commands

```bash
# Quick health check
kubectl get pods,svc,ingress,pvc

# Check helm release
helm status <release-name>

# Validate values
helm template <release-name> . --validate

# Test connectivity
kubectl run test --rm -it --image=busybox --restart=Never -- wget -O- http://<service-name>:5006
```

## Next Steps

- Review [configuration options](./configuration.md)
- Check [authentication setup](./authentication.md)
- Configure [storage properly](./storage.md)
- Explore [advanced configuration](./advanced-configuration.md)
