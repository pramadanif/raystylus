'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { parseEther } from 'viem';
import { RAYSTYLUS_ABI, RAYSTYLUS_ADDRESS } from '../abi/RayStylus';

export interface RenderConfig {
  sphereColor: string;
  bgColor1: string;
  bgColor2: string;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
}

export const useRayStylusMint = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<'pending' | 'confirming' | 'confirmed' | 'failed' | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);

  const { writeContractAsync, isPending } = useWriteContract();

  const parseHexColor = (hex: string): [number, number, number] => {
    const cleaned = hex.replace('#', '').padStart(6, '0');
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return [r, g, b];
  };

  const mint = async (config: RenderConfig): Promise<string | null> => {
    try {
      setCustomError(null);

      if (!isConnected || !address) {
        setCustomError('Please connect your wallet first');
        throw new Error('Wallet not connected');
      }

      const [sphereR, sphereG, sphereB] = parseHexColor(config.sphereColor);
      const [bgR1, bgG1, bgB1] = parseHexColor(config.bgColor1);
      const [bgR2, bgG2, bgB2] = parseHexColor(config.bgColor2);

      const camX = Math.round(config.cameraX);
      const camY = Math.round(config.cameraY);
      const camZ = Math.round(config.cameraZ);

      console.log('🟡 Starting mint with config:', {
        sphereR, sphereG, sphereB,
        bgR1, bgG1, bgB1,
        bgR2, bgG2, bgB2,
        camX, camY, camZ,
      });

      console.log('📤 Sending transaction to contract:', RAYSTYLUS_ADDRESS);
      
      if (publicClient) {
        const chainId = await publicClient.getChainId();
        console.log('🔗 Connected to chain ID:', chainId);
      }

      // Estimate gas
      let gasEstimate = BigInt(1000000); // Start with higher default
      try {
        if (publicClient) {
          gasEstimate = await publicClient.estimateContractGas({
            address: RAYSTYLUS_ADDRESS as `0x${string}`,
            abi: RAYSTYLUS_ABI,
            functionName: 'mint',
            args: [sphereR, sphereG, sphereB, bgR1, bgG1, bgB1, bgR2, bgG2, bgB2, camX, camY, camZ],
            account: address,
          });
          // Add 50% buffer for safety
          gasEstimate = (gasEstimate * BigInt(150)) / BigInt(100);
          console.log('💾 Gas estimate with 50% buffer:', gasEstimate.toString());
        }
      } catch (gasError) {
        console.warn('Could not estimate gas, using default:', gasError);
      }

      // Get gas prices from RPC
      let maxFeePerGas: bigint | undefined;
      let maxPriorityFeePerGas: bigint | undefined;
      
      try {
        if (publicClient) {
          const feeData = await publicClient.estimateFeesPerGas();
          console.log('⛽ Fee data from RPC:', {
            maxFeePerGas: feeData.maxFeePerGas?.toString(),
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
          });
          
          if (feeData.maxFeePerGas) {
            // Add 50% buffer to maxFeePerGas
            maxFeePerGas = (feeData.maxFeePerGas * BigInt(150)) / BigInt(100);
          }
          
          if (feeData.maxPriorityFeePerGas) {
            // Add 50% buffer to maxPriorityFeePerGas
            maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas * BigInt(150)) / BigInt(100);
          }
        }
      } catch (feeError) {
        console.warn('Could not get fee data from RPC:', feeError);
      }
      
      // Define robust minimums for Arbitrum Sepolia
      // 3 Gwei = 3,000,000,000 Wei (Standard is usually 0.1, so this is 30x)
      const MIN_MAX_FEE = BigInt(3000000000); 
      // 1 Gwei = 1,000,000,000 Wei
      const MIN_PRIORITY_FEE = BigInt(1000000000);

      // Apply minimums and fallbacks
      if (!maxFeePerGas || maxFeePerGas < MIN_MAX_FEE) {
        console.log('⚠️ maxFeePerGas too low or missing, using minimum:', MIN_MAX_FEE.toString());
        maxFeePerGas = MIN_MAX_FEE;
      }
      
      if (!maxPriorityFeePerGas || maxPriorityFeePerGas < MIN_PRIORITY_FEE) {
        console.log('⚠️ maxPriorityFeePerGas too low or missing, using minimum:', MIN_PRIORITY_FEE.toString());
        maxPriorityFeePerGas = MIN_PRIORITY_FEE;
      }
      
      // Ensure priority fee is always less than max fee
      if (maxPriorityFeePerGas >= maxFeePerGas) {
        // If priority fee is too high relative to max fee, cap it at 50% of max fee
        maxPriorityFeePerGas = maxFeePerGas / BigInt(2);
      }

      console.log('⛽ Final gas settings:', {
        gas: gasEstimate.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
      });

      // Send transaction
      // Note: We are NOT setting 'gas' (gas limit) manually here. 
      // We let the wallet/provider estimate the gas limit to avoid "out of gas" or "intrinsic gas too low" errors
      // which can cause transactions to be dropped or stuck.
      const hash = await writeContractAsync({
        address: RAYSTYLUS_ADDRESS as `0x${string}`,
        abi: RAYSTYLUS_ABI,
        functionName: 'mint',
        args: [sphereR, sphereG, sphereB, bgR1, bgG1, bgB1, bgR2, bgG2, bgB2, camX, camY, camZ],
        // gas: gasEstimate, // Let wallet estimate gas limit
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
      });

      console.log('✅ Mint transaction hash:', hash);
      
      if (hash && typeof hash === 'string' && hash.startsWith('0x')) {
        setTxHash(hash);
        setTxStatus('pending');
        setTokenId(Date.now().toString());
        
        // Wait for transaction confirmation
        try {
          if (publicClient) {
            console.log('⏳ Waiting for transaction confirmation...');
            setTxStatus('confirming');
            
            const receipt = await publicClient.waitForTransactionReceipt({
              hash: hash as `0x${string}`,
              confirmations: 1,
              timeout: 60_000, // 60 second timeout
            });
            
            if (receipt?.status === 'success') {
              console.log('✅ Transaction confirmed:', receipt.transactionHash);
              setTxStatus('confirmed');
            } else {
              console.error('❌ Transaction failed or reverted');
              setTxStatus('failed');
              setCustomError('Transaction was reverted on-chain');
            }
          }
        } catch (confirmError) {
          const confirmMsg = confirmError instanceof Error ? confirmError.message : 'Timeout waiting for confirmation';
          console.warn('⚠️ Confirmation error (tx may still be pending):', confirmMsg);
          setTxStatus('pending');
          // Don't set error - tx may still be pending, just not immediately confirmed
        }
        
        return hash;
      } else {
        console.error('Unexpected response:', hash);
        setCustomError('Transaction sent but no hash received');
        setTxStatus('failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint NFT';
      console.error('❌ Mint error:', errorMessage);
      setCustomError(errorMessage);
      return null;
    }
  };

  return {
    mint,
    isMinting: isPending,
    tokenId,
    txHash,
    txStatus,
    isConnected,
    address,
    error: customError,
  };
};
