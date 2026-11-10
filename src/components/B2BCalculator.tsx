import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types/pharmacy';
import {
  Calculator,
  Truck,
  Package,
  Layers,
  Scale,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Plane,
  Clock,
  Sparkles,
} from 'lucide-react';

import { computeB2BCargoAndPricing } from '../utils/b2bMath';

interface B2BCalculatorProps {
  initialProductId?: string;
  onTransferToLeadForm: (calcData: {
    product: Product;
    units: number;
    cartons: number;
    pallets: number;
    weightKg: number;
    volumeCbm: number;
    discountPercent: number;
    estimatedCost: number;
    shippingTier: string;
  }) => void;
}

export const B2BCalculator: React.FC<B2BCalculatorProps> = ({
  initialProductId = 'broco-syrup',
  onTransferToLeadForm,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId);
  const [targetUnits, setTargetUnits] = useState<number>(2400);
  const [shippingTier, setShippingTier] = useState<string>('Standard Sea/Ground Freight');

  // Find currently selected product
  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0],
    [selectedProductId]
  );

  // Dynamic calculations via tested pure math engine
  const calculations = useMemo(() => {
    return computeB2BCargoAndPricing({
      targetUnits,
      unitsPerCarton: product.packaging.unitsPerCarton || 48,
      cartonsPerPallet: product.packaging.cartonsPerPallet || 40,
      weightPerCartonKg: product.packaging.cartonWeightKg || 10,
      cbmPerCarton: product.category === 'syrup' ? 0.03 : 0.025,
      baseWholesaleRate: product.pricingTier.baseWholesaleUsd,
    });
  }, [product, targetUnits]);

  const quickScaleOptions = [500, 1200, 2400, 5000, 12000, 25000];

  const handleApplyToRFQ = () => {
    onTransferToLeadForm({
      product,
      units: calculations.actualUnits,
      cartons: calculations.cartons,
      pallets: calculations.pallets,
      weightKg: calculations.grossWeightKg,
      volumeCbm: calculations.totalCbm,
      discountPercent: calculations.discountPercent,
      estimatedCost: calculations.netTotal,
      shippingTier,
    });
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-2xl relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-500/10 filter blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 mb-2">
          <Calculator className="w-3.5 h-3.5 text-blue-600" />
          <span>Procurement & Logistics Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          B2B Distribution & Cargo Volume Calculator
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Configure wholesale shipment scales, case palletization, freight weights, and volume-discounted ex-factory commercial estimates for institutional healthcare procurement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls Column (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6 bg-slate-50/80 p-6 rounded-2xl border border-slate-200 text-left">
          {/* Product Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Formulation / SKU
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all"
            >
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.volume} - {p.category === 'syrup' ? 'Syrup' : 'Sachet'})
                </option>
              ))}
            </select>
          </div>

          {/* Target Volume Slider & Manual Number Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target Volume Scale (Units)
              </label>
              <input
                type="number"
                min="100"
                max="100000"
                step="100"
                value={targetUnits}
                onChange={(e) => setTargetUnits(Math.max(100, parseInt(e.target.value) || 100))}
                className="w-28 px-2.5 py-1 text-right text-sm font-bold font-mono text-blue-900 bg-white border border-slate-300 rounded-lg shadow-sm"
              />
            </div>

            <input
              type="range"
              min="200"
              max="25000"
              step="100"
              value={targetUnits}
              onChange={(e) => setTargetUnits(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            {/* Quick Scale Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Quick Select:</span>
              {quickScaleOptions.map((qty) => (
                <button
                  key={qty}
                  onClick={() => setTargetUnits(qty)}
                  className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${
                    targetUnits === qty
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {qty.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Shipping Logistics Tier */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Logistics Delivery Tier
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'Standard Sea/Ground Freight',
                  name: 'Standard Freight (Sea / Ground)',
                  time: '14 - 21 Business Days',
                  icon: <Truck className="w-4 h-4 text-blue-600" />,
                },
                {
                  id: 'Priority Cold-Chain Express',
                  name: 'Pharma Cold-Chain Controlled (2°-25°C)',
                  time: '5 - 7 Business Days',
                  icon: <ShieldCheck className="w-4 h-4 text-teal-600" />,
                },
                {
                  id: 'Air Cargo Expedited',
                  name: 'Expedited Air Cargo Hub',
                  time: '3 - 5 Business Days',
                  icon: <Plane className="w-4 h-4 text-amber-600" />,
                },
              ].map((tier) => (
                <label
                  key={tier.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    shippingTier === tier.id
                      ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="shippingTier"
                      checked={shippingTier === tier.id}
                      onChange={() => setShippingTier(tier.id)}
                      className="accent-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{tier.name}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {tier.time}
                      </p>
                    </div>
                  </div>
                  {tier.icon}
                </label>
              ))}
            </div>
          </div>

          {/* Packaging Specs Mini-card */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-slate-400">
              Standard Primary Case Spec
            </span>
            <p className="text-slate-700">
              <strong className="text-slate-900">{product.packaging.unitsPerCarton} units</strong> per corrugated master carton.
            </p>
            <p className="text-slate-500 text-[11px]">
              Carton size: {product.packaging.cartonDimensions} • Shelf life: {product.packaging.shelfLife}
            </p>
          </div>
        </div>

        {/* Right Computation Display (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Real-Time Metrics 4-Box Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] uppercase font-bold">Total Units</span>
                <Package className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-white">
                {calculations.actualUnits.toLocaleString()}
              </p>
              <span className="text-[10px] text-teal-300 font-medium">Standardized Fill</span>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] uppercase font-bold">Cartons</span>
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-white">
                {calculations.cartons.toLocaleString()}
              </p>
              <span className="text-[10px] text-blue-300 font-medium">Master Boxes</span>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] uppercase font-bold">Pallets</span>
                <Layers className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-white">
                {calculations.pallets}
              </p>
              <span className="text-[10px] text-amber-300 font-medium">Standard Pallets</span>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] uppercase font-bold">Cargo Vol</span>
                <Scale className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-white">
                {calculations.totalCbm} <span className="text-xs font-normal">CBM</span>
              </p>
              <span className="text-[10px] text-cyan-300 font-medium">{calculations.grossWeightKg} kg Gross</span>
            </div>
          </div>

          {/* Pricing & Commercial Summary Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 via-[#0B1B3D] to-slate-950 text-white shadow-xl border border-blue-800/60 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-blue-800/80">
              <div>
                <span className="text-xs text-blue-300 font-semibold uppercase tracking-wider">
                  Commercial Procurement Estimate
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">{product.name}</h4>
              </div>

              {calculations.discountPercent > 0 && (
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tier Discount: {calculations.discountPercent}% OFF</span>
                </div>
              )}
            </div>

            <div className="py-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Standard Catalog Base Rate:</span>
                <span>${product.pricingTier.baseWholesaleUsd.toFixed(2)} / unit</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Effective Volume Discounted Unit Rate:</span>
                <span className="font-bold text-teal-300">${calculations.effectiveUnitPrice} / unit</span>
              </div>
              {calculations.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-300 font-medium text-xs">
                  <span>Batch Volume Savings:</span>
                  <span>-${calculations.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="pt-3 border-t border-blue-800/60 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Estimated Ex-Factory Total</span>
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    ${calculations.netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-xs text-slate-400 text-right">
                  Excluding destination duties & inland transport
                </span>
              </div>
            </div>

            {/* Instant Action Trigger Button */}
            <div className="pt-2">
              <button
                onClick={handleApplyToRFQ}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-slate-950 shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Transfer Configuration to Official B2B Quote Sheet</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Delivery & Compliance Notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <p>
              All shipments include Certificate of Analysis (CoA), batch release records, stability chamber reports, and WHO-GMP export documentation sealed per pallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
