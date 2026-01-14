# 🔐 Environment Security Best Practices

## ❌ NEVER Hardcode Credentials

### Wrong - DON'T DO THIS:

```javascript
// ❌ NEVER hardcode API keys
const apiKey = "sk-ant-api-key-12345"; // NEVER DO THIS!
const dbPassword = "MyPassword123"; // NEVER DO THIS!
const jwtSecret = "mysecret"; // NEVER DO THIS!

// ❌ NEVER commit credentials in config files
const config = {
  database: {
    host: "localhost",
    password: "MyPassword123", // NEVER DO THIS!
  },
};
```

---

## ✅ CORRECT - Use Environment Variables

### Right - DO THIS:

```typescript
// ✅ Always use environment variables
const apiKey = process.env.ANTHROPIC_API_KEY;
const dbPassword = process.env.DB_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;

// ✅ Always validate environment variables
if (!apiKey) {
  throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
}

if (!dbPassword) {
  throw new Error("DB_PASSWORD is not set in environment variables");
}

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}
```

---

## 🛡️ Environment Validation

We've implemented automatic environment validation in `/server/src/config/validateEnv.ts`:

```typescript
const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "JWT_SECRET",
  "JWT_EXPIRE",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "FRONTEND_URL",
];
```

This validation runs **before** the server starts, preventing runtime errors from missing configuration.

---

## 📋 Security Checklist

- [x] Created `.gitignore` to exclude `.env` files
- [x] Created `.env.example` template (safe to commit)
- [x] Generated secure JWT secrets (128 characters)
- [x] Created environment validation utility
- [x] Integrated validation into server startup
- [ ] Never commit `.env` file to Git
- [ ] Use different secrets for production
- [ ] Rotate secrets regularly
- [ ] Use environment-specific `.env` files (`.env.development`, `.env.production`)

---

## 🔑 Generating Secure Secrets

### JWT Secrets (recommended 128 characters):

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### API Keys:

- Use provider-specific generation (Anthropic, Stripe, etc.)
- Never share or commit API keys
- Rotate keys if compromised

---

## 🚨 What to Do If Secrets Are Exposed

1. **Immediately revoke** the exposed credentials
2. **Generate new secrets** using secure methods
3. **Update** all environments with new credentials
4. **Review** Git history and remove exposed secrets
5. **Notify** team members and stakeholders

---

## 📚 Additional Resources

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12 Factor App - Config](https://12factor.net/config)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
