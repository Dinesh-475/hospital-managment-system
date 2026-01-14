#!/bin/bash

echo "🔐 Verifying Git Protection for Secrets..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Verify .gitignore exists
echo "1️⃣  Checking .gitignore exists..."
if [ -f .gitignore ]; then
    echo -e "${GREEN}✅ .gitignore exists${NC}"
else
    echo -e "${RED}❌ .gitignore not found!${NC}"
    exit 1
fi

# Check 2: Verify .env is in .gitignore
echo ""
echo "2️⃣  Checking .env is in .gitignore..."
if grep -q "^\.env$" .gitignore; then
    echo -e "${GREEN}✅ .env is in .gitignore${NC}"
else
    echo -e "${RED}❌ .env not found in .gitignore!${NC}"
    echo "Adding .env to .gitignore..."
    echo ".env" >> .gitignore
fi

# Check 3: Verify .env files are not tracked
echo ""
echo "3️⃣  Checking if .env files are tracked by git..."
ENV_FILES=$(git status --porcelain | grep -E "\.env$|\.env\.local|\.env\.development|\.env\.production" || true)
if [ -z "$ENV_FILES" ]; then
    echo -e "${GREEN}✅ No .env files are tracked by git${NC}"
else
    echo -e "${RED}❌ WARNING: .env files found in git status:${NC}"
    echo "$ENV_FILES"
    echo ""
    echo "To fix this, run:"
    echo "  git rm --cached .env"
    echo "  git commit -m 'Remove .env from git tracking'"
    exit 1
fi

# Check 4: Verify .env files are not in git history
echo ""
echo "4️⃣  Checking git history for .env files..."
ENV_IN_HISTORY=$(git log --all --full-history --pretty=format: --name-only | grep -E "\.env$" | sort -u || true)
if [ -z "$ENV_IN_HISTORY" ]; then
    echo -e "${GREEN}✅ No .env files found in git history${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: .env files found in git history:${NC}"
    echo "$ENV_IN_HISTORY"
    echo ""
    echo "These files were committed in the past. Consider:"
    echo "  1. Rotating all secrets that were in those files"
    echo "  2. Using git-filter-repo to remove from history (advanced)"
fi

# Check 5: Verify .env.example exists
echo ""
echo "5️⃣  Checking .env.example exists..."
if [ -f .env.example ]; then
    echo -e "${GREEN}✅ .env.example exists${NC}"
else
    echo -e "${YELLOW}⚠️  .env.example not found${NC}"
fi

# Check 6: Scan for potential secrets in staged files
echo ""
echo "6️⃣  Scanning staged files for potential secrets..."
STAGED_FILES=$(git diff --cached --name-only)
if [ -z "$STAGED_FILES" ]; then
    echo -e "${GREEN}✅ No files staged for commit${NC}"
else
    echo "Scanning staged files for potential secrets..."
    FOUND_SECRETS=false
    
    for file in $STAGED_FILES; do
        if [ -f "$file" ]; then
            # Check for common secret patterns
            if grep -qE "(password|secret|api_key|token|private_key).*=.*['\"].*['\"]" "$file" 2>/dev/null; then
                echo -e "${YELLOW}⚠️  Potential secret found in: $file${NC}"
                FOUND_SECRETS=true
            fi
        fi
    done
    
    if [ "$FOUND_SECRETS" = false ]; then
        echo -e "${GREEN}✅ No obvious secrets found in staged files${NC}"
    else
        echo -e "${YELLOW}⚠️  Review the files above before committing${NC}"
    fi
fi

# Check 7: Verify server/.env is protected
echo ""
echo "7️⃣  Checking server/.env protection..."
if [ -f server/.env ]; then
    SERVER_ENV_TRACKED=$(git ls-files server/.env 2>/dev/null || true)
    if [ -z "$SERVER_ENV_TRACKED" ]; then
        echo -e "${GREEN}✅ server/.env exists but is not tracked${NC}"
    else
        echo -e "${RED}❌ server/.env is tracked by git!${NC}"
        echo "Run: git rm --cached server/.env"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  server/.env not found (create from .env.example)${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Verification complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
