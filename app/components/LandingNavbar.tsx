import React from 'react';
import { Box } from './Icons';
import { RaccoonLogo } from './Logo';
import Link from 'next/link';

export const LandingNavbar: React.FC = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-ray-dark/90 backdrop-blur-md border-b border-ray-mid/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="text-ray-light hover:text-ray-light transition-colors">
                            <RaccoonLogo size="sm" />
                        </div>
                        <span className="text-xl font-bold tracking-wider text-ray-cream">RAYSTYLUS</span>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <a href="#how-it-works" className="text-ray-cream hover:text-ray-light px-3 py-2 rounded-md text-sm font-medium transition-colors">How it Works</a>
                            <a href="#problem" className="text-ray-cream hover:text-ray-light px-3 py-2 rounded-md text-sm font-medium transition-colors">Why Stylus?</a>
                            <a href="#benchmark" className="text-ray-cream hover:text-ray-light px-3 py-2 rounded-md text-sm font-medium transition-colors">Benchmarks</a>
                            <Link href="/studio" className="bg-ray-mid text-white hover:bg-ray-light px-4 py-2 rounded-md font-bold transition-all shadow-[0_0_10px_rgba(98,129,65,0.4)]">Launch App</Link>
                        </div>
                    </div>
                    {/* Mobile Menu Button - simplified */}
                    <div className="-mr-2 flex md:hidden pr-4">
                        {/* Logic omitted for brevity but keeping structure valid */}
                    </div>
                </div>
            </div>
        </nav>
    );
};
