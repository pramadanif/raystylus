import React from 'react';
import { ArrowRight } from './Icons';

export const Benchmark: React.FC = () => {
    return (
        <section id="benchmark" className="py-20 bg-[#1B211A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-ray-cream">Performance Benchmark</h2>
                    <p className="text-gray-400 mt-4">Quantitative proof why Stylus is the future of on-chain computation.</p>
                </div>

                <div className="overflow-hidden rounded-xl border border-ray-mid/30 shadow-[0_0_40px_rgba(98,129,65,0.1)]">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-[#232922]">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-400 uppercase tracking-wider">
                                    Metric
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-ray-light uppercase tracking-wider bg-ray-mid/10">
                                    Stylus (Rust)
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-red-400 uppercase tracking-wider">
                                    Traditional EVM
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#1B211A] divide-y divide-gray-800">
                            <tr>
                                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-300">
                                    Rendering Cost (32x32)
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap bg-ray-mid/5">
                                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full bg-ray-mid/20 text-ray-light border border-ray-mid">
                                        $0.001 - $0.005
                                    </span>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                                    <span className="line-through decoration-red-500">Est. $5,000+</span>
                                    <span className="block text-xs text-red-400 mt-1">Gas Limit Exceeded</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-300">
                                    Computation Time
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap bg-ray-mid/5">
                                    <span className="text-ray-cream font-bold">~120ms (Instant)</span>
                                    <span className="block text-xs text-gray-400 mt-1">Native Code Speed</span>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                                    Timeout / Fail
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-300">
                                    Math Precision
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap bg-ray-mid/5">
                                    <span className="text-ray-light">Native Floating Point (f64)</span>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                                    Fixed Point Workarounds
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
