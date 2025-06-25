---
id: troubleshooting
title: PyPI Server Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 5
description: Common issues, debugging commands, and solutions for PyPI Server Helm chart deployments
keywords: [pypiserver troubleshooting, debugging, common issues, kubernetes problems, helm chart issues]
---

# Troubleshooting

This page covers common issues you may encounter when deploying and running PyPI Server on Kubernetes, along with debugging commands and solutions.

## Common Issues

### 1. Pod Startup Issues

#### Pod Stuck in Pending State

**Symptoms:**
- Pod remains in `Pending` state
- No events or error messages

**Debug Commands:**
```bash
# Check pod status
kubectl get pods -l app.kubernetes.io/name=pypiserver

# Check pod events
kubectl describe pod <pod-name>

# Check node resources
kubectl describe nodes

# Check PVC status
kubectl get pvc
kubectl describe pvc pypi-packages-pvc
```

**Solutions:**
- Ensure PVC exists and is bound
- Check node resources and taints
- Verify storage class is available
- Check resource requests/limits

#### Pod CrashLoopBackOff

**Symptoms:**
- Pod repeatedly crashes and restarts
- Status shows `CrashLoopBackOff`

**Debug Commands:**
```bash
# Check pod logs
kubectl logs <pod-name> --previous

# Check pod events
kubectl describe pod <pod-name>

# Check container status
kubectl get pods <pod-name> -o yaml
```

**Common Causes:**
- Incorrect volume mounts
- Permission issues
- Missing configuration files
- Resource constraints

### 2. Storage Issues

#### Permission Denied Errors

**Symptoms:**
- `Permission denied` in logs
- Cannot write to package directory

**Debug Commands:**
```bash
# Check volume mounts
kubectl exec -it <pod-name> -- ls -la /data/

# Check file permissions
kubectl exec -it <pod-name> -- ls -la /data/packages/

# Check security context
kubectl get pod <pod-name> -o yaml | grep -A 10 securityContext
```

**Solutions:**
```yaml
# Fix security context
podSecurityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: OnRootMismatch

securityContext:
  runAsNonRoot: true
  runAsUser: 1000
```

#### Storage Full

**Symptoms:**
- `No space left on device` errors
- Cannot upload new packages

**Debug Commands:**
```bash
# Check storage usage
kubectl exec -it <pod-name> -- df -h

# Check package directory size
kubectl exec -it <pod-name> -- du -sh /data/packages/

# Check PVC capacity
kubectl get pvc pypi-packages-pvc
```

**Solutions:**
- Increase PVC size
- Clean up old packages
- Implement storage monitoring

### 3. Network Issues

#### Service Not Accessible

**Symptoms:**
- Cannot access PyPI Server from outside cluster
- Connection refused errors

**Debug Commands:**
```bash
# Check service status
kubectl get svc -l app.kubernetes.io/name=pypiserver

# Check endpoints
kubectl get endpoints -l app.kubernetes.io/name=pypiserver

# Test service connectivity
kubectl run test-pod --image=busybox --rm -it --restart=Never -- wget -O- http://<service-name>:8080

# Check ingress status
kubectl get ingress
kubectl describe ingress <ingress-name>
```

**Solutions:**
- Verify service configuration
- Check ingress controller
- Ensure port mappings are correct

#### Ingress Issues

**Symptoms:**
- Ingress not routing traffic
- SSL/TLS certificate issues

**Debug Commands:**
```bash
# Check ingress controller logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller

# Check ingress events
kubectl describe ingress <ingress-name>

# Test ingress connectivity
curl -I https://pypi.yourdomain.com
```

**Solutions:**
- Verify ingress annotations
- Check certificate configuration
- Ensure DNS resolution

### 4. Authentication Issues

#### Password File Problems

**Symptoms:**
- Authentication failures
- Cannot access protected packages

**Debug Commands:**
```bash
# Check password file
kubectl exec -it <pod-name> -- cat /data/.htpasswd

# Check secret
kubectl get secret pypi-auth -o yaml

# Test authentication
curl -u username:password https://pypi.yourdomain.com/simple/
```

**Solutions:**
- Verify password file format
- Check secret configuration
- Ensure proper volume mounting

### 5. Performance Issues

#### Slow Package Uploads/Downloads

**Symptoms:**
- Long response times
- Timeout errors

**Debug Commands:**
```bash
# Check resource usage
kubectl top pod <pod-name>

# Check pod metrics
kubectl exec -it <pod-name> -- cat /proc/cpuinfo
kubectl exec -it <pod-name> -- cat /proc/meminfo

# Check network performance
kubectl exec -it <pod-name> -- ping -c 3 google.com
```

**Solutions:**
- Increase resource limits
- Use SSD storage
- Optimize server configuration
- Add more replicas

## Debugging Commands

### General Debugging

```bash
# Get all resources
kubectl get all -l app.kubernetes.io/name=pypiserver

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Check logs with timestamps
kubectl logs <pod-name> --timestamps

# Follow logs in real-time
kubectl logs <pod-name> -f

# Check pod details
kubectl describe pod <pod-name>

# Check service details
kubectl describe svc <service-name>
```

### Storage Debugging

```bash
# Check PVC status
kubectl get pvc
kubectl describe pvc pypi-packages-pvc

# Check storage usage
kubectl exec -it <pod-name> -- df -h
kubectl exec -it <pod-name> -- du -sh /data/packages/

# Check file permissions
kubectl exec -it <pod-name> -- ls -la /data/
kubectl exec -it <pod-name> -- id

# Check volume mounts
kubectl get pod <pod-name> -o yaml | grep -A 20 volumeMounts
```

### Network Debugging

```bash
# Check service endpoints
kubectl get endpoints <service-name>

# Test service connectivity
kubectl run test-pod --image=busybox --rm -it --restart=Never -- wget -O- http://<service-name>:8080

# Check ingress status
kubectl get ingress
kubectl describe ingress <ingress-name>

# Test external connectivity
curl -I http://<service-ip>:8080
curl -I https://pypi.yourdomain.com
```

### Application Debugging

```bash
# Check PyPI Server process
kubectl exec -it <pod-name> -- ps aux

# Check listening ports
kubectl exec -it <pod-name> -- netstat -tlnp

# Check environment variables
kubectl exec -it <pod-name> -- env | grep PYPISERVER

# Check configuration
kubectl exec -it <pod-name> -- cat /data/.htpasswd
```

## Health Check Issues

### Liveness Probe Failures

**Symptoms:**
- Pod restarts frequently
- Health endpoint returns errors

**Debug Commands:**
```bash
# Test health endpoint
kubectl exec -it <pod-name> -- wget -O- http://localhost:8080/health

# Check probe configuration
kubectl get pod <pod-name> -o yaml | grep -A 10 livenessProbe

# Check application logs
kubectl logs <pod-name> --previous
```

**Solutions:**
```yaml
# Adjust probe settings
livenessProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 60
  periodSeconds: 30
  timeoutSeconds: 10
  failureThreshold: 3
```

### Readiness Probe Failures

**Symptoms:**
- Service endpoints not ready
- Traffic not routed to pod

**Debug Commands:**
```bash
# Check readiness status
kubectl get pods -o wide

# Test readiness endpoint
kubectl exec -it <pod-name> -- wget -O- http://localhost:8080/health

# Check probe configuration
kubectl get pod <pod-name> -o yaml | grep -A 10 readinessProbe
```

## Resource Issues

### Memory Issues

**Symptoms:**
- `OOMKilled` errors
- High memory usage

**Debug Commands:**
```bash
# Check memory usage
kubectl top pod <pod-name>

# Check memory limits
kubectl get pod <pod-name> -o yaml | grep -A 5 resources

# Check memory stats
kubectl exec -it <pod-name> -- cat /proc/meminfo
```

**Solutions:**
```yaml
# Increase memory limits
resources:
  limits:
    memory: 4Gi
  requests:
    memory: 2Gi
```

### CPU Issues

**Symptoms:**
- Slow response times
- High CPU usage

**Debug Commands:**
```bash
# Check CPU usage
kubectl top pod <pod-name>

# Check CPU limits
kubectl get pod <pod-name> -o yaml | grep -A 5 resources

# Check CPU stats
kubectl exec -it <pod-name> -- cat /proc/cpuinfo
```

## Configuration Issues

### Values File Problems

**Symptoms:**
- Helm install/upgrade fails
- Unexpected behavior

**Debug Commands:**
```bash
# Validate values file
helm template . -f values.yaml --dry-run

# Check rendered templates
helm template . -f values.yaml

# Validate against schema
helm template . -f values.yaml --validate
```

### Environment Variable Issues

**Symptoms:**
- Application not using expected configuration
- Missing environment variables

**Debug Commands:**
```bash
# Check environment variables
kubectl exec -it <pod-name> -- env

# Check specific variable
kubectl exec -it <pod-name> -- echo $PYPISERVER_PORT

# Check deployment configuration
kubectl get deployment <deployment-name> -o yaml | grep -A 10 env
```

## Recovery Procedures

### Pod Recovery

```bash
# Restart deployment
kubectl rollout restart deployment <deployment-name>

# Check rollout status
kubectl rollout status deployment <deployment-name>

# Rollback to previous version
kubectl rollout undo deployment <deployment-name>
```

### Data Recovery

```bash
# Create backup before troubleshooting
kubectl exec -it <pod-name> -- tar -czf /tmp/backup.tar.gz /data/packages/

# Copy backup from pod
kubectl cp <pod-name>:/tmp/backup.tar.gz ./backup.tar.gz

# Restore data if needed
kubectl cp ./backup.tar.gz <new-pod-name>:/tmp/
kubectl exec -it <new-pod-name> -- tar -xzf /tmp/backup.tar.gz -C /
```

### Service Recovery

```bash
# Restart service
kubectl delete svc <service-name>
kubectl apply -f service.yaml

# Check service endpoints
kubectl get endpoints <service-name>

# Test service connectivity
kubectl run test-pod --image=busybox --rm -it --restart=Never -- wget -O- http://<service-name>:8080
```

## Monitoring and Alerting

### Set Up Monitoring

```yaml
# Add monitoring annotations
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"

# Create ServiceMonitor for Prometheus
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: pypi-monitor
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: pypiserver
  endpoints:
    - port: http
      path: /metrics
```

### Common Alerts

```yaml
# Example Prometheus alert rules
groups:
  - name: pypi-server
    rules:
      - alert: PyPIServerDown
        expr: up{app="pypiserver"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "PyPI Server is down"

      - alert: PyPIServerHighMemory
        expr: container_memory_usage_bytes{container="pypiserver"} > 3e9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "PyPI Server memory usage is high"
```

## Next Steps

- Review [configuration](./configuration.md) for proper setup
- Learn about [storage](./storage.md) configuration
- Explore [advanced configuration](./advanced-configuration.md) options
- Check the [usage guide](./usage.md) for deployment examples
