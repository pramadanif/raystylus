'use client';

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
// Pastikan ABI di file ini sudah diupdate sesuai instruksi di bawah kode ini
import { RAYSTYLUS_ABI, RAYSTYLUS_ADDRESS } from '@/app/abi/RayStylus';
import {
  scaleToFixedPoint,
  createStyleVector,
  clampValue,
  AestheticParameters,
  aestheticToStyleVector,
} from '@/app/utils/fixedPoint';
import { renderBmpImage, parseBmpHeader } from '@/app/utils/bmpRenderer';

/**
 * Configuration for the aesthetic minting flow
 */
export interface AestheticMintConfig {
  // Aesthetic parameters (0.0-1.0)
  warmth: number;
  intensity: number;
  depth: number;

  // Static ray tracing parameters
  bgColor1: {
    r: number;
    g: number;
    b: number;
  };
  bgColor2: {
    r: number;
    g: number;
    b: number;
  };
  camera: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 * State of the minting transaction
 */
export type MintingState = 'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed';

/**
 * Result of a successful minting operation
 */
export interface MintingResult {
  tokenId: string;
  txHash: string;
  imageUrl: string;
  imageInfo: {
    width: number;
    height: number;
    fileSize: number;
  };
}

/**
 * Hook for handling aesthetic-based minting with ML inference
 */
export const useAestheticMint = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // State management
  const [state, setState] = useState<MintingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MintingResult | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  /**
   * Validates and clamps aesthetic configuration values
   */
  const validateConfig = useCallback((config: AestheticMintConfig): AestheticMintConfig => {
    return {
      warmth: clampValue(config.warmth),
      intensity: clampValue(config.intensity),
      depth: clampValue(config.depth),
      bgColor1: {
        r: Math.max(0, Math.min(255, Math.round(config.bgColor1.r))),
        g: Math.max(0, Math.min(255, Math.round(config.bgColor1.g))),
        b: Math.max(0, Math.min(255, Math.round(config.bgColor1.b))),
      },
      bgColor2: {
        r: Math.max(0, Math.min(255, Math.round(config.bgColor2.r))),
        g: Math.max(0, Math.min(255, Math.round(config.bgColor2.g))),
        b: Math.max(0, Math.min(255, Math.round(config.bgColor2.b))),
      },
      camera: {
        x: Math.max(-2048, Math.min(2048, Math.round(config.camera.x))),
        y: Math.max(-2048, Math.min(2048, Math.round(config.camera.y))),
        z: Math.max(-2048, Math.min(2048, Math.round(config.camera.z))),
      },
    };
  }, []);

  /**
   * Primary minting function
   * Calls mint_by_aesthetic with preprocessed parameters
   */
  const mint = useCallback(
    async (config: AestheticMintConfig): Promise<string | null> => {
      try {
        setError(null);
        setState('pending');

        // Validate wallet connection
        if (!isConnected || !address) {
          throw new Error('Wallet not connected');
        }

        if (!publicClient) {
          throw new Error('Public client not available');
        }

        // Validate and clamp config
        const validatedConfig = validateConfig(config);

        console.log('🎨 Aesthetic Minting Parameters:');
        console.log('  Warmth:', validatedConfig.warmth);
        console.log('  Intensity:', validatedConfig.intensity);
        console.log('  Depth:', validatedConfig.depth);

        // Create fixed-point style vector strings
        const styleVectorStrings = createStyleVector(
          validatedConfig.warmth,
          validatedConfig.intensity,
          validatedConfig.depth
        );

        // --- FIXED: Convert and Destructure into Individual BigInts ---
        // Kita tidak mengirim Array ke contract, tapi 3 argumen terpisah
        const [warmthBig, intensityBig, depthBig] = styleVectorStrings.map(BigInt);

        console.log('✓ Style vector scaled to fixed-point (Individual Args):');
        console.log(`  Arg 1 (Warmth): ${warmthBig}`);
        console.log(`  Arg 2 (Intensity): ${intensityBig}`);
        console.log(`  Arg 3 (Depth): ${depthBig}`);

        console.log('🚀 Submitting mint_by_aesthetic transaction...');

        // Call mint_by_aesthetic with SPLIT ARGUMENTS
        const txHash = await writeContractAsync({
          address: RAYSTYLUS_ADDRESS as `0x${string}`,
          abi: RAYSTYLUS_ABI,
          functionName: 'mint_by_aesthetic',
          args: [
            // --- PERUBAHAN UTAMA DISINI ---
            // Jangan kirim array, kirim variabel satu per satu
            warmthBig,     // int64 (Style 1)
            intensityBig,  // int64 (Style 2)
            depthBig,      // int64 (Style 3)
            
            validatedConfig.bgColor1.r,
            validatedConfig.bgColor1.g,
            validatedConfig.bgColor1.b,
            validatedConfig.bgColor2.r,
            validatedConfig.bgColor2.g,
            validatedConfig.bgColor2.b,
            validatedConfig.camera.x,
            validatedConfig.camera.y,
            validatedConfig.camera.z,
          ],
        });

        console.log('✅ Transaction submitted:', txHash);
        setTxHash(txHash);

        // Wait for transaction confirmation
        setState('confirming');
        console.log('⏳ Waiting for transaction confirmation...');

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
          confirmations: 1,
        });

        if (receipt.status !== 'success') {
          throw new Error('Transaction failed');
        }

        console.log('✓ Transaction confirmed');

        // Extract token ID logic
        let tokenId = '0';
        try {
          // Fallback logic: use block number or tx hash if event parsing isn't set up
          tokenId = receipt.blockNumber.toString();
        } catch {
          tokenId = txHash;
        }

        console.log('🎁 Token ID:', tokenId);

        // Render the token image
        setState('confirmed');
        const imageUrl = await renderToken(BigInt(tokenId));

        // Build result
        const finalResult: MintingResult = {
          tokenId,
          txHash,
          imageUrl,
          imageInfo: {
            width: 32, 
            height: 32,
            fileSize: 3072 + 54, 
          },
        };

        setResult(finalResult);
        console.log('🎉 Minting complete!');

        return txHash;
      } catch (err) {
        const errorMessage = err && typeof err === 'object' && 'message' in err ? (err as Error).message : String(err);
        
        // Debugging hint for Gas Fee errors
        if (errorMessage.includes("gas") || errorMessage.includes("fee")) {
            console.error("⚠️ GAS ESTIMATION FAILED. Likely caused by Contract Revert/Panic.");
            console.error("Check ABI arguments match the Rust contract exactly.");
        }

        console.error('❌ Minting error:', errorMessage);
        setError(errorMessage);
        setState('failed');
        return null;
      }
    },
    [isConnected, address, publicClient, writeContractAsync, validateConfig]
  );

  /**
   * Renders a token image after minting
   */
  const renderToken = useCallback(
    async (tokenId: bigint | string): Promise<string> => {
      try {
        if (!publicClient) {
          throw new Error('Public client not available');
        }

        console.log('🎨 Rendering token:', tokenId);

        const bmpBytes = await publicClient.readContract({
          address: RAYSTYLUS_ADDRESS as `0x${string}`,
          abi: RAYSTYLUS_ABI,
          functionName: 'render_token',
          args: [BigInt(tokenId)],
        });

        let byteArray: Uint8Array;
        if (typeof bmpBytes === 'string') {
          const hexString = bmpBytes.startsWith('0x') ? bmpBytes.slice(2) : bmpBytes;
          byteArray = new Uint8Array(hexString.length / 2);
          for (let i = 0; i < hexString.length; i += 2) {
            byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
          }
        } else if (ArrayBuffer.isView(bmpBytes as any)) {
          const view = bmpBytes as any;
          byteArray = new Uint8Array(view);
        } else if (Array.isArray(bmpBytes)) {
          byteArray = new Uint8Array(bmpBytes);
        } else {
          throw new Error('Unexpected BMP data format');
        }

        const imageUrl = renderBmpImage(byteArray, { validate: true });
        return imageUrl;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('❌ Render error:', errorMessage);
        throw err;
      }
    },
    [publicClient]
  );

  const reset = useCallback(() => {
    setState('idle');
    setError(null);
    setResult(null);
    setTxHash(null);
  }, []);

  return {
    state,
    error,
    result,
    txHash,
    isLoading: isWritePending,
    mint,
    renderToken,
    reset,
  };
};

/**
 * Utility hook for managing multiple aesthetic parameters
 */
export const useAestheticParams = (initialConfig?: Partial<AestheticMintConfig>) => {
  const defaultConfig: AestheticMintConfig = {
    warmth: 0.5,
    intensity: 0.5,
    depth: 0.5,
    bgColor1: { r: 255, g: 255, b: 255 },
    bgColor2: { r: 100, g: 100, b: 100 },
    camera: { x: 0, y: 0, z: 0 },
    ...initialConfig,
  };

  const [config, setConfig] = useState<AestheticMintConfig>(defaultConfig);

  const updateWarmth = useCallback((warmth: number) => {
    setConfig((prev) => ({ ...prev, warmth: clampValue(warmth) }));
  }, []);

  const updateIntensity = useCallback((intensity: number) => {
    setConfig((prev) => ({ ...prev, intensity: clampValue(intensity) }));
  }, []);

  const updateDepth = useCallback((depth: number) => {
    setConfig((prev) => ({ ...prev, depth: clampValue(depth) }));
  }, []);

  const updateBgColor1 = useCallback((color: { r?: number; g?: number; b?: number }) => {
    setConfig((prev) => ({
      ...prev,
      bgColor1: { ...prev.bgColor1, ...color },
    }));
  }, []);

  const updateBgColor2 = useCallback((color: { r?: number; g?: number; b?: number }) => {
    setConfig((prev) => ({
      ...prev,
      bgColor2: { ...prev.bgColor2, ...color },
    }));
  }, []);

  const updateCamera = useCallback((camera: { x?: number; y?: number; z?: number }) => {
    setConfig((prev) => ({
      ...prev,
      camera: { ...prev.camera, ...camera },
    }));
  }, []);

  const reset = useCallback(() => {
    setConfig(defaultConfig);
  }, [defaultConfig]);

  return {
    config,
    updateWarmth,
    updateIntensity,
    updateDepth,
    updateBgColor1,
    updateBgColor2,
    updateCamera,
    reset,
  };
};