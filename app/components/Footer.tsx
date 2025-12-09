import React from 'react';
import { Github, Box, ArrowRight } from './Icons';
import { RaccoonLogo } from './Logo';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-[#121611] border-t border-ray-mid/20 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-800 pt-8">
                    <div className="flex items-center space-x-3">
                        <div className="text-ray-light">
                            <RaccoonLogo size="md" />
                        </div>
                        <span className="text-lg font-bold text-ray-cream">RAYSTYLUS</span>
                    </div>
                </div>
            
                <div className="mt-8 text-center text-xs text-gray-600">
                    &copy; 2025 RayStylus Project. Built with Rust &amp; React.
                </div>
            </div>
        </footer>
    );
};
