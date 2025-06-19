---
sidebar_position: 1
---

# Cloudflared Tunnel chart usage

[Cloudflared](https://github.com/cloudflare/cloudflared) is a tool from Cloudflare to create secure tunnels from your Kubernetes cluster to the Cloudflare network, exposing services without opening public ports.

- **Official Website:** [https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- **GitHub Repository:** [https://github.com/cloudflare/cloudflared](https://github.com/cloudflare/cloudflared)
- **Documentation:** [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- **ArtifactHub:** [Cloudflared Helm Chart](https://artifacthub.io/packages/helm/community-charts/cloudflared)

## Why use this chart?

- Securely expose Kubernetes services to the internet via Cloudflare
- No need to open public ports or manage ingress
- Community-maintained Helm chart

## Installation

```bash
helm repo add community-charts https://community-charts.github.io/helm-charts
helm repo update
helm install my-cloudflared community-charts/cloudflared -n <your-namespace>
```

Replace `<your-namespace>` with your target namespace. For configuration options, see [values.yaml](https://github.com/community-charts/helm-charts/blob/main/charts/cloudflared/values.yaml) and [ArtifactHub page](https://artifacthub.io/packages/helm/community-charts/cloudflared).
