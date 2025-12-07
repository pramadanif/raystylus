import React from 'react';
import { XCircle, CheckCircle, Cpu, Layers } from './Icons';

export const ProblemSolution: React.FC = () => {
    return (
        <section id="why" className="py-24 bg-[#161a15] relative">
            <div className="absolute inset-0 bg-[radial-gradient(#2A3328_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-ray-cream mb-4">Why It Matters</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Bringing ray tracing logic into smart contracts requires a paradigm shift in architecture.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Problem Card */}
                    <div className="bg-ray-dark border border-red-900/30 rounded-2xl p-8 hover:border-red-900/50 transition-colors group">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-red-900/20 rounded-lg text-red-400 group-hover:text-red-300 transition-colors">
                                <XCircle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-red-200">The Problem</h3>
                        </div>
                        <h4 className="text-lg font-semibold text-ray-cream mb-3">
                            Why Is Heavy Computation Always Off-Chain?
                        </h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start">
                                <span className="mr-3 mt-1 block w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                                <span>
                                    <strong className="text-red-300">Expensive Costs:</strong> EVM is not designed for complex floating-point math. Simple 3D rendering can cost thousands of dollars in gas.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 mt-1 block w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                                <span>
                                    <strong className="text-red-300">Array Limitations:</strong> Large pixel array manipulation often hits block gas limits.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 mt-1 block w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                                <span>
                                    <strong className="text-red-300">Off-chain Reliance:</strong> Most NFTs only store URLs to IPFS/S3, not the actual image data.
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Solution Card */}
                    <div className="bg-ray-dark border border-ray-light/30 rounded-2xl p-8 hover:border-ray-light/60 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ray-light/5 rounded-bl-full -mr-8 -mt-8"></div>

                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-ray-mid/20 rounded-lg text-ray-light group-hover:text-ray-cream transition-colors">
                                <CheckCircle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-ray-light">The Solution</h3>
                        </div>
                        <h4 className="text-lg font-semibold text-ray-cream mb-3">
                            StylusCanvas: Native Rust RayTracer
                        </h4>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start">
                                <Cpu className="mr-3 mt-1 text-ray-mid flex-shrink-0" size={18} />
                                <span>
                                    <strong className="text-ray-light">Stylus Efficiency:</strong> We move vector, shading, and lighting logic to Rust Smart Contracts compiled to WASM.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <Layers className="mr-3 mt-1 text-ray-mid flex-shrink-0" size={18} />
                                <span>
                                    <strong className="text-ray-light">10-100x Cheaper:</strong> Instant computation with a fraction of the cost of traditional EVM.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="mr-3 mt-1 text-ray-mid flex-shrink-0" size={18} />
                                <span>
                                    <strong className="text-ray-light">True On-Chain:</strong> Images are generated deterministically by contract code, forever on the blockchain.
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
};
