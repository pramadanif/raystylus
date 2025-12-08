'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const rpcUrl = process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC || 'https://arbitrum-sepolia-rpc.publicnode.com';

const config = createConfig({
    chains: [arbitrumSepolia],
    transports: {
        [arbitrumSepolia.id]: http(rpcUrl),
    },
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
