'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useChainId } from 'wagmi';
import { ConnectButtonWrapper } from '../components/ConnectButtonWrapper';
import { useRayStylus } from '../hooks/useRayStylus';
import { useRayStylusMint } from '../hooks/useRayStylusMint';
import { RaccoonLogo } from '../components/Logo';
import { Settings, Camera, Zap, Activity, Palette, Gift, Terminal, Cpu, Layers } from 'lucide-react';

// Utility component for consistent Label styling
const Label = ({ icon: Icon, children }: { icon?: any, children: React.ReactNode }) => (
    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
        {Icon && <Icon size={14} className="text-ray-mid" />}
        {children}
    </label>
);

// Custom styled Range Slider
const RangeSlider = ({ label, value, min, max, onChange }: any) => (
    <div className="group">
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono text-gray-500 group-hover:text-gray-300 transition-colors">{label}</span>
            <span className="text-xs font-mono text-ray-cream bg-white/5 px-2 py-0.5 rounded">{value}</span>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            value={value} 
            onChange={onChange} 
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-ray-mid hover:accent-ray-light transition-all"
        />
    </div>
);

// Smooth Marquee Component
const Marquee = ({ children }: { children: React.ReactNode }) => {
    const [contentWidth, setContentWidth] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            setContentWidth(contentRef.current.offsetWidth);
        }
    }, []);

    const duration = contentWidth > 0 ? contentWidth / 50 : 30;

    return (
        <div className="w-full overflow-hidden bg-white/[0.02] border border-white/5 rounded-lg">
            <style>{`
                @keyframes smoothMarquee {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                .marquee-content {
                    animation: smoothMarquee ${duration}s linear infinite;
                    display: inline-block;
                    white-space: nowrap;
                }
                .marquee-container:hover .marquee-content {
                    animation-play-state: paused;
                }
            `}</style>
            <div className="marquee-container py-3">
                <div 
                    ref={contentRef}
                    className="marquee-content text-xs text-gray-300 px-6"
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function StudioPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chainId = useChainId();
    const { render, isLoading, data, gasUsed, execTime, error } = useRayStylus();
    const { mint, isMinting, txHash, isConnected } = useRayStylusMint();

    // Configuration State
    const [config, setConfig] = useState({
        resolution: '32x32',
        sphereColor: '#EBD5AB',
        bgColor1: '#0F120E',
        bgColor2: '#5B7FD5',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 0,
    });

    const [mintMessage, setMintMessage] = useState<string>('');

    // --- Logic Tetap Sama (Keep Logic Intact) ---
    useEffect(() => {
        if (data && canvasRef.current) {
            drawPixels(data);
        }
    }, [data]);

    useEffect(() => {
        const timer = setTimeout(() => {
            render(config);
        }, 300);
        return () => clearTimeout(timer);
    }, [config, render]);

    const drawPixels = (hexString: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            const rawBytes = hexString.slice(2);
            if (!rawBytes || rawBytes.length === 0) return;

            const byteArray = [];
            for (let i = 0; i < rawBytes.length; i += 2) {
                byteArray.push(parseInt(rawBytes.substr(i, 2), 16));
            }
            const bytes = new Uint8Array(byteArray);

            const width = 32;
            const height = 32;
            const imageData = ctx.createImageData(width, height);

            for (let i = 0; i < width * height; i++) {
                const byteIndex = i * 3;
                const pixelIndex = i * 4;
                imageData.data[pixelIndex + 0] = bytes[byteIndex] || 0;
                imageData.data[pixelIndex + 1] = bytes[byteIndex + 1] || 0;
                imageData.data[pixelIndex + 2] = bytes[byteIndex + 2] || 0;
                imageData.data[pixelIndex + 3] = 255;
            }

            createImageBitmap(imageData).then(bitmap => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
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
        setMintMessage('⏳ Sending transaction...');
        const result = await mint(config);
        if (result) {
            setMintMessage(`✓ Transaction submitted! Check on Arbiscan`);
        } else {
            setMintMessage(`❌ Mint failed. Check console.`);
        }
    };

    const handleRender = async () => {
        setMintMessage('');
        await render(config);
    };
    // --- End Logic ---

    return (
        <div className="min-h-screen bg-[#050605] text-gray-200 flex flex-col font-sans selection:bg-ray-mid selection:text-black">
            {/* Background Texture (Grid) */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Header */}
            <header className="h-16 border-b border-white/5 bg-[#0f120e]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
                <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="text-ray-light p-1.5 bg-ray-light/10 rounded-lg">
                        <RaccoonLogo size="sm" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-white tracking-tight leading-tight">RayStylus Studio</h1>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">On-Chain Renderer</p>
                    </div>
                </a>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1.5 rounded-full bg-black/40 border border-white/5 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${chainId === 421614 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                        <span className="text-xs font-mono text-gray-400">
                            {chainId === 421614 ? 'Arbitrum Sepolia' : 'Wrong Network'}
                        </span>
                    </div>
                    <ConnectButtonWrapper />
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden relative z-10">
                {/* Sidebar Controls */}
                <aside className="w-80 bg-[#0a0c0a]/95 border-r border-white/5 flex flex-col overflow-y-auto backdrop-blur-sm custom-scrollbar">
                    <div className="p-6 space-y-8">
                        
                        {/* Section: Settings */}
                        <div>
                            <Label icon={Settings}>Global Settings</Label>
                            <div className="relative group">
                                <select disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-400 appearance-none cursor-not-allowed">
                                    <option>32x32 (On-Chain Native)</option>
                                </select>
                                <div className="absolute right-3 top-3 text-gray-600">
                                    <Layers size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Colors */}
                        <div>
                            <Label icon={Palette}>Palette Configuration</Label>
                            <div className="space-y-3">
                                {[
                                    { label: 'Sphere Surface', key: 'sphereColor' },
                                    { label: 'Sky Gradient (Top)', key: 'bgColor1' },
                                    { label: 'Ground Gradient (Bot)', key: 'bgColor2' }
                                ].map((item) => (
                                    <div key={item.key} className="bg-white/5 p-2 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-8 h-8 flex-shrink-0">
                                                <input 
                                                    type="color" 
                                                    value={config[item.key as keyof typeof config] as string}
                                                    onChange={(e) => setConfig({ ...config, [item.key]: e.target.value })} 
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                />
                                                <div 
                                                    className="w-full h-full rounded border border-white/20 shadow-sm"
                                                    style={{ backgroundColor: config[item.key as keyof typeof config] as string }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] uppercase text-gray-500 font-bold mb-0.5">{item.label}</p>
                                                <input 
                                                    type="text" 
                                                    value={config[item.key as keyof typeof config] as string}
                                                    onChange={(e) => setConfig({ ...config, [item.key]: e.target.value })}
                                                    className="w-full bg-transparent text-xs font-mono text-gray-300 outline-none border-b border-transparent focus:border-ray-mid transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section: Camera */}
                        <div>
                            <Label icon={Camera}>Camera Position</Label>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-5">
                                <RangeSlider label="Offset X" min="-50" max="50" value={config.cameraX} onChange={(e: any) => setConfig({...config, cameraX: Number(e.target.value)})} />
                                <RangeSlider label="Offset Y" min="-50" max="50" value={config.cameraY} onChange={(e: any) => setConfig({...config, cameraY: Number(e.target.value)})} />
                                <RangeSlider label="Offset Z" min="-50" max="50" value={config.cameraZ} onChange={(e: any) => setConfig({...config, cameraZ: Number(e.target.value)})} />
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="mt-auto p-6 bg-gradient-to-t from-black to-transparent space-y-3 border-t border-white/5">
                        
                        {/* Terminal / Status Box */}
                        <div className="bg-black/80 rounded-lg border border-white/10 p-3 font-mono text-[10px] leading-relaxed mb-4 shadow-inner">
                            <div className="flex items-center gap-2 text-gray-500 border-b border-white/5 pb-2 mb-2">
                                <Terminal size={10} />
                                <span className="uppercase tracking-widest">System Output</span>
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Stylus VM</span>
                                    <span className={isLoading ? "text-yellow-400 animate-pulse" : error ? "text-red-400" : "text-green-400"}>
                                        {isLoading ? "COMPUTING..." : error ? "ERROR" : "READY"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Gas Used</span>
                                    <span className="text-ray-light">{gasUsed || '0'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Exec Time</span>
                                    <span className="text-white">{execTime || '0ms'}</span>
                                </div>
                            </div>

                            {(mintMessage || error) && (
                                <div className={`mt-3 p-2 rounded border-l-2 ${error ? 'bg-red-500/10 border-red-500 text-red-200' : 'bg-blue-500/10 border-blue-500 text-blue-200'}`}>
                                    {mintMessage || error}
                                    {txHash && (
                                        <a href={`https://sepolia.arbiscan.io/address/${txHash}`} target="_blank" rel="noopener noreferrer" className="block mt-1 underline decoration-dotted hover:text-white">
                                            View Your Transaction &rarr;
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={handleRender}
                                disabled={isLoading}
                                className={`col-span-1 py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 border ${isLoading
                                    ? 'bg-gray-800 border-transparent text-gray-500 cursor-not-allowed'
                                    : 'bg-ray-mid/10 border-ray-mid/50 text-ray-light hover:bg-ray-mid hover:text-black hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]'
                                    }`}
                            >
                                {isLoading ? <div className="w-3 h-3 border-2 border-t-transparent border-current rounded-full animate-spin"/> : <Zap size={14} />}
                                Render
                            </button>
                        </div>

                        <button
                            onClick={handleMint}
                            disabled={isMinting || !data || !isConnected}
                            className={`w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${
                                isMinting || !data || !isConnected
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#628141] to-[#3d4a24] text-white hover:brightness-110 shadow-[#628141]/20'
                            }`}
                        >
                            {isMinting ? 'Signing...' : !isConnected ? 'Connect Wallet' : <><Gift size={14} /> Mint NFT</>}
                        </button>
                    </div>
                </aside>

                {/* Main Canvas View */}
                <div className="flex-1 relative flex flex-col items-center justify-center p-12 overflow-hidden">
                    {/* Ambient Glows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ray-mid/5 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <div className="relative group z-20">
                        {/* Canvas Frame */}
                        <div className="relative p-1 bg-gradient-to-b from-gray-700 to-gray-900 rounded-sm shadow-2xl">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-ray-light/50 to-transparent"></div>
                            
                            <canvas
                                ref={canvasRef}
                                width={512}
                                height={512}
                                className="block bg-[#050605] image-pixelated w-[512px] h-[512px] shadow-inner"
                            />

                            {/* Overlay if empty */}
                            {!data && !isLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                    <div className="bg-[#151a14]/90 p-8 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl text-center max-w-sm transform transition-all hover:scale-105 duration-500">
                                        <div className="w-16 h-16 bg-gradient-to-br from-ray-mid/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-4 border border-ray-mid/20">
                                            <Cpu size={32} className="text-ray-light" />
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-2">Awaiting Instructions</h3>
                                        <p className="text-gray-400 text-xs leading-relaxed">
                                            Configure scene parameters in the sidebar and initiate the <span className="text-ray-light font-mono">Render Sequence</span> to compute pixels via Arbitrum Stylus WASM.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Loading Overlay */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                                    <div className="text-ray-light font-mono text-xs animate-pulse tracking-widest">
                                        COMPUTING PIXELS...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Decorative HUD Elements around canvas */}
                        <div className="absolute -left-8 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                        <div className="absolute -right-8 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                        <div className="absolute -bottom-8 left-0 w-full text-center">
                           <span className="text-[10px] text-gray-600 font-mono tracking-[0.5em] uppercase">Resolution: 32x32px // Scale: 16x</span>
                        </div>
                    </div>

                    {/* Marquee Section */}
                    <div className="mt-8 w-full max-w-4xl">
                        <Marquee>
                            The 3D graphics you create are rendered on the blockchain, not on your PC. 
                            It executes thousands of complex vector mathematical operations 
                            <span className="text-ray-light font-semibold"> (Dot Product</span>, 
                            <span className="text-ray-light font-semibold"> Normalization</span>, 
                            <span className="text-ray-light font-semibold"> Quadratic Formula)</span> 
                            for every pixel in a single transaction. •
                        </Marquee>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 max-w-2xl text-center">
                         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                            <Activity size={14} className="text-ray-mid" />
                            <p className="text-xs text-gray-400">
                                Powered by <span className="text-gray-200 font-semibold">Rust</span> & <span className="text-gray-200 font-semibold">WebAssembly</span> on Arbitrum Stylus Contract
                            </p>
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
}