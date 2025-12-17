'use client';

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
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
 * Configuration for aesthetic minting
 */
export interface AestheticMintConfig {
  warmth: number;
  intensity: number;
  depth: number;

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
 * Preview result from view_aesthetic
 */
export interface AestheticPreview {
  sphere_r: number;
  sphere_g: number;
  sphere_b: number;
}

/**
 * State of minting operation
 */
export type MintingState = 'idle' | 'previewing' | 'pending' | 'confirming' | 'confirmed' | 'failed';

/**
 * Result of successful minting
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
 * Hook for aesthetic-based minting with ML inference
 * 
 * NEW WORKFLOW:
 * 1. previewAesthetic() - VIEW function (FREE!) - get ML colors
 * 2. mint() - STATE function (pays gas) - create NFT
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
  const [preview, setPreview] = useState<AestheticPreview | null>(null);

  /**
   * Validates and clamps configuration values
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
   * STEP 1: Preview aesthetic colors using ML inference (VIEW function - FREE!)
   * 
   * This calls view_aesthetic which is a VIEW function:
   * - No gas cost
   * - No blockchain transaction
   * - Instant result
   * - Perfect for previewing before minting
   */
  const previewAesthetic = useCallback(
    async (config: AestheticMintConfig): Promise<AestheticPreview | null> => {
      try {
        setError(null);
        setState('previewing');

        if (!isConnected || !address) {
          throw new Error('Wallet not connected');
        }

        if (!publicClient) {
          throw new Error('Public client not available');
        }

        const validatedConfig = validateConfig(config);

        console.log('🎨 Previewing Aesthetic Colors (FREE VIEW FUNCTION):');
        console.log('  Warmth:', validatedConfig.warmth);
        console.log('  Intensity:', validatedConfig.intensity);
        console.log('  Depth:', validatedConfig.depth);

        // Create fixed-point style vector
        const styleVectorStrings = createStyleVector(
          validatedConfig.warmth,
          validatedConfig.intensity,
          validatedConfig.depth
        );

        const [warmthBig, intensityBig, depthBig] = styleVectorStrings.map(BigInt);

        console.log('✓ Style vector scaled to fixed-point:');
        console.log(`  Warmth: ${warmthBig}`);
        console.log(`  Intensity: ${intensityBig}`);
        console.log(`  Depth: ${depthBig}`);

        // Call VIEW function - completely FREE, no gas!
        console.log('🔍 Calling view_aesthetic (FREE)...');

        const result = await publicClient.readContract({
          address: RAYSTYLUS_ADDRESS as `0x${string}`,
          abi: RAYSTYLUS_ABI,
          functionName: 'viewAesthetic',
          args: [warmthBig, intensityBig, depthBig],
        });

        const previewResult: AestheticPreview = {
          sphere_r: Number(result[0]),
          sphere_g: Number(result[1]),
          sphere_b: Number(result[2]),
        };

        console.log('✅ Preview result:');
        console.log(`  R: ${previewResult.sphere_r}`);
        console.log(`  G: ${previewResult.sphere_g}`);
        console.log(`  B: ${previewResult.sphere_b}`);

        setPreview(previewResult);
        setState('idle');

        return previewResult;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('❌ Preview error:', errorMessage);
        setError(errorMessage);
        setState('failed');
        return null;
      }
    },
    [isConnected, address, publicClient, validateConfig]
  );

  /**
   * STEP 2: Mint token with computed colors (STATE function - PAYS GAS)
   * 
   * After previewing with previewAesthetic(), call this to actually mint.
   * This calls the mint() function which:
   * - Stores token data
   * - Creates NFT
   * - Pays gas fee (normal range: 50K-100K)
   */
  const mint = useCallback(
    async (config: AestheticMintConfig, previewResult: AestheticPreview): Promise<string | null> => {
      try {
        setError(null);
        setState('pending');

        if (!isConnected || !address) {
          throw new Error('Wallet not connected');
        }

        if (!publicClient) {
          throw new Error('Public client not available');
        }

        if (!previewResult) {
          throw new Error('No preview data. Call previewAesthetic() first!');
        }

        const validatedConfig = validateConfig(config);

        console.log('💾 Minting token with computed colors...');
        console.log(`  Sphere RGB: (${previewResult.sphere_r}, ${previewResult.sphere_g}, ${previewResult.sphere_b})`);

        // Estimate gas first
        console.log('🔍 Estimating gas...');

        try {
          const gasEstimate = await publicClient.estimateContractGas({
            address: RAYSTYLUS_ADDRESS as `0x${string}`,
            abi: RAYSTYLUS_ABI,
            functionName: 'mint',
            account: address,
            args: [
              previewResult.sphere_r,
              previewResult.sphere_g,
              previewResult.sphere_b,
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

          console.log(`⛽ Estimated gas: ${gasEstimate.toString()} units`);

          if (gasEstimate > BigInt(500_000)) {
            throw new Error(
              `Gas estimate too high (${gasEstimate}). Expected 50K-100K. ` +
              `Check contract or parameters.`
            );
          }
        } catch (estimateErr) {
          console.error('❌ Gas estimation failed:', estimateErr);
          throw new Error('Contract execution would fail. Check inputs.');
        }

        console.log('🚀 Submitting mint transaction...');

        // Call mint() - STATE function that pays gas
        const txHash = await writeContractAsync({
          address: RAYSTYLUS_ADDRESS as `0x${string}`,
          abi: RAYSTYLUS_ABI,
          functionName: 'mint',
          args: [
            previewResult.sphere_r,
            previewResult.sphere_g,
            previewResult.sphere_b,
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

        // Wait for confirmation
        setState('confirming');
        console.log('⏳ Waiting for confirmation...');

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
          confirmations: 1,
        });

        if (receipt.status !== 'success') {
          throw new Error('Transaction failed');
        }

        console.log('✓ Transaction confirmed');
        console.log(`  Gas used: ${receipt.gasUsed.toString()}`);

        // Get token ID
        let tokenId = '0';
        try {
          tokenId = receipt.blockNumber.toString();
        } catch {
          tokenId = txHash;
        }

        console.log('🎁 Token ID:', tokenId);

        // Render token
        setState('confirmed');
        const imageUrl = await renderToken(BigInt(tokenId));

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
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('❌ Minting error:', errorMessage);
        setError(errorMessage);
        setState('failed');
        return null;
      }
    },
    [isConnected, address, publicClient, writeContractAsync, validateConfig]
  );

  /**
   * Renders token image
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
          functionName: 'renderToken',
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
    setPreview(null);
  }, []);

  return {
    state,
    error,
    result,
    preview,
    txHash,
    isLoading: isWritePending,
    previewAesthetic,  // NEW: Preview colors (free view function)
    mint,              // Mint token (state function, pays gas)
    renderToken,
    reset,
  };
};

/**
 * Hook for managing aesthetic parameters
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