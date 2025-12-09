'use client';

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { Loader2, Wallet, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const ARBITRUM_SEPOLIA = {
    id: 421614,
    name: 'Arbitrum Sepolia',
    network: 'arbitrum-sepolia',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia-rollup.arbitrum.io/rpc'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Arbiscan',
            url: 'https://sepolia.arbiscan.io',
        },
    },
    testnet: true,
};

export const ConnectButton = () => {
    const { address, isConnected } = useAccount();
    const { connectors, connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const [mounted, setMounted] = useState(false);
    const [showChainWarning, setShowChainWarning] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-prompt to switch chain when connected to wrong network
    useEffect(() => {
        if (isConnected && chainId !== ARBITRUM_SEPOLIA.id) {
            setShowChainWarning(true);
        } else {
            setShowChainWarning(false);
        }
    }, [isConnected, chainId]);

    const handleSwitchChain = async () => {
        try {
            // First try to switch using wagmi
            if (switchChain) {
                await switchChain({ chainId: ARBITRUM_SEPOLIA.id });
                return;
            }
        } catch (error: any) {
            console.log('Switch chain via wagmi failed, trying ethereum provider...', error);
        }

        // Fallback: use ethereum provider directly
        try {
            const provider = (window as any).ethereum;
            if (!provider) {
                alert('MetaMask not found. Please install MetaMask.');
                return;
            }

            // Try to switch to the chain
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${ARBITRUM_SEPOLIA.id.toString(16)}` }],
            });
        } catch (switchError: any) {
            // Chain doesn't exist, add it
            if (switchError?.code === 4902) {
                try {
                    const provider = (window as any).ethereum;
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x${ARBITRUM_SEPOLIA.id.toString(16)}`,
                                chainName: ARBITRUM_SEPOLIA.name,
                                nativeCurrency: ARBITRUM_SEPOLIA.nativeCurrency,
                                rpcUrls: ARBITRUM_SEPOLIA.rpcUrls.default.http,
                                blockExplorerUrls: [ARBITRUM_SEPOLIA.blockExplorers.default.url],
                            },
                        ],
                    });
                } catch (addError) {
                    console.error('Error adding chain:', addError);
                    alert('Failed to add Arbitrum Sepolia network');
                }
            } else {
                console.error('Error switching chain:', switchError);
                alert('Failed to switch network');
            }
        }
    };

    if (!mounted) {
        return (
            <button className="px-4 py-2 bg-ray-dark border border-gray-700 rounded text-gray-500 cursor-not-allowed">
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
                            <p className="text-xs text-red-300 font-medium">Wrong network</p>
                            <button
                                onClick={handleSwitchChain}
                                className="text-xs text-red-400 hover:text-red-300 underline font-semibold mt-1 block"
                            >
                                Switch to Arbitrum Sepolia
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <div className="px-4 py-2 bg-ray-mid/20 border border-ray-mid text-ray-light rounded font-mono text-sm">
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
                    className="flex items-center px-4 py-2 bg-ray-mid hover:bg-ray-light text-white rounded font-medium transition-all shadow-[0_0_10px_rgba(98,129,65,0.3)] hover:shadow-[0_0_15px_rgba(98,129,65,0.6)]"
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
