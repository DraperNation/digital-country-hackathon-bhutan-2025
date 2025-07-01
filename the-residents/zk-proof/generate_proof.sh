#!/bin/bash

echo "🚀 Generating ZK Proof for Bhutan Nationality Check..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if circom is installed
if ! command -v circom &> /dev/null; then
    echo -e "${YELLOW}⚠️  Circom not found. Installing...${NC}"
    npm install -g circom
fi

# Check if snarkjs is installed
if ! command -v snarkjs &> /dev/null; then
    echo -e "${YELLOW}⚠️  SnarkJS not found. Installing...${NC}"
    npm install -g snarkjs
fi

echo -e "${BLUE}📝 Step 1: Compiling circuit...${NC}"
circom nationality_simple.circom --r1cs --wasm --sym

echo -e "${BLUE}🔧 Step 2: Computing witness...${NC}"
node nationality_simple_js/generate_witness.js nationality_simple_js/nationality_simple.wasm input_simple.json witness.wtns

echo -e "${BLUE}🔑 Step 3: Setting up trusted setup (Powers of Tau)...${NC}"
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

echo -e "${BLUE}🎯 Step 4: Generating zkey...${NC}"
snarkjs groth16 setup nationality_simple.r1cs pot12_final.ptau nationality_simple_0000.zkey
snarkjs zkey contribute nationality_simple_0000.zkey nationality_simple_0001.zkey --name="1st Contributor" -v
snarkjs zkey export verificationkey nationality_simple_0001.zkey verification_key.json

echo -e "${BLUE}✨ Step 5: Generating proof...${NC}"
snarkjs groth16 prove nationality_simple_0001.zkey witness.wtns proof.json public.json

echo -e "${GREEN}✅ Proof generated successfully!${NC}"
echo -e "${GREEN}📄 Files created:${NC}"
echo -e "   • proof.json - The ZK proof"
echo -e "   • public.json - Public inputs"
echo -e "   • verification_key.json - Verification key"

echo -e "${BLUE}🔍 Proof contents:${NC}"
cat proof.json

echo -e "\n${BLUE}🔍 Public inputs:${NC}"
cat public.json 