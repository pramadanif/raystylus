// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useAccount } from 'wagmi';
// import { useAestheticMint, useAestheticParams, AestheticMintConfig } from '@/app/hooks/useAestheticMint';

// /**
//  * AestheticMinter Component
//  * 
//  * A complete UI for generating NFTs using aesthetic parameters
//  * with on-chain ML inference and ray tracing.
//  * 
//  * Features:
//  * - Three interactive sliders for Warmth, Intensity, Depth
//  * - Static parameter inputs for ray tracing
//  * - Real-time preview of selected colors
//  * - Transaction status tracking
//  * - Image display after successful minting
//  */
// export const AestheticMinter: React.FC = () => {
//   const { isConnected } = useAccount();
//   const {
//     config,
//     updateWarmth,
//     updateIntensity,
//     updateDepth,
//     updateBgColor1,
//     updateBgColor2,
//     updateCamera,
//     reset: resetParams,
//   } = useAestheticParams({
//     bgColor1: { r: 255, g: 255, b: 255 },
//     bgColor2: { r: 91, g: 127, b: 213 },
//   });

//   const { state, error, result, isLoading, mint, reset: resetMint } = useAestheticMint();

//   // Local UI state
//   const [showAdvanced, setShowAdvanced] = useState(false);
//   const [lastImageUrl, setLastImageUrl] = useState<string | null>(null);

//   // Update last image when result changes
//   useEffect(() => {
//     if (result?.imageUrl) {
//       setLastImageUrl(result.imageUrl);
//     }
//   }, [result]);

//   const handleMint = async () => {
//     if (!isConnected) {
//       alert('Please connect your wallet first');
//       return;
//     }

//     await mint(config);
//   };

//   const rgbToHex = (r: number, g: number, b: number): string => {
//     const toHex = (n: number) => {
//       const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
//       return hex.length === 1 ? '0' + hex : hex;
//     };
//     return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
//   };

//   const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
//     const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     return result
//       ? {
//           r: parseInt(result[1], 16),
//           g: parseInt(result[2], 16),
//           b: parseInt(result[3], 16),
//         }
//       : { r: 0, g: 0, b: 0 };
//   };

//   const handleColorChange = (
//     color: 'bgColor1' | 'bgColor2',
//     hex: string
//   ) => {
//     const rgb = hexToRgb(hex);
//     if (color === 'bgColor1') {
//       updateBgColor1(rgb);
//     } else {
//       updateBgColor2(rgb);
//     }
//   };

//   const statusMessages = {
//     idle: 'Ready to mint your unique artwork',
//     pending: 'Submitting transaction...',
//     confirming: 'Confirming on chain...',
//     confirmed: '✨ Minted successfully!',
//     failed: '❌ Minting failed',
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] rounded-lg border border-ray-mid/20 p-6 space-y-6">
//       {/* Header */}
//       <div className="space-y-2">
//         <h2 className="text-2xl font-bold text-ray-cream">🎨 Aesthetic Minter</h2>
//         <p className="text-sm text-gray-400">
//           Create unique artwork powered by on-chain ML inference and ray tracing
//         </p>
//       </div>

//       {/* Aesthetic Parameters - Sliders */}
//       <div className="space-y-4 bg-black/20 rounded-lg p-4 border border-ray-mid/10">
//         <h3 className="text-lg font-semibold text-ray-light">Aesthetic Parameters</h3>

//         {/* Warmth Slider */}
//         <div className="space-y-2">
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium text-gray-300">
//               🔥 Warmth
//             </label>
//             <span className="text-sm font-mono text-ray-mid">
//               {(config.warmth * 100).toFixed(0)}%
//             </span>
//           </div>
//           <input
//             type="range"
//             min="0"
//             max="100"
//             value={config.warmth * 100}
//             onChange={(e) => updateWarmth(parseInt(e.target.value) / 100)}
//             className="w-full h-2 bg-ray-dark rounded-lg appearance-none cursor-pointer accent-ray-mid"
//           />
//           <div
//             className="h-2 rounded-lg"
//             style={{
//               background: `linear-gradient(to right, rgb(100,100,255), rgb(255,200,100))`,
//             }}
//           />
//         </div>

//         {/* Intensity Slider */}
//         <div className="space-y-2">
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium text-gray-300">
//               ⚡ Intensity
//             </label>
//             <span className="text-sm font-mono text-ray-mid">
//               {(config.intensity * 100).toFixed(0)}%
//             </span>
//           </div>
//           <input
//             type="range"
//             min="0"
//             max="100"
//             value={config.intensity * 100}
//             onChange={(e) => updateIntensity(parseInt(e.target.value) / 100)}
//             className="w-full h-2 bg-ray-dark rounded-lg appearance-none cursor-pointer accent-ray-mid"
//           />
//           <div
//             className="h-2 rounded-lg"
//             style={{
//               background: `linear-gradient(to right, rgb(50,50,50), rgb(255,255,255))`,
//             }}
//           />
//         </div>

//         {/* Depth Slider */}
//         <div className="space-y-2">
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium text-gray-300">
//               🌌 Depth
//             </label>
//             <span className="text-sm font-mono text-ray-mid">
//               {(config.depth * 100).toFixed(0)}%
//             </span>
//           </div>
//           <input
//             type="range"
//             min="0"
//             max="100"
//             value={config.depth * 100}
//             onChange={(e) => updateDepth(parseInt(e.target.value) / 100)}
//             className="w-full h-2 bg-ray-dark rounded-lg appearance-none cursor-pointer accent-ray-mid"
//           />
//           <div
//             className="h-2 rounded-lg"
//             style={{
//               background: `linear-gradient(to right, rgb(0,0,0), rgb(100,200,255))`,
//             }}
//           />
//         </div>
//       </div>

//       {/* Static Ray Tracing Parameters */}
//       <div className="space-y-4 bg-black/20 rounded-lg p-4 border border-ray-mid/10">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold text-ray-light">Ray Tracing Config</h3>
//           <button
//             onClick={() => setShowAdvanced(!showAdvanced)}
//             className="text-xs px-3 py-1 rounded bg-ray-mid/20 hover:bg-ray-mid/40 text-ray-light transition-colors"
//           >
//             {showAdvanced ? 'Hide' : 'Show'} Advanced
//           </button>
//         </div>

//         {/* Background Colors */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-300">
//               Background Top
//             </label>
//             <input
//               type="color"
//               value={rgbToHex(
//                 config.bgColor1.r,
//                 config.bgColor1.g,
//                 config.bgColor1.b
//               )}
//               onChange={(e) => handleColorChange('bgColor1', e.target.value)}
//               className="w-full h-10 rounded cursor-pointer border border-ray-mid/20"
//             />
//             <div className="text-xs text-gray-500">
//               RGB({config.bgColor1.r}, {config.bgColor1.g}, {config.bgColor1.b})
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-300">
//               Background Bottom
//             </label>
//             <input
//               type="color"
//               value={rgbToHex(
//                 config.bgColor2.r,
//                 config.bgColor2.g,
//                 config.bgColor2.b
//               )}
//               onChange={(e) => handleColorChange('bgColor2', e.target.value)}
//               className="w-full h-10 rounded cursor-pointer border border-ray-mid/20"
//             />
//             <div className="text-xs text-gray-500">
//               RGB({config.bgColor2.r}, {config.bgColor2.g}, {config.bgColor2.b})
//             </div>
//           </div>
//         </div>

//         {/* Camera Parameters (Advanced) */}
//         {showAdvanced && (
//           <div className="mt-4 pt-4 border-t border-ray-mid/10 space-y-3">
//             <h4 className="text-sm font-semibold text-gray-400">Camera Position</h4>
//             <div className="grid grid-cols-3 gap-3">
//               {[
//                 { key: 'x', label: 'X', icon: '↔️' },
//                 { key: 'y', label: 'Y', icon: '↕️' },
//                 { key: 'z', label: 'Z', icon: '🔍' },
//               ].map(({ key, label, icon }) => (
//                 <div key={key} className="space-y-1">
//                   <label className="text-xs font-medium text-gray-400">
//                     {icon} {label}
//                   </label>
//                   <input
//                     type="number"
//                     value={config.camera[key as keyof typeof config.camera]}
//                     onChange={(e) => {
//                       const val = parseInt(e.target.value) || 0;
//                       updateCamera({ [key]: val });
//                     }}
//                     min="-2048"
//                     max="2048"
//                     className="w-full px-2 py-1 rounded bg-ray-dark/50 border border-ray-mid/20 text-sm text-ray-light focus:outline-none focus:border-ray-mid/60"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Status Display */}
//       <div
//         className={`p-4 rounded-lg border transition-all ${
//           error
//             ? 'bg-red-950/20 border-red-500/30 text-red-200'
//             : state === 'confirmed'
//               ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
//               : 'bg-ray-mid/10 border-ray-mid/30 text-ray-light'
//         }`}
//       >
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-medium">
//             {error ? '❌ ' : state === 'confirmed' ? '✓ ' : ''}
//             {error || statusMessages[state]}
//           </span>
//           {state === 'pending' || state === 'confirming' ? (
//             <div className="animate-spin">⏳</div>
//           ) : null}
//         </div>

//         {/* Error Details */}
//         {error && (
//           <p className="text-xs mt-2 opacity-80">
//             {error.length > 100 ? error.substring(0, 100) + '...' : error}
//           </p>
//         )}

//         {/* Transaction Hash */}
//         {result?.txHash && (
//           <div className="mt-2 text-xs space-y-1">
//             <p>
//               Token ID: <span className="font-mono">{result.tokenId}</span>
//             </p>
//             <p>
//               Tx Hash:{' '}
//               <a
//                 href={`https://sepolia.arbiscan.io/tx/${result.txHash}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-ray-mid hover:text-ray-light underline"
//               >
//                 View on Arbiscan
//               </a>
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Image Display */}
//       {lastImageUrl && (
//         <div className="space-y-2 bg-black/40 rounded-lg p-4 border border-ray-mid/10">
//           <p className="text-sm text-gray-400">Generated Artwork</p>
//           <div className="flex justify-center">
//             <img
//               src={lastImageUrl}
//               alt="Minted NFT"
//               className="w-64 h-64 image-rendering pixelated border-2 border-ray-mid/30 rounded"
//               style={{ imageRendering: 'pixelated' }}
//             />
//           </div>
//           <p className="text-xs text-gray-500 text-center">
//             32×32 Ray Traced Sphere with Dynamic Colors
//           </p>
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex gap-3 pt-4 border-t border-ray-mid/10">
//         <button
//           onClick={handleMint}
//           disabled={!isConnected || isLoading || state === 'pending' || state === 'confirming'}
//           className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-ray-mid to-ray-light text-black hover:shadow-lg hover:shadow-ray-mid/50 disabled:hover:shadow-none"
//         >
//           {isLoading ? '⏳ Minting...' : '🚀 Generate & Mint'}
//         </button>

//         <button
//           onClick={() => {
//             resetParams();
//             resetMint();
//             setLastImageUrl(null);
//           }}
//           className="px-4 py-3 rounded-lg font-semibold transition-all bg-ray-dark/40 hover:bg-ray-dark/60 text-ray-light border border-ray-mid/20 hover:border-ray-mid/50"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Wallet Connection Warning */}
//       {!isConnected && (
//         <div className="p-3 rounded-lg bg-yellow-950/20 border border-yellow-600/30 text-yellow-200 text-sm">
//           🔗 Please connect your wallet to mint
//         </div>
//       )}

//       {/* Info Box */}
//       <div className="text-xs text-gray-500 space-y-1 p-3 bg-black/20 rounded-lg border border-ray-mid/10">
//         <p>
//           <span className="font-semibold">How it works:</span> Your aesthetic
//           parameters are scaled to fixed-point format and sent to the contract.
//           The on-chain ML model processes them to determine sphere colors, then
//           ray tracing renders the final image.
//         </p>
//       </div>
//     </div>
//   );
// };
