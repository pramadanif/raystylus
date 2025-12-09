'use client';

import { AIChat } from './AIChat';
import { Sparkles, Cpu, Box, Zap } from 'lucide-react';

export const AIChatLanding = () => (
  <div className="relative w-full max-w-2xl mx-auto my-16 px-4">
    
    {/* 1. Ambient Background Glow Effects */}
    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] opacity-50 pointer-events-none animate-pulse" />
    <div className="absolute top-40 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

    {/* Main Container */}
    <div className="relative z-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      
      {/* 2. Header Section */}
      <div className="text-center space-y-4">
        
        {/* Badge "New" */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase mb-2 shadow-[0_0_10px_rgba(16,185,129,0.2)] animate-in zoom-in duration-500 delay-100">
          <Zap size={10} fill="currentColor" />
          <span>Live Demo</span>
        </div>

        {/* Title with Gradient */}
        <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight animate-in slide-in-from-bottom-4 duration-700 delay-200">
          Try <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400">RayStylus AI</span>
        </h3>

        {/* Subtitle */}
        <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-300">
          Experience the future of natural language control. <br className="hidden md:block"/>
          Ask the AI to modify the scene or explain the technology.
        </p>

        {/* 3. Tech Stack Badges (Replaces the text paragraph) */}
        <div className="flex flex-wrap justify-center gap-3 mt-4 animate-in slide-in-from-bottom-4 duration-700 delay-500">
          <TechBadge icon={<Sparkles size={12} />} label="AI Integrated" delay="delay-500" />
          <TechBadge icon={<Cpu size={12} />} label="WASM Raytracing" delay="delay-600" />
          <TechBadge icon={<Box size={12} />} label="Arbitrum Stylus" delay="delay-700" />
        </div>
      </div>

      {/* 4. Chat Container with Glass Border & Shadow */}
      <div className="relative group">
        {/* Animated Border Gradient */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-emerald-500/30 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
        
        <div className="relative h-[500px] w-full rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <AIChat />
        </div>
      </div>

    </div>
  </div>
);

// Helper Component for Badges
const TechBadge = ({ icon, label, delay }: { icon: any, label: string, delay: string }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-all cursor-default group animate-in fade-in slide-in-from-bottom-2 duration-700 ${delay}`}>
    <span className="text-emerald-400 group-hover:text-emerald-300 transition-colors">{icon}</span>
    <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{label}</span>
  </div>
);