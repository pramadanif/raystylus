'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Loader2, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';

export const ConnectButton = () => {
    const { address, isConnected } = useAccount();
    const { connectors, connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="px-4 py-2 bg-ray-dark border border-gray-700 rounded text-gray-500 cursor-not-allowed">
                Loading...
            </button>
        );
    }

    if (isConnected && address) {
        return (
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
