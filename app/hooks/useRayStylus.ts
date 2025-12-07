'use client';

import { usePublicClient } from 'wagmi';
import { RAYSTYLUS_ABI, RAYSTYLUS_ADDRESS } from '../abi/RayStylus';
import { useState, useCallback } from 'react';

export function useRayStylus() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        data: string | undefined;
        gas: string | undefined;
        time: string | undefined;
        error: string | undefined;
    }>({ data: undefined, gas: undefined, time: undefined, error: undefined });

    const publicClient = usePublicClient();

    const render = useCallback(async (config: {
        sphereColor: string;
        cameraX: number;
        cameraY: number;
        cameraZ: number;
    }) => {
        setIsLoading(true);
        try {
            if (!publicClient) {
                throw new Error('Public client not available');
            }
            
            console.log('Starting render with config:', config);
            const startTime = performance.now();
            
            // Parse hex color to RGB
            const r = parseInt(config.sphereColor.slice(1, 3), 16);
            const g = parseInt(config.sphereColor.slice(3, 5), 16);
            const b = parseInt(config.sphereColor.slice(5, 7), 16);

            // Call as a read contract instead using publicClient
            const result = await publicClient.readContract({
                address: RAYSTYLUS_ADDRESS as `0x${string}`,
                abi: RAYSTYLUS_ABI,
                functionName: 'renderScene',
                args: [r, g, b, config.cameraX, config.cameraY, config.cameraZ],
            });
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);

            console.log('Render response:', { result, duration });

            if (result && typeof result === 'string' && result.length > 2) {
                console.log('Successfully got pixels, length:', result.length);
                setResult({
                    data: result,
                    gas: "0",
                    time: `${duration}ms`,
                    error: undefined
                });
            } else {
                const msg = 'No valid pixel data returned from contract';
                console.warn(msg, result);
                setResult({
                    data: undefined,
                    gas: undefined,
                    time: undefined,
                    error: msg
                });
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
            console.error('Render exception:', errorMsg);
            setResult({
                data: undefined,
                gas: undefined,
                time: undefined,
                error: errorMsg
            });
        } finally {
            setIsLoading(false);
        }
    }, [publicClient]);

    return {
        render,
        isLoading,
        data: result.data,
        gasUsed: result.gas,
        execTime: result.time,
        error: result.error
    };
}
