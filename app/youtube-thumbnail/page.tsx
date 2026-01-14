'use client';

import React from 'react';
import Image from 'next/image';

export default function YouTubeThumbnail() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#0f1210] p-8">
      {/* Thumbnail Container - 1280x720 (16:9) */}
      <div
        className="relative w-full max-w-6xl aspect-video bg-[#1B211A] rounded-2xl shadow-2xl overflow-hidden border border-[#628141]/30"
      >
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0">
           <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#628141] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
           <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#8BAE66] rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        {/* Content Grid */}
        <div className="relative z-10 h-full grid grid-cols-12 gap-8 p-16 items-center">
          
          {/* Left Side: Logo & Visuals (4 cols) */}
          <div className="col-span-4 flex flex-col items-center justify-center h-full relative">
             {/* Glowing Circle behind logo */}
             <div className="absolute w-[320px] h-[320px] bg-gradient-to-b from-[#EBD5AB]/20 to-transparent rounded-full blur-2xl"></div>
             
             <div className="relative transform hover:scale-105 transition-transform duration-500">
                <Image
                  src="/raystylus-logo.png"
                  alt="RayStylus Logo"
                  width={380}
                  height={380}
                  className="object-contain drop-shadow-[0_0_50px_rgba(235,213,171,0.3)]"
                  priority
                />
             </div>
          </div>

          {/* Right Side: Typography (8 cols) */}
          <div className="col-span-8 flex flex-col justify-center pl-8">
            
            {/* Top Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#628141]/20 border border-[#628141] px-4 py-1.5 rounded-full backdrop-blur-md">
                <span className="text-[#8BAE66] font-bold tracking-wider text-sm uppercase">Arbitrum Stylus</span>
              </div>
              <div className="bg-[#EBD5AB]/10 border border-[#EBD5AB]/30 px-4 py-1.5 rounded-full backdrop-blur-md">
                <span className="text-[#EBD5AB] font-bold tracking-wider text-sm uppercase">Rust + WASM</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-7xl font-black text-white leading-[0.95] tracking-tight mb-6 drop-shadow-xl">
              REAL-TIME <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8BAE66] to-[#EBD5AB]">
                ON-CHAIN
              </span> <br/>
              RAY TRACING
            </h1>

            {/* Subheadline */}
            <div className="border-l-4 border-[#628141] pl-6 py-2 bg-gradient-to-r from-[#628141]/10 to-transparent rounded-r-lg">
              <p className="text-2xl text-[#EBD5AB] font-medium leading-snug">
                Extended with Deterministic <br/>
                <span className="text-white">Neural Color Rendering</span>
              </p>
            </div>

            {/* Bottom Tech Stack Icons/Text */}
            <div className="mt-10 flex items-center gap-6 opacity-80">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8BAE66]"></div>
                  <span className="text-gray-300 font-mono text-sm">Next.js</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EBD5AB]"></div>
                  <span className="text-gray-300 font-mono text-sm">OpenAI Integration</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#628141]"></div>
                  <span className="text-gray-300 font-mono text-sm">100% On-Chain Logic</span>
               </div>
            </div>

          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 p-8">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                <path d="M64 0H0V64" stroke="#EBD5AB" strokeWidth="2"/>
            </svg>
        </div>
        <div className="absolute bottom-0 left-0 p-8 rotate-180">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                <path d="M64 0H0V64" stroke="#EBD5AB" strokeWidth="2"/>
            </svg>
        </div>

      </div>

      {/* Info text below */}
      <div className="fixed bottom-4 text-center text-gray-500 text-xs">
        1280x720 Preview Mode
      </div>
    </div>
  );
}
