#!/bin/bash

echo "🚀 Setting up Docvista Hospital Management System..."
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to server directory
cd server || exit 1

# Check if .env exists
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file already exists. Skipping...${NC}"
else
    echo "📝 Creating .env file from template..."
    
    if [ ! -f .env.example ]; then
        echo "❌ .env.example not found in server directory!"
        exit 1
    fi
    
    cp .env.example .env
    
    # Generate JWT secrets
    echo "🔑 Generating secure JWT secrets..."
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
    JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
    
    # Update .env file (Mac-compatible sed)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your_jwt_secret_minimum_32_characters_here/$JWT_SECRET/" .env
        sed -i '' "s/your_refresh_token_secret_here/$JWT_REFRESH_SECRET/" .env
    else
        # Linux
        sed -i "s/your_jwt_secret_minimum_32_characters_here/$JWT_SECRET/" .env
        sed -i "s/your_refresh_token_secret_here/$JWT_REFRESH_SECRET/" .env
    fi
    
    echo -e "${GREEN}✅ .env file created with auto-generated JWT secrets${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Edit server/.env and fill in:${NC}"
    echo "   - Database credentials (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)"
    echo "   - Email credentials (SMTP_USER, SMTP_PASSWORD)"
    echo "   - API keys (ANTHROPIC_API_KEY, etc.)"
    echo ""
fi

# Install dependencies
echo "📦 Installing server dependencies..."
npm install

echo ""
echo "📦 Installing client dependencies..."
cd ../client || exit 1
npm install

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo "1. Edit server/.env file with your credentials"
echo "2. Create PostgreSQL database:"
echo "   createdb hospital_management"
echo "3. Start the server:"
echo "   cd server && npm run dev"
echo "4. Start the client (in another terminal):"
echo "   cd client && npm run dev"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Setup instructions"
echo "   - SECURITY.md - Security best practices"
echo "   - GITHUB_SECRETS.md - GitHub Actions setup"
echo ""
