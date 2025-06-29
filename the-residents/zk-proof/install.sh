#!/bin/bash

echo "🚀 Installing Bhutan e-Residency ZK Proof System..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo -e "${BLUE}✅ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install npm first.${NC}"
    exit 1
fi

echo -e "${BLUE}✅ npm found: $(npm --version)${NC}"

# Install global dependencies
echo -e "${YELLOW}📦 Installing Circom...${NC}"
if npm install -g circom; then
    echo -e "${GREEN}✅ Circom installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install Circom${NC}"
    echo "Try: sudo npm install -g circom"
fi

echo -e "${YELLOW}📦 Installing SnarkJS...${NC}"
if npm install -g snarkjs; then
    echo -e "${GREEN}✅ SnarkJS installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install SnarkJS${NC}"
    echo "Try: sudo npm install -g snarkjs"
fi

# Make scripts executable
echo -e "${BLUE}🔧 Making scripts executable...${NC}"
chmod +x generate_proof.sh verify_proof.sh

echo -e "${GREEN}🎉 Installation complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run: ./generate_proof.sh"
echo "2. Run: ./verify_proof.sh"
echo "3. Or run: npm run demo"
echo ""
echo -e "${BLUE}For web demo:${NC}"
echo "Visit the /vc page in your e-Residency app and click the 'ZK Proof' tab" 