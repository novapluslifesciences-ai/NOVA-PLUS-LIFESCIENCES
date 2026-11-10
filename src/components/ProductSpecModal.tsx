import React from 'react';
import { Product } from '../types/pharmacy';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Package,
  Layers,
  Thermometer,
  FileText,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';

interface ProductSpecModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectForQuote: (product: Product) => void;
}

export const ProductSpecModal: React.FC<ProductSpecModalProps> = ({
  product,
  onClose,
  onSelectForQuote,
}) => {
  if (!product) return null;

  const isSyrup = product.category === 'syrup';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-left my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-6 border-b border-slate-100">
          <div className="md:col-span-4 flex items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-56 sm:h-64 object-contain filter drop-shadow-xl"
            />
          </div>

          <div className="md:col-span-8 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  isSyrup ? 'bg-blue-100 text-blue-900' : 'bg-teal-100 text-teal-900'
                }`}
              >
                {product.category === 'syrup' ? '120ml Oral Liquid Formulation' : '10s Unit Pack Sachet'}
              </span>
              {product.sugarFree && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sugar-Free
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                {product.fdaAyushStatus}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h2>
            <p className="text-xs sm:text-sm text-teal-800 font-semibold">{product.subtitle}</p>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {product.formulationNotes}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-500">
              <span>Standard Volume: <strong className="text-slate-900">{product.volume}</strong></span>
              <span>Shelf Life: <strong className="text-slate-900">{product.packaging.shelfLife}</strong></span>
            </div>
          </div>
        </div>

        {/* Clinical Monograph Sections */}
        <div className="py-6 space-y-6 text-xs sm:text-sm text-slate-700">
          {/* Active Bio-Compounds & Key Ingredients */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Standardized Active Phytochemicals / API Profile
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.activeBioCompounds.map((compound, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{compound}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Indications & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Clinical Therapeutic Indications
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {product.indications.map((ind, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Evidence-Based Benefits
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {product.benefits.map((ben, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Posology & Administration */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2 text-xs">
            <h4 className="font-bold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              Posology & Posological Administration Guidelines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
              <div>
                <span className="font-bold text-teal-900 block">Adults & Adolescents:</span>
                <span>{product.dosage.adults}</span>
              </div>
              {product.dosage.pediatrics && (
                <div>
                  <span className="font-bold text-teal-900 block">Pediatrics:</span>
                  <span>{product.dosage.pediatrics}</span>
                </div>
              )}
            </div>
            <p className="text-slate-600 text-[11px] pt-1">
              <strong className="text-slate-800">Frequency Note:</strong> {product.dosage.frequency}
            </p>
          </div>

          {/* Packaging & Logistics Specification */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
            <h4 className="font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Export Packaging & Logistics Standard
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Carton Capacity</span>
                <span className="font-bold text-white text-sm">{product.packaging.unitsPerCarton} Units</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Gross Weight</span>
                <span className="font-bold text-white text-sm">{product.packaging.cartonWeightKg} kg</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Pallet Stacking</span>
                <span className="font-bold text-white text-sm">{product.packaging.cartonsPerPallet} Boxes</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Storage Limits</span>
                <span className="font-bold text-white text-xs">{product.packaging.storage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Close Specification
          </button>
          <button
            onClick={() => {
              onClose();
              onSelectForQuote(product);
            }}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Configure B2B Bulk Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
