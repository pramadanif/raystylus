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
        bgColor1: string;
        bgColor2: string;
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
            
            // Parse hex colors to RGB
            const sphere_r = parseInt(config.sphereColor.slice(1, 3), 16);
            const sphere_g = parseInt(config.sphereColor.slice(3, 5), 16);
            const sphere_b = parseInt(config.sphereColor.slice(5, 7), 16);

            const bg1_r = parseInt(config.bgColor1.slice(1, 3), 16);
            const bg1_g = parseInt(config.bgColor1.slice(3, 5), 16);
            const bg1_b = parseInt(config.bgColor1.slice(5, 7), 16);

            const bg2_r = parseInt(config.bgColor2.slice(1, 3), 16);
            const bg2_g = parseInt(config.bgColor2.slice(3, 5), 16);
            const bg2_b = parseInt(config.bgColor2.slice(5, 7), 16);

            // Call contract with all color parameters
            const result = await publicClient.readContract({
                address: RAYSTYLUS_ADDRESS as `0x${string}`,
                abi: RAYSTYLUS_ABI,
                functionName: 'renderScene',
                args: [
                    sphere_r, sphere_g, sphere_b,
                    bg1_r, bg1_g, bg1_b,
                    bg2_r, bg2_g, bg2_b,
                    config.cameraX, config.cameraY, config.cameraZ
                ],
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
