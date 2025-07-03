---
slug: outline-chart-version-0.4.0-released
title: Outline chart 0.4.0 brings powerful enhancements
date: 2025-07-03T18:58
authors: burakince
tags: [outline, helm, kubernetes, open-source]
description: Discover what's new in Outline chart 0.4.0—including expanded external secret support and improved integrations—to simplify your Kubernetes deployments.
---

# Outline Chart 0.4.0 Brings Powerful Enhancements

We’re excited to announce the release of the **Outline Helm chart version 0.4.0**, now available as of July 3, 2025. This release includes major improvements and expanded functionality that make deploying Outline on Kubernetes even more seamless and secure.

<!-- truncate -->

## What’s New in Outline 0.4.0

Chart version 0.4.0 introduces a range of new features and fixes that reflect active community contributions and ongoing enhancements in the open-source ecosystem:

- ✅ **External Secrets Support Extended**: Securely connect to external services like Redis, PostgreSQL, S3, SMTP, Slack, Dropbox, Google, Azure, OIDC, GitHub, Discord, Gitea, GitLab, Auth0, Keycloak, SAML, Iframely, and OpenAI.
  - 📌 [GitHub Issue #156](https://github.com/community-charts/helm-charts/issues/156)
- 🔧 **Bug Fix**: Resolved an issue with the missing Dropbox app key secret.
- 🌐 **DNS and Host Configuration**: Add support for dnsPolicy, dnsConfig, and hostAliases for advanced networking needs.
  - 📌 [GitHub Issue #157](https://github.com/community-charts/helm-charts/issues/157)
- ⚙️ **Service Toggle**: Introduced an enabled flag for service control.
- 🔌 **New Integrations**: Added official support for Linear and Notion integrations.
  - 📌 [GitHub Issue #161](https://github.com/community-charts/helm-charts/issues/161)

You can review the full release details in the official [release notes on GitHub](https://github.com/community-charts/helm-charts/releases/tag/outline-0.4.0).

## Get Started with Outline 0.4.0

Looking to set up Outline on your Kubernetes cluster? Start here:

🛠️ Visit our [Outline documentation](https://community-charts.github.io/docs/category/outline) to find:

- Quick-start installation steps  
- Configuration customization tips  
- Best practices for production environments  

Whether you're running on a local cluster or in a cloud environment (AWS, Azure, etc.), we've got guides to help you succeed.

## Why Use the Outline Helm Chart?

Managed by the [GitHub Community Charts](https://github.com/community-charts/helm-charts) team, the Outline Helm chart ensures fast, reliable, and easy deployments on Kubernetes.

✨ **Key advantages**:

- Simple and intuitive configuration  
- Backed by a growing open-source community  
- Flexible, production-ready setups  
- Trusted and tested within real-world environments  

## Join the Open Source Community

Our project thrives on community support! Whether you’re a developer, DevOps engineer, or documentation enthusiast, here’s how you can contribute:

🔍 Learn: Browse the [Outline Helm chart documentation](https://community-charts.github.io/docs/category/outline)  
👩‍💻 Contribute: Open a pull request on our [GitHub repository](https://github.com/community-charts/helm-charts)  
🐞 Report: Spot a bug? [Log it here](https://github.com/community-charts/helm-charts/issues)  
💡 Request: Submit your feature ideas via the [issue tracker](https://github.com/community-charts/helm-charts/issues/new)

Thank you for being part of the journey to make Kubernetes deployments more accessible. Let’s innovate and grow together—powered by open source!