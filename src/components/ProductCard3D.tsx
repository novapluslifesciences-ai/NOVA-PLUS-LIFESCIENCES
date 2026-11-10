import React, { useRef, useState, useEffect } from 'react';
import { Product } from '../types/pharmacy';
import { Shield, Sparkles, CheckCircle2, ChevronRight, FileText, ShoppingCart, Beaker } from 'lucide-react';

interface ProductCard3DProps {
  product: Product;
  onOpenSpecs: (product: Product) => void;
  onSelectForQuote: (product: Product) => void;
  isHighlighted?: boolean;
}

export const ProductCard3D: React.FC<ProductCard3DProps> = ({
  product,
  onOpenSpecs,
  onSelectForQuote,
  isHighlighted = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1200px) rotateX(0deg) rotateY(0deg)');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Coordinate offset calculation (-1 to +1)
    const offsetX = (x - centerX) / centerX;
    const offsetY = (y - centerY) / centerY;

    // Smooth tilt angles in true 3D space (max ~14 degrees)
    const rotateX = -offsetY * 13;
    const rotateY = offsetX * 13;

    setTransformStyle(`perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const isSyrup = product.category === 'syrup';
  const glowAuraClass = isHovered
    ? isSyrup
      ? 'shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4),0_0_40px_rgba(2,132,199,0.25)] border-blue-400 ring-2 ring-blue-400/40'
      : 'shadow-[0_20px_50px_-10px_rgba(13,148,136,0.4),0_0_40px_rgba(20,184,166,0.3)] border-teal-400 ring-2 ring-teal-400/40'
    : isHighlighted
    ? 'shadow-[0_0_35px_rgba(13,148,136,0.35)] ring-2 ring-teal-500 border-teal-400'
    : 'shadow-lg border-slate-200/80';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl bg-white/95 backdrop-blur-xl border p-6 transition-all duration-200 ease-out preserve-3d ${glowAuraClass} ${
        isHighlighted ? 'bg-gradient-to-b from-teal-50/40 to-white' : ''
      }`}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Category Reactive Glow Ambient Underlay */}
      <div
        className={`absolute inset-0 -z-10 rounded-3xl transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } ${
          isSyrup
            ? 'bg-gradient-to-br from-blue-500/10 via-sky-400/5 to-transparent'
            : 'bg-gradient-to-br from-teal-500/10 via-emerald-400/5 to-transparent'
        }`}
      />

      {/* Top Header Row with Category & Sugar-Free Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              isSyrup
                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                : 'bg-teal-100 text-teal-900 border border-teal-200'
            }`}
          >
            {product.category === 'syrup' ? 'Syrup Formulation' : 'Sachet Division'}
          </span>
          {product.sugarFree && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Sugar-Free
            </span>
          )}
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          {product.volume}
        </span>
      </div>

      {/* Product Image Stage with translateZ(40px) Pop Forward Effect */}
      <div
        className="relative my-3 py-4 px-2 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60 flex items-center justify-center overflow-visible preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Soft Radial Contact Grounding Shadow */}
        <div className="absolute bottom-2 w-3/4 h-5 bg-slate-900/15 rounded-full blur-md" />

        {/* 3D Popping Image Element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-60 sm:h-64 object-contain transition-transform duration-300 pointer-events-none drop-shadow-xl"
          style={{
            transform: isHovered ? 'translateZ(40px) scale(1.05)' : 'translateZ(0px) scale(1)',
          }}
        />

        {/* Floating Regulatory Badge inside image frame */}
        <div
          className="absolute bottom-2 left-3 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200 shadow-sm"
          style={{
            transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)',
          }}
        >
          {product.fdaAyushStatus}
        </div>
      </div>

      {/* Product Title and Subtitle */}
      <div className="text-left mt-4" style={{ transform: isHovered ? 'translateZ(15px)' : 'translateZ(0px)' }}>
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-900">
          {product.name}
        </h3>
        <p className="text-xs font-semibold text-slate-600 mt-1 line-clamp-1">{product.subtitle}</p>
        <p className="text-xs text-teal-700 font-medium mt-1">
          <span className="font-bold text-slate-700">Key Formula: </span>
          {product.keyIngredients}
        </p>
      </div>

      {/* Benefits Bullet Grid */}
      <div className="my-4 pt-3 border-t border-slate-100 space-y-1.5 text-left text-xs text-slate-600">
        {product.benefits.slice(0, 3).map((benefit, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <CheckCircle2
              className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                isSyrup ? 'text-blue-600' : 'text-teal-600'
              }`}
            />
            <span className="line-clamp-1">{benefit}</span>
          </div>
        ))}
      </div>

      {/* Packaging & Pallet Logistics Pill */}
      <div className="bg-slate-50 rounded-xl p-2.5 mb-4 text-left border border-slate-100 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Case Packaging</span>
          <span className="font-semibold text-slate-800">{product.packaging.unitsPerCarton} units/carton</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Shelf Life</span>
          <span className="font-semibold text-slate-800">{product.packaging.shelfLife}</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onOpenSpecs(product)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-slate-600" />
          <span>Clinical Spec</span>
        </button>

        <button
          onClick={() => onSelectForQuote(product)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
            isSyrup
              ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              : 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/20'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>B2B Quote</span>
        </button>
      </div>
    </div>
  );
};
