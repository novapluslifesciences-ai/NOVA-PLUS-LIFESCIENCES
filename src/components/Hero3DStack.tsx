import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { ThreeBottleCanvas } from './ThreeBottleCanvas';
import { Layers, Box, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface Hero3DStackProps {
  onSelectProduct: (productId: string) => void;
  onOpenMatcher: () => void;
}

export const Hero3DStack: React.FC<Hero3DStackProps> = ({ onSelectProduct, onOpenMatcher }) => {
  const [viewMode, setViewMode] = useState<'stack' | 'webgl'>('stack');

  // Featured products for the multi-plane 3D drift stack
  const broco = PRODUCTS.find((p) => p.id === 'broco-syrup') || PRODUCTS[0];
  const ferolex = PRODUCTS.find((p) => p.id === 'ferolex-f-syrup') || PRODUCTS[1];
  const cranBee = PRODUCTS.find((p) => p.id === 'cran-bee-sachets') || PRODUCTS[4];

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] flex flex-col items-center justify-center">
      {/* Mode Toggle Switcher */}
      <div className="absolute top-2 right-2 sm:right-6 z-30 flex items-center p-1 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-lg">
        <button
          onClick={() => setViewMode('stack')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === 'stack'
              ? 'bg-[#0B1B3D] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-teal-400" />
          <span>3D Drift Stack</span>
        </button>
        <button
          onClick={() => setViewMode('webgl')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === 'webgl'
              ? 'bg-[#0B1B3D] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Box className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D WebGL Lab</span>
        </button>
      </div>

      {viewMode === 'webgl' ? (
        <div className="w-full h-full bg-gradient-to-br from-[#0B1B3D] via-[#0F2942] to-[#0A192F] rounded-3xl p-2 border border-slate-700/60 shadow-2xl relative">
          <ThreeBottleCanvas />
        </div>
      ) : (
        /* Cinematic Multi-Layered 3D Presentation Stack */
        <div className="relative w-full h-full flex items-center justify-center perspective-1200 preserve-3d">
          {/* Ambient luminous glow backgrounds */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-500/15 filter blur-3xl -top-6 -left-6 pointer-events-none" />
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-teal-500/15 filter blur-3xl -bottom-6 -right-6 pointer-events-none" />

          {/* LAYER 1: Deep Backplane - Ferolex-F (Z = -20px to 15px) */}
          <div
            onClick={() => onSelectProduct(ferolex.id)}
            className="absolute -left-2 sm:left-4 top-10 sm:top-14 w-52 sm:w-60 md:w-64 glass-card rounded-2xl p-3 sm:p-4 shadow-xl border border-red-100 cursor-pointer animate-float-b hover:scale-105 transition-all duration-300 z-10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-rose-50/60 to-white p-2">
              <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider">
                Hematology
              </span>
              <img
                src={ferolex.image}
                alt={ferolex.name}
                className="w-full h-44 sm:h-52 object-contain filter drop-shadow-md transition-transform duration-300"
              />
            </div>
            <div className="mt-2 text-left">
              <h4 className="font-bold text-slate-900 text-sm">{ferolex.name}</h4>
              <p className="text-xs text-rose-700 font-medium">Iron Bisglycinate + Folic Acid</p>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                <span>120ml Syrup</span>
                <span className="text-rose-600 font-semibold flex items-center gap-0.5">
                  View Specs <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* LAYER 2: Central Flagship Hero Card - BroCo Cough Syrup (Z = 50px - 70px) */}
          <div
            onClick={() => onSelectProduct(broco.id)}
            className="relative w-64 sm:w-72 md:w-80 glass-card rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-teal-500/30 cursor-pointer animate-float-a hover:scale-105 transition-all duration-300 z-20 aura-syrup-glow"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-500 text-white tracking-wide uppercase shadow-sm">
                Flagship Formula
              </span>
              <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                Sugar-Free 120ml
              </span>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-teal-50/30 p-2 my-1">
              <img
                src={broco.image}
                alt={broco.name}
                className="w-full h-56 sm:h-64 object-contain filter drop-shadow-xl"
              />
            </div>

            <div className="mt-3 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{broco.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Ayush Approved</span>
              </div>
              <p className="text-xs text-teal-700 font-medium mt-0.5">Ivy Leaf + Thyme + Licorice + Ginger</p>
              
              <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  Liquefies Mucus
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  Bronchial Ease
                </div>
              </div>
            </div>
          </div>

          {/* LAYER 3: Foreplane Accent Card - Cran Bee Sachets (Z = 65px - 90px) */}
          <div
            onClick={() => onSelectProduct(cranBee.id)}
            className="absolute -right-2 sm:right-4 bottom-8 sm:bottom-12 w-52 sm:w-60 md:w-64 glass-card rounded-2xl p-3 sm:p-4 shadow-2xl border border-teal-200 cursor-pointer animate-float-c hover:scale-105 transition-all duration-300 z-30 aura-sachet-glow"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#881337] text-white uppercase tracking-wider">
                Sachets Division
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                10 Sachets
              </span>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-rose-50/40 to-teal-50/20 p-2">
              <img
                src={cranBee.image}
                alt={cranBee.name}
                className="w-full h-40 sm:h-48 object-contain filter drop-shadow-md"
              />
            </div>

            <div className="mt-2 text-left">
              <h4 className="font-bold text-slate-900 text-sm">{cranBee.name}</h4>
              <p className="text-xs text-teal-800 font-medium">Cranberry 250mg + Vit C</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Healthy Urinary Tract Support</p>
            </div>
          </div>

          {/* Floating Pill Badge: Quick Symptom Matcher Trigger */}
          <div
            onClick={onOpenMatcher}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-slate-800 border border-teal-500/40 shadow-xl cursor-pointer hover:bg-teal-50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-800">Match Symptoms to Formulations</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          </div>
        </div>
      )}
    </div>
  );
};
