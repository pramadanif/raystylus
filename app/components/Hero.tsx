'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Zap } from './Icons';

export const Hero: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const render = () => {
            time += 0.02;
            const width = canvas.width;
            const height = canvas.height;

            // Clear with dark background
            ctx.fillStyle = '#1B211A';
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;
            const radius = 80;
            const pixelSize = 8; // Pixelated look

            for (let y = 0; y < height; y += pixelSize) {
                for (let x = 0; x < width; x += pixelSize) {
                    // Sphere math
                    const dx = x - cx;
                    const dy = y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < radius) {
                        // Lighting calculation
                        const z = Math.sqrt(radius * radius - dist * dist);

                        // Rotate light source
                        const lightX = Math.sin(time) * 100;
                        const lightY = Math.cos(time) * 100;
                        const lightZ = 100;

                        // Normal vector
                        const nx = dx / radius;
                        const ny = dy / radius;
                        const nz = z / radius;

                        // Light vector
                        const lx = (lightX - dx);
                        const ly = (lightY - dy);
                        const lz = (lightZ - z);
                        const len = Math.sqrt(lx * lx + ly * ly + lz * lz);

                        // Dot product for diffuse lighting
                        const dot = (nx * (lx / len) + ny * (ly / len) + nz * (lz / len));
                        const intensity = Math.max(0.1, dot);

                        // Color mapping based on palette
                        if (intensity > 0.8) ctx.fillStyle = '#EBD5AB'; // Highlight
                        else if (intensity > 0.5) ctx.fillStyle = '#8BAE66'; // Mid
                        else if (intensity > 0.2) ctx.fillStyle = '#628141'; // Shadow
                        else ctx.fillStyle = '#2A3328'; // Darkest

                        ctx.fillRect(x, y, pixelSize - 1, pixelSize - 1);
                    }
                }
            }
            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [mounted]);

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="text-left">
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-ray-mid bg-ray-mid/10 text-ray-light text-xs font-mono mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <Zap size={14} className="mr-2" />
                            POWERED BY ARBITRUM STYLUS
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ray-cream mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            RAYSTYLUS: <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ray-light to-ray-mid animate-pulse-glow">
                                ON-CHAIN GRAPHICS
                            </span>
                        </h1>
                        
                        <div className="h-8 mb-8 font-mono text-lg text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="typewriter inline-block">
                                &gt; Rendering pixels via Rust Smart Contracts...
                            </div>
                        </div>

                        <p className="text-lg text-gray-400 mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            Experience the first fully on-chain ray tracer built with Rust and WebAssembly. 
                            High-performance graphics computation directly on the Arbitrum blockchain.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            <a href="/studio" className="px-8 py-4 bg-ray-mid hover:bg-ray-light text-white font-bold rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(98,129,65,0.4)] flex items-center justify-center group">
                                LAUNCH STUDIO
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="#architecture" className="px-8 py-4 border border-gray-700 hover:border-ray-mid text-gray-300 hover:text-white font-bold rounded-lg transition-all flex items-center justify-center">
                                VIEW ARCHITECTURE
                            </a>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="relative animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-ray-mid/20 to-transparent rounded-full blur-3xl opacity-30"></div>
                        <div className="relative border border-ray-mid/30 rounded-xl p-2 bg-ray-dark/50 backdrop-blur-sm shadow-2xl">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-ray-mid/20 bg-ray-dark/80 rounded-t-lg">
                                <span className="text-xs font-mono text-ray-light">sphere_renderer.rs</span>
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
                                </div>
                            </div>
                            <canvas
                                ref={canvasRef}
                                width={400}
                                height={400}
                                className="w-full max-w-[400px] aspect-square rounded-b-lg image-pixelated cursor-crosshair"
                            />
                            <div className="absolute bottom-4 right-4 bg-ray-dark/90 px-3 py-1 rounded text-xs font-mono text-ray-light border border-ray-mid/50">
                                32x32 Upscaled
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
