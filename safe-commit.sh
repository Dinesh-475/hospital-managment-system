#!/bin/bash

# Safe auto-commit script with secret protection
# Use this instead of direct git commands for automated commits

echo "🔄 Safe Auto-Commit Script"
echo ""

# Step 1: Check for .env files in changes
echo "1️⃣  Checking for .env files in changes..."
ENV_IN_CHANGES=$(git diff --name-only | grep -E "\.env$|\.env\.local|\.env\.development|\.env\.production" || true)

if [ -n "$ENV_IN_CHANGES" ]; then
    echo "⚠️  WARNING: .env file detected in changes!"
    echo "Files: $ENV_IN_CHANGES"
    echo ""
    echo "These files will NOT be committed (protected by .gitignore)"
    echo ""
fi

# Step 2: Check for staged .env files
echo "2️⃣  Checking for staged .env files..."
ENV_STAGED=$(git diff --cached --name-only | grep -E "\.env$|\.env\.local|\.env\.development|\.env\.production" || true)

if [ -n "$ENV_STAGED" ]; then
    echo "❌ ERROR: .env files are staged for commit!"
    echo "Removing from staging area..."
    
    # Remove .env files from staging
    git reset HEAD .env 2>/dev/null || true
    git reset HEAD server/.env 2>/dev/null || true
    git reset HEAD client/.env 2>/dev/null || true
    git reset HEAD .env.local 2>/dev/null || true
    git reset HEAD .env.development 2>/dev/null || true
    git reset HEAD .env.production 2>/dev/null || true
    
    echo "✅ Removed .env files from staging"
    echo ""
    
    # Ensure .env is in .gitignore
    if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
        echo "Adding .env to .gitignore..."
        echo ".env" >> .gitignore
        git add .gitignore
        echo "✅ Added .env to .gitignore"
    fi
fi

# Step 3: Show what will be committed
echo "3️⃣  Files to be committed:"
git status --short

# Step 4: Add all files (except those in .gitignore)
echo ""
echo "4️⃣  Adding files to staging..."
git add .

# Step 5: Run verification
echo ""
echo "5️⃣  Running secret verification..."
if [ -f ./verify-secrets.sh ]; then
    ./verify-secrets.sh
    if [ $? -ne 0 ]; then
        echo "❌ Verification failed! Aborting commit."
        exit 1
    fi
else
    echo "⚠️  verify-secrets.sh not found, skipping verification"
fi

# Step 6: Commit with timestamp
echo ""
echo "6️⃣  Creating commit..."
COMMIT_MSG="Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"

if [ -n "$1" ]; then
    COMMIT_MSG="$1"
fi

git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
    echo "✅ Commit successful!"
    echo ""
    echo "7️⃣  Pushing to remote..."
    git push
    
    if [ $? -eq 0 ]; then
        echo "✅ Push successful!"
    else
        echo "⚠️  Push failed. Run 'git push' manually."
    fi
else
    echo "⚠️  Nothing to commit or commit failed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Auto-commit complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
