'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { RAYSTYLUS_ABI, RAYSTYLUS_ADDRESS } from '../abi/RayStylus';

export interface MintConfig {
  sphereColor: string; // hex color
  bgColor1: string;    // hex color
  bgColor2: string;    // hex color
  cameraX: number;
  cameraY: number;
  cameraZ: number;
}

export const useRayStylusMint = () => {
  const { address, isConnected } = useAccount();
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);

  const { writeContractAsync, isPending } = useWriteContract();

  const parseHexColor = (hex: string): [number, number, number] => {
    const cleaned = hex.replace('#', '').padStart(6, '0');
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return [r, g, b];
  };

  const mint = async (config: MintConfig): Promise<string | null> => {
    try {
      setCustomError(null);

      if (!isConnected || !address) {
        setCustomError('Please connect your wallet first');
        throw new Error('Wallet not connected');
      }

      const [sphereR, sphereG, sphereB] = parseHexColor(config.sphereColor);
      const [bgR1, bgG1, bgB1] = parseHexColor(config.bgColor1);
      const [bgR2, bgG2, bgB2] = parseHexColor(config.bgColor2);

      // Convert camera values to contract scale (scale 1024)
      const camX = Math.round(config.cameraX * 1024);
      const camY = Math.round(config.cameraY * 1024);
      const camZ = Math.round(config.cameraZ * 1024);

      // For now, we'll just call renderScene (which is a view function)
      // Future: add a state-changing mint function to the contract
      // This is a placeholder that will call renderScene to prove ownership
      
      console.log('Preparing to render scene for minting:', {
        sphereR, sphereG, sphereB,
        bgR1, bgG1, bgB1,
        bgR2, bgG2, bgB2,
        camX, camY, camZ,
      });

      // Call mint function on contract (this is now state-changing!)
      const tx = await writeContractAsync({
        address: RAYSTYLUS_ADDRESS as `0x${string}`,
        abi: RAYSTYLUS_ABI,
        functionName: 'mint',
        args: [sphereR, sphereG, sphereB, bgR1, bgG1, bgB1, bgR2, bgG2, bgB2, camX, camY, camZ],
      });

      console.log('Mint transaction hash:', tx);
      
      setTxHash(tx);
      
      // Generate a mock token ID based on timestamp
      const mockTokenId = Date.now().toString();
      setTokenId(mockTokenId);

      return tx;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint NFT';
      setCustomError(errorMessage);
      console.error('Mint error:', err);
      return null;
    }
  };

  return {
    mint,
    isMinting: isPending,
    tokenId,
    txHash,
    isConnected,
    address,
    error: customError,
  };
};
