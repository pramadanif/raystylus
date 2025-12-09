'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Zap } from './Icons';
import Link from 'next/link';

export const DemoSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
        });
    };

    return (
        <section 
            ref={sectionRef}
            id="demo" 
            className="py-24 bg-ray-dark relative overflow-hidden min-h-screen flex items-center justify-center"
            onMouseMove={handleMouseMove}
        >
            {/* Enhanced Background Elements with Dynamic Movement */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Top Left Glow */}
                <div 
                    className={`absolute top-0 left-1/4 w-96 h-96 bg-ray-mid/30 rounded-full blur-[100px] transition-all duration-500 ${
                        isVisible ? 'opacity-20' : 'opacity-0'
                    }`}
                    style={{
                        transform: isVisible ? `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)` : 'translate(0, 0)',
                    }}
                ></div>

                {/* Bottom Right Glow */}
                <div 
                    className={`absolute bottom-0 right-1/4 w-96 h-96 bg-ray-light/20 rounded-full blur-[100px] transition-all duration-500 ${
                        isVisible ? 'opacity-20' : 'opacity-0'
                    }`}
                    style={{
                        transform: isVisible ? `translate(${-mousePosition.x * 40}px, ${-mousePosition.y * 40}px)` : 'translate(0, 0)',
                    }}
                ></div>

                {/* Animated Grid Pattern */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ${isVisible ? 'opacity-30' : 'opacity-0'}`}>
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#627D41" strokeWidth="0.5" opacity="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Floating Particles */}
                {isVisible && [0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-ray-mid rounded-full"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + i * 10}%`,
                            opacity: 0.6,
                            animation: `float ${4 + i}s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`,
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                /* --- NEW ENHANCEMENTS KEYFRAMES --- */

                @keyframes textGlitch {
                    0% {
                        text-shadow: 2px 2px 0 #627D41, -2px -2px 0 #151a14;
                        opacity: 0.95;
                    }
                    5% {
                        text-shadow: -2px 0px 0 #627D41, 2px 0px 0 #151a14;
                        opacity: 0.98;
                    }
                    100% {
                        text-shadow: 0 0 0 transparent, 0 0 0 transparent;
                        opacity: 1;
                    }
                }
                
                @keyframes intenseShimmer {
                    0%, 100% {
                        box-shadow: 0 0 30px rgba(98, 129, 65, 0.6), inset 0 0 15px rgba(98, 129, 65, 0.2);
                    }
                    50% {
                        box-shadow: 0 0 50px rgba(139, 174, 102, 0.9), inset 0 0 25px rgba(139, 174, 102, 0.4);
                    }
                }

                /* --- NEW ANIMATION CLASSES --- */

                .animate-glitch-text {
                    animation: textGlitch 5s linear infinite;
                }
                .animate-glitch-text-second {
                    animation: textGlitch 5s linear infinite reverse;
                }
                .animate-intenseShimmer {
                    animation: intenseShimmer 3s ease-in-out infinite;
                }

                .animate-slideUp {
                    animation: slideUp 0.8s ease-out forwards;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.6s ease-out forwards;
                }

                .animate-orbit {
                    animation: orbitIcon 20s linear infinite;
                }
            `}</style>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
                <div className="space-y-8">
                    {/* Heading (Updated with Glitch Effect) */}
                    <div
                        className={`transition-all duration-1000 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                        style={{
                            transitionDelay: isVisible ? '0.1s' : '0s'
                        }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ray-cream mb-6 tracking-tight leading-tight animate-glitch-text">
                            Ready to Render
                            {/* Glitch text effect applied here */}
                            <span className="block text-ray-mid mt-2 animate-glitch-text-second">On-Chain?</span>
                        </h2>
                    </div>

                    {/* Description */}
                    <p 
                        className={`text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                        style={{
                            transitionDelay: isVisible ? '0.2s' : '0s'
                        }}
                    >
                        Experience the power of Arbitrum Stylus. Enter the RayStylus Studio to configure your scene in real time, connect your wallet, and run a full Rust-based ray tracer directly on the blockchain.
                    </p>

                    {/* CTA Button (Updated with Intense Shimmer) */}
                    <div
                        className={`transition-all duration-1000 ${
                            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                        }`}
                        style={{
                            transitionDelay: isVisible ? '0.3s' : '0s'
                        }}
                    >
                        <Link href="/studio">
                            <button className="group relative px-8 md:px-12 py-4 md:py-5 bg-ray-mid hover:bg-ray-light text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 flex items-center mx-auto gap-3 overflow-hidden animate-intenseShimmer">
                                {/* Background shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

                                {/* Orbiting Icon */}
                                <div className="relative w-5 h-5">
                                    <Zap className="w-5 h-5 fill-current transition-transform group-hover:scale-125" />
                                </div>

                                <span className="relative z-10">LAUNCH STUDIO</span>

                                {/* Border glow effect */}
                                <div className="absolute inset-0 rounded-xl ring-2 ring-white/0 group-hover:ring-white/40 transition-all duration-300"></div>
                            </button>
                        </Link>
                    </div>

                    {/* Status Badge (Updated with Zero-Lag Claim) */}
                    <div
                        className={`transition-all duration-1000 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                        style={{
                            transitionDelay: isVisible ? '0.4s' : '0s'
                        }}
                    >
                        <div className="p-6 bg-gradient-to-r from-ray-mid/10 via-transparent to-ray-light/10 backdrop-blur-md border border-ray-mid/30 rounded-xl inline-block hover:border-ray-mid/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(98,129,65,0.2)]">
                            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-sm font-mono text-gray-400">
                                <div className="hidden md:block w-px h-4 bg-gray-700"></div>

                                {/* Existing Badges */}
                                <div className="flex items-center group/item">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                    <span className="group-hover/item:text-gray-300 transition-colors">Arbitrum Sepolia</span>
                                </div>
                                <div className="hidden md:block w-px h-4 bg-gray-700"></div>
                                <div className="flex items-center group/item">
                                    <span className="w-2 h-2 bg-ray-mid rounded-full mr-3 animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                                    <span className="group-hover/item:text-gray-300 transition-colors">Rust Stylus V1</span>
                                </div>
                                <div className="hidden md:block w-px h-4 bg-gray-700"></div>
                                <div className="flex items-center group/item">
                                    <span className="w-2 h-2 bg-ray-light rounded-full mr-3 animate-pulse" style={{ animationDelay: '1s' }}></span>
                                    <span className="group-hover/item:text-gray-300 transition-colors">WASM Powered</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};