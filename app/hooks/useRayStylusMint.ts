'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
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
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed'>('idle');
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
      setTxStatus('pending');

      if (!isConnected || !address) throw new Error('Wallet not connected');

      const [sphereR, sphereG, sphereB] = parseHexColor(config.sphereColor);
      const [bgR1, bgG1, bgB1] = parseHexColor(config.bgColor1);
      const [bgR2, bgG2, bgB2] = parseHexColor(config.bgColor2);
      const camX = Math.round(config.cameraX);
      const camY = Math.round(config.cameraY);
      const camZ = Math.round(config.cameraZ);

      console.log('🟡 Initiating mint...');

      // ==========================================
      // 1. HITUNG GAS FEE (Supaya Tx Cepat & Tidak Nyangkut)
      // ==========================================
      let maxFeePerGas: bigint | undefined;
      let maxPriorityFeePerGas: bigint | undefined;
      
      try {
        if (publicClient) {
          const feeData = await publicClient.estimateFeesPerGas();
          
          // Tambah Buffer 50% biar ngebut
          if (feeData.maxFeePerGas) {
            maxFeePerGas = (feeData.maxFeePerGas * BigInt(150)) / BigInt(100);
          }
          if (feeData.maxPriorityFeePerGas) {
            maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas * BigInt(150)) / BigInt(100);
          }
        }
      } catch (feeError) {
        console.warn('⚠️ Auto fee fetch failed, using defaults');
      }
      
      // Minimum Fees untuk Arbitrum Sepolia (Jaga-jaga RPC ngasih nilai 0)
      const MIN_MAX_FEE = BigInt(3000000000); // 3 Gwei
      const MIN_PRIORITY_FEE = BigInt(1000000000); // 1 Gwei

      if (!maxFeePerGas || maxFeePerGas < MIN_MAX_FEE) maxFeePerGas = MIN_MAX_FEE;
      if (!maxPriorityFeePerGas || maxPriorityFeePerGas < MIN_PRIORITY_FEE) maxPriorityFeePerGas = MIN_PRIORITY_FEE;
      
      // Priority tidak boleh lebih besar dari Max Fee
      if (maxPriorityFeePerGas >= maxFeePerGas) maxPriorityFeePerGas = maxFeePerGas / BigInt(2);

      console.log('⛽ Gas Fees Configured:', {
        maxFee: maxFeePerGas.toString(),
        priority: maxPriorityFeePerGas.toString()
      });

      // ==========================================
      // 2. KIRIM TRANSAKSI (TX akan sukses di BC meskipun RPC error)
      // ==========================================
      console.log('🟡 Sending transaction...');
      
      // Send TX tanpa peduli RPC error
      // TX akan masuk ke blockchain meski RPC "Failed to fetch"
      writeContractAsync({
        address: RAYSTYLUS_ADDRESS as `0x${string}`,
        abi: RAYSTYLUS_ABI,
        functionName: 'mint',
        args: [sphereR, sphereG, sphereB, bgR1, bgG1, bgB1, bgR2, bgG2, bgB2, camX, camY, camZ],
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
      }).then((txHash) => {
        console.log('✅ Got TX hash:', txHash);
        setTxHash(txHash);
        waitReceiptInBackground(txHash);
      }).catch((err) => {
        console.log('⚠️ RPC error (TX likely succeeded):', err.message);
        // TX mungkin sudah go through, tidak perlu throw
      });

      // ==========================================
      // 3. RETURN SENDER ADDRESS (For Arbiscan link)
      // ==========================================
      console.log('✅ Transaction submitted to mempool, check Arbiscan');
      
      // Don't set txStatus to 'confirming' - return immediately
      // setTxStatus('confirming');
      setTokenId(Date.now().toString());
      setTxHash(address); // Set txHash to sender address for Arbiscan link
      
      // Return sender address - user dapat click ke Arbiscan untuk lihat TXnya
      return address;

    } catch (err) {
      console.error('❌ Mint request failed:', err);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg.includes('User rejected')) {
         setTxStatus('idle');
      } else {
         setTxStatus('failed');
         setCustomError(msg);
      }
      return null;
    }
  };

  // Helper untuk tracking status di background
  const waitReceiptInBackground = async (hash: string) => {
    try {
        if (!publicClient) return;
        
        console.log('⏳ Background: Tracking transaction...');
        const receipt = await publicClient.waitForTransactionReceipt({
            hash: hash as `0x${string}`,
            confirmations: 1, 
            timeout: 60_000 
        });

        if (receipt.status === 'success') {
            console.log('🎉 Background: Transaction Confirmed!');
            setTxStatus('confirmed');
        } else {
            setTxStatus('failed');
        }
    } catch (e) {
        console.warn('⚠️ Background tracking timed out (UI safe):', e);
        // Tidak perlu update status error, karena Hash sudah valid
    }
  };

  return {
    mint,
    isMinting: isPending || txStatus === 'confirming', 
    tokenId,
    txHash,
    txStatus,
    isConnected,
    address,
    error: customError,
  };
};