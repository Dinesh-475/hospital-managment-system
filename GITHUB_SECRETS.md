# 🔐 GitHub Secrets Setup Guide

## Overview

This guide explains how to configure GitHub Secrets for secure CI/CD deployment of the Docvista application.

---

## 📋 Required Secrets

You need to add the following secrets to your GitHub repository:

### Database Configuration

- `DB_HOST` - Database host (e.g., `localhost` or production DB URL)
- `DB_PORT` - Database port (e.g., `5432`)
- `DB_NAME` - Database name (e.g., `hospital_management`)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password

### JWT Configuration

- `JWT_SECRET` - JWT secret for access tokens (minimum 32 characters)
- `JWT_EXPIRE` - JWT expiration time (e.g., `24h`)
- `JWT_REFRESH_SECRET` - JWT secret for refresh tokens
- `JWT_REFRESH_EXPIRE` - Refresh token expiration (e.g., `7d`)

### Email Configuration

- `SMTP_HOST` - SMTP server host (e.g., `smtp.gmail.com`)
- `SMTP_PORT` - SMTP port (e.g., `587`)
- `SMTP_USER` - Email address for sending
- `SMTP_PASSWORD` - Email password or app password
- `EMAIL_FROM` - From email address

### Application Configuration

- `FRONTEND_URL` - Frontend URL (e.g., `https://your-app.com`)

### API Keys

- `ANTHROPIC_API_KEY` - Anthropic API key for AI features

### Optional Secrets (if using)

- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

---

## 🚀 How to Add Secrets

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository
2. Click **Settings** (top navigation)
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Each Secret

1. Click **New repository secret**
2. Enter the **Name** (e.g., `DB_PASSWORD`)
3. Enter the **Value** (your actual password)
4. Click **Add secret**
5. Repeat for all required secrets

### Step 3: Verify Secrets

After adding all secrets, you should see them listed (values are hidden for security).

---

## 📝 Example: Adding DB_PASSWORD

```
Name: DB_PASSWORD
Value: your_actual_database_password_here
```

Click **Add secret** to save.

---

## 🔄 GitHub Actions Workflow

The workflow file is located at [`.github/workflows/deploy.yml`](file:///Users/octane/Documents/PROJECTS/Docvista/.github/workflows/deploy.yml)

### Workflow Triggers

- **Push to `main` branch** - Runs tests, builds, and deploys
- **Pull requests to `main`** - Runs tests and builds (no deployment)

### Workflow Steps

1. **Checkout code** - Gets the latest code
2. **Setup Node.js** - Installs Node.js 18
3. **Install dependencies** - Runs `npm install`
4. **Run tests** - Executes test suite with secrets
5. **Build** - Compiles TypeScript with secrets
6. **Deploy** - Deploys to production (only on push to main)

### Using Secrets in Workflow

Secrets are accessed using the syntax:

```yaml
env:
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

---

## ⚠️ Security Best Practices

### ✅ DO:

- Use different secrets for production and staging
- Rotate secrets regularly
- Use strong, randomly generated secrets
- Limit access to repository secrets
- Use environment-specific secrets when possible

### ❌ DON'T:

- Never commit secrets to Git
- Don't share secrets in chat or email
- Don't use weak or predictable secrets
- Don't reuse secrets across environments
- Don't log secret values in workflows

---

## 🔑 Generating Secrets

### JWT Secrets (128 characters recommended):

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Database Password (strong password):

```bash
openssl rand -base64 32
```

---

## 🧪 Testing the Workflow

1. Add all required secrets to GitHub
2. Push a commit to a feature branch
3. Create a pull request to `main`
4. Check the **Actions** tab to see the workflow run
5. Verify tests and build pass
6. Merge to `main` to trigger deployment

---

## 🐛 Troubleshooting

### Workflow fails with "Missing environment variable"

- Check that all required secrets are added in GitHub Settings
- Verify secret names match exactly (case-sensitive)
- Ensure no typos in secret names

### Build fails with authentication errors

- Verify database credentials are correct
- Check SMTP credentials for email service
- Validate API keys are active and have proper permissions

### Deployment doesn't run

- Ensure you're pushing to the `main` branch
- Check workflow file syntax is valid YAML
- Verify deployment step conditions are met

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Environment Variables Best Practices](https://12factor.net/config)
