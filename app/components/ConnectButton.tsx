'use client';

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { Loader2, Wallet, AlertCircle, LogOut, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const ARBITRUM_SEPOLIA_ID = 421614;
const ARBITRUM_SEPOLIA_HEX = '0x66eee';

export const ConnectButton = () => {
    const { address, isConnected } = useAccount();
    const { connectors, connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const chainId = useChainId();
    
    const [mounted, setMounted] = useState(false);
    const [showChainWarning, setShowChainWarning] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    const [currentChain, setCurrentChain] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
        
        const handleChainChanged = (chainIdHex: string) => {
            const newChainId = parseInt(chainIdHex, 16);
            setCurrentChain(newChainId);
        };

        if (window.ethereum) {
            window.ethereum.on('chainChanged', handleChainChanged);
            window.ethereum.request({ method: 'eth_chainId' }).then((chainIdHex: string) => {
                const newChainId = parseInt(chainIdHex, 16);
                setCurrentChain(newChainId);
            });

            return () => {
                window.ethereum?.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    useEffect(() => {
        const effectiveChainId = currentChain ?? chainId;
        if (isConnected && effectiveChainId && effectiveChainId !== ARBITRUM_SEPOLIA_ID) {
            setShowChainWarning(true);
        } else {
            setShowChainWarning(false);
        }
    }, [isConnected, currentChain, chainId]);

    const handleSwitchChain = useCallback(async () => {
        const ethereum = (window as any).ethereum;
        if (!ethereum) {
            alert('MetaMask not found');
            return;
        }

        setIsSwitching(true);
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ARBITRUM_SEPOLIA_HEX }],
            });
        } catch (error: any) {
            if (error.code === 4902) {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: ARBITRUM_SEPOLIA_HEX,
                            chainName: 'Arbitrum Sepolia',
                            rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
                            blockExplorerUrls: ['https://sepolia.arbiscan.io'],
                            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                        }],
                    });
                } catch (e) {
                    console.error('Add chain failed:', e);
                }
            }
        } finally {
            setIsSwitching(false);
        }
    }, []);

    if (!mounted) {
        return (
            <div className="h-10 w-32 bg-zinc-800/50 animate-pulse rounded-full border border-zinc-700/50" />
        );
    }

    if (isConnected && address) {
        return (
            // Tambahkan 'relative' di sini agar elemen absolute mengacu pada div ini
            <div className="relative font-sans z-50">
                
                {/* 1. Address & Disconnect Pill */}
                <div className="group flex items-center gap-0 bg-zinc-900 border border-zinc-800 rounded-full pl-1 pr-1 py-1 shadow-sm hover:border-zinc-700 hover:shadow-md transition-all duration-300">
                    {/* Status Dot & Address */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50">
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${showChainWarning ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${showChainWarning ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                        </span>
                        <span className="font-mono text-sm font-medium text-zinc-200 tracking-tight">
                            {address.slice(0, 6)}...{address.slice(-4)}
                        </span>
                    </div>

                    {/* Separator */}
                    <div className="w-px h-4 bg-zinc-800 mx-1" />

                    {/* Disconnect Button */}
                    <button
                        onClick={() => disconnect()}
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-200 group-hover:text-zinc-300"
                        title="Disconnect Wallet"
                    >
                        <LogOut size={16} strokeWidth={2.5} />
                    </button>
                </div>

                {/* 2. Network Warning Notification (ABSOLUTE POSITION) */}
                {/* 
                    Perubahan Utama:
                    - absolute: Agar melayang keluar dari flow dokumen (tidak menambah tinggi navbar).
                    - top-full: Muncul tepat di bawah tombol.
                    - mt-2: Memberi jarak sedikit.
                    - right-0: Rata kanan dengan tombol (mencegah kepotong di sisi kanan layar).
                    - w-max: Mencegah teks terpotong/wrapping jelek.
                */}
                {showChainWarning && (
                    <div className="absolute top-full right-0 mt-2 z-[100]">
                        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-zinc-950/90 border border-red-500/30 rounded-xl w-max shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-400" />
                                <span className="text-xs font-medium text-red-200 whitespace-nowrap">Wrong Network</span>
                            </div>
                            <button
                                onClick={handleSwitchChain}
                                disabled={isSwitching}
                                className="flex items-center gap-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-50 ml-4 border border-red-500/20"
                            >
                                {isSwitching ? 'Switching...' : 'Switch'}
                                {!isSwitching && <ChevronRight size={12} />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            {connectors.map((connector) => (
                <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    disabled={isPending}
                    className="
                        relative overflow-hidden group
                        flex items-center gap-2 px-5 py-2.5 
                        bg-zinc-50 hover:bg-white text-zinc-900 
                        dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white
                        border border-zinc-200 dark:border-zinc-700
                        rounded-xl font-medium text-sm transition-all duration-300
                        shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]
                        active:scale-95
                    "
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                    ) : (
                        <div className="p-1 bg-zinc-200 dark:bg-zinc-800 rounded-md group-hover:scale-110 transition-transform duration-300">
                            <Wallet className="w-3.5 h-3.5" />
                        </div>
                    )}
                    <span>Connect {connector.name}</span>
                </button>
            ))}
        </div>
    );
};

declare global {
    interface Window {
        ethereum?: {
            on: (event: string, callback: (...args: any[]) => void) => void;
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            removeListener: (event: string, callback: (...args: any[]) => void) => void;
        };
    }
}