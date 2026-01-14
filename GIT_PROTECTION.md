# 🔐 Git Secret Protection Guide

## Overview

This guide explains all the protection mechanisms in place to prevent accidentally committing secrets to Git.

---

## 🛡️ Protection Layers

### Layer 1: `.gitignore`

**Location:** [`.gitignore`](file:///Users/octane/Documents/PROJECTS/Docvista/.gitignore)

Prevents Git from tracking sensitive files:

- `.env` and all variants (`.env.local`, `.env.development`, etc.)
- `config.json`, `secrets.json`, `credentials.json`
- `*.pem`, `*.key`, `*.cert` (certificates)
- Database files, logs, and more

### Layer 2: Pre-Commit Hook

**Location:** `.git/hooks/pre-commit`

Automatically runs before every commit:

- ✅ Blocks commits containing `.env` files
- ✅ Scans for hardcoded secrets in staged files
- ✅ Provides interactive confirmation for suspicious patterns
- ✅ Can be bypassed with `--no-verify` (use with extreme caution)

### Layer 3: Verification Script

**Location:** [`verify-secrets.sh`](file:///Users/octane/Documents/PROJECTS/Docvista/verify-secrets.sh)

Manual verification tool:

```bash
./verify-secrets.sh
```

Checks:

1. `.gitignore` exists
2. `.env` is in `.gitignore`
3. No `.env` files tracked by git
4. No `.env` files in git history
5. `.env.example` exists
6. Scans staged files for secrets
7. Verifies `server/.env` protection

### Layer 4: Safe Auto-Commit Script

**Location:** [`safe-commit.sh`](file:///Users/octane/Documents/PROJECTS/Docvista/safe-commit.sh)

Replacement for manual git commands:

```bash
./safe-commit.sh "Your commit message"
```

Features:

- Automatically removes `.env` files from staging
- Runs verification before commit
- Shows what will be committed
- Commits and pushes safely

---

## 📋 Usage Guide

### Daily Development Workflow

```bash
# 1. Make your changes
# 2. Use safe-commit instead of git add/commit/push
./safe-commit.sh "Add new feature"

# Or manually:
git add .
git commit -m "Your message"  # Pre-commit hook runs automatically
git push
```

### Before Important Commits

```bash
# Run verification manually
./verify-secrets.sh

# Check what will be committed
git status
git diff --cached

# Commit if everything looks good
git commit -m "Your message"
```

### If .env Accidentally Staged

The pre-commit hook will automatically block it, but you can also:

```bash
# Remove from staging
git reset HEAD .env

# Verify it's in .gitignore
grep "^\.env$" .gitignore

# If not, add it
echo ".env" >> .gitignore
```

---

## 🚨 Emergency: Secret Was Committed

If you accidentally committed a secret:

### 1. **Immediately Revoke the Secret**

- Change database passwords
- Regenerate API keys
- Rotate JWT secrets
- Update all affected services

### 2. **Remove from Git History** (if not pushed)

```bash
# Undo last commit (keeps changes)
git reset HEAD~1

# Remove .env from staging
git reset HEAD .env

# Commit again without .env
git commit -m "Your message"
```

### 3. **If Already Pushed**

```bash
# WARNING: This rewrites history - coordinate with team
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (dangerous!)
git push origin --force --all
```

**Better approach:** Use `git-filter-repo` (safer):

```bash
brew install git-filter-repo
git filter-repo --path .env --invert-paths
git push origin --force --all
```

### 4. **Notify Your Team**

- Inform all team members
- Update all environments with new secrets
- Review access logs for potential breaches

---

## ✅ Verification Checklist

Run this checklist before pushing to production:

- [ ] `.env` files are in `.gitignore`
- [ ] No `.env` files in `git status`
- [ ] `./verify-secrets.sh` passes all checks
- [ ] No hardcoded secrets in code
- [ ] All secrets use `process.env.*`
- [ ] `.env.example` is up to date
- [ ] GitHub Secrets configured for CI/CD
- [ ] Pre-commit hook is installed and working

---

## 🔧 Troubleshooting

### Pre-commit hook not running

```bash
# Check if hook exists and is executable
ls -la .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### False positives in secret detection

The pre-commit hook may flag legitimate code. Options:

1. Review and confirm it's not a real secret
2. Commit with `git commit --no-verify` (use sparingly)
3. Adjust the regex patterns in `.git/hooks/pre-commit`

### verify-secrets.sh fails

```bash
# Make sure it's executable
chmod +x verify-secrets.sh

# Run with bash explicitly
bash verify-secrets.sh
```

---

## 📚 Additional Resources

- [SECURITY.md](file:///Users/octane/Documents/PROJECTS/Docvista/SECURITY.md) - Security best practices
- [GITHUB_SECRETS.md](file:///Users/octane/Documents/PROJECTS/Docvista/GITHUB_SECRETS.md) - GitHub Actions setup
- [.env.example](file:///Users/octane/Documents/PROJECTS/Docvista/.env.example) - Environment variable template
