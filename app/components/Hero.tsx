'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const ArrowRight = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
    <path d="M5 10h10m-4-4l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const titles = [
    { title: "RAYSTYLUS", subtitle: "ON-CHAIN ENGINE" },
    { title: "RAYTRACING", subtitle: "ON ARBITRUM STYLUS" },
    { title: "INTEGRATED", subtitle: "AI & WASM" },
];

const subtitles = [
    "Executing complex ray tracing logic on-chain.",
    "High-frequency rendering via Rust smart contracts.",
    "The world’s first gas-optimized 3D graphics engine.",
    "Connecting AI-level language with system-level computation."
];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cycle titles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [titles.length]);

  // Canvas animation
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let time = 0;

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#1B211A';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = 80;
      const pixelSize = 8;

      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius) {
            const z = Math.sqrt(radius * radius - dist * dist);

            const lightX = Math.sin(time) * 100;
            const lightY = Math.cos(time) * 100;
            const lightZ = 100;

            const nx = dx / radius;
            const ny = dy / radius;
            const nz = z / radius;

            const lx = lightX - dx;
            const ly = lightY - dy;
            const lz = lightZ - z;
            const len = Math.sqrt(lx * lx + ly * ly + lz * lz);

            const dot = nx * (lx / len) + ny * (ly / len) + nz * (lz / len);
            const intensity = Math.max(0.1, dot);

            if (intensity > 0.8) ctx.fillStyle = '#EBD5AB';
            else if (intensity > 0.5) ctx.fillStyle = '#8BAE66';
            else if (intensity > 0.2) ctx.fillStyle = '#628141';
            else ctx.fillStyle = '#2A3328';

            ctx.fillRect(x, y, pixelSize - 1, pixelSize - 1);
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  // typed as Variants to satisfy framer-motion TypeScript types
  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    // using a resolver function -- annotate as any inside transition to avoid strict mismatches
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      } as any,
    }),
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  } as Variants;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#1B211A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="text-left z-20">

            {/* Title - Animated */}
            <div className="mb-8 min-h-[180px] sm:min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col"
                >
                  <motion.h1 
                    className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#EBD5AB] leading-tight"
                  >
                    {titles[currentIndex].title.split("").map((char, i) => (
                      <motion.span key={i} custom={i} variants={letterVariants}>
                        {char}
                      </motion.span>
                    ))}
                  </motion.h1>
                  
                  <motion.div 
                    className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#EBD5AB] to-[#8BAE66]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    {titles[currentIndex].subtitle}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subtitle - Typewriter effect */}
            <div className="h-12 mb-8 font-mono text-base sm:text-lg text-yellow-600 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="whitespace-nowrap overflow-hidden border-r-2 border-[#8BAE66]"
                >
                  &gt; {subtitles[currentIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Description */}
            <motion.p 
              className="text-lg text-gray-400 mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Experience the first fully on-chain ray tracer built with Rust and WebAssembly. 
              High-performance graphics computation directly on the Arbitrum blockchain.
            </motion.p>

            {/* Blockchain Info */}
            <motion.div
              className="mb-8 p-4 bg-[#0F1410]/60 border border-[#8BAE66]/30 rounded-lg max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <p className="text-sm text-gray-300 leading-relaxed">
                The 3D graphics you create are rendered on the blockchain, not on your PC. 
                It executes thousands of complex vector mathematical operations 
                (<span className="text-[#8BAE66] font-semibold">Dot Product</span>, 
                <span className="text-[#8BAE66] font-semibold"> Normalization</span>, 
                <span className="text-[#8BAE66] font-semibold"> Quadratic Formula</span>) 
                for every pixel in a single transaction.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <motion.a 
                href="/studio" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#8BAE66] hover:bg-[#9BC97A] text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(139,174,102,0.4)] flex items-center justify-center group"
              >
                LAUNCH STUDIO
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a 
                href="#architecture" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-gray-700 hover:border-[#8BAE66] text-gray-300 hover:text-white font-bold rounded-lg transition-all flex items-center justify-center"
              >
                VIEW ARCHITECTURE
              </motion.a>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8BAE66]/20 to-transparent rounded-2xl blur-3xl opacity-40"></div>
            <div className="relative border border-[#8BAE66]/40 rounded-2xl p-1 bg-[#0F1410]/80 backdrop-blur-lg shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#8BAE66]/20 bg-gradient-to-r from-[#1B211A]/90 to-transparent rounded-t-xl">
                <span className="text-xs font-mono text-[#8BAE66] font-semibold">sphere_renderer.rs</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/60"></div>
                </div>
              </div>
              
              {/* Canvas Container */}
              <div className="flex items-center justify-center p-6 bg-[#1B211A]/50">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="w-full max-w-xs rounded-lg cursor-crosshair shadow-lg"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              
              {/* Footer */}
              <div className="px-4 py-3 border-t border-[#8BAE66]/20 bg-gradient-to-r from-[#1B211A]/90 to-transparent rounded-b-xl flex justify-end">
                <div className="bg-[#0F1410]/60 px-3 py-1.5 rounded text-xs font-mono text-[#8BAE66] border border-[#8BAE66]/40 backdrop-blur-sm">
                  32x32 Upscaled
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
