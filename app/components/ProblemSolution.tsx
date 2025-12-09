'use client';

import React, { use, useEffect, useRef, useState } from 'react';
import { XCircle, CheckCircle, Cpu, Layers } from './Icons';

export const ProblemSolution: React.FC = () => {
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

    const problemItems = [
        {
            title: 'Expensive Costs',
            description: 'EVM is not designed for complex floating-point math. Simple 3D rendering can cost thousands of dollars in gas.',
            delay: 0.2
        },
        {
            title: 'Array Limitations',
            description: 'Large pixel array manipulation often hits block gas limits.',
            delay: 0.35
        },
        {
            title: 'Off-chain Reliance',
            description: 'Most NFTs only store URLs to IPFS/S3, not the actual image data.',
            delay: 0.5
        }
    ];

    const solutionItems = [
        {
            icon: Cpu,
            title: 'Stylus Efficiency',
            description: 'We move vector, shading, and lighting logic to Rust Smart Contracts compiled to WASM.',
            delay: 0.2
        },
        {
            icon: Layers,
            title: '10-100x Cheaper',
            description: 'Instant computation with a fraction of the cost of traditional EVM.',
            delay: 0.35
        },
        {
            icon: CheckCircle,
            title: 'True On-Chain',
            description: 'Images are generated deterministically by contract code, forever on the blockchain.',
            delay: 0.5
        }
    ];

    return (
        <section 
            ref={sectionRef}
            id="why" 
            className="py-24 bg-[#161a15] relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-[radial-gradient(#2A3328_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Title Section */}
                <div className={`text-center mb-16 transition-all duration-1000 ${
                    isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-10'
                }`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-ray-cream mb-4">Why It Matters</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Bringing ray tracing logic into smart contracts requires a paradigm shift in architecture.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Problem Card */}
                    <div 
                        className={`bg-ray-dark border border-red-900/30 rounded-2xl p-8 hover:border-red-900/50 transition-all hover:-translate-y-1 group relative overflow-hidden ${
                            isVisible 
                                ? 'opacity-100 translate-x-0' 
                                : 'opacity-0 -translate-x-12'
                        }`}
                        style={{
                            transitionDuration: '1s',
                            transitionDelay: isVisible ? '0.1s' : '0s'
                        }}
                    >
                        {/* Animated background accent */}
                        <div className="absolute top-0 left-0 w-40 h-40 bg-red-900/10 rounded-br-full -ml-20 -mt-20 group-hover:bg-red-900/20 transition-colors duration-500"></div>
                        
                        <div className="flex items-center space-x-3 mb-6 relative z-10">
                            <div className={`p-3 bg-red-900/20 rounded-lg text-red-400 group-hover:text-red-300 transition-all group-hover:scale-110 group-hover:rotate-12 transform duration-300 ${
                                isVisible ? 'animate-pulse' : ''
                            }`}>
                                <XCircle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-red-200">The Problem</h3>
                        </div>

                        <h4 className="text-lg font-semibold text-ray-cream mb-3 relative z-10">
                            Why Is Heavy Computation Always Off-Chain?
                        </h4>

                        <ul className="space-y-4 text-gray-400 relative z-10">
                            {problemItems.map((item, index) => (
                                <li 
                                    key={index}
                                    className={`flex items-start group/item transition-all duration-700 ${
                                        isVisible 
                                            ? 'opacity-100 translate-y-0' 
                                            : 'opacity-0 translate-y-4'
                                    }`}
                                    style={{
                                        transitionDelay: isVisible ? `${0.15 + item.delay}s` : '0s'
                                    }}
                                >
                                    <span className={`mr-3 mt-1 block w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 ${
                                        isVisible ? 'animate-pulse' : ''
                                    }`}></span>
                                    <span>
                                        <strong className="text-red-300">{item.title}:</strong> {item.description}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Solution Card */}
                    <div 
                        className={`bg-ray-dark border border-ray-light/30 rounded-2xl p-8 hover:border-ray-light/60 transition-all hover:-translate-y-1 group relative overflow-hidden ${
                            isVisible 
                                ? 'opacity-100 translate-x-0' 
                                : 'opacity-0 translate-x-12'
                        }`}
                        style={{
                            transitionDuration: '1s',
                            transitionDelay: isVisible ? '0.3s' : '0s'
                        }}
                    >
                        {/* Animated glowing accent */}
                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-all duration-500 ${
                            isVisible 
                                ? 'bg-ray-light/10 shadow-[0_0_40px_rgba(74,222,128,0.15)]' 
                                : 'bg-ray-light/5'
                        }`}></div>

                        <div className="flex items-center space-x-3 mb-6 relative z-10">
                            <div className={`p-3 bg-ray-mid/20 rounded-lg text-ray-light group-hover:text-ray-cream transition-all group-hover:scale-110 group-hover:-rotate-12 transform duration-300 ${
                                isVisible ? 'animate-pulse' : ''
                            }`} style={{
                                animationDelay: isVisible ? '0.5s' : '0s'
                            }}>
                                <CheckCircle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-ray-light">The Solution</h3>
                        </div>

                        <h4 className="text-lg font-semibold text-ray-cream mb-3 relative z-10">
                            StylusCanvas: Native Rust RayTracer
                        </h4>

                        <ul className="space-y-4 text-gray-300 relative z-10">
                            {solutionItems.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <li 
                                        key={index}
                                        className={`flex items-start group/item transition-all duration-700 hover:translate-x-1 ${
                                            isVisible 
                                                ? 'opacity-100 translate-y-0' 
                                                : 'opacity-0 translate-y-4'
                                        }`}
                                        style={{
                                            transitionDelay: isVisible ? `${0.35 + item.delay}s` : '0s'
                                        }}
                                    >
                                        <IconComponent className="mr-3 mt-1 text-ray-mid flex-shrink-0 group-hover/item:text-ray-light transition-all group-hover/item:scale-125 duration-300" size={18} />
                                        <span>
                                            <strong className="text-ray-light">{item.title}:</strong> {item.description}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
};