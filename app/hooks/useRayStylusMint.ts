'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
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

      // Convert camera values to int32
      const camX = Math.round(config.cameraX);
      const camY = Math.round(config.cameraY);
      const camZ = Math.round(config.cameraZ);

      console.log('Minting with config:', {
        sphereR, sphereG, sphereB,
        bgR1, bgG1, bgB1,
        bgR2, bgG2, bgB2,
        camX, camY, camZ,
      });

      // Call mint_rendered_image with all parameters as DNA
      const tx = await writeContractAsync({
        address: RAYSTYLUS_ADDRESS as `0x${string}`,
        abi: RAYSTYLUS_ABI,
        functionName: 'mint_rendered_image',
        args: [sphereR, sphereG, sphereB, bgR1, bgG1, bgB1, bgR2, bgG2, bgB2, camX, camY, camZ],
      });

      console.log('Mint transaction hash:', tx);
      
      setTxHash(tx);
      
      // Generate token ID based on transaction hash
      const tokenIdStr = Date.now().toString();
      setTokenId(tokenIdStr);

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
