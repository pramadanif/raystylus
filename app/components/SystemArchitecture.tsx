'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Box, Cpu, Database, Globe, Layers, Monitor, Zap, Gift } from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const architectureData = [
        {
            items: [
                { title: 'Configuration UI', description: 'Resolution, Camera Offset, Colors' },
                { title: 'Wagmi + Viem', description: 'Web3 Contract Interaction' },
                { title: 'Canvas Engine', description: 'Hex Decoding & Rendering' },
                { title: 'AI Integration', description: 'Natural language to config, powered by OpenRouter' }
            ],
            delay: 0.1
        }
    ];

    const featureItems = [
        {
            icon: Layers,
            title: 'Integer Math',
            description: 'Custom fixed-point arithmetic (Scale 1024) ensures deterministic rendering across all nodes.',
            delay: 0.2
        },
        {
            icon: Cpu,
            title: 'Ray Tracing',
            description: 'Full ray-sphere intersection with diffuse lighting and shadow calculations on-chain.',
            delay: 0.35
        },
        {
            icon: Gift,
            title: 'NFT Minting',
            description: 'Mint unique NFTs with rendering parameters stored permanently on-chain (21 bytes).',
            delay: 0.5
        },
        {
            icon: Zap,
            title: 'Ultra-Efficient',
            description: 'Mint: 5K gas | Render: 120K gas | Traditional EVM: impossible or $5000+.',
            delay: 0.65
        }
    ];

    return (
        <section 
            ref={sectionRef}
            id="architecture" 
            className="py-20 bg-[#0f120e] relative overflow-hidden"
        >
            {/* Background Glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-ray-mid/5 blur-[120px] pointer-events-none transition-opacity duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}></div>

            <style>{`
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes flowDown {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(10px);
                    }
                }

                @keyframes connectionPulse {
                    0%, 100% {
                        opacity: 0.5;
                        stroke-dashoffset: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                }

                .animate-slideInLeft {
                    animation: slideInLeft 0.8s ease-out forwards;
                }

                .animate-slideInRight {
                    animation: slideInRight 0.8s ease-out forwards;
                }

                .animate-slideInUp {
                    animation: slideInUp 0.6s ease-out forwards;
                }

                .animate-fadeInScale {
                    animation: fadeInScale 0.7s ease-out forwards;
                }

                .animate-flowDown {
                    animation: flowDown 2s ease-in-out infinite;
                }

                .pulse-glow {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${
                    isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-10'
                }`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-ray-cream mb-4">System Architecture</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A complete technical breakdown of how RayStylus executes ray tracing computations on-chain using Arbitrum Stylus.
                    </p>
                </div>

                {/* Visual Architecture Diagram */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    
                    {/* Client Layer */}
                    <div 
                        className={`bg-[#151a14]/80 backdrop-blur border border-gray-800 rounded-xl p-6 flex flex-col relative group hover:border-ray-mid/50 transition-all duration-300 ${
                            isVisible ? 'animate-slideInLeft' : 'opacity-0'
                        }`}
                        style={{
                            animationDelay: isVisible ? '0.15s' : '0s'
                        }}
                    >
                        <div className="absolute -top-3 left-6 bg-ray-dark px-2 text-xs font-mono text-ray-light border border-ray-mid/30 rounded">CLIENT LAYER</div>
                        <div className="flex items-center mb-6">
                            <Monitor className="text-ray-cream mr-3 group-hover:scale-110 transition-transform" size={24} />
                            <h3 className="text-lg font-bold text-white">RayStylus Studio</h3>
                        </div>
                        
                        <div className="space-y-3 flex-1">
                            {[
                                { title: 'Configuration UI', desc: 'Resolution, Camera Offset, Colors' },
                                { title: 'Wagmi + Viem', desc: 'Web3 Contract Interaction' },
                                { title: 'Canvas Engine', desc: 'Hex Decoding & Rendering' },
                                { title: 'AI Integration', desc: 'AI-powered config & chat' }
                            ].map((item, idx) => (
                                <div 
                                    key={idx}
                                    className={`bg-black/40 p-3 rounded border border-gray-800 text-sm text-gray-300 transition-all duration-500 hover:border-ray-mid/50 hover:bg-black/60 group/item ${
                                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                                    }`}
                                    style={{
                                        transitionDelay: isVisible ? `${0.25 + idx * 0.1}s` : '0s'
                                    }}
                                >
                                    <div className="font-bold text-ray-light mb-1 group-hover/item:text-ray-cream transition-colors">{item.title}</div>
                                    {item.desc}
                                </div>
                            ))}
                        </div>

                        <div className={`mt-6 flex justify-center transition-all duration-700 ${
                            isVisible ? 'opacity-100' : 'opacity-0'
                        }`} style={{
                            transitionDelay: isVisible ? '0.55s' : '0s'
                        }}>
                            <ArrowDown className="text-gray-600 animate-flowDown" />
                        </div>
                    </div>

                    {/* Network Layer */}
                    <div className={`flex flex-col justify-center items-center space-y-4 ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                    } transition-opacity duration-1000`} style={{
                        transitionDelay: isVisible ? '0.3s' : '0s'
                    }}>
                        {/* RPC Endpoint */}
                        <div 
                            className={`w-full bg-[#151a14]/80 border border-gray-800 rounded-xl p-4 text-center group hover:border-blue-500/50 transition-all duration-300 ${
                                isVisible ? 'animate-fadeInScale' : 'opacity-0'
                            }`}
                            style={{
                                transitionDelay: isVisible ? '0.35s' : '0s'
                            }}
                        >
                            <Globe className="mx-auto text-blue-400 mb-2 group-hover:scale-110 group-hover:rotate-12 transition-transform" size={24} />
                            <div className="text-sm font-bold text-white">RPC Endpoint</div>
                            <div className="text-xs text-gray-500 font-mono">Arbitrum Sepolia</div>
                        </div>
                        
                        {/* Connection Line */}
                        <div className={`h-12 w-0.5 bg-gradient-to-b from-gray-800 to-ray-mid transition-opacity duration-1000 ${
                            isVisible ? 'opacity-100' : 'opacity-0'
                        }`} style={{
                            transitionDelay: isVisible ? '0.45s' : '0s'
                        }}></div>
                        
                        {/* Stylus VM */}
                        <div 
                            className={`w-full bg-[#151a14]/80 border border-gray-800 rounded-xl p-4 text-center group hover:border-ray-mid/50 transition-all duration-300 ${
                                isVisible ? 'animate-fadeInScale' : 'opacity-0'
                            }`}
                            style={{
                                transitionDelay: isVisible ? '0.55s' : '0s'
                            }}
                        >
                            <Zap className="mx-auto text-ray-light mb-2 group-hover:scale-110 group-hover:animate-pulse transition-transform" size={24} />
                            <div className="text-sm font-bold text-white">Stylus VM</div>
                            <div className="text-xs text-gray-500 font-mono">WASM Execution</div>
                        </div>
                    </div>

                    {/* Blockchain Layer */}
                    <div 
                        className={`bg-[#151a14]/80 backdrop-blur border border-gray-800 rounded-xl p-6 flex flex-col relative group hover:border-ray-mid/50 transition-all duration-300 ${
                            isVisible ? 'animate-slideInRight' : 'opacity-0'
                        }`}
                        style={{
                            animationDelay: isVisible ? '0.15s' : '0s'
                        }}
                    >
                        <div className="absolute -top-3 left-6 bg-ray-dark px-2 text-xs font-mono text-ray-light border border-ray-mid/30 rounded">CONTRACT LAYER</div>
                        <div className="flex items-center mb-6">
                            <Cpu className="text-ray-cream mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform" size={24} />
                            <h3 className="text-lg font-bold text-white">Rust Contract</h3>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div 
                                className={`p-3 rounded bg-ray-mid/10 border border-ray-mid/20 transition-all duration-500 hover:bg-ray-mid/20 ${
                                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                }`}
                                style={{
                                    transitionDelay: isVisible ? '0.35s' : '0s'
                                }}
                            >
                                <div className="font-mono text-xs text-ray-light mb-1 group-hover:text-ray-cream transition-colors">fn mint() / fn render_token()</div>
                                <div className="text-gray-300 text-xs">Two-phase: Store params, render on-demand</div>
                            </div>

                            <div className="pl-4 border-l-2 border-ray-mid/40 space-y-2">
                                {[
                                    { num: '1', text: 'Mint:', desc: 'Pack 21 bytes, store NFT' },
                                    { num: '2', text: 'Setup:', desc: 'Unpack data, init scene' },
                                    { num: '3', text: 'Loop:', desc: '32x32 ray generation' },
                                    { num: '4', text: 'Math:', desc: 'Fixed-point (scale 1024)' },
                                    { num: '5', text: 'Output:', desc: 'BMP + RGB bytes' }
                                ].map((step, idx) => (
                                    <div 
                                        key={idx}
                                        className={`text-gray-400 text-xs transition-all duration-500 hover:text-gray-300 hover:translate-x-2 ${
                                            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                                        }`}
                                        style={{
                                            transitionDelay: isVisible ? `${0.4 + idx * 0.08}s` : '0s'
                                        }}
                                    >
                                        <span className="text-ray-light font-bold">{step.num}. {step.text}</span> {step.desc}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    {featureItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <div 
                                key={index}
                                className={`bg-[#151a14] border border-gray-800 rounded-lg p-6 hover:-translate-y-1 transition-all duration-300 group hover:border-ray-mid/50 hover:shadow-[0_0_20px_rgba(98,129,65,0.15)] ${
                                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                                style={{
                                    transitionDelay: isVisible ? `${0.6 + item.delay}s` : '0s',
                                    transitionDuration: '0.8s'
                                }}
                            >
                                <div className="w-10 h-10 bg-ray-mid/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-ray-mid/40 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(98,129,65,0.4)] transition-all duration-300">
                                    <IconComponent className="text-ray-light group-hover:text-ray-cream transition-colors" size={20} />
                                </div>
                                <h3 className="text-ray-light font-bold mb-2 group-hover:text-ray-cream transition-colors">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};