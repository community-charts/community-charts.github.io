---
id: ingress-configuration
title: Ingress Configuration
sidebar_label: Ingress Configuration
sidebar_position: 4
description: Configure ingress rules for Cloudflare Tunnel to route traffic to your Kubernetes services
keywords: [cloudflared, ingress, routing, tunnel, kubernetes, services, helm]
---

# Ingress Configuration

This guide covers how to configure ingress rules for Cloudflare Tunnel to route traffic to your Kubernetes services.

## Ingress Overview

Cloudflare Tunnel ingress rules define how traffic is routed from the internet to your internal services. Unlike traditional Kubernetes ingress, tunnel ingress rules are processed by Cloudflared and can route traffic to any service within your cluster.

## Basic Ingress Rules

### Simple Hostname Routing

```yaml
ingress:
  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80

  - hostname: api.example.com
    service: http://api-service.default.svc.cluster.local:8080

  - service: http_status:404
```

:::tip
The last rule with `http_status:404` is required to handle unmatched requests and should always be included.
:::

### Wildcard Subdomain Routing

```yaml
ingress:
  - hostname: "*.example.com"
    service: http://wildcard-service.default.svc.cluster.local:80

  - hostname: app.example.com
    service: http://app-service.default.svc.cluster.local:3000

  - service: http_status:404
```

:::info
Wildcard subdomains require a CNAME record for `*` in your DNS configuration.
:::

## Advanced Ingress Rules

### Path-Based Routing

```yaml
ingress:
  - hostname: example.com
    path: "/api/*"
    service: http://api-service.default.svc.cluster.local:8080

  - hostname: example.com
    path: "/admin/*"
    service: http://admin-service.default.svc.cluster.local:8080

  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80

  - service: http_status:404
```

### Static File Routing

```yaml
ingress:
  - hostname: example.com
    path: "\\.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|eot)$"
    service: http://static-service.default.svc.cluster.local:80

  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80

  - service: http_status:404
```

### Multiple Services with Load Balancing

```yaml
ingress:
  - hostname: example.com
    service: http://web-service-1.default.svc.cluster.local:80
    originRequest:
      loadBalancer:
        pool: web-pool

  - hostname: example.com
    service: http://web-service-2.default.svc.cluster.local:80
    originRequest:
      loadBalancer:
        pool: web-pool

  - service: http_status:404
```

## Origin Request Configuration

### Connection Settings

```yaml
ingress:
  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80
    originRequest:
      connectTimeout: 10s
      readTimeout: 30s
      keepAliveConnections: 100
      keepAliveTimeout: 90s
      disableChunkedEncoding: true
      httpHostHeader: "internal.example.com"
```

### TLS Settings

```yaml
ingress:
  - hostname: example.com
    service: https://secure-service.default.svc.cluster.local:443
    originRequest:
      noTLSVerify: true
      caPool: /etc/ssl/certs/ca-certificates.crt
      clientTLS:
        cert: /etc/ssl/client.crt
        key: /etc/ssl/client.key
```

### HTTP Headers

```yaml
ingress:
  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80
    originRequest:
      httpHostHeader: "internal.example.com"
      noTLSVerify: true
      headers:
        - name: X-Forwarded-For
          value: "{{ .ClientIP }}"
        - name: X-Real-IP
          value: "{{ .ClientIP }}"
        - name: X-Forwarded-Proto
          value: "{{ .Protocol }}"
```

## Service Types

### HTTP Services

```yaml
ingress:
  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80
```

### HTTPS Services

```yaml
ingress:
  - hostname: example.com
    service: https://secure-service.default.svc.cluster.local:443
    originRequest:
      noTLSVerify: true
```

### TCP Services

```yaml
ingress:
  - hostname: example.com
    service: tcp://database-service.default.svc.cluster.local:5432
```

### Unix Socket Services

```yaml
ingress:
  - hostname: example.com
    service: unix:///var/run/myapp.sock
```

## Error Handling

### Custom Error Responses

```yaml
ingress:
  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80

  - hostname: api.example.com
    service: http://api-service.default.svc.cluster.local:8080

  # Custom error responses
  - service: http_status:404
  - service: http_status:500
  - service: http_status:503
```

### Fallback Services

```yaml
ingress:
  - hostname: example.com
    service: http://primary-service.default.svc.cluster.local:80

  - hostname: example.com
    service: http://fallback-service.default.svc.cluster.local:80
    originRequest:
      connectTimeout: 5s

  - service: http_status:404
```

## Load Balancing and High Availability

### Multiple Backend Services

```yaml
ingress:
  - hostname: example.com
    service: http://web-service-1.default.svc.cluster.local:80

  - hostname: example.com
    service: http://web-service-2.default.svc.cluster.local:80

  - hostname: example.com
    service: http://web-service-3.default.svc.cluster.local:80

  - service: http_status:404
```

### Health Check Configuration

```yaml
ingress:
  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80
    originRequest:
      connectTimeout: 10s
      readTimeout: 30s
      keepAliveConnections: 100
      keepAliveTimeout: 90s
```

## Security Configuration

### Access Control

```yaml
ingress:
  - hostname: admin.example.com
    service: http://admin-service.default.svc.cluster.local:8080
    originRequest:
      headers:
        - name: X-API-Key
          value: "your-api-key"
```

### IP Filtering

```yaml
ingress:
  - hostname: internal.example.com
    service: http://internal-service.default.svc.cluster.local:80
    originRequest:
      ipRules:
        - prefix: "192.168.1.0/24"
          allow: true
        - prefix: "10.0.0.0/8"
          allow: true
        - prefix: "0.0.0.0/0"
          allow: false
```

## Monitoring and Logging

### Request Logging

```yaml
ingress:
  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80
    originRequest:
      connectTimeout: 10s
      readTimeout: 30s
```

### Metrics Collection

Enable metrics for monitoring:

```yaml
tunnelConfig:
  metricsUpdateFrequency: "5s"
  logLevel: "info"
  transportLogLevel: "warn"
```

## Complete Examples

### Multi-Service Application

```yaml
ingress:
  # Web application
  - hostname: app.example.com
    service: http://web-service.default.svc.cluster.local:80

  # API service
  - hostname: api.example.com
    service: http://api-service.default.svc.cluster.local:8080
    originRequest:
      connectTimeout: 10s
      readTimeout: 30s

  # Admin panel
  - hostname: admin.example.com
    service: http://admin-service.default.svc.cluster.local:8080
    originRequest:
      headers:
        - name: X-API-Key
          value: "admin-key"

  # Static assets
  - hostname: app.example.com
    path: "\\.(css|js|png|jpg|ico)$"
    service: http://static-service.default.svc.cluster.local:80

  # Health check
  - hostname: health.example.com
    service: http://health-service.default.svc.cluster.local:8080

  # Default error response
  - service: http_status:404
```

### Microservices Architecture

```yaml
ingress:
  # Frontend
  - hostname: frontend.example.com
    service: http://frontend-service.default.svc.cluster.local:3000

  # User service
  - hostname: users.example.com
    service: http://user-service.default.svc.cluster.local:8080

  # Product service
  - hostname: products.example.com
    service: http://product-service.default.svc.cluster.local:8080

  # Order service
  - hostname: orders.example.com
    service: http://order-service.default.svc.cluster.local:8080

  # Payment service
  - hostname: payments.example.com
    service: https://payment-service.default.svc.cluster.local:443
    originRequest:
      noTLSVerify: true

  # Monitoring
  - hostname: monitoring.example.com
    service: http://monitoring-service.default.svc.cluster.local:9090

  # Error handling
  - service: http_status:404
```

### Development Environment

```yaml
ingress:
  # Development app
  - hostname: dev.example.com
    service: http://dev-service.default.svc.cluster.local:3000

  # Development API
  - hostname: dev-api.example.com
    service: http://dev-api-service.default.svc.cluster.local:8080

  # Development database (read-only)
  - hostname: dev-db.example.com
    service: tcp://dev-db-service.default.svc.cluster.local:5432

  # Development tools
  - hostname: dev-tools.example.com
    service: http://dev-tools-service.default.svc.cluster.local:8080

  # Error handling
  - service: http_status:404
```

## Best Practices

### 1. Always Include Error Handler

```yaml
ingress:
  # Your service rules here
  - service: http_status:404  # Required
```

### 2. Use Specific Hostnames

```yaml
# Good
- hostname: api.example.com
  service: http://api-service.default.svc.cluster.local:8080

# Avoid overly broad wildcards
- hostname: "*.example.com"
  service: http://catch-all-service.default.svc.cluster.local:80
```

### 3. Configure Timeouts

```yaml
ingress:
  - hostname: example.com
    service: http://web-service.default.svc.cluster.local:80
    originRequest:
      connectTimeout: 10s
      readTimeout: 30s
```

### 4. Use Health Checks

```yaml
ingress:
  - hostname: health.example.com
    service: http://health-service.default.svc.cluster.local:8080
```

### 5. Secure Sensitive Services

```yaml
ingress:
  - hostname: admin.example.com
    service: http://admin-service.default.svc.cluster.local:8080
    originRequest:
      headers:
        - name: X-API-Key
          value: "secure-key"
```

## Troubleshooting

### Common Issues

1. **Service Not Reachable**
   - Verify service name and namespace
   - Check service port
   - Ensure service is running

2. **DNS Resolution Issues**
   - Verify DNS records in Cloudflare
   - Check tunnel DNS configuration

3. **Timeout Issues**
   - Increase connection and read timeouts
   - Check service health

### Debug Commands

```bash
# Check tunnel logs
kubectl logs -f deployment/my-cloudflared

# Test service connectivity
kubectl exec -it <pod-name> -- curl http://service-name.namespace.svc.cluster.local:port

# Check tunnel status
kubectl exec -it <pod-name> -- cloudflared tunnel info my-tunnel
```

## Next Steps

- Learn about [tunnel setup](./tunnel-setup.md)
- Explore [advanced configuration options](./advanced-configuration.md)
- Learn about [troubleshooting common issues](./troubleshooting.md)
- Review [configuration options](./configuration.md)
