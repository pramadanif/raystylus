'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useAestheticMint, useAestheticParams } from '@/app/hooks/useAestheticMint';
import { ConnectButtonWrapper } from '@/app/components/ConnectButtonWrapper';
import { AIChat } from '@/app/components/AIChat';
import { RaccoonLogo } from '@/app/components/Logo';
import { Settings, Palette, Camera, Terminal, Gift, Zap, Eye, Layers, Activity, Cpu, Sparkles, Brain } from 'lucide-react';
import { renderSphereToCanvas } from '@/app/utils/sphereRenderer';

const Label = ({ icon: Icon, children }: { icon?: any; children: React.ReactNode }) => (
  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
    {Icon && <Icon size={14} className="text-[#4adc80]" />}
    {children}
  </label>
);

const RangeSlider = ({ label, value, min, max, onChange }: any) => (
  <div className="group">
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs font-mono text-gray-500 group-hover:text-gray-300 transition-colors">{label}</span>
      <span className="text-xs font-mono text-[#f5e6d3] bg-white/5 px-2 py-0.5 rounded">{value}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={onChange} 
      className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#4adc80] hover:accent-[#5aff90] transition-all"
    />
  </div>
);

const Marquee = ({ children }: { children: React.ReactNode }) => {
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.offsetWidth);
    }
  }, []);

  const duration = contentWidth > 0 ? contentWidth / 50 : 30;

  return (
    <div className="w-full overflow-hidden bg-white/[0.02] border border-white/5 rounded-lg">
      <style>{`
        @keyframes smoothMarquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .marquee-content {
          animation: smoothMarquee ${duration}s linear infinite;
          display: inline-block;
          white-space: nowrap;
        }
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
      `}</style>
      <div className="marquee-container py-3">
        <div ref={contentRef} className="marquee-content text-xs text-gray-300 px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function AestheticPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const minting = useAestheticMint();
  const params = useAestheticParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [displayedImage, setDisplayedImage] = useState<string | null>(null);
  const [previewColors, setPreviewColors] = useState<{sphere_r: number; sphere_g: number; sphere_b: number} | null>(null);

  // Render sphere preview when preview colors change
  useEffect(() => {
    if (previewColors && canvasRef.current) {
      renderSphereToCanvas(canvasRef.current, {
        sphereColor: {
          r: previewColors.sphere_r,
          g: previewColors.sphere_g,
          b: previewColors.sphere_b,
        },
        bgColor1: {
          r: Math.round(15 * 2.55),
          g: Math.round(18 * 2.55),
          b: Math.round(14 * 2.55),
        },
        bgColor2: {
          r: Math.round(91 * 2.55 / 10),
          g: Math.round(127 * 2.55 / 10),
          b: Math.round(213 * 2.55 / 10),
        },
        width: 512,
        height: 512,
      });
    }
  }, [previewColors]);

  // Handle preview aesthetic (VIEW function - FREE!)
  const handlePreview = async () => {
    try {
      const preview = await minting.previewAesthetic(params.config);
      if (preview) {
        setPreviewColors(preview);
      }
    } catch (err) {
      console.error('Preview error:', err);
    }
  };

  // Handle mint (STATE function - PAYS GAS)
  const handleMint = async () => {
    if (!previewColors) {
      alert('Preview colors first!');
      return;
    }

    try {
      const config = {
        ...params.config,
        bgColor1: { r: 0.1, g: 0.1, b: 0.15 },
        bgColor2: { r: 0.05, g: 0.05, b: 0.1 },
        camera: { x: 0, y: 0, z: 2.5 },
      };

      const txHash = await minting.mint(config, previewColors as any);

      if (txHash && minting.result?.imageUrl) {
        setDisplayedImage(minting.result.imageUrl);
      }
    } catch (err) {
      console.error('Mint error:', err);
    }
  };

  const handleReset = () => {
    minting.reset();
    params.reset();
    setDisplayedImage(null);
    setPreviewColors(null);
  };

  // Handle config from AI
  const handleConfigFromAI = (aiConfig: any) => {
    const newConfig = { ...params.config };
    
    if (aiConfig.warmth !== undefined) newConfig.warmth = aiConfig.warmth;
    if (aiConfig.intensity !== undefined) newConfig.intensity = aiConfig.intensity;
    if (aiConfig.depth !== undefined) newConfig.depth = aiConfig.depth;
    
    // Update all parameters
    params.updateWarmth(newConfig.warmth);
    params.updateIntensity(newConfig.intensity);
    params.updateDepth(newConfig.depth);
    
    // Auto-preview after update
    setTimeout(() => {
      minting.previewAesthetic(newConfig).then(preview => {
        if (preview) setPreviewColors(preview);
      });
    }, 300);
  };

  const isPreviewing = minting.state === 'previewing';
  const isMinting = minting.state === 'pending' || minting.state === 'confirming';
  const isMinted = minting.state === 'confirmed' && displayedImage;
  const canPreview = isConnected && !isPreviewing && !isMinting && !isMinted;
  const canMint = isConnected && previewColors && !isMinting && !isMinted;

  return (
    <div className="h-screen bg-[#050605] text-gray-200 flex flex-col font-sans selection:bg-[#4adc80] selection:text-black overflow-hidden">
      {/* Background Texture Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-[#0f120e]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-[#4adc80] p-1.5 bg-[#4adc80]/10 rounded-lg">
            <RaccoonLogo size="sm" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight leading-tight">RayStylus Aesthetic</h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">ML-Powered Minting</p>
          </div>
        </a>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 rounded-full bg-black/40 border border-white/5 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${chainId === 421614 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
            <span className="text-xs font-mono text-gray-400">
              {chainId === 421614 ? 'Arbitrum Sepolia' : 'Wrong Network'}
            </span>
          </div>
          <ConnectButtonWrapper />
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative z-10 gap-4 p-4">
        {/* Left Sidebar Controls */}
        <aside className="w-80 bg-[#0a0c0a]/95 border-l border-white/5 flex flex-col overflow-hidden backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            
            {/* Section: Settings */}
            <div>
              <Label icon={Settings}>Global Settings</Label>
              <div className="relative group">
                <select disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-400 appearance-none cursor-not-allowed">
                  <option>32x32 (On-Chain Native)</option>
                </select>
                <div className="absolute right-3 top-3 text-gray-600">
                  <Layers size={14} />
                </div>
              </div>
            </div>

            {/* Section: Aesthetic Parameters */}
            <div>
              <Label icon={Palette}>Aesthetic Parameters</Label>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-5">
                <RangeSlider 
                  label="Warmth" 
                  min="0" 
                  max="100" 
                  value={Math.round(params.config.warmth * 100)} 
                  onChange={(e: any) => params.updateWarmth(Number(e.target.value) / 100)} 
                />
                <RangeSlider 
                  label="Intensity" 
                  min="0" 
                  max="100" 
                  value={Math.round(params.config.intensity * 100)} 
                  onChange={(e: any) => params.updateIntensity(Number(e.target.value) / 100)} 
                />
                <RangeSlider 
                  label="Depth" 
                  min="0" 
                  max="100" 
                  value={Math.round(params.config.depth * 100)} 
                  onChange={(e: any) => params.updateDepth(Number(e.target.value) / 100)} 
                />
              </div>
              <p className="text-[10px] text-gray-600 mt-2">Adjust style parameters for ML inference</p>
            </div>

            {/* Section: Preview Color Result */}
            {previewColors && (
              <div>
                <Label icon={Eye}>Preview Result</Label>
                <div className="bg-white/5 rounded-xl p-4 border border-[#4adc80]/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-16 h-16 rounded-lg border border-white/10 shadow-lg"
                      style={{
                        backgroundColor: `rgb(${previewColors.sphere_r}, ${previewColors.sphere_g}, ${previewColors.sphere_b})`
                      }}
                    ></div>
                    <div className="flex-1 font-mono text-xs">
                      <p className="text-gray-400">Sphere Color</p>
                      <p className="text-[#4adc80]">RGB({previewColors.sphere_r}, {previewColors.sphere_g}, {previewColors.sphere_b})</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500">ML inference complete - ready to mint!</p>
                </div>
              </div>
            )}

            {/* Section: Camera */}
            <div>
              <Label icon={Camera}>Camera Position</Label>
              <div className="relative group">
                <select disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-400 appearance-none cursor-not-allowed">
                  <option>Fixed (x: 0, y: 0, z: 2.5)</option>
                </select>
                <div className="absolute right-3 top-3 text-gray-600">
                  <Settings size={14} />
                </div>
              </div>
              <p className="text-[10px] text-gray-600 mt-2">Camera position locked for consistency</p>
            </div>
          </div>

          {/* Action Area */}
          <div className="p-6 bg-gradient-to-t from-black to-transparent space-y-3 border-t border-white/5 flex-shrink-0">
            
            {/* Terminal / Status Box */}
            <div className="bg-black/80 rounded-lg border border-white/10 p-3 font-mono text-[10px] leading-relaxed mb-4 shadow-inner">
              <div className="flex items-center gap-2 text-gray-500 border-b border-white/5 pb-2 mb-2">
                <Terminal size={10} />
                <span className="uppercase tracking-widest">System Output</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">ML Model</span>
                  <span className={
                    minting.state === 'idle' ? "text-green-400" : 
                    minting.state === 'previewing' ? "text-yellow-400 animate-pulse" :
                    minting.state === 'pending' || minting.state === 'confirming' ? "text-yellow-400 animate-pulse" : 
                    minting.state === 'confirmed' ? "text-green-400" : "text-red-400"
                  }>
                    {minting.state === 'idle' ? 'READY' : 
                     minting.state === 'previewing' ? 'INFERENCING' :
                     minting.state === 'pending' ? 'MINTING' : 
                     minting.state === 'confirming' ? 'CONFIRMING' : 
                     minting.state === 'confirmed' ? 'COMPLETE' : 'ERROR'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Preview</span>
                  <span className={previewColors ? 'text-green-400' : 'text-gray-500'}>
                    {previewColors ? 'READY' : 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Network</span>
                  <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                    {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>
              </div>

              {minting.error && (
                <div className={`mt-3 p-2 rounded border-l-2 text-xs bg-red-500/10 border-red-500 text-red-200`}>
                  {minting.error}
                </div>
              )}
            </div>

            {/* Gas Fee Info */}
            <div className="bg-white/5 rounded-lg border border-white/10 p-3">
              <p className="text-[10px] uppercase text-gray-500 font-bold mb-2">Estimated Cost</p>
              <div className="space-y-1">
                <p className="text-xs text-gray-300">
                  <span className="text-gray-500">Preview: </span>
                  <span className="text-[#4adc80] font-mono">FREE (VIEW)</span>
                </p>
                <p className="text-xs text-gray-300">
                  <span className="text-gray-500">Mint: </span>
                  <span className="text-[#4adc80] font-mono">$2 - $5 USD</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {/* Preview Button */}
              <button
                onClick={handlePreview}
                disabled={!canPreview}
                className={`w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 border ${
                  canPreview
                    ? 'bg-[#4adc80]/10 border-[#4adc80]/50 text-[#4adc80] hover:bg-[#4adc80]/20 hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]'
                    : 'bg-gray-800 border-transparent text-gray-500 cursor-not-allowed'
                }`}
              >
                {isPreviewing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-t-transparent border-current rounded-full animate-spin" />
                    Inferencing...
                  </>
                ) : previewColors ? (
                  <>
                    <Eye size={14} />
                    Preview Ready ✓
                  </>
                ) : (
                  <>
                    <Eye size={14} />
                    Preview Colors (FREE)
                  </>
                )}
              </button>

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={!canMint}
                className={`w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 border relative overflow-hidden group ${
                  canMint
                    ? 'bg-[#4adc80]/10 border-[#4adc80]/50 text-[#4adc80] hover:bg-[#4adc80] hover:text-black hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]'
                    : 'bg-gray-800 border-transparent text-gray-500 cursor-not-allowed'
                }`}
              >
                {/* Mini Neural Network Badge */}
                {canMint && !isMinting && !isMinted && (
                  <span className="absolute top-0 right-0 inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider rounded-bl-lg">
                    <Brain size={10} />
                    ML
                  </span>
                )}
                
                {isMinting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-t-transparent border-current rounded-full animate-spin" />
                    Minting...
                  </>
                ) : isMinted ? (
                  <>
                    <Zap size={14} />
                    Minted ✓
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    Mint NFT
                  </>
                )}
              </button>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                disabled={isMinting || (!displayedImage && !previewColors)}
                className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${
                  displayedImage && !isMinting
                    ? 'bg-gradient-to-r from-[#628141] to-[#3d4a24] text-white hover:brightness-110 shadow-[#628141]/20'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                Reset & Try Again
              </button>
            </div>
          </div>
        </aside>

        {/* Main Canvas View */}
        <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4adc80]/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative group z-20">
            {/* Canvas Frame */}
            <div className="relative p-1 bg-gradient-to-b from-gray-700 to-gray-900 rounded-sm shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#4adc80]/50 to-transparent"></div>
              
              {displayedImage ? (
                <img
                  src={displayedImage}
                  alt="Generated aesthetic"
                  className="block bg-[#050605] image-pixelated w-[512px] h-[512px] shadow-inner rounded-sm"
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  width={512}
                  height={512}
                  className="block bg-[#050605] image-pixelated w-[512px] h-[512px] shadow-inner rounded-sm"
                />
              )}

              {/* Loading Overlay */}
              {(isPreviewing || isMinting) && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center rounded-sm">
                  <div className="text-[#4adc80] font-mono text-xs animate-pulse tracking-widest">
                    {isPreviewing ? 'INFERENCING ML...' : 'MINTING...'}
                  </div>
                </div>
              )}
            </div>

            {/* Decorative HUD Elements */}
            <div className="absolute -left-8 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            <div className="absolute -right-8 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            <div className="absolute -bottom-8 left-0 w-full text-center">
              <span className="text-[10px] text-gray-600 font-mono tracking-[0.5em] uppercase">Resolution: 32x32px // Scale: 16x</span>
            </div>
          </div>

          {/* Marquee Section */}
          <div className="mt-8 w-full max-w-4xl px-4">
            <Marquee>
              3→4→2 <span className="text-purple-400 font-semibold">Mini Neural Network</span> (Input: Warmth, Intensity, Depth) • 
              Fixed-Point i64 Inference on <span className="text-[#4adc80] font-semibold">Arbitrum Stylus</span> • 
              On-Chain <span className="text-blue-400 font-semibold">ML Model</span> • Fast <span className="text-yellow-400 font-semibold">GPU-Like</span> Computation •
            </Marquee>
          </div>

          {/* Footer Info */}
          <div className="mt-8 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
              <Activity size={14} className="text-[#4adc80]" />
              <p className="text-xs text-gray-400">
                <span className="text-gray-200 font-semibold">Rust ML</span> + <span className="text-purple-400 font-semibold">Neural Network</span> + <span className="text-gray-200 font-semibold">WebAssembly</span> on <span className="text-[#4adc80] font-semibold">Arbitrum Stylus</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - AI Chat Panel */}
        <div className="w-72 flex-shrink-0 h-full flex flex-col">
          <AIChat onConfigReceived={handleConfigFromAI} />
        </div>
      </main>
    </div>
  );
}