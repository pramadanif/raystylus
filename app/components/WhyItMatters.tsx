'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Lock, TrendingUp, Brain, Database, Shield } from 'lucide-react';

export const WhyItMatters = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: Brain,
      title: 'AI on Blockchain',
      description: 'First-ever 3→4→2 neural network running on smart contracts. AI inference without off-chain APIs or centralized servers.',
      color: 'text-[#8BAE66]'
    },
    {
      icon: Zap,
      title: 'GPU-Like Performance',
      description: 'Fixed-point i64 arithmetic enables fast matrix operations. 4 hidden neurons with ReLU activation and sigmoid output layer.',
      color: 'text-[#8BAE66]'
    },
    {
      icon: Lock,
      title: 'Deterministic & Verifiable',
      description: 'Every ML inference result is on-chain and immutable. No randomness, no server inconsistency—pure mathematics.',
      color: 'text-[#8BAE66]'
    },
    {
      icon: TrendingUp,
      title: 'Aesthetic Generation',
      description: 'Train ML model off-chain, deploy weights on-chain. Users input 3 parameters (Warmth, Intensity, Depth), get deterministic RGB colors.',
      color: 'text-[#8BAE66]'
    },
    {
      icon: Database,
      title: 'Minimal Footprint',
      description: '28 weights + 6 biases = ~1KB of data. Efficient enough to run millions of inferences within gas constraints.',
      color: 'text-[#8BAE66]'
    },
    {
      icon: Shield,
      title: 'Trust Minimized',
      description: 'No centralized service controlling aesthetic generation. Model weights are public, auditable, and unchangeable on-chain.',
      color: 'text-[#8BAE66]'
    }
  ];

  const mlDetails = [
    {
      title: '1000 Samples Training',
      description: 'Trained on synthetic data: Warmth × Intensity × Depth → RGB sphere color outputs with noise to improve generalization.',
      tech: 'TensorFlow + Keras'
    },
    {
      title: 'Fixed-Point Conversion',
      description: 'Weights & biases converted to i64 fixed-point (scale 10^18) for Rust contract. Maintains precision across blockchain.',
      tech: 'Python numpy'
    },
    {
      title: 'On-Chain Inference',
      description: 'Layer 1: 3 inputs → 4 hidden (ReLU). Layer 2: 4 hidden → 2 outputs (Sigmoid). Free VIEW function, no gas required.',
      tech: 'Rust + Stylus VM'
    },
    {
      title: 'Aesthetic NFT Minting',
      description: 'After inference, render raytraced sphere with predicted colors. Store rendering params (21 bytes) on-chain permanently.',
      tech: 'Arbitrum Stylus'
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-[#0f120e] relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-[#628141]/5 blur-[120px] pointer-events-none transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-[#EBD5AB] mb-4">
            Why Neural Network on Blockchain Matters
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Combining AI with verifiable on-chain computation creates a new paradigm: 
            <span className="text-[#8BAE66] font-semibold"> trustless AI inference</span> with deterministic results.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.6 }}
                className="bg-[#151a14]/80 border border-[#628141]/20 rounded-lg p-6 hover:border-[#628141]/50 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-[#628141]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#628141]/20 transition-all duration-300">
                  <Icon className={`${benefit.color} group-hover:scale-110 transition-transform`} size={24} />
                </div>
                <h3 className="text-[#EBD5AB] font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ML Pipeline Details */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-[#EBD5AB] mb-8 text-center">
            Neural Network Pipeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mlDetails.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                className="bg-[#151a14]/80 border border-[#628141]/20 rounded-lg p-6 hover:border-[#628141]/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#628141]/20 text-[#8BAE66] font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-[#EBD5AB] mb-2">{detail.title}</h4>
                    <p className="text-gray-400 text-sm mb-3">{detail.description}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#628141]/10 rounded-full border border-[#628141]/20">
                      <span className="text-xs font-mono text-[#8BAE66]">{detail.tech}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-gradient-to-r from-[#151a14] to-[#0a0c0a] border border-[#628141]/30 rounded-lg p-8"
        >
          <h3 className="text-xl font-bold text-[#EBD5AB] mb-4">Why This Changes Everything</h3>
          <div className="space-y-3 text-gray-400">
            <p>
              <span className="text-[#8BAE66] font-semibold">Before:</span> AI services were centralized. Users had to trust servers. Models could be changed without notice.
            </p>
            <p>
              <span className="text-[#8BAE66] font-semibold">Now:</span> ML runs on blockchain. Weights are immutable. Every inference is verifiable. Trustless AI for the first time.
            </p>
            <p>
              <span className="text-[#8BAE66] font-semibold">RayStylus + MNN:</span> Raytracing (geometric computation) + Neural Network (aesthetic inference) = complete on-chain 3D graphics with AI. No servers. No APIs. Pure blockchain.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
