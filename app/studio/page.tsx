'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useChainId } from 'wagmi';
import { ConnectButton } from '../components/ConnectButton';
import { useRayStylus } from '../hooks/useRayStylus';
import { useRayStylusMint } from '../hooks/useRayStylusMint';
import { RaccoonLogo } from '../components/Logo';
import { Settings, Camera, Zap, Activity, Palette, Gift } from 'lucide-react';

export default function StudioPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chainId = useChainId();
    const { render, isLoading, data, gasUsed, execTime, error } = useRayStylus();
    const { mint, isMinting, txHash, isConnected } = useRayStylusMint();

    // Configuration State - serves as DNA for rendered images
    const [config, setConfig] = useState({
        resolution: '32x32',
        sphereColor: '#EBD5AB',
        bgColor1: '#FFFFFF',
        bgColor2: '#5B7FD5',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 0,
    });

    const [mintMessage, setMintMessage] = useState<string>('');

    // Render Effect
    useEffect(() => {
        if (data && canvasRef.current) {
            drawPixels(data);
        }
    }, [data]);

    // Auto-render when config changes
    useEffect(() => {
        const timer = setTimeout(() => {
            render(config);
        }, 300); // Debounce untuk mencegah multiple renders
        
        return () => clearTimeout(timer);
    }, [config, render]);

    const drawPixels = (hexString: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            console.log('Drawing pixels, hex length:', hexString.length);
            
            const rawBytes = hexString.slice(2); // Remove '0x' prefix
            
            if (!rawBytes || rawBytes.length === 0) {
                console.error('No bytes data');
                return;
            }

            // Parse hex string to bytes
            const byteArray = [];
            for (let i = 0; i < rawBytes.length; i += 2) {
                byteArray.push(parseInt(rawBytes.substr(i, 2), 16));
            }
            const bytes = new Uint8Array(byteArray);

            console.log('Bytes array length:', bytes.length, 'Expected:', 32 * 32 * 3);

            const width = 32;
            const height = 32;
            const imageData = ctx.createImageData(width, height);

            // Fill pixel data
            for (let i = 0; i < width * height; i++) {
                const byteIndex = i * 3;
                const pixelIndex = i * 4;
                
                imageData.data[pixelIndex + 0] = bytes[byteIndex] || 0;     // R
                imageData.data[pixelIndex + 1] = bytes[byteIndex + 1] || 0; // G
                imageData.data[pixelIndex + 2] = bytes[byteIndex + 2] || 0; // B
                imageData.data[pixelIndex + 3] = 255;                       // A
            }

            // Create a bitmap from the image data to allow scaling
            createImageBitmap(imageData).then(bitmap => {
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Disable smoothing for pixel art look
                ctx.imageSmoothingEnabled = false;
                
                // Draw scaled image
                ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                
                console.log('Successfully drew scaled pixels to canvas');
            });
        } catch (err) {
            console.error('Error drawing pixels:', err);
        }
    };

    const clearRender = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleMint = async () => {
        if (!data) {
            setMintMessage('❌ Please render a scene first');
            return;
        }
        if (!isConnected) {
            setMintMessage('❌ Please connect your wallet first');
            return;
        }

        setMintMessage('⏳ Sending transaction to Arbitrum Sepolia...');
        console.log('🟡 Starting mint with config:', config);
        
        const result = await mint(config);
        
        if (result) {
            console.log('✅ Got sender address:', result);
            // Show success immediately - no "confirming" state
            setMintMessage(`✓ Transaction submitted! Check on Arbiscan`);
        } else {
            console.error('❌ Mint failed');
            setMintMessage(`❌ Mint failed. Check console for details.`);
        }
    };

    const handleRender = async () => {
        // Clear mint message when starting a new render
        setMintMessage('');
        // Call render hook
        await render(config);
    };

    return (
        <div className="min-h-screen bg-[#0f120e] text-gray-200 flex flex-col font-sans">
            {/* Header */}
            <header className="h-16 border-b border-gray-800 bg-[#151a14] px-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="text-ray-light">
                        <RaccoonLogo size="sm" />
                    </div>
                    <span className="font-bold text-lg text-white">RayStylus Studio</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-xs font-mono text-gray-500">
                        {chainId === 421614 ? (
                            <span className="text-green-400">✓ Arbitrum Sepolia (421614)</span>
                        ) : (
                            <span className="text-red-400">⚠ Wrong Chain: {chainId}</span>
                        )}
                    </div>
                    <ConnectButton />
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Controls */}
                <aside className="w-80 bg-[#151a14] border-r border-gray-800 p-6 flex flex-col overflow-y-auto">
                    <h2 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-6 flex items-center">
                        <Settings size={14} className="mr-2" /> Configuration
                    </h2>

                    <div className="space-y-6">
                        {/* Scene Settings */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-300 block">Resolution</label>
                            <select
                                disabled
                                className="w-full bg-[#1b211a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 focus:border-ray-mid outline-none"
                            >
                                <option>32x32 (On-Chain Native)</option>
                            </select>
                            <p className="text-xs text-gray-600">Locked to 32x32 for gas efficiency.</p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-800">
                            <label className="text-sm font-medium text-gray-300 block flex items-center">
                                <Palette size={14} className="mr-2" /> Scene Coloring
                            </label>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs text-gray-500 mb-1 block">Sphere Color</span>
                                    <div className="flex gap-2">
                                        <input 
                                            type="color" 
                                            value={config.sphereColor} 
                                            onChange={(e) => setConfig({ ...config, sphereColor: e.target.value })} 
                                            className="w-12 h-8 rounded cursor-pointer border border-gray-700"
                                        />
                                        <input 
                                            type="text" 
                                            value={config.sphereColor} 
                                            onChange={(e) => setConfig({ ...config, sphereColor: e.target.value })} 
                                            className="flex-1 bg-[#1b211a] border border-gray-700 rounded px-2 py-1 text-xs text-gray-300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 mb-1 block">BG Color 1 (Top)</span>
                                    <div className="flex gap-2">
                                        <input 
                                            type="color" 
                                            value={config.bgColor1} 
                                            onChange={(e) => setConfig({ ...config, bgColor1: e.target.value })} 
                                            className="w-12 h-8 rounded cursor-pointer border border-gray-700"
                                        />
                                        <input 
                                            type="text" 
                                            value={config.bgColor1} 
                                            onChange={(e) => setConfig({ ...config, bgColor1: e.target.value })} 
                                            className="flex-1 bg-[#1b211a] border border-gray-700 rounded px-2 py-1 text-xs text-gray-300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 mb-1 block">BG Color 2 (Bottom)</span>
                                    <div className="flex gap-2">
                                        <input 
                                            type="color" 
                                            value={config.bgColor2} 
                                            onChange={(e) => setConfig({ ...config, bgColor2: e.target.value })} 
                                            className="w-12 h-8 rounded cursor-pointer border border-gray-700"
                                        />
                                        <input 
                                            type="text" 
                                            value={config.bgColor2} 
                                            onChange={(e) => setConfig({ ...config, bgColor2: e.target.value })} 
                                            className="flex-1 bg-[#1b211a] border border-gray-700 rounded px-2 py-1 text-xs text-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-800">
                            <label className="text-sm font-medium text-gray-300 block flex items-center">
                                <Camera size={14} className="mr-2" /> Camera Offset
                            </label>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-500">X: {config.cameraX}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="-50" 
                                        max="50" 
                                        value={config.cameraX} 
                                        onChange={(e) => setConfig({ ...config, cameraX: Number(e.target.value) })} 
                                        className="w-full h-2 bg-[#1b211a] border border-gray-700 rounded appearance-none cursor-pointer accent-ray-mid"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-500">Y: {config.cameraY}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="-50" 
                                        max="50" 
                                        value={config.cameraY} 
                                        onChange={(e) => setConfig({ ...config, cameraY: Number(e.target.value) })} 
                                        className="w-full h-2 bg-[#1b211a] border border-gray-700 rounded appearance-none cursor-pointer accent-ray-mid"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-500">Z: {config.cameraZ}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="-50" 
                                        max="50" 
                                        value={config.cameraZ} 
                                        onChange={(e) => setConfig({ ...config, cameraZ: Number(e.target.value) })} 
                                        className="w-full h-2 bg-[#1b211a] border border-gray-700 rounded appearance-none cursor-pointer accent-ray-mid"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-800">
                        <button
                            onClick={handleRender}
                            disabled={isLoading}
                            className={`w-full py-3 rounded font-bold transition-all flex items-center justify-center ${isLoading
                                ? 'bg-ray-mid/50 cursor-not-allowed text-white/50'
                                : 'bg-ray-mid hover:bg-ray-light text-white shadow-lg shadow-ray-mid/20'
                                }`}
                        >
                            {isLoading ? (
                                <>Processing...</>
                            ) : (
                                <><Zap size={16} className="mr-2" /> Render Frame</>
                            )}
                        </button>

                        <button
                            onClick={handleMint}
                            disabled={isMinting || !data || !isConnected}
                            className={`w-full py-3 mt-2 rounded font-bold transition-all flex items-center justify-center ${
                                isMinting || !data || !isConnected
                                    ? 'bg-purple-900/30 cursor-not-allowed text-white/50'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20'
                            }`}
                        >
                            {isMinting ? (
                                <>Signing...</>
                            ) : !isConnected ? (
                                <>Connect Wallet to Mint</>
                            ) : (
                                <><Gift size={16} className="mr-2" /> Mint as NFT</>
                            )}
                        </button>

                        <button
                            onClick={clearRender}
                            className="w-full py-2 mt-2 rounded font-bold transition-all bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-700/50 text-sm"
                        >
                            Wipeout Render
                        </button>

                        <div className="mt-4 bg-black/40 rounded p-3 text-xs font-mono space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={isLoading ? "text-yellow-500" : error ? "text-red-500" : "text-green-500"}>
                                    {isLoading ? "Running WASM..." : error ? "Error" : "Ready"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Gas Used</span>
                                <span className="text-ray-cream">{gasUsed || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Time</span>
                                <span>{execTime || '-'}</span>
                            </div>
                            {mintMessage && (
                                <div className="mt-2 p-2 bg-purple-900/30 border border-purple-700/50 rounded text-purple-300 text-xs">
                                    {mintMessage}
                                    {txHash && txHash.startsWith('0x') && txHash.length === 42 && (
                                        <a 
                                            href={`https://sepolia.arbiscan.io/address/${txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 underline block mt-1"
                                        >
                                            View address on Arbiscan →
                                        </a>
                                    )}
                                    {txHash && txHash.startsWith('0x') && txHash.length === 66 && (
                                        <a 
                                            href={`https://sepolia.arbiscan.io/tx/${txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 underline block mt-1"
                                        >
                                            View on Arbiscan →
                                        </a>
                                    )}
                                </div>
                            )}
                            {error && (
                                <div className="mt-2 p-2 bg-red-900/30 border border-red-700/50 rounded text-red-300 text-xs">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Mian Canvas View */}
                <div className="flex-1 bg-[#0a0c0a] flex flex-col items-center justify-center relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1B211A]/30 to-transparent p-10 space-y-6">
                    <div className="relative group">
                        {/* Border effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-ray-mid to-ray-light rounded opacity-20 group-hover:opacity-40 transition blur"></div>
                        <canvas
                            ref={canvasRef}
                            width={512}
                            height={512}
                            className="relative bg-black rounded shadow-2xl image-pixelated w-[512px] h-[512px]"
                        />

                        {!data && !isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center bg-[#151a14]/90 p-6 rounded-xl border border-gray-800 backdrop-blur-sm max-w-xs">
                                    <Activity size={32} className="mx-auto text-ray-mid mb-3" />
                                    <h3 className="text-gray-200 font-bold mb-1">Ready to Render</h3>
                                    <p className="text-gray-500 font-mono text-xs">
                                        Configure your scene and click "Render Frame" to compute pixels on Arbitrum Stylus.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Blockchain Information */}
                    <div className="max-w-2xl text-center bg-[#151a14]/80 border border-ray-mid/30 rounded-lg p-6 backdrop-blur-sm">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            The 3D graphics you create are rendered on the blockchain, not on your PC. 
                            It executes thousands of complex vector mathematical operations 
                            (<span className="text-ray-light font-semibold">Dot Product</span>, 
                            <span className="text-ray-light font-semibold"> Normalization</span>, 
                            <span className="text-ray-light font-semibold"> Quadratic Formula</span>) 
                            for every pixel in a single transaction.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
