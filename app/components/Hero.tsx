'use client';

import React, { useEffect, useRef, useState } from 'react';

const ArrowRight = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
    <path d="M5 10h10m-4-4l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Zap = ({ size = 24, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

export const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const titles = [
    { title: "RAYSTYLUS:", subtitle: "ON-CHAIN GRAPHICS" },
    { title: "RUST + WASM", subtitle: "COMPUTATION" },
    { title: "NEXT GEN", subtitle: "BLOCKCHAIN TECH" }
  ];

  const subtitles = [
    "Rendering pixels via Rust Smart Contracts...",
    "Experience on-chain ray tracing...",
    "High-performance graphics on blockchain..."
  ];

  const [key, setKey] = useState(0);
  const [subKey, setSubKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animasi bergantian title dan subtitle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % titles.length;
        setKey((k) => k + 1);
        setSubKey((k) => k + 1);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Canvas animation untuk sphere
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

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#1B211A]">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(139, 174, 102, 0.4), 0 0 20px rgba(139, 174, 102, 0.2);
          }
          50% {
            text-shadow: 0 0 20px rgba(139, 174, 102, 0.8), 0 0 40px rgba(139, 174, 102, 0.4);
          }
        }

        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink {
          0%, 49%, 100% {
            border-right-color: #8BAE66;
          }
          50%, 99% {
            border-right-color: transparent;
          }
        }

        @keyframes floatUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            filter: drop-shadow(0 0 8px rgba(139, 174, 102, 0.3));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 20px rgba(139, 174, 102, 0.6));
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .typewriter {
          display: inline-block;
          border-right: 3px solid #8BAE66;
          animation: typewriter 3s steps(60, end) forwards, blink 0.7s step-end infinite;
          white-space: nowrap;
          overflow: hidden;
          font-family: 'Courier New', monospace;
        }

        .float-animation {
          animation: floatUp 0.6s ease-out forwards;
        }

        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .text-transition {
          animation: textSwitch 0.6s ease-in-out;
        }

        @keyframes textSwitch {
          0% {
            opacity: 1;
            transform: rotateX(0deg);
          }
          50% {
            opacity: 0;
            transform: rotateX(90deg);
          }
          100% {
            opacity: 1;
            transform: rotateX(0deg);
          }
        }

        .subtitle-transition {
          animation: subtitleSwitch 0.5s ease-in-out;
        }

        @keyframes subtitleSwitch {
          0% {
            opacity: 1;
            transform: translateY(0px);
          }
          50% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }

        .shine-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(235, 213, 171, 0.2) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(139, 174, 102, 0.3);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="text-left">

            {/* Title - Bergantian */}
            <div className="mb-8">
              <h1 key={key} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#EBD5AB] leading-tight text-transition min-h-60" style={{ perspective: '1000px' }}>
                {titles[currentIndex].title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EBD5AB] to-[#8BAE66] pulse-glow">
                  {titles[currentIndex].subtitle}
                </span>
              </h1>
            </div>

            {/* Subtitle - Bergantian dengan Typewriter */}
            <div className="h-12 mb-8 font-mono text-base sm:text-lg text-yellow-600 overflow-hidden" style={{ animationDelay: '0.3s' }}>
              <div key={subKey} className="typewriter inline-block whitespace-nowrap subtitle-transition">
                &gt; {subtitles[currentIndex]}
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-400 mb-8 max-w-lg animate-fade-in-up float-animation" style={{ animationDelay: '0.4s' }}>
              Experience the first fully on-chain ray tracer built with Rust and WebAssembly. 
              High-performance graphics computation directly on the Arbitrum blockchain.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up float-animation" style={{ animationDelay: '0.5s' }}>
              <a href="/studio" className="hover-lift px-8 py-4 bg-[#8BAE66] hover:bg-[#9BC97A] text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(139,174,102,0.4)] flex items-center justify-center group shine-effect">
                LAUNCH STUDIO
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#architecture" className="hover-lift px-8 py-4 border border-gray-700 hover:border-[#8BAE66] text-gray-300 hover:text-white font-bold rounded-lg transition-all flex items-center justify-center">
                VIEW ARCHITECTURE
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative animate-fade-in-up float-animation" style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8BAE66]/20 to-transparent rounded-2xl blur-3xl opacity-40"></div>
            <div className="relative border border-[#8BAE66]/40 rounded-2xl p-1 bg-[#0F1410]/80 backdrop-blur-lg shadow-2xl hover-lift">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#8BAE66]/20 bg-gradient-to-r from-[#1B211A]/90 to-transparent rounded-t-xl">
                <span className="text-xs font-mono text-[#8BAE66] font-semibold">sphere_renderer.rs</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/60 hover:bg-red-500/60 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/60 hover:bg-yellow-500/60 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/60 hover:bg-green-500/60 transition-colors"></div>
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
          </div>

        </div>
      </div>
    </section>
  );
};