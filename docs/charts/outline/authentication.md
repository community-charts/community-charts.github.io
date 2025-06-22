---
id: authentication
title: Authentication Setup
sidebar_label: Authentication
sidebar_position: 3
description: Configure authentication methods for Outline including Google, Azure, OIDC, Slack, GitHub, and more
keywords: [outline, authentication, oauth, oidc, google, azure, slack, github, gitlab, gitea, keycloak, discord, auth0, saml]
---

# Authentication Setup

Outline supports multiple authentication methods. This guide covers all available authentication options and their configuration.

## Authentication Methods

Outline supports the following authentication providers:

- **Google**: Google OAuth2 authentication
- **Azure**: Microsoft Entra ID (Azure AD) authentication
- **OIDC**: Generic OpenID Connect authentication
- **Slack**: Slack OAuth authentication
- **GitHub**: GitHub OAuth authentication
- **GitLab**: GitLab OAuth authentication
- **Gitea**: Gitea OAuth authentication
- **Keycloak**: Keycloak OIDC authentication
- **Discord**: Discord OAuth authentication
- **Auth0**: Auth0 OIDC authentication
- **SAML**: SAML 2.0 authentication

## Google Authentication

Configure Google OAuth2 authentication:

```yaml
auth:
  google:
    enabled: true
    clientId: "your-google-client-id"
    clientSecret: "your-google-client-secret"
```

:::info
Create a Google OAuth2 application in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and configure the redirect URI as `https://your-domain.com/auth/google.callback`.
:::

## Azure Authentication

Configure Microsoft Entra ID (Azure AD) authentication:

```yaml
auth:
  azure:
    enabled: true
    clientId: "your-azure-client-id"
    clientSecret: "your-azure-client-secret"
    resourceAppId: "optional-resource-app-id"  # Optional
    tenantId: "optional-tenant-id"  # Optional
```

:::tip
For Azure AD, configure the redirect URI as `https://your-domain.com/auth/azure.callback` in your Azure application.
:::

## OpenID Connect (OIDC)

Configure generic OpenID Connect authentication:

```yaml
auth:
  oidc:
    enabled: true
    clientId: "your-client-id"
    clientSecret: "your-client-secret"
    authUri: "https://your-auth-server/auth"
    tokenUri: "https://your-auth-server/token"
    userInfoUri: "https://your-auth-server/userinfo"
    usernameClaim: "preferred_username"
    displayName: "OpenID Connect"
    scopes:
      - openid
      - profile
      - email
```

## Slack Authentication

Configure Slack OAuth authentication:

```yaml
auth:
  slack:
    enabled: true
    clientId: "your-slack-client-id"
    clientSecret: "your-slack-client-secret"
```

:::info
Create a Slack app in the [Slack API Console](https://api.slack.com/apps) and configure the redirect URI as `https://your-domain.com/auth/slack.callback`.
:::

## GitHub Authentication

Configure GitHub OAuth authentication:

```yaml
auth:
  github:
    enabled: true
    clientId: "your-github-client-id"
    clientSecret: "your-github-client-secret"
    appName: "your-app-name"  # Optional
    appId: "your-app-id"  # Optional
    appPrivateKey: "your-private-key"  # Optional
```

:::tip
For GitHub Apps, you can also configure GitHub App authentication with additional parameters.
:::

## GitLab Authentication

Configure GitLab OAuth authentication:

```yaml
auth:
  gitlab:
    enabled: true
    clientId: "your-gitlab-client-id"
    clientSecret: "your-gitlab-client-secret"
    baseUrl: "https://gitlab.com"  # Optional, for self-hosted instances
```

## Gitea Authentication

Configure Gitea OAuth authentication:

```yaml
auth:
  gitea:
    enabled: true
    clientId: "your-gitea-client-id"
    clientSecret: "your-gitea-client-secret"
    baseUrl: "https://gitea.com"  # Optional, for self-hosted instances
```

## Keycloak Authentication

Configure Keycloak OIDC authentication:

```yaml
auth:
  keycloak:
    enabled: true
    clientId: "your-keycloak-client-id"
    clientSecret: "your-keycloak-client-secret"
    baseUrl: "https://your-keycloak-server"
    realmName: "your-realm"
```

## Discord Authentication

Configure Discord OAuth authentication:

```yaml
auth:
  discord:
    enabled: true
    clientId: "your-discord-client-id"
    clientSecret: "your-discord-client-secret"
    serverId: "your-server-id"
    serverRoles: []
```

:::info
Discord authentication requires a server ID and can optionally restrict access to specific server roles.
:::

## Auth0 Authentication

Configure Auth0 OIDC authentication:

```yaml
auth:
  auth0:
    enabled: true
    clientId: "your-auth0-client-id"
    clientSecret: "your-auth0-client-secret"
    baseUrl: "https://your-auth0-domain"
```

## SAML Authentication

Configure SAML 2.0 authentication:

```yaml
auth:
  saml:
    enabled: true
    ssoEndpoint: "https://your-saml-provider/sso"
    cert: "your-saml-certificate"
```

:::warning
SAML configuration requires the SSO endpoint URL and the certificate from your SAML identity provider.
:::

## Multiple Authentication Methods

You can enable multiple authentication methods simultaneously. Users will see all enabled options on the login page:

```yaml
auth:
  google:
    enabled: true
    clientId: "your-google-client-id"
    clientSecret: "your-google-client-secret"

  github:
    enabled: true
    clientId: "your-github-client-id"
    clientSecret: "your-github-client-secret"

  slack:
    enabled: true
    clientId: "your-slack-client-id"
    clientSecret: "your-slack-client-secret"
```

## Environment Variables

The chart automatically sets the following environment variables based on your authentication configuration:

| Variable | Description | Source |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `auth.google.clientId` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `auth.google.clientSecret` |
| `AZURE_CLIENT_ID` | Azure AD client ID | `auth.azure.clientId` |
| `AZURE_CLIENT_SECRET` | Azure AD client secret | `auth.azure.clientSecret` |
| `OIDC_CLIENT_ID` | OIDC client ID | `auth.oidc.clientId` |
| `OIDC_CLIENT_SECRET` | OIDC client secret | `auth.oidc.clientSecret` |
| `SLACK_CLIENT_ID` | Slack OAuth client ID | `auth.slack.clientId` |
| `SLACK_CLIENT_SECRET` | Slack OAuth client secret | `auth.slack.clientSecret` |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | `auth.github.clientId` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | `auth.github.clientSecret` |

## Common OAuth Provider Setup

### Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `https://your-domain.com/auth/google.callback`
4. Copy the Client ID and Client Secret to your values.yaml

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set the Authorization callback URL to:
   - `https://your-domain.com/auth/github.callback`
4. Copy the Client ID and Client Secret to your values.yaml

### Slack OAuth Setup

1. Go to [Slack API Console](https://api.slack.com/apps)
2. Create a new app
3. Add OAuth & Permissions
4. Set the Redirect URLs to:
   - `https://your-domain.com/auth/slack.callback`
5. Copy the Client ID and Client Secret to your values.yaml

## Troubleshooting Authentication

### Common Issues

1. **Invalid Redirect URI**: Ensure the redirect URI in your OAuth provider matches exactly
2. **Client ID/Secret Errors**: Verify credentials are correct and the application is properly configured
3. **CORS Issues**: Ensure your domain is properly configured in the OAuth provider
4. **SSL Certificate Issues**: Use proper SSL certificates for production

### Debug Mode

Enable debug logging for authentication issues:

```yaml
logging:
  level: debug
  extraDebug:
    - http
    - router
```

### Testing Authentication

1. **Check Environment Variables**:
   ```bash
   kubectl exec -it <pod-name> -- env | grep -E "(GOOGLE|AZURE|OIDC|SLACK|GITHUB)"
   ```

2. **Check Application Logs**:
   ```bash
   kubectl logs <pod-name> | grep -i auth
   ```

3. **Verify Secrets**:
   ```bash
   kubectl get secret <release-name>-auth-secret -o yaml
   ```

## Security Considerations

:::warning
- Store OAuth credentials securely using Kubernetes Secrets
- Use HTTPS in production
- Regularly rotate client secrets
- Implement proper RBAC for access control
:::

## Next Steps

- Configure [storage options](./storage.md)
- Set up [database configuration](./database.md)
- Explore [advanced configuration options](./advanced-configuration.md)
- Learn about [troubleshooting common issues](./troubleshooting.md)
