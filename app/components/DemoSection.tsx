'use client';

import React from 'react';
import { Play, Zap } from './Icons';
import Link from 'next/link';

export const DemoSection: React.FC = () => {
    return (
        <section id="demo" className="py-24 bg-ray-dark relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-ray-mid/30 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ray-light/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="max-w-3xl mx-auto animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-ray-cream mb-6 tracking-tight">
                        Ready to Render On-Chain?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                        Experience the power of Arbitrum Stylus. Enter the RayStylus Studio to configure your scene, connect your wallet, and run a full Rust-based ray tracer directly on the blockchain.
                    </p>

                    <Link href="/studio">
                        <button className="group relative px-8 py-4 bg-ray-mid hover:bg-ray-light text-white font-bold text-lg rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(98,129,65,0.4)] hover:shadow-[0_0_30px_rgba(139,174,102,0.6)] flex items-center mx-auto animate-pulse-glow">
                            <Zap className="mr-2 fill-current w-5 h-5 group-hover:rotate-12 transition-transform" />
                            LAUNCH STUDIO APP
                            <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
                        </button>
                    </Link>

                    <div className="mt-12 p-6 bg-[#232922]/50 backdrop-blur border border-ray-mid/20 rounded-xl inline-block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center space-x-8 text-sm font-mono text-gray-400">
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                Arbitrum Sepolia
                            </div>
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Rust Stylus V1
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
