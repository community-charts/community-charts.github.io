---
id: tunnel-setup
title: Cloudflared Tunnel Setup Guide
sidebar_label: Tunnel Setup
sidebar_position: 3
description: Set up Cloudflare Tunnel for secure access to your Kubernetes services
keywords: [cloudflared, tunnel, setup, cloudflare, credentials, certificate, kubernetes, helm]
---

# Tunnel Setup Guide

This guide covers the complete process of setting up a Cloudflare Tunnel for use with the Helm chart.

## Prerequisites

### 1. Cloudflare Account

If you don't have a Cloudflare account, create one at [Cloudflare's official documentation](https://developers.cloudflare.com/fundamentals/setup/account/create-account/).

### 2. Domain Configuration

Ensure your domain is added to your Cloudflare account and the nameservers are properly configured.

### 3. Cloudflared CLI

Install the Cloudflared CLI tool:

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# Linux
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Windows
# Download from https://github.com/cloudflare/cloudflared/releases
```

## Creating a Tunnel

### Step 1: Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This command will:
1. Open your browser to authenticate with Cloudflare
2. Download a certificate file (`cert.pem`) to `~/.cloudflared/`
3. Create the necessary permissions for tunnel management

### Step 2: Create a Tunnel

```bash
cloudflared tunnel create my-tunnel
```

This creates a tunnel and generates a credentials file in `~/.cloudflared/`.

### Step 3: Verify Tunnel Creation

```bash
# List all tunnels
cloudflared tunnel list

# Get tunnel details
cloudflared tunnel info my-tunnel
```

## Configuring DNS Records

### Automatic DNS Configuration

```bash
# Create DNS record for your tunnel
cloudflared tunnel route dns my-tunnel example.com

# For wildcard subdomains
cloudflared tunnel route dns my-tunnel *.example.com
```

### Manual DNS Configuration

If you prefer manual DNS configuration:

1. Go to your Cloudflare dashboard
2. Navigate to DNS settings for your domain
3. Add a CNAME record:
   - **Name**: `example.com` or `*` for wildcard
   - **Target**: `<tunnel-id>.cfargotunnel.com`
   - **Proxy status**: Proxied (orange cloud)

## Preparing Tunnel Files

### Step 1: Locate Tunnel Files

After creating the tunnel, you'll have these files in `~/.cloudflared/`:

- `cert.pem` - Certificate file
- `<tunnel-id>.json` - Credentials file

### Step 2: Encode Files for Helm

Encode the files using base64:

```bash
# Encode credentials JSON file
base64 -b 0 -i ~/.cloudflared/*.json

# Encode certificate PEM file
base64 -b 0 -i ~/.cloudflared/cert.pem
```

:::tip
Alternative encoding commands for different operating systems:
```bash
# macOS/Linux alternative
cat ~/.cloudflared/*.json | base64
cat ~/.cloudflared/cert.pem | base64

# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$env:USERPROFILE\.cloudflared\*.json"))
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$env:USERPROFILE\.cloudflared\cert.pem"))
```
:::

## Helm Chart Configuration

### Step 1: Create Values File

Create a `values.yaml` file with your tunnel configuration:

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

### Step 2: Install the Chart

```bash
# Add the repository
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update

# Install with your values
helm install my-cloudflared community-charts/cloudflared \
  -f values.yaml \
  -n <your-namespace> \
  --create-namespace
```

### Step 3: Verify Installation

```bash
# Check pod status
kubectl get pods -l app.kubernetes.io/name=cloudflared

# Check tunnel logs
kubectl logs -f deployment/my-cloudflared

# Check tunnel status
kubectl exec -it <pod-name> -- cloudflared tunnel info my-tunnel
```

## Advanced Tunnel Configuration

### Multiple Tunnels

You can create multiple tunnels for different purposes:

```bash
# Create tunnels for different environments
cloudflared tunnel create production-tunnel
cloudflared tunnel create staging-tunnel
cloudflared tunnel create development-tunnel

# Configure DNS for each
cloudflared tunnel route dns production-tunnel app.example.com
cloudflared tunnel route dns staging-tunnel staging.example.com
cloudflared tunnel route dns development-tunnel dev.example.com
```

### Tunnel with Custom Configuration

Create a custom tunnel configuration file:

```yaml
# ~/.cloudflared/config.yml
tunnel: my-tunnel
credentials-file: /etc/cloudflared/creds/credentials.json

ingress:
  - hostname: example.com
    service: http://localhost:8080
  - hostname: api.example.com
    service: http://localhost:3000
  - service: http_status:404

metrics: 0.0.0.0:2000
loglevel: info
```

## Security Best Practices

### 1. Secure Credential Storage

:::warning
Never commit tunnel credentials to version control. Use Kubernetes secrets or external secret management.
:::

### 2. Network Policies

Create network policies to restrict tunnel access:

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

### 3. RBAC Configuration

Configure proper RBAC for the tunnel service account:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloudflared-tunnel-role
rules:
- apiGroups: [""]
  resources: ["services", "endpoints"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cloudflared-tunnel-binding
subjects:
- kind: ServiceAccount
  name: my-cloudflared
  namespace: default
roleRef:
  kind: ClusterRole
  name: cloudflared-tunnel-role
  apiGroup: rbac.authorization.k8s.io
```

## Monitoring and Health Checks

### Health Check Endpoint

The tunnel provides a health check endpoint at port 2000:

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

## Troubleshooting Tunnel Setup

### Common Issues

1. **Authentication Failed**
   ```bash
   # Re-authenticate
   cloudflared tunnel login
   ```

2. **Tunnel Not Connecting**
   ```bash
   # Check tunnel status
   cloudflared tunnel info my-tunnel

   # Check DNS configuration
   cloudflared tunnel route ip show
   ```

3. **Certificate Issues**
   ```bash
   # Regenerate certificate
   cloudflared tunnel login
   ```

### Debug Commands

```bash
# Test tunnel locally
cloudflared tunnel --config ~/.cloudflared/config.yml run my-tunnel

# Check tunnel logs
cloudflared tunnel logs my-tunnel

# Verify DNS resolution
nslookup example.com
dig example.com
```

## Tunnel Management

### Updating Tunnel Configuration

```bash
# Update tunnel settings
cloudflared tunnel update my-tunnel

# Update DNS routes
cloudflared tunnel route dns my-tunnel new-subdomain.example.com
```

### Deleting Tunnels

```bash
# Delete DNS routes first
cloudflared tunnel route dns my-tunnel example.com --delete

# Delete the tunnel
cloudflared tunnel delete my-tunnel
```

### Backup and Recovery

```bash
# Backup tunnel configuration
cp ~/.cloudflared/*.json ./backup/
cp ~/.cloudflared/cert.pem ./backup/

# Restore tunnel configuration
cp ./backup/*.json ~/.cloudflared/
cp ./backup/cert.pem ~/.cloudflared/
```

## Next Steps

- Configure [ingress rules](./ingress-configuration.md)
- Set up [advanced configuration options](./advanced-configuration.md)
- Learn about [troubleshooting common issues](./troubleshooting.md)
- Review [configuration options](./configuration.md)
