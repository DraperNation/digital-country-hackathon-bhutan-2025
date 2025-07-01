#!/bin/bash

echo "🔍 Verifying ZK Proof for Bhutan Nationality..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required files exist
if [ ! -f "proof.json" ] || [ ! -f "public.json" ] || [ ! -f "verification_key.json" ]; then
    echo -e "${RED}❌ Missing required files. Please run generate_proof.sh first.${NC}"
    exit 1
fi

echo -e "${BLUE}🔐 Verifying proof...${NC}"

# Verify the proof
if snarkjs groth16 verify verification_key.json public.json proof.json; then
    echo -e "${GREEN}✅ PROOF VALID! ✅${NC}"
    echo -e "${GREEN}🎉 The user has successfully proven they are from Bhutan without revealing their identity!${NC}"
    echo ""
    echo -e "${BLUE}📊 What was proven:${NC}"
    echo -e "   ✓ User has Bhutanese nationality"
    echo -e "   ✓ User knows a valid secret commitment"
    echo -e "   ✓ No personal information was revealed"
    echo ""
    echo -e "${BLUE}🔒 Privacy preserved:${NC}"
    echo -e "   • Name: Hidden"
    echo -e "   • Date of birth: Hidden"
    echo -e "   • Full identity: Hidden"
    echo -e "   • Only nationality status: Proven"
else
    echo -e "${RED}❌ PROOF INVALID! ❌${NC}"
    echo -e "${RED}The proof verification failed.${NC}"
    exit 1
fi 