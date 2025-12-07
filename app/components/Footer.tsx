import React from 'react';
import { Github, Box, ArrowRight } from './Icons';
import { RaccoonLogo } from './Logo';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-[#121611] border-t border-ray-mid/20 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Architecture Diagram (Simplified) */}
                <div className="mb-16">
                    <h3 className="text-ray-cream font-bold mb-8 text-center uppercase tracking-widest text-sm">System Architecture</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-mono text-gray-400">
                        <div className="p-4 border border-gray-700 rounded bg-black">Frontend (React)</div>
                        <ArrowRight className="rotate-90 md:rotate-0 text-ray-mid" />
                        <div className="p-4 border border-gray-700 rounded bg-black">Viem / Wagmi</div>
                        <ArrowRight className="rotate-90 md:rotate-0 text-ray-mid" />
                        <div className="p-4 border border-ray-light rounded bg-ray-mid/10 text-ray-light shadow-[0_0_15px_rgba(139,174,102,0.2)]">
                            Arbitrum Stylus (Rust WASM)
                        </div>
                        <ArrowRight className="rotate-90 md:rotate-0 text-ray-mid" />
                        <div className="p-4 border border-gray-700 rounded bg-black">Canvas Output</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-800 pt-8">
                    <div className="flex items-center space-x-3">
                        <div className="text-ray-light">
                            <RaccoonLogo size="md" />
                        </div>
                        <span className="text-lg font-bold text-ray-cream">RAYSTYLUS</span>
                    </div>

                    <div className="text-center md:text-left">
                        <p className="text-gray-500 text-sm">
                            Winning submission for Arbitrum Stylus Hackathon.
                            <br />
                            Powering the next generation of On-Chain Graphics.
                        </p>
                    </div>

                    <div className="flex justify-center md:justify-end space-x-6">
                        <a href="#" className="text-gray-400 hover:text-ray-light transition-colors">
                            <Github />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-ray-light transition-colors">
                            Documentation
                        </a>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-600">
                    &copy; 2024 RayStylus Project. Built with Rust &amp; React.
                </div>
            </div>
        </footer>
    );
};
