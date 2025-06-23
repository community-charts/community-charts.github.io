---
id: usage
title: PyPI Server Chart Usage
sidebar_label: Usage
sidebar_position: 1
description: Learn how to deploy and use PyPI Server on Kubernetes with the community-maintained Helm chart
keywords: [pypiserver usage, helm deployment, kubernetes, python package server, installation]
---

# PyPI Server Chart Usage

[PyPI Server](https://github.com/pypiserver/pypiserver) is a minimal PyPI compatible server for hosting your own Python packages. This chart helps you deploy a private PyPI server on Kubernetes.

- **Official Website:** [https://github.com/pypiserver/pypiserver](https://github.com/pypiserver/pypiserver)
- **GitHub Repository:** [https://github.com/pypiserver/pypiserver](https://github.com/pypiserver/pypiserver)
- **Documentation:** [https://github.com/pypiserver/pypiserver?tab=readme-ov-file#pypiserver](https://github.com/pypiserver/pypiserver?tab=readme-ov-file#pypiserver)
- **ArtifactHub:** [PyPI Server Helm Chart](https://artifacthub.io/packages/helm/community-charts/pypiserver)

## Why use this chart?

- Host your own private Python package repository
- Community-maintained and up-to-date
- Simple, lightweight, and easy to use

## Installation

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
helm install my-pypiserver community-charts/pypiserver -n <your-namespace>
```

Replace `<your-namespace>` with your target namespace. For advanced configuration, see [values.yaml](https://github.com/community-charts/helm-charts/blob/main/charts/pypiserver/values.yaml) and [ArtifactHub page](https://artifacthub.io/packages/helm/community-charts/pypiserver).

## Basic Usage

### Quick Start

Deploy PyPI Server with default settings:

```bash
# Create namespace
kubectl create namespace pypi

# Install chart
helm install pypi community-charts/pypiserver -n pypi

# Check deployment
kubectl get pods -n pypi
kubectl get svc -n pypi
```

### Access the Server

```bash
# Port forward to access locally
kubectl port-forward svc/pypi 8080:8080 -n pypi

# Access in browser: http://localhost:8080
```

### Upload Packages

```bash
# Upload a package
pip install twine
twine upload --repository-url http://localhost:8080 your-package.whl

# Or use pip to install from your server
pip install --index-url http://localhost:8080/simple/ your-package
```

## Configuration Examples

### Basic Configuration

```yaml
# values-basic.yaml
replicaCount: 1

service:
  type: ClusterIP
  port: 8080

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: pypi.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
```

### Production Configuration

```yaml
# values-production.yaml
replicaCount: 3

service:
  type: LoadBalancer
  port: 8080

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: pypi.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: pypi-tls
      hosts:
        - pypi.yourdomain.com

resources:
  limits:
    cpu: 1000m
    memory: 4Gi
  requests:
    cpu: 500m
    memory: 2Gi

volumes:
  - name: packages
    persistentVolumeClaim:
      claimName: pypi-packages-pvc

volumeMounts:
  - name: packages
    mountPath: "/data/packages"
```

## Package Management

### Uploading Packages

```bash
# Using twine
twine upload --repository-url https://pypi.yourdomain.com your-package.whl

# Using pip
pip install --index-url https://pypi.yourdomain.com/simple/ your-package

# Using curl
curl -X POST -F "content=@your-package.whl" https://pypi.yourdomain.com/upload/
```

### Authentication

For protected packages, create a password file:

```bash
# Create password file
htpasswd -c .htpasswd username

# Create Kubernetes secret
kubectl create secret generic pypi-auth --from-file=.htpasswd -n pypi

# Update values.yaml
volumes:
  - name: auth
    secret:
      secretName: pypi-auth

volumeMounts:
  - name: auth
    mountPath: "/data/.htpasswd"
    subPath: ".htpasswd"

podArgs:
  - "run"
  - "-a"
  - "."
  - "-P"
  - "/data/.htpasswd"
  - "--overwrite"
```

### Package Organization

Organize packages by project or team:

```bash
# Create package directories
mkdir -p packages/{team-a,team-b,public}

# Upload to specific directories
twine upload --repository-url https://pypi.yourdomain.com/team-a/ package-a.whl
twine upload --repository-url https://pypi.yourdomain.com/team-b/ package-b.whl
```

## Integration Examples

### CI/CD Integration

```yaml
# GitHub Actions example
name: Deploy Package
on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build package
        run: |
          python setup.py sdist bdist_wheel

      - name: Upload to PyPI Server
        run: |
          pip install twine
          twine upload --repository-url ${{ secrets.PYPI_URL }} \
            --username ${{ secrets.PYPI_USERNAME }} \
            --password ${{ secrets.PYPI_PASSWORD }} \
            dist/*
```

### Docker Integration

```dockerfile
# Dockerfile example
FROM python:3.9-slim

# Install from private PyPI server
RUN pip install --index-url https://pypi.yourdomain.com/simple/ \
    --trusted-host pypi.yourdomain.com \
    your-private-package

# Continue with your application
COPY . /app
WORKDIR /app
CMD ["python", "app.py"]
```

### Kubernetes Job Example

```yaml
# job-example.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: package-upload-job
spec:
  template:
    spec:
      containers:
      - name: upload
        image: python:3.9-slim
        command:
        - /bin/sh
        - -c
        - |
          pip install twine
          twine upload --repository-url https://pypi.yourdomain.com \
            --username $PYPI_USERNAME \
            --password $PYPI_PASSWORD \
            /packages/*.whl
        env:
        - name: PYPI_USERNAME
          valueFrom:
            secretKeyRef:
              name: pypi-credentials
              key: username
        - name: PYPI_PASSWORD
          valueFrom:
            secretKeyRef:
              name: pypi-credentials
              key: password
        volumeMounts:
        - name: packages
          mountPath: /packages
      volumes:
      - name: packages
        persistentVolumeClaim:
          claimName: packages-pvc
      restartPolicy: Never
```

## Monitoring and Health Checks

### Health Endpoint

PyPI Server provides a health endpoint:

```bash
# Check health
curl http://localhost:8080/health

# Expected response: {"status": "healthy"}
```

### Metrics

Enable Prometheus metrics:

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/metrics"
```

### Logs

```bash
# View logs
kubectl logs -f deployment/pypi -n pypi

# Check specific pod logs
kubectl logs -f pod/pypi-xxxxx -n pypi
```

## Scaling and Performance

### Horizontal Scaling

```yaml
# Scale to multiple replicas
replicaCount: 3

# Use shared storage
volumes:
  - name: packages
    persistentVolumeClaim:
      claimName: pypi-packages-pvc
      # Use ReadWriteMany storage class

volumeMounts:
  - name: packages
    mountPath: "/data/packages"
```

### Resource Optimization

```yaml
# Optimize for performance
resources:
  limits:
    cpu: 2000m
    memory: 8Gi
  requests:
    cpu: 1000m
    memory: 4Gi

podArgs:
  - "run"
  - "--server"
  - "gunicorn"
  - "--workers"
  - "8"
  - "--worker-connections"
  - "2000"
```

## Security Considerations

### Network Security

```yaml
# Restrict network access
service:
  type: ClusterIP  # Internal access only

# Use ingress for external access
ingress:
  enabled: true
  annotations:
    nginx.ingress.kubernetes.io/whitelist-source-range: "10.0.0.0/8,172.16.0.0/12"
```

### Authentication

```yaml
# Require authentication for all packages
podArgs:
  - "run"
  - "-a"
  - "."
  - "-P"
  - "/data/.htpasswd"
  - "--overwrite"
```

### TLS/SSL

```yaml
# Enable HTTPS
ingress:
  enabled: true
  tls:
    - secretName: pypi-tls
      hosts:
        - pypi.yourdomain.com
```

## Next Steps

- Learn about [configuration](./configuration.md) options and customization
- Set up [storage](./storage.md) for persistent package storage
- Explore [advanced configuration](./advanced-configuration.md) for production deployments
- Check [troubleshooting](./troubleshooting.md) for common issues and solutions
