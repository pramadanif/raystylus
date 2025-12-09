'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ConnectButtonClient = dynamic(() => import('./ConnectButton').then(mod => ({ default: mod.ConnectButton })), {
    ssr: false,
    loading: () => (
        <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-500 cursor-not-allowed">
            Loading...
        </button>
    ),
});

export function ConnectButtonWrapper() {
    return (
        <Suspense fallback={
            <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-500 cursor-not-allowed">
                Loading...
            </button>
        }>
            <ConnectButtonClient />
        </Suspense>
    );
}
