'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

export const Benchmark: React.FC = () => {
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

    const benchmarkData = [
        {
            metric: 'Rendering Cost (32x32)',
            stylus: { value: '$0.001 - $0.005', label: 'Ultra Cheap' },
            evm: { value: 'Est. $5,000+', label: 'Gas Limit Exceeded', isNegative: true },
            improvement: '1,000,000x',
            delay: 0.2
        },
        {
            metric: 'Computation Time',
            stylus: { value: '~120ms', label: 'Native Code Speed' },
            evm: { value: 'Timeout / Fail', label: 'Impossible', isNegative: true },
            improvement: '∞',
            delay: 0.35
        },
        {
            metric: 'Math Precision',
            stylus: { value: 'Fixed Point (Scale 1024)', label: 'Deterministic' },
            evm: { value: 'Workarounds', label: 'Complex', isNegative: true },
            improvement: 'Superior',
            delay: 0.5
        }
    ];

    return (
        <section 
            ref={sectionRef}
            id="benchmark" 
            className="py-20 bg-[#1B211A] relative overflow-hidden"
        >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 right-0 w-96 h-96 bg-ray-mid/10 rounded-full blur-[100px] transition-opacity duration-1000 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}></div>
            </div>

            <style>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes countUp {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes rowHighlight {
                    0%, 100% {
                        box-shadow: inset 0 0 0 rgba(98, 129, 65, 0);
                    }
                    50% {
                        box-shadow: inset 0 0 20px rgba(98, 129, 65, 0.1);
                    }
                }

                .animate-slideInUp {
                    animation: slideInUp 0.8s ease-out forwards;
                }

                .animate-slideInLeft {
                    animation: slideInLeft 0.8s ease-out forwards;
                }

                .animate-slideInRight {
                    animation: slideInRight 0.8s ease-out forwards;
                }

                .animate-countUp {
                    animation: countUp 0.7s ease-out forwards;
                }

                .animate-rowHighlight {
                    animation: rowHighlight 2s ease-in-out infinite;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${
                    isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-10'
                }`}>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <TrendingUp className="text-ray-mid w-8 h-8" />
                        <span className="text-sm font-mono text-ray-light bg-ray-mid/20 px-3 py-1 rounded-full border border-ray-mid/40">
                            PERFORMANCE METRICS
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-ray-cream mb-4">Performance Benchmark</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
                        Quantitative proof why Stylus is the future of on-chain computation.
                    </p>
                </div>

                {/* Comparison Cards View - Mobile/Tablet Friendly */}
                <div className="block lg:hidden space-y-6 mb-12">
                    {benchmarkData.map((row, idx) => (
                        <div
                            key={idx}
                            className={`bg-[#232922]/50 border border-ray-mid/20 rounded-xl p-6 backdrop-blur transition-all duration-1000 hover:border-ray-mid/50 hover:shadow-[0_0_20px_rgba(98,129,65,0.15)] ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                            style={{
                                transitionDelay: isVisible ? `${0.15 + row.delay}s` : '0s'
                            }}
                        >
                            <h3 className="text-ray-light font-bold text-lg mb-6">{row.metric}</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {/* Stylus */}
                                <div className={`bg-ray-mid/10 border border-ray-mid/30 rounded-lg p-4 transition-all duration-700 ${
                                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                }`} style={{
                                    transitionDelay: isVisible ? `${0.25 + row.delay}s` : '0s'
                                }}>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Stylus</p>
                                    <p className="text-ray-light font-bold text-sm mb-1">{row.stylus.value}</p>
                                    <p className="text-xs text-ray-light/60">{row.stylus.label}</p>
                                </div>

                                {/* EVM */}
                                <div className={`bg-red-900/10 border border-red-900/30 rounded-lg p-4 transition-all duration-700 ${
                                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                }`} style={{
                                    transitionDelay: isVisible ? `${0.3 + row.delay}s` : '0s'
                                }}>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Traditional EVM</p>
                                    <p className={`font-bold text-sm mb-1 ${row.evm.isNegative ? 'text-red-400 line-through' : 'text-gray-300'}`}>
                                        {row.evm.value}
                                    </p>
                                    <p className="text-xs text-red-400/60">{row.evm.label}</p>
                                </div>
                            </div>

                            {/* Improvement Badge */}
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="inline-flex items-center gap-2 bg-ray-mid/20 px-3 py-1.5 rounded-full border border-ray-mid/40">
                                    <ArrowRight className="w-4 h-4 text-ray-mid" />
                                    <span className="text-xs font-bold text-ray-light">{row.improvement} Better</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className={`hidden lg:block overflow-hidden rounded-xl border border-ray-mid/30 shadow-[0_0_40px_rgba(98,129,65,0.1)] transition-all duration-1000 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`} style={{
                    transitionDelay: isVisible ? '0.2s' : '0s'
                }}>
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gradient-to-r from-[#232922] to-[#1f251d]">
                            <tr>
                                <th scope="col" className="px-8 py-6 text-left text-sm font-bold text-gray-400 uppercase tracking-wider">
                                    Metric
                                </th>
                                <th scope="col" className="px-8 py-6 text-left text-sm font-bold text-ray-light uppercase tracking-wider bg-ray-mid/15 border-l border-r border-ray-mid/30">
                                    Stylus (Rust)
                                </th>
                                <th scope="col" className="px-8 py-6 text-left text-sm font-bold text-red-400 uppercase tracking-wider">
                                    Traditional EVM
                                </th>
                                <th scope="col" className="px-8 py-6 text-left text-sm font-bold text-ray-light uppercase tracking-wider bg-ray-mid/10">
                                    Improvement
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#1B211A] divide-y divide-gray-800">
                            {benchmarkData.map((row, idx) => (
                                <tr 
                                    key={idx}
                                    className={`hover:bg-white/5 transition-all duration-300 group ${
                                        isVisible ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    style={{
                                        transitionDelay: isVisible ? `${0.3 + row.delay}s` : '0s'
                                    }}
                                >
                                    {/* Metric */}
                                    <td className="px-8 py-7 whitespace-nowrap text-sm font-medium text-gray-300 group-hover:text-ray-light transition-colors">
                                        {row.metric}
                                    </td>

                                    {/* Stylus Value */}
                                    <td className="px-8 py-7 whitespace-nowrap bg-ray-mid/5 border-l border-r border-ray-mid/20 group-hover:bg-ray-mid/10 transition-colors">
                                        <div className={`transition-all duration-700 ${
                                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                        }`} style={{
                                            transitionDelay: isVisible ? `${0.4 + row.delay}s` : '0s'
                                        }}>
                                            <span className="px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-lg bg-ray-mid/20 text-ray-light border border-ray-mid/50 shadow-[0_0_15px_rgba(98,129,65,0.15)] group-hover:shadow-[0_0_25px_rgba(98,129,65,0.3)] transition-shadow">
                                                {row.stylus.value}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-2">{row.stylus.label}</p>
                                        </div>
                                    </td>

                                    {/* EVM Value */}
                                    <td className="px-8 py-7 whitespace-nowrap">
                                        <div className={`transition-all duration-700 ${
                                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                        }`} style={{
                                            transitionDelay: isVisible ? `${0.45 + row.delay}s` : '0s'
                                        }}>
                                            <span className={`text-sm font-bold ${row.evm.isNegative ? 'text-red-400 line-through' : 'text-gray-400'}`}>
                                                {row.evm.value}
                                            </span>
                                            <p className="text-xs text-red-400/70 mt-2">{row.evm.label}</p>
                                        </div>
                                    </td>

                                    {/* Improvement */}
                                    <td className="px-8 py-7 whitespace-nowrap bg-ray-mid/10 group-hover:bg-ray-mid/20 transition-colors">
                                        <div className={`flex items-center gap-2 transition-all duration-700 ${
                                            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                                        }`} style={{
                                            transitionDelay: isVisible ? `${0.5 + row.delay}s` : '0s'
                                        }}>
                                            <ArrowRight className="w-4 h-4 text-ray-mid" />
                                            <span className="text-sm font-bold text-ray-light">{row.improvement}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                
            </div>
        </section>
    );
};