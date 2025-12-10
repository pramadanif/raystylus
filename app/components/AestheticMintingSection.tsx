'use client';

import React from 'react';
import { AestheticMinter } from '@/app/components/AestheticMinter';

/**
 * Aesthetic Minting Section untuk Studio
 * Dapat diintegrasikan ke halaman studio yang sudah ada
 */
export const AestheticMintingSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="border-t border-white/5 pt-6">
        <h2 className="text-lg font-bold text-ray-cream mb-4">🎨 AI-Powered Aesthetic Minting</h2>
        <p className="text-sm text-gray-400 mb-6">
          Generate unique artwork using on-chain ML inference. Define your aesthetic preferences (Warmth, Intensity, Depth) and let the neural network determine the perfect colors.
        </p>
      </div>
      <AestheticMinter />
    </div>
  );
};
