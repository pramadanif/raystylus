'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ConnectButton } from '../components/ConnectButton';
import { useRayStylus } from '../hooks/useRayStylus';
import { Settings, Camera, Zap, Activity } from 'lucide-react';

export default function StudioPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { render, isLoading, data, gasUsed, execTime } = useRayStylus();

    // Configuration State (Client-side simulation or future contract params)
    const [config, setConfig] = useState({
        resolution: '32x32',
        sphereColor: '#EBD5AB',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 0,
    });

    // Render Effect
    useEffect(() => {
        if (data && canvasRef.current) {
            drawPixels(data);
        }
    }, [data]);

    const drawPixels = (hexString: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rawBytes = hexString.slice(2);
        const bytes = new Uint8Array(rawBytes.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

        const width = 32;
        const height = 32;
        const imageData = ctx.createImageData(width, height);

        for (let i = 0; i < width * height; i++) {
            const r = bytes[i * 3 + 0];
            const g = bytes[i * 3 + 1];
            const b = bytes[i * 3 + 2];

            imageData.data[i * 4 + 0] = r;
            imageData.data[i * 4 + 1] = g;
            imageData.data[i * 4 + 2] = b;
            imageData.data[i * 4 + 3] = 255;
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx?.putImageData(imageData, 0, 0);

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="min-h-screen bg-[#0f120e] text-gray-200 flex flex-col font-sans">
            {/* Header */}
            <header className="h-16 border-b border-gray-800 bg-[#151a14] px-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-ray-mid rounded flex items-center justify-center font-bold text-white">R</div>
                    <span className="font-bold text-lg text-white">RayStylus Studio</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-xs font-mono text-gray-500">Arbitrum Sepolia</div>
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
                                <Camera size={14} className="mr-2" /> Camera Offset
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <span className="text-xs text-gray-500 mb-1 block">X</span>
                                    <input type="number" value={config.cameraX} onChange={(e) => setConfig({ ...config, cameraX: Number(e.target.value) })} className="w-full bg-[#1b211a] border border-gray-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 mb-1 block">Y</span>
                                    <input type="number" value={config.cameraY} onChange={(e) => setConfig({ ...config, cameraY: Number(e.target.value) })} className="w-full bg-[#1b211a] border border-gray-700 rounded px-2 py-1 text-xs" />
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 mb-1 block">Z</span>
                                    <input type="number" value={config.cameraZ} onChange={(e) => setConfig({ ...config, cameraZ: Number(e.target.value) })} className="w-full bg-[#1b211a] border border-gray-700 rounded px-2 py-1 text-xs" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-800">
                        <button
                            onClick={render}
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
                        <div className="mt-4 bg-black/40 rounded p-3 text-xs font-mono space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={isLoading ? "text-yellow-500" : "text-green-500"}>
                                    {isLoading ? "Running WASM..." : "Ready"}
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
                        </div>
                    </div>
                </aside>

                {/* Mian Canvas View */}
                <div className="flex-1 bg-[#0a0c0a] flex items-center justify-center relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1B211A]/30 to-transparent p-10">
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
                </div>
            </main>
        </div>
    );
}
