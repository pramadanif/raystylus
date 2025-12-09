'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Disable MetaMaskSDK initialization
if (typeof window !== 'undefined') {
    (window as any).MetaMaskSDK = { initialized: true };
}

const rpcUrl = process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc';

const config = createConfig({
    chains: [arbitrumSepolia],
    connectors: [
        metaMask({
            dappMetadata: {
                name: 'RayStylus',
            },
        }),
    ],
    transports: {
        [arbitrumSepolia.id]: http(rpcUrl),
    },
    ssr: true,
});

const queryClient = new QueryClient();

export function OnchainProviders({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}