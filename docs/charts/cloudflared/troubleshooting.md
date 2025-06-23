---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 6
description: Common issues and solutions for Cloudflared Tunnel Helm chart deployments
keywords: [cloudflared, troubleshooting, issues, problems, kubernetes, helm, tunnel, cloudflare]
---

# Troubleshooting

This guide covers common issues and their solutions when deploying Cloudflared Tunnel using the Helm chart.

## Pod Issues

### Pod Stuck in Pending State

**Symptoms**: Pod remains in `Pending` status

**Common Causes**:
- Insufficient cluster resources
- Node selector constraints
- Taint/toleration issues

**Solutions**:

```bash
# Check pod events
kubectl describe pod <pod-name>

# Check resource availability
kubectl get nodes -o custom-columns="NAME:.metadata.name,CPU:.status.capacity.cpu,MEMORY:.status.capacity.memory"

# Check node selector
kubectl get nodes --show-labels | grep -E "(kubernetes.io/os|node-type)"

# Check taints
kubectl get nodes -o custom-columns="NAME:.metadata.name,TAINTS:.spec.taints"
```

### Pod CrashLoopBackOff

**Symptoms**: Pod repeatedly crashes and restarts

**Common Causes**:
- Invalid tunnel configuration
- Missing or incorrect credentials
- Configuration errors

**Solutions**:

```bash
# Check pod logs
kubectl logs <pod-name> --previous

# Check pod events
kubectl describe pod <pod-name>

# Check tunnel configuration
kubectl get configmap <release-name> -o yaml

# Check tunnel secrets
kubectl get secret tunnel-credentials -o yaml
```

### Pod Not Ready

**Symptoms**: Pod is running but not ready

**Common Causes**:
- Health check failures
- Tunnel connection issues
- Configuration problems

**Solutions**:

```bash
# Check readiness probe
kubectl describe pod <pod-name> | grep -A 10 "Readiness"

# Check tunnel health
kubectl exec -it <pod-name> -- curl -f http://localhost:2000/ready

# Check tunnel logs
kubectl logs <pod-name> | grep -i "ready\|health"
```

## Tunnel Connection Issues

### Tunnel Not Connecting

**Symptoms**: Tunnel fails to establish connection with Cloudflare

**Common Causes**:
- Invalid tunnel credentials
- Network connectivity issues
- DNS resolution problems

**Solutions**:

```bash
# Check tunnel status
kubectl exec -it <pod-name> -- cloudflared tunnel info <tunnel-name>

# Check tunnel logs
kubectl logs <pod-name> | grep -i "connection\|connect"

# Verify credentials
kubectl exec -it <pod-name> -- ls -la /etc/cloudflared/creds/

# Test tunnel locally
cloudflared tunnel run <tunnel-name>
```

### Authentication Failed

**Symptoms**: Tunnel authentication errors

**Common Causes**:
- Invalid or expired credentials
- Incorrect certificate
- Permission issues

**Solutions**:

```bash
# Re-authenticate with Cloudflare
cloudflared tunnel login

# Regenerate tunnel credentials
cloudflared tunnel create <tunnel-name>

# Update base64 encoded values
base64 -b 0 -i ~/.cloudflared/*.json
base64 -b 0 -i ~/.cloudflared/cert.pem

# Update Helm release
helm upgrade <release-name> community-charts/cloudflared \
  --set tunnelSecrets.base64EncodedConfigJsonFile="new-encoded-credentials" \
  --set tunnelSecrets.base64EncodedPemFile="new-encoded-certificate"
```

### DNS Resolution Issues

**Symptoms**: Cannot access services via tunnel hostnames

**Common Causes**:
- Missing DNS records
- Incorrect CNAME configuration
- DNS propagation delays

**Solutions**:

```bash
# Check DNS records
cloudflared tunnel route dns list

# Verify DNS resolution
nslookup <hostname>
dig <hostname>

# Check tunnel DNS configuration
kubectl exec -it <pod-name> -- cloudflared tunnel route ip show
```

## Service Routing Issues

### Service Not Reachable

**Symptoms**: Cannot access services through tunnel

**Common Causes**:
- Incorrect service name/namespace
- Service not running
- Port configuration issues

**Solutions**:

```bash
# Check service status
kubectl get svc -A

# Test service connectivity from pod
kubectl exec -it <pod-name> -- curl http://service-name.namespace.svc.cluster.local:port

# Check ingress configuration
kubectl get configmap <release-name> -o yaml

# Verify service endpoints
kubectl get endpoints <service-name> -n <namespace>
```

### Wrong Service Routing

**Symptoms**: Traffic routed to incorrect service

**Common Causes**:
- Incorrect ingress rules
- Hostname conflicts
- Path matching issues

**Solutions**:

```bash
# Check ingress configuration
kubectl get configmap <release-name> -o yaml

# Review ingress rules order
# Rules are processed in order, most specific first

# Test specific hostname
curl -H "Host: <hostname>" http://localhost
```

## Performance Issues

### High Latency

**Symptoms**: Slow response times through tunnel

**Common Causes**:
- Network congestion
- Resource constraints
- Suboptimal protocol

**Solutions**:

```bash
# Check resource usage
kubectl top pod <pod-name>

# Monitor tunnel metrics
kubectl exec -it <pod-name> -- curl http://localhost:2000/metrics

# Optimize protocol
# Change tunnelConfig.protocol to "http2" or "quic"

# Check connection pooling
# Increase keepAliveConnections and keepAliveTimeout
```

### Connection Drops

**Symptoms**: Intermittent connection failures

**Common Causes**:
- Network instability
- Resource exhaustion
- Timeout issues

**Solutions**:

```bash
# Check tunnel logs for connection errors
kubectl logs <pod-name> | grep -i "connection\|timeout"

# Increase retry settings
# Set tunnelConfig.retries to higher value

# Adjust timeouts
# Increase connectTimeout and gracePeriod

# Check network policies
kubectl get networkpolicy
```

## Security Issues

### Permission Denied

**Symptoms**: Permission errors in logs

**Common Causes**:
- Incorrect security context
- File permission issues
- Service account problems

**Solutions**:

```bash
# Check security context
kubectl describe pod <pod-name> | grep -A 10 "Security Context"

# Verify file permissions
kubectl exec -it <pod-name> -- ls -la /etc/cloudflared/

# Check service account
kubectl get serviceaccount
kubectl describe serviceaccount <service-account-name>
```

### Network Policy Issues

**Symptoms**: Network connectivity blocked

**Common Causes**:
- Restrictive network policies
- Missing egress rules
- Incorrect namespace selectors

**Solutions**:

```bash
# Check network policies
kubectl get networkpolicy -A

# Test connectivity
kubectl exec -it <pod-name> -- curl http://service-name.namespace.svc.cluster.local:port

# Review network policy rules
kubectl describe networkpolicy <policy-name>
```

## Configuration Issues

### Invalid YAML Configuration

**Symptoms**: Helm installation fails with YAML errors

**Common Causes**:
- Syntax errors in values.yaml
- Invalid ingress rules
- Missing required fields

**Solutions**:

```bash
# Validate Helm chart
helm template <release-name> community-charts/cloudflared -f values.yaml

# Check YAML syntax
yamllint values.yaml

# Validate ingress rules
# Ensure all required fields are present
```

### Missing Required Values

**Symptoms**: Chart installation fails with missing values

**Common Causes**:
- Missing tunnel name
- Missing credentials
- Incomplete configuration

**Solutions**:

```bash
# Check required values
helm template <release-name> community-charts/cloudflared -f values.yaml --debug

# Verify tunnel configuration
# Ensure tunnelConfig.name is set
# Ensure tunnelSecrets are provided

# Check values schema
helm template <release-name> community-charts/cloudflared --validate
```

## Common Error Messages

### "Base64 encoded config file string is required"

```bash
# Encode credentials file
base64 -b 0 -i ~/.cloudflared/*.json

# Update values.yaml
tunnelSecrets:
  base64EncodedConfigJsonFile: "your-encoded-value"
```

### "Base64 encoded certificate pem file string is required"

```bash
# Encode certificate file
base64 -b 0 -i ~/.cloudflared/cert.pem

# Update values.yaml
tunnelSecrets:
  base64EncodedPemFile: "your-encoded-value"
```

### "A valid tunnelConfig.name entry required"

```bash
# Set tunnel name in values.yaml
tunnelConfig:
  name: "your-tunnel-name"
```

### "Tunnel not found"

```bash
# Verify tunnel exists
cloudflared tunnel list

# Check tunnel name
kubectl exec -it <pod-name> -- cloudflared tunnel info <tunnel-name>

# Recreate tunnel if needed
cloudflared tunnel create <tunnel-name>
```

## Debug Commands

### General Debugging

```bash
# Check all resources
kubectl get all -l app.kubernetes.io/name=cloudflared

# Check events
kubectl get events --sort-by='.lastTimestamp' | grep cloudflared

# Check logs
kubectl logs -f deployment/<release-name>

# Check configuration
kubectl get configmap <release-name> -o yaml
kubectl get secret tunnel-credentials -o yaml
```

### Tunnel-Specific Debugging

```bash
# Check tunnel status
kubectl exec -it <pod-name> -- cloudflared tunnel info <tunnel-name>

# Check tunnel logs
kubectl exec -it <pod-name> -- cloudflared tunnel logs <tunnel-name>

# Test tunnel locally
cloudflared tunnel run <tunnel-name>

# Check DNS routes
cloudflared tunnel route dns list
```

### Network Debugging

```bash
# Test DNS resolution
nslookup <hostname>
dig <hostname>

# Test service connectivity
kubectl exec -it <pod-name> -- curl -v http://service-name.namespace.svc.cluster.local:port

# Check network policies
kubectl get networkpolicy -A
kubectl describe networkpolicy <policy-name>
```

## Monitoring and Health Checks

### Health Check Endpoints

```bash
# Check tunnel health
kubectl exec -it <pod-name> -- curl http://localhost:2000/ready

# Check metrics
kubectl exec -it <pod-name> -- curl http://localhost:2000/metrics

# Check tunnel info
kubectl exec -it <pod-name> -- cloudflared tunnel info <tunnel-name>
```

### Prometheus Monitoring

Enable monitoring for better debugging:

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "2000"
  prometheus.io/path: "/metrics"
```

## Recovery Procedures

### Tunnel Recovery

```bash
# Restart tunnel
kubectl rollout restart deployment/<release-name>

# Check rollout status
kubectl rollout status deployment/<release-name>

# Rollback if needed
kubectl rollout undo deployment/<release-name>
```

### Credential Recovery

```bash
# Backup current credentials
kubectl get secret tunnel-credentials -o yaml > backup-credentials.yaml

# Regenerate credentials
cloudflared tunnel login
cloudflared tunnel create <tunnel-name>

# Update Helm release with new credentials
helm upgrade <release-name> community-charts/cloudflared \
  --set tunnelSecrets.base64EncodedConfigJsonFile="new-credentials" \
  --set tunnelSecrets.base64EncodedPemFile="new-certificate"
```

### Configuration Recovery

```bash
# Backup current configuration
kubectl get configmap <release-name> -o yaml > backup-config.yaml

# Restore configuration
kubectl apply -f backup-config.yaml

# Restart deployment
kubectl rollout restart deployment/<release-name>
```

## Getting Help

### Collecting Debug Information

```bash
# Collect all relevant information
kubectl get all -l app.kubernetes.io/name=cloudflared
kubectl get configmap -l app.kubernetes.io/name=cloudflared
kubectl get secret -l app.kubernetes.io/name=cloudflared
kubectl describe pod <pod-name>
kubectl logs <pod-name> --previous
kubectl exec -it <pod-name> -- env | sort
```

### Useful Commands

```bash
# Check all resources
kubectl get all -l app.kubernetes.io/name=cloudflared

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Check resource usage
kubectl top pods -l app.kubernetes.io/name=cloudflared

# Check configuration
kubectl get configmap -l app.kubernetes.io/name=cloudflared
kubectl get secret -l app.kubernetes.io/name=cloudflared
```

## Next Steps

- Review [configuration options](./configuration.md)
- Check [tunnel setup](./tunnel-setup.md)
- Verify [ingress configuration](./ingress-configuration.md)
- Explore [advanced configuration options](./advanced-configuration.md)
