---
id: usage
title: Cloudflared Chart Usage Guide
sidebar_label: Usage
sidebar_position: 1
description: Learn how to deploy and use Cloudflared Tunnel with the community-maintained Helm chart
keywords: [cloudflared, tunnel, usage, deployment, kubernetes, helm, cloudflare]
---

# Cloudflared Chart Usage Guide

[Cloudflared](https://github.com/cloudflare/cloudflared) is a tool from Cloudflare to create secure tunnels from your Kubernetes cluster to the Cloudflare network, exposing services without opening public ports.

- **Official Website:** [https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- **GitHub Repository:** [https://github.com/cloudflare/cloudflared](https://github.com/cloudflare/cloudflared)
- **Documentation:** [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- **ArtifactHub:** [Cloudflared Helm Chart](https://artifacthub.io/packages/helm/community-charts/cloudflared)

## Why Use This Chart?

- **Secure Access**: Expose Kubernetes services securely without opening public ports
- **No Ingress Required**: Bypass traditional ingress controllers and load balancers
- **Global Network**: Leverage Cloudflare's global network for optimal performance
- **Community Maintained**: Open-source Helm chart with active community support
- **Easy Deployment**: Simple Helm-based deployment with comprehensive configuration options

## Prerequisites

Before deploying the Cloudflared Tunnel chart, ensure you have:

1. **Kubernetes Cluster**: Version 1.21 or later
2. **Helm**: Version 3.0 or later
3. **Cloudflare Account**: With a domain added and configured
4. **Cloudflared CLI**: For tunnel setup and management

## Quick Start

### 1. Add the Helm Repository

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
```

### 2. Create a Tunnel

```bash
# Authenticate with Cloudflare
cloudflared tunnel login

# Create a tunnel
cloudflared tunnel create my-tunnel

# Configure DNS (optional)
cloudflared tunnel route dns my-tunnel example.com
```

### 3. Prepare Tunnel Files

```bash
# Encode credentials file
base64 -b 0 -i ~/.cloudflared/*.json

# Encode certificate file
base64 -b 0 -i ~/.cloudflared/cert.pem
```

### 4. Create Values File

Create a `values.yaml` file:

```yaml
# Tunnel configuration
tunnelConfig:
  name: "my-tunnel"
  logLevel: "info"
  protocol: "auto"
  retries: 5
  connectTimeout: "30s"
  gracePeriod: "30s"

# Tunnel secrets (replace with your encoded values)
tunnelSecrets:
  base64EncodedConfigJsonFile: "your-base64-encoded-credentials"
  base64EncodedPemFile: "your-base64-encoded-certificate"

# Ingress rules
ingress:
  - hostname: example.com
    service: http://your-service.namespace.svc.cluster.local:80

  - service: http_status:404
```

### 5. Install the Chart

```bash
helm install my-cloudflared community-charts/cloudflared \
  -f values.yaml \
  -n <your-namespace> \
  --create-namespace
```

### 6. Verify Installation

```bash
# Check pod status
kubectl get pods -l app.kubernetes.io/name=cloudflared

# Check tunnel logs
kubectl logs -f deployment/my-cloudflared

# Test access
curl https://example.com
```

## Deployment Modes

### DaemonSet Mode (Recommended)

Deploy to all nodes for high availability:

```yaml
replica:
  allNodes: true
```

### Deployment Mode

Deploy specific number of replicas:

```yaml
replica:
  allNodes: false
  count: 3
```

## Basic Configuration Examples

### Simple Web Application

```yaml
tunnelConfig:
  name: "web-app-tunnel"
  logLevel: "info"

tunnelSecrets:
  base64EncodedConfigJsonFile: "your-credentials"
  base64EncodedPemFile: "your-certificate"

ingress:
  - hostname: app.example.com
    service: http://web-service.default.svc.cluster.local:80

  - service: http_status:404
```

### Multi-Service Application

```yaml
tunnelConfig:
  name: "multi-service-tunnel"
  logLevel: "info"

tunnelSecrets:
  base64EncodedConfigJsonFile: "your-credentials"
  base64EncodedPemFile: "your-certificate"

ingress:
  - hostname: app.example.com
    service: http://frontend-service.default.svc.cluster.local:3000

  - hostname: api.example.com
    service: http://api-service.default.svc.cluster.local:8080

  - hostname: admin.example.com
    service: http://admin-service.default.svc.cluster.local:8080

  - service: http_status:404
```

### Development Environment

```yaml
replica:
  allNodes: false
  count: 1

tunnelConfig:
  name: "dev-tunnel"
  logLevel: "debug"

tunnelSecrets:
  base64EncodedConfigJsonFile: "your-credentials"
  base64EncodedPemFile: "your-certificate"

ingress:
  - hostname: dev.example.com
    service: http://dev-service.default.svc.cluster.local:3000

  - hostname: dev-api.example.com
    service: http://dev-api-service.default.svc.cluster.local:8080

  - service: http_status:404

resources:
  limits:
    cpu: "200m"
    memory: "128Mi"
  requests:
    cpu: "100m"
    memory: "64Mi"
```

## Common Operations

### Upgrading the Chart

```bash
# Update repository
helm repo update

# Upgrade installation
helm upgrade my-cloudflared community-charts/cloudflared \
  -f values.yaml \
  -n <your-namespace>
```

### Scaling the Deployment

```bash
# Scale to specific number of replicas
kubectl scale deployment my-cloudflared --replicas=3

# Or update values and upgrade
helm upgrade my-cloudflared community-charts/cloudflared \
  --set replica.count=3 \
  -n <your-namespace>
```

### Rolling Back

```bash
# Rollback to previous version
helm rollback my-cloudflared -n <your-namespace>

# Or rollback to specific revision
helm rollback my-cloudflared 2 -n <your-namespace>
```

### Uninstalling

```bash
# Uninstall the chart
helm uninstall my-cloudflared -n <your-namespace>

# Delete tunnel (optional)
cloudflared tunnel delete my-tunnel
```

## Monitoring and Health Checks

### Health Check Endpoint

The tunnel provides a health check endpoint:

```bash
# Check tunnel health
kubectl exec -it <pod-name> -- curl http://localhost:2000/ready

# Check metrics
kubectl exec -it <pod-name> -- curl http://localhost:2000/metrics
```

### Prometheus Monitoring

Enable Prometheus monitoring:

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "2000"
  prometheus.io/path: "/metrics"
```

### Log Monitoring

```bash
# Follow tunnel logs
kubectl logs -f deployment/my-cloudflared

# Check specific log levels
kubectl logs deployment/my-cloudflared | grep -i "error\|warn"
```

## Security Considerations

### Network Policies

Create network policies to restrict access:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: cloudflared-network-policy
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: cloudflared
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: TCP
      port: 2000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: default
    ports:
    - protocol: TCP
      port: 80
    - protocol: TCP
      port: 443
```

### RBAC Configuration

Configure proper RBAC:

```yaml
serviceAccount:
  create: true
  name: "cloudflared-service-account"
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/cloudflared-role"
```

## Best Practices

### 1. Use DaemonSet for High Availability

```yaml
replica:
  allNodes: true
```

### 2. Configure Resource Limits

```yaml
resources:
  limits:
    cpu: "500m"
    memory: "256Mi"
  requests:
    cpu: "200m"
    memory: "128Mi"
```

### 3. Enable Monitoring

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "2000"
  prometheus.io/path: "/metrics"
```

### 4. Use Specific Hostnames

```yaml
ingress:
  - hostname: app.example.com
    service: http://app-service.default.svc.cluster.local:80

  - hostname: api.example.com
    service: http://api-service.default.svc.cluster.local:8080
```

### 5. Always Include Error Handler

```yaml
ingress:
  # Your service rules here
  - service: http_status:404  # Required
```

## Troubleshooting

### Common Issues

1. **Pod Not Starting**: Check tunnel credentials and configuration
2. **Service Not Accessible**: Verify ingress rules and service endpoints
3. **High Latency**: Optimize protocol and connection settings
4. **Authentication Errors**: Regenerate tunnel credentials

### Debug Commands

```bash
# Check pod status
kubectl get pods -l app.kubernetes.io/name=cloudflared

# Check tunnel logs
kubectl logs -f deployment/my-cloudflared

# Check tunnel status
kubectl exec -it <pod-name> -- cloudflared tunnel info my-tunnel

# Test service connectivity
kubectl exec -it <pod-name> -- curl http://service-name.namespace.svc.cluster.local:port
```

## Next Steps

- Learn about [tunnel setup](./tunnel-setup.md)
- Configure [ingress rules](./ingress-configuration.md)
- Explore [advanced configuration options](./advanced-configuration.md)
- Learn about [troubleshooting common issues](./troubleshooting.md)
- Review [configuration options](./configuration.md)
