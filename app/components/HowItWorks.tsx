'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Zap, Layers, Box } from 'lucide-react';

export const HowItWorks: React.FC = () => {
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
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section 
            ref={sectionRef}
            id="how-it-works" 
            className="py-24 bg-[#151a14] relative border-t border-ray-mid/10 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Title Section */}
                <div className={`text-center mb-16 transition-all duration-1000 ${
                    isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-10'
                }`}>
                    <h2 className="text-3xl md:text-5xl font-bold text-ray-cream mb-6">
                        Under the Hood: Stylus Architecture
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Traditional EVM contracts struggle with heavy math. RayStylus leverages Arbitrum Stylus to run compiled Rust code at native speeds.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Visual Diagram */}
                    <div 
                        className={`relative bg-[#1b211a] p-8 rounded-2xl border border-ray-mid/20 shadow-2xl transition-all duration-1000 ${
                            isVisible 
                                ? 'opacity-100 translate-x-0' 
                                : 'opacity-0 -translate-x-20'
                        }`}
                    >
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-ray-mid/20 rounded-full blur-[40px]"></div>

                        <div className="space-y-6 relative z-10">
                            {/* Step 1 */}
                            <div 
                                className={`flex items-center p-4 bg-black/40 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all group ${
                                    isVisible 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-8'
                                }`}
                                style={{
                                    transitionDelay: isVisible ? '0.1s' : '0s',
                                    transitionDuration: '0.6s'
                                }}
                            >
                                <div className="p-3 bg-orange-900/30 text-orange-400 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                                    <Box size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-200">Rust Logic</h4>
                                    <p className="text-sm text-gray-500">Vector math & ray tracing algorithms written in Rust.</p>
                                </div>
                            </div>

                            {/* Arrow Down */}
                            <div className="flex justify-center -my-2">
                                <span className="text-gray-600 animate-bounce">↓</span>
                            </div>

                            {/* Step 2 */}
                            <div 
                                className={`flex items-center p-4 bg-black/40 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all group ${
                                    isVisible 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-8'
                                }`}
                                style={{
                                    transitionDelay: isVisible ? '0.2s' : '0s',
                                    transitionDuration: '0.6s'
                                }}
                            >
                                <div className="p-3 bg-blue-900/30 text-blue-400 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                                    <Cpu size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-200">WASM Compilation</h4>
                                    <p className="text-sm text-gray-500">Compiled to WebAssembly for near-native execution speed.</p>
                                </div>
                            </div>

                            {/* Arrow Down */}
                            <div className="flex justify-center -my-2">
                                <span className="text-gray-600 animate-bounce" style={{ animationDelay: '0.1s' }}>↓</span>
                            </div>

                            {/* Step 3 */}
                            <div 
                                className={`flex items-center p-4 bg-black/40 rounded-xl border border-ray-mid/30 shadow-[0_0_15px_rgba(98,129,65,0.1)] hover:shadow-[0_0_25px_rgba(98,129,65,0.3)] transition-all group ${
                                    isVisible 
                                        ? 'opacity-100 translate-y-0 border-ray-mid/60 shadow-[0_0_25px_rgba(98,129,65,0.3)]' 
                                        : 'opacity-0 translate-y-8'
                                }`}
                                style={{
                                    transitionDelay: isVisible ? '0.3s' : '0s',
                                    transitionDuration: '0.6s'
                                }}
                            >
                                <div className="p-3 bg-ray-mid/20 text-ray-light rounded-lg mr-4 group-hover:scale-110 transition-transform">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-ray-cream">Arbitrum Stylus</h4>
                                    <p className="text-sm text-gray-500">Executed on-chain at 10x-100x lower gas cost than Solidity.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-12">
                        {/* Feature 1 */}
                        <div 
                            className={`flex space-x-6 group transition-all duration-1000 ${
                                isVisible 
                                    ? 'opacity-100 translate-x-0' 
                                    : 'opacity-0 translate-x-20'
                            }`}
                            style={{
                                transitionDelay: isVisible ? '0.2s' : '0s'
                            }}
                        >
                            <div className="flex-shrink-0 mt-1">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-ray-mid text-white group-hover:rotate-12 transition-transform">
                                    <Layers className="h-6 w-6" aria-hidden="true" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Why not Solidity?</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Ray tracing involves solving quadratic equations thousands of times per image.
                                    In Solidity, this would consume millions of gas and likely hit the block gas limit instantly.
                                    Stylus allows us to use standard Rust libraries and fixed-point math efficiently.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div 
                            className={`flex space-x-6 group transition-all duration-1000 ${
                                isVisible 
                                    ? 'opacity-100 translate-x-0' 
                                    : 'opacity-0 translate-x-20'
                            }`}
                            style={{
                                transitionDelay: isVisible ? '0.4s' : '0s'
                            }}
                        >
                            <div className="flex-shrink-0 mt-1">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-ray-mid text-white group-hover:rotate-12 transition-transform">
                                    <Cpu className="h-6 w-6" aria-hidden="true" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Zero-Knowledge Ready</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Because the logic is written in Rust, it can be easily adapted for ZK-proof generation in the future,
                                    allowing for verifiable compute where the rendering happens off-chain and is proved on-chain.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};