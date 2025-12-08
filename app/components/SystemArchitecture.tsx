import React from 'react';
import { ArrowDown, ArrowRight, Box, Cpu, Database, Globe, Layers, Monitor, Zap, Gift } from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
    return (
        <section id="architecture" className="py-20 bg-[#0f120e] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-ray-mid/5 blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-ray-cream mb-4">System Architecture</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A complete technical breakdown of how RayStylus executes ray tracing computations on-chain using Arbitrum Stylus.
                    </p>
                </div>

                {/* Visual Architecture Diagram */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    
                    {/* Client Layer */}
                    <div className="bg-[#151a14]/80 backdrop-blur border border-gray-800 rounded-xl p-6 flex flex-col relative group hover:border-ray-mid/50 transition-all duration-300">
                        <div className="absolute -top-3 left-6 bg-ray-dark px-2 text-xs font-mono text-ray-light border border-ray-mid/30 rounded">CLIENT LAYER</div>
                        <div className="flex items-center mb-6">
                            <Monitor className="text-ray-cream mr-3" size={24} />
                            <h3 className="text-lg font-bold text-white">RayStylus Studio</h3>
                        </div>
                        
                        <div className="space-y-3 flex-1">
                            <div className="bg-black/40 p-3 rounded border border-gray-800 text-sm text-gray-300">
                                <div className="font-bold text-ray-light mb-1">Configuration UI</div>
                                Resolution, Camera Offset, Colors
                            </div>
                            <div className="bg-black/40 p-3 rounded border border-gray-800 text-sm text-gray-300">
                                <div className="font-bold text-ray-light mb-1">Wagmi + Viem</div>
                                Web3 Contract Interaction
                            </div>
                            <div className="bg-black/40 p-3 rounded border border-gray-800 text-sm text-gray-300">
                                <div className="font-bold text-ray-light mb-1">Canvas Engine</div>
                                Hex Decoding & Rendering
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <ArrowDown className="text-gray-600 animate-bounce" />
                        </div>
                    </div>

                    {/* Network Layer */}
                    <div className="flex flex-col justify-center items-center space-y-4">
                        <div className="w-full bg-[#151a14]/80 border border-gray-800 rounded-xl p-4 text-center group hover:border-blue-500/50 transition-all">
                            <Globe className="mx-auto text-blue-400 mb-2" size={24} />
                            <div className="text-sm font-bold text-white">RPC Endpoint</div>
                            <div className="text-xs text-gray-500 font-mono">Arbitrum Sepolia</div>
                        </div>
                        
                        <div className="h-12 w-0.5 bg-gradient-to-b from-gray-800 to-ray-mid"></div>
                        
                        <div className="w-full bg-[#151a14]/80 border border-gray-800 rounded-xl p-4 text-center group hover:border-ray-mid/50 transition-all">
                            <Zap className="mx-auto text-ray-light mb-2" size={24} />
                            <div className="text-sm font-bold text-white">Stylus VM</div>
                            <div className="text-xs text-gray-500 font-mono">WASM Execution</div>
                        </div>
                    </div>

                    {/* Blockchain Layer */}
                    <div className="bg-[#151a14]/80 backdrop-blur border border-gray-800 rounded-xl p-6 flex flex-col relative group hover:border-ray-mid/50 transition-all duration-300">
                        <div className="absolute -top-3 left-6 bg-ray-dark px-2 text-xs font-mono text-ray-light border border-ray-mid/30 rounded">CONTRACT LAYER</div>
                        <div className="flex items-center mb-6">
                            <Cpu className="text-ray-cream mr-3" size={24} />
                            <h3 className="text-lg font-bold text-white">Rust Contract</h3>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="p-3 rounded bg-ray-mid/10 border border-ray-mid/20">
                                <div className="font-mono text-xs text-ray-light mb-1">fn mint() / fn render_token()</div>
                                <div className="text-gray-300 text-xs">Two-phase: Store params, render on-demand</div>
                            </div>

                            <div className="pl-4 border-l-2 border-gray-700 space-y-2">
                                <div className="text-gray-400 text-xs">
                                    <span className="text-ray-cream">1. Mint:</span> Pack 21 bytes, store NFT
                                </div>
                                <div className="text-gray-400 text-xs">
                                    <span className="text-ray-cream">2. Setup:</span> Unpack data, init scene
                                </div>
                                <div className="text-gray-400 text-xs">
                                    <span className="text-ray-cream">3. Loop:</span> 32x32 ray generation
                                </div>
                                <div className="text-gray-400 text-xs">
                                    <span className="text-ray-cream">4. Math:</span> Fixed-point (scale 1024)
                                </div>
                                <div className="text-gray-400 text-xs">
                                    <span className="text-ray-cream">5. Output:</span> BMP + RGB bytes
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    <div className="bg-[#151a14] border border-gray-800 rounded-lg p-6 hover:-translate-y-1 transition-transform duration-300 group">
                        <div className="w-10 h-10 bg-ray-mid/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-ray-mid/30 transition-colors">
                            <Layers className="text-ray-light" size={20} />
                        </div>
                        <h3 className="text-ray-light font-bold mb-2">Integer Math</h3>
                        <p className="text-gray-400 text-sm">
                            Custom fixed-point arithmetic (Scale 1024) ensures deterministic rendering across all nodes.
                        </p>
                    </div>
                    <div className="bg-[#151a14] border border-gray-800 rounded-lg p-6 hover:-translate-y-1 transition-transform duration-300 group">
                        <div className="w-10 h-10 bg-ray-mid/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-ray-mid/30 transition-colors">
                            <Cpu className="text-ray-light" size={20} />
                        </div>
                        <h3 className="text-ray-light font-bold mb-2">Ray Tracing</h3>
                        <p className="text-gray-400 text-sm">
                            Full ray-sphere intersection with diffuse lighting and shadow calculations on-chain.
                        </p>
                    </div>
                    <div className="bg-[#151a14] border border-gray-800 rounded-lg p-6 hover:-translate-y-1 transition-transform duration-300 group">
                        <div className="w-10 h-10 bg-ray-mid/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-ray-mid/30 transition-colors">
                            <Gift className="text-ray-light" size={20} />
                        </div>
                        <h3 className="text-ray-light font-bold mb-2">NFT Minting</h3>
                        <p className="text-gray-400 text-sm">
                            Mint unique NFTs with rendering parameters stored permanently on-chain (21 bytes).
                        </p>
                    </div>
                    <div className="bg-[#151a14] border border-gray-800 rounded-lg p-6 hover:-translate-y-1 transition-transform duration-300 group">
                        <div className="w-10 h-10 bg-ray-mid/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-ray-mid/30 transition-colors">
                            <Zap className="text-ray-light" size={20} />
                        </div>
                        <h3 className="text-ray-light font-bold mb-2">Ultra-Efficient</h3>
                        <p className="text-gray-400 text-sm">
                            Mint: 5K gas | Render: 120K gas | Traditional EVM: impossible or $5000+.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
