import React from 'react';
import { SYMPTOM_FILTERS, PRODUCTS } from '../data/products';
import { SymptomFilter, Product } from '../types/pharmacy';
import {
  Wind,
  Droplet,
  Flame,
  Sparkles,
  ShieldCheck,
  LayoutGrid,
  Check,
  ArrowRight,
  Info,
} from 'lucide-react';

interface SymptomMatcherProps {
  selectedSymptomId: string;
  onSelectSymptom: (symptomId: string) => void;
  onOpenSpecs: (product: Product) => void;
  onSelectForQuote: (product: Product) => void;
}

export const SymptomMatcher: React.FC<SymptomMatcherProps> = ({
  selectedSymptomId,
  onSelectSymptom,
  onOpenSpecs,
  onSelectForQuote,
}) => {
  const activeFilter =
    SYMPTOM_FILTERS.find((f) => f.id === selectedSymptomId) || SYMPTOM_FILTERS[0];

  const matchedProduct = activeFilter.targetProductId
    ? PRODUCTS.find((p) => p.id === activeFilter.targetProductId)
    : null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wind':
        return <Wind className="w-4 h-4" />;
      case 'Droplet':
        return <Droplet className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4" />;
      default:
        return <LayoutGrid className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Interactive Clinical Filter</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Dynamic Symptom-to-Medicine Matcher
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Select a clinical symptom profile to instantly identify the targeted Nova-Plus therapeutic formulation, biochemical mechanism, and posology.
        </p>
      </div>

      {/* Symptom Tag Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-8">
        {SYMPTOM_FILTERS.map((filter) => {
          const isSelected = selectedSymptomId === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => onSelectSymptom(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#0B1B3D] to-teal-800 text-white shadow-md shadow-teal-900/20 scale-105 ring-2 ring-teal-400'
                  : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:border-teal-300'
              }`}
            >
              <span className={isSelected ? 'text-teal-300' : 'text-teal-600'}>
                {renderIcon(filter.iconName)}
              </span>
              <span>{filter.label}</span>
              {isSelected && <Check className="w-3.5 h-3.5 text-teal-300 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Match Result Banner & Clinical Breakdown */}
      {matchedProduct ? (
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-700">
          <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left: Matched Product Snapshot */}
            <div className="md:col-span-4 flex flex-col items-center justify-center bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-2">
                Primary Matched Formulation
              </span>
              <img
                src={matchedProduct.image}
                alt={matchedProduct.name}
                className="h-44 sm:h-52 object-contain filter drop-shadow-2xl hover:scale-105 transition-transform"
              />
              <span className="mt-2 text-xs font-mono text-slate-300 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                {matchedProduct.volume} • {matchedProduct.fdaAyushStatus}
              </span>
            </div>

            {/* Right: Clinical Details & Rationale */}
            <div className="md:col-span-8 text-left space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Target: {activeFilter.label}
                </span>
                {matchedProduct.sugarFree && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Sugar Free Formula
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {matchedProduct.name}
              </h3>
              <p className="text-sm text-teal-200 font-medium">
                {matchedProduct.keyIngredients}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeFilter.description}
              </p>

              {/* Posology Quick Callout */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-teal-300 font-bold">
                  <Info className="w-3.5 h-3.5" />
                  <span>Recommended Dosage & Administration:</span>
                </div>
                <p className="text-slate-200">
                  <strong className="text-white">Adults:</strong> {matchedProduct.dosage.adults}
                </p>
                {matchedProduct.dosage.pediatrics && (
                  <p className="text-slate-200">
                    <strong className="text-white">Pediatrics:</strong> {matchedProduct.dosage.pediatrics}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenSpecs(matchedProduct)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <span>View Clinical Monograph</span>
                  <ArrowRight className="w-4 h-4 text-teal-600" />
                </button>
                <button
                  onClick={() => onSelectForQuote(matchedProduct)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/20 transition-all"
                >
                  Calculate B2B Batch Order
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs sm:text-sm text-center">
          Displaying all 5 Nova-Plus formulations across Syrups and Sachets divisions. Click any specific symptom tag above to isolate matching therapeutics.
        </div>
      )}
    </div>
  );
};
