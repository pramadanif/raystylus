#!/bin/bash

# Test contract on Arbitrum Sepolia
CONTRACT="0xe29f03e8a356c77c9a9f17639e6f4b0626321772"
RPC="https://sepolia-rollup.arbitrum.io/rpc"

echo "Testing contract at: $CONTRACT"
echo "Network: Arbitrum Sepolia"
echo ""

# Check if contract exists (getCode)
echo "1. Checking if contract is deployed..."
curl -s -X POST $RPC \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getCode",
    "params":["'$CONTRACT'","latest"],
    "id":1
  }' | jq '.'

echo ""
echo "2. If result is NOT '0x', contract exists ✓"
echo ""
echo "3. Check Arbiscan:"
echo "   https://sepolia.arbiscan.io/address/$CONTRACT"
