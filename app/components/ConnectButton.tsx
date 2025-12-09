'use client';

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { Loader2, Wallet, AlertCircle } from 'lucide-react';
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
        
        // Listen to chain changes
        const handleChainChanged = (chainIdHex: string) => {
            const newChainId = parseInt(chainIdHex, 16);
            setCurrentChain(newChainId);
        };

        if (window.ethereum) {
            window.ethereum.on('chainChanged', handleChainChanged);
            
            // Get initial chain
            window.ethereum.request({ method: 'eth_chainId' }).then((chainIdHex: string) => {
                const newChainId = parseInt(chainIdHex, 16);
                setCurrentChain(newChainId);
            });

            return () => {
                window.ethereum?.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    // Cek network
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
            console.log('Attempting to switch to chain:', ARBITRUM_SEPOLIA_HEX);
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ARBITRUM_SEPOLIA_HEX }],
            });
            console.log('Successfully switched chain');
        } catch (error: any) {
            console.log('Switch error code:', error.code, 'Message:', error.message);
            
            if (error.code === 4902) {
                try {
                    console.log('Chain not found, attempting to add...');
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
                    console.log('Chain added successfully');
                } catch (e) {
                    console.error('Add chain failed:', e);
                }
            } else if (error.code === 4001) {
                console.log('User rejected the request');
            }
        } finally {
            setIsSwitching(false);
        }
    }, []);

    if (!mounted) {
        return (
            <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-500 cursor-not-allowed">
                Loading...
            </button>
        );
    }

    if (isConnected && address) {
        return (
            <div className="flex flex-col gap-2">
                {showChainWarning && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg animate-pulse">
                        <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-red-300 font-medium">Wrong network - Switching...</p>
                            <button
                                onClick={handleSwitchChain}
                                disabled={isSwitching}
                                className="text-xs text-red-400 hover:text-red-300 underline font-semibold mt-1 block disabled:opacity-50"
                            >
                                {isSwitching ? 'Switching...' : 'Click to switch manually'}
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <div className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded font-mono text-sm">
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </div>
                    <button
                        onClick={() => disconnect()}
                        className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded transition-colors"
                        title="Disconnect"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                    </button>
                </div>
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
                    className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded font-medium transition-all"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Wallet className="w-4 h-4 mr-2" />
                    )}
                    Connect {connector.name}
                </button>
            ))}
        </div>
    );
};

// Add a type declaration for the 'ethereum' property on the Window object
declare global {
    interface Window {
        ethereum?: {
            on: (event: string, callback: (...args: any[]) => void) => void;
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            removeListener: (event: string, callback: (...args: any[]) => void) => void;
        };
    }
}