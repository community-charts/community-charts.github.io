---
id: authentication
title: Actual Budget Authentication Setup
sidebar_label: Authentication
sidebar_position: 3
description: Configure authentication methods for Actual Budget including password, header-based, and OpenID Connect
keywords: [actual, actualbudget, personal finance, authentication, openid, oauth, password, header]
---

# Authentication Setup

Actual Budget supports multiple authentication methods. This guide covers all available authentication options and their configuration.

## Authentication Methods

The chart supports three authentication methods:

- **Password**: Traditional username/password authentication
- **Header**: Header-based authentication for reverse proxy setups
- **OpenID Connect**: OAuth2/OpenID Connect for enterprise SSO

## Basic Authentication Configuration

```yaml
login:
  method: password
  allowedLoginMethods:
    - password
    - header
    - openid
  skipSSLVerification: false
```

## Password Authentication

The default authentication method using username and password:

```yaml
login:
  method: password
  allowedLoginMethods:
    - password
```

:::info
When using password authentication, you'll create your account on first login through the web interface.
:::

## Header-Based Authentication

Use header-based authentication when running behind a reverse proxy that handles authentication:

```yaml
login:
  method: header
  allowedLoginMethods:
    - header
```

:::tip
Header authentication is useful when you have an existing authentication system (like LDAP, OAuth proxy, etc.) that sets user headers.
:::

## OpenID Connect Authentication

Configure OpenID Connect for enterprise SSO integration. Actual Budget supports both discovery-based and manual endpoint configuration.

### Discovery-Based Configuration

```yaml
login:
  method: openid
  allowedLoginMethods:
    - openid
  openid:
    enforce: true
    providerName: "Your SSO Provider"
    discoveryUrl: "https://your-provider.com/.well-known/openid_configuration"
    clientId: "your-client-id"
    clientSecret: "your-client-secret"
```

### Manual Endpoint Configuration

```yaml
login:
  method: openid
  allowedLoginMethods:
    - openid
  openid:
    enforce: true
    providerName: "Custom OIDC Provider"
    authorizationEndpoint: "https://your-provider.com/oauth/authorize"
    tokenEndpoint: "https://your-provider.com/oauth/token"
    userInfoEndpoint: "https://your-provider.com/oauth/userinfo"
    clientId: "your-client-id"
    clientSecret: "your-client-secret"
```

### OpenID Connect with Ingress

When using OpenID Connect with ingress, the chart automatically configures the server hostname:

```yaml
ingress:
  enabled: true
  hosts:
    - host: actualbudget.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
    - secretName: actualbudget-tls
      hosts:
        - actualbudget.yourdomain.com

login:
  method: openid
  allowedLoginMethods:
    - openid
  openid:
    enforce: true
    providerName: "Your SSO Provider"
    discoveryUrl: "https://your-provider.com/.well-known/openid_configuration"
    clientId: "your-client-id"
    clientSecret: "your-client-secret"
```

:::warning
The `clientSecret` will be stored in a Kubernetes Secret. Ensure your cluster has proper RBAC and encryption at rest configured.
:::

## Multiple Authentication Methods

You can enable multiple authentication methods simultaneously:

```yaml
login:
  method: password  # Default method
  allowedLoginMethods:
    - password
    - openid
  openid:
    enforce: false  # Don't enforce OIDC, allow fallback to password
    providerName: "Optional SSO"
    discoveryUrl: "https://your-provider.com/.well-known/openid_configuration"
    clientId: "your-client-id"
    clientSecret: "your-client-secret"
```

## SSL Verification

For development or self-signed certificates, you can disable SSL verification:

```yaml
login:
  method: openid
  skipSSLVerification: true
  openid:
    # ... OIDC configuration
```

:::danger
Only disable SSL verification in development environments. Production deployments should use proper SSL certificates.
:::

## Environment Variables

The chart automatically sets the following environment variables based on your configuration:

| Variable | Description | Source |
|----------|-------------|---------|
| `ACTUAL_LOGIN_METHOD` | Primary authentication method | `login.method` |
| `ACTUAL_ALLOWED_LOGIN_METHODS` | Comma-separated list of allowed methods | `login.allowedLoginMethods` |
| `NODE_TLS_REJECT_UNAUTHORIZED` | SSL verification setting | `login.skipSSLVerification` |
| `ACTUAL_MULTIUSER` | Multi-user mode flag | Auto-set for OIDC |
| `ACTUAL_OPENID_*` | OpenID Connect configuration | `login.openid.*` |

## Common OpenID Connect Providers

### Google Workspace

```yaml
login:
  method: openid
  allowedLoginMethods:
    - openid
  openid:
    enforce: true
    providerName: "Google Workspace"
    discoveryUrl: "https://accounts.google.com/.well-known/openid_configuration"
    clientId: "your-google-client-id"
    clientSecret: "your-google-client-secret"
```

### Azure AD

```yaml
login:
  method: openid
  allowedLoginMethods:
    - openid
  openid:
    enforce: true
    providerName: "Azure AD"
    discoveryUrl: "https://login.microsoftonline.com/your-tenant-id/v2.0/.well-known/openid_configuration"
    clientId: "your-azure-client-id"
    clientSecret: "your-azure-client-secret"
```

### Okta

```yaml
login:
  method: openid
  allowedLoginMethods:
    - openid
  openid:
    enforce: true
    providerName: "Okta"
    discoveryUrl: "https://your-domain.okta.com/.well-known/openid_configuration"
    clientId: "your-okta-client-id"
    clientSecret: "your-okta-client-secret"
```

## Troubleshooting Authentication

### Common Issues

1. **OIDC Discovery Fails**: Verify the discovery URL is accessible and returns valid JSON
2. **Client ID/Secret Errors**: Ensure credentials are correct and the application is properly configured
3. **Redirect URI Issues**: Configure the correct redirect URI in your OIDC provider (usually `https://your-domain.com/oauth/callback`)
4. **SSL Certificate Issues**: Use `skipSSLVerification: true` for development, proper certificates for production

## Next Steps

- Configure [storage and persistence](./storage.md)
- Set up [advanced configuration options](./advanced-configuration.md)
- Learn about [troubleshooting common issues](./troubleshooting.md)
