import React, { useState, useRef } from 'react';
import { PRODUCTS, CORPORATE_INFO, SYMPTOM_FILTERS } from './data/products';
import { Product } from './types/pharmacy';
import { Hero3DStack } from './components/Hero3DStack';
import { ProductCard3D } from './components/ProductCard3D';
import { SymptomMatcher } from './components/SymptomMatcher';
import { B2BCalculator } from './components/B2BCalculator';
import { ComplianceGrid } from './components/ComplianceGrid';
import { LeadPortal } from './components/LeadPortal';
import { ProductSpecModal } from './components/ProductSpecModal';
import { ClinicalAIModal } from './components/ClinicalAIModal';
import {
  Phone,
  Globe,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Calculator,
  Brain,
  Layers,
  CheckCircle2,
  Menu,
  X,
  FileText,
  Mail,
  ExternalLink,
  Beaker,
  ChevronRight,
  HeartHandshake,
  Building2,
} from 'lucide-react';

export default function App() {
  const [selectedProductForSpec, setSelectedProductForSpec] = useState<Product | null>(null);
  const [isClinicalAiOpen, setIsClinicalAiOpen] = useState<boolean>(false);
  const [activeSymptomId, setActiveSymptomId] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'syrup' | 'sachet'>('all');

  // Pre-fill state for the B2B Lead Portal
  const [calcTransferData, setCalcTransferData] = useState<any | null>(null);

  // Section references for smooth scrolling
  const productsRef = useRef<HTMLDivElement>(null);
  const matcherRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const complianceRef = useRef<HTMLDivElement>(null);
  const partnerPortalRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setMobileMenuOpen(false);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter products based on category and active symptom
  const filteredProducts = PRODUCTS.filter((p) => {
    // 1. Category tab filter
    if (categoryFilter !== 'all' && p.category !== categoryFilter) {
      return false;
    }
    // 2. Active symptom filter
    if (activeSymptomId !== 'all') {
      const filter = SYMPTOM_FILTERS.find((f) => f.id === activeSymptomId);
      if (filter && filter.targetProductId) {
        return p.id === filter.targetProductId;
      }
    }
    return true;
  });

  const handleSelectProductFromHero = (productId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      setSelectedProductForSpec(prod);
    }
  };

  const handleTransferToRFQ = (calcData: any) => {
    setCalcTransferData(calcData);
    scrollTo(partnerPortalRef);
  };

  const handleQuoteClickFromCard = (product: Product) => {
    setCalcTransferData({
      product,
      units: product.packaging.unitsPerCarton * 10,
      shippingTier: 'Standard Sea/Ground Freight',
      notes: `Institutional inquiry for ${product.name} (${product.volume})`,
    });
    scrollTo(partnerPortalRef);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      {/* 1. FIXED GLASSMORPHISM NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand Anchor */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* High-fidelity Brand Emblem: Golden Star + Mortar & Pestle with Green Leaves */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0B1B3D] via-[#0E2856] to-teal-800 p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-[14px] bg-[#0B1B3D] flex items-center justify-center overflow-hidden">
                <span className="text-xl">⚚</span>
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center text-[8px] text-slate-900 font-black shadow-sm">
                ★
              </span>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-[#0B1B3D] tracking-tight">
                  Nova-Plus
                </span>
                <span className="font-semibold text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Lifesciences
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Advancing Healthcare through Safe & Effective Medicine
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
            <button
              onClick={() => scrollTo(productsRef)}
              className="hover:text-blue-900 transition-colors"
            >
              Portfolio
            </button>
            <button
              onClick={() => scrollTo(matcherRef)}
              className="hover:text-teal-700 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Symptom Matcher
            </button>
            <button
              onClick={() => scrollTo(calculatorRef)}
              className="hover:text-blue-900 transition-colors flex items-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              B2B Calculator
            </button>
            <button
              onClick={() => scrollTo(complianceRef)}
              className="hover:text-blue-900 transition-colors"
            >
              Compliance & QA
            </button>
            <button
              onClick={() => scrollTo(aboutRef)}
              className="hover:text-blue-900 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => setIsClinicalAiOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 transition-colors"
            >
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
              <span>Clinical AI</span>
            </button>
          </nav>

          {/* Quick Contact & Sticky Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${CORPORATE_INFO.phone}`}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0B1B3D] hover:text-teal-700 transition-colors bg-slate-100/80 px-3 py-2 rounded-xl"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>{CORPORATE_INFO.phoneDisplay}</span>
            </a>

            <button
              onClick={() => scrollTo(partnerPortalRef)}
              className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#0B1B3D] via-[#0E2856] to-teal-800 hover:from-slate-900 hover:to-teal-900 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>B2B Inquiry</span>
              <ChevronRight className="w-3.5 h-3.5 text-teal-300" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-4 space-y-3 text-left">
            <button
              onClick={() => scrollTo(productsRef)}
              className="block w-full py-2 text-sm font-bold text-slate-800"
            >
              Product Portfolio
            </button>
            <button
              onClick={() => scrollTo(matcherRef)}
              className="block w-full py-2 text-sm font-bold text-teal-700"
            >
              Symptom Matcher
            </button>
            <button
              onClick={() => scrollTo(calculatorRef)}
              className="block w-full py-2 text-sm font-bold text-blue-900"
            >
              B2B Volume Calculator
            </button>
            <button
              onClick={() => scrollTo(complianceRef)}
              className="block w-full py-2 text-sm font-bold text-slate-800"
            >
              Compliance & WHO-GMP
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsClinicalAiOpen(true);
              }}
              className="flex items-center gap-2 py-2 text-sm font-bold text-indigo-900"
            >
              <Brain className="w-4 h-4 text-indigo-600" />
              Clinical AI (gemini-4-argon)
            </button>
            <button
              onClick={() => scrollTo(partnerPortalRef)}
              className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-[#0B1B3D] flex items-center justify-center gap-2"
            >
              <span>Submit B2B Inquiry</span>
              <ChevronRight className="w-4 h-4 text-teal-300" />
            </button>
          </div>
        )}
      </header>

      {/* 2. CORPORATE HERO SECTION */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden medical-grid-bg">
        {/* Soft Ambient Radiance Blurs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-blue-400/10 filter blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-teal-400/10 filter blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Hero Column: Brand Manifesto & Dual Micro-Animated CTAs */}
            <div className="lg:col-span-6 text-left space-y-6">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-900 border border-blue-200/80 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>OFFICIAL CORPORATE PORTAL</span>
                <span className="text-slate-300">•</span>
                <span className="text-teal-700">WHO-GMP & AYUSH</span>
              </div>

              {/* Flagship Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1B3D] tracking-tight leading-[1.12]">
                Trusted Medicines for a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600">
                  Healthier Tomorrow
                </span>
              </h1>

              {/* Official Mission & Manifesto */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Under our enduring mission,{' '}
                <strong className="text-slate-900 font-bold">
                  "Advancing Healthcare through Safe & Effective Medicine,"
                </strong>{' '}
                Nova-Plus Lifesciences manufactures standardized oral syrups and targeted sachets formulated to stringent pharmaceutical thresholds.
              </p>

              {/* Quick Trust Badges Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>GMP Certified</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Award className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>WHO-GMP Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>ISO Certified</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Ayush Approved</span>
                </div>
              </div>

              {/* Dual Micro-Animated Depth-Shadowed CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => scrollTo(productsRef)}
                  className="px-6 py-3.5 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-[#0B1B3D] via-[#0E2A54] to-teal-800 hover:from-slate-900 hover:to-teal-900 shadow-xl shadow-blue-950/20 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <span>Explore Portfolio</span>
                  <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => scrollTo(partnerPortalRef)}
                  className="px-6 py-3.5 rounded-2xl font-extrabold text-sm text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-teal-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span>Partner Portal</span>
                </button>

                <button
                  onClick={() => setIsClinicalAiOpen(true)}
                  className="px-4 py-3.5 rounded-2xl font-bold text-xs text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5"
                >
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <span>Clinical AI Assistant</span>
                </button>
              </div>

              {/* Direct Telephone Landmark */}
              <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
                <span className="font-semibold text-slate-700">Commercial Direct Line:</span>
                <a
                  href={`tel:${CORPORATE_INFO.phone}`}
                  className="font-bold text-teal-800 hover:underline"
                >
                  {CORPORATE_INFO.phoneDisplay}
                </a>
                <span>•</span>
                <span className="text-slate-500">{CORPORATE_INFO.website}</span>
              </div>
            </div>

            {/* Right Hero Column: Cinematic Hero Canvas with 3D Stack */}
            <div className="lg:col-span-6 w-full">
              <Hero3DStack
                onSelectProduct={handleSelectProductFromHero}
                onOpenMatcher={() => scrollTo(matcherRef)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC SYMPTOM-TO-MEDICINE MATCHER FILTER */}
      <section ref={matcherRef} className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SymptomMatcher
          selectedSymptomId={activeSymptomId}
          onSelectSymptom={(id) => {
            setActiveSymptomId(id);
            // If selecting a specific symptom, smoothly orient to product showcase
            if (id !== 'all' && productsRef.current) {
              productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }}
          onOpenSpecs={(product) => setSelectedProductForSpec(product)}
          onSelectForQuote={handleQuoteClickFromCard}
        />
      </section>

      {/* 4. MAXIMIZED PRODUCT SHOWCASE GRID */}
      <section ref={productsRef} className="py-16 sm:py-24 bg-white/70 border-y border-slate-200/80 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 mb-2">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Formulation Portfolio</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3D] tracking-tight">
                Maximized Product Showcase
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                Hover over any card to experience the high-performance 3D Tilt Matrix with coordinate offset tracking and reactive ambient glow auras (Blue for Syrups, Bio-Teal for Sachets).
              </p>
            </div>

            {/* Division Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-[#0B1B3D] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Formulations ({PRODUCTS.length})
              </button>
              <button
                onClick={() => setCategoryFilter('syrup')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === 'syrup'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Syrups Division (120ml)
              </button>
              <button
                onClick={() => setCategoryFilter('sachet')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === 'sachet'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sachets Division
              </button>
            </div>
          </div>

          {/* SYRUPS DIVISION HEADING (if viewing all or syrups) */}
          {(categoryFilter === 'all' || categoryFilter === 'syrup') && (
            <div className="mb-8 text-left">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <h3 className="text-xl font-extrabold text-[#0B1B3D]">
                  Syrups Division • 120ml Oral Formulations
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-6">
                Pharmaceutical liquid suspensions and syrups manufactured in automated HEPA cleanroom suites.
              </p>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts
              .filter((p) => p.category === 'syrup')
              .map((product) => (
                <ProductCard3D
                  key={product.id}
                  product={product}
                  onOpenSpecs={(p) => setSelectedProductForSpec(p)}
                  onSelectForQuote={handleQuoteClickFromCard}
                  isHighlighted={
                    activeSymptomId !== 'all' &&
                    SYMPTOM_FILTERS.find((f) => f.id === activeSymptomId)?.targetProductId === product.id
                  }
                />
              ))}
          </div>

          {/* SACHETS DIVISION HEADING (if viewing all or sachet) */}
          {(categoryFilter === 'all' || categoryFilter === 'sachet') && (
            <div className="mt-16 mb-8 text-left">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-teal-600" />
                <h3 className="text-xl font-extrabold text-[#0B1B3D]">
                  Sachets Division • Effervescent Granules
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-6">
                Triple-foil nitrogen-sealed packaging guaranteeing 100% active botanical proanthocyanidin potency.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts
              .filter((p) => p.category === 'sachet')
              .map((product) => (
                <ProductCard3D
                  key={product.id}
                  product={product}
                  onOpenSpecs={(p) => setSelectedProductForSpec(p)}
                  onSelectForQuote={handleQuoteClickFromCard}
                  isHighlighted={
                    activeSymptomId !== 'all' &&
                    SYMPTOM_FILTERS.find((f) => f.id === activeSymptomId)?.targetProductId === product.id
                  }
                />
              ))}
          </div>
        </div>
      </section>

      {/* 5. PREMIUM B2B DISTRIBUTION & VOLUME CALCULATOR */}
      <section ref={calculatorRef} className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <B2BCalculator onTransferToLeadForm={handleTransferToRFQ} />
      </section>

      {/* 6. CORPORATE COMPLIANCE & GLOBAL TRUST GRID */}
      <section ref={complianceRef} className="py-16 sm:py-24 bg-gradient-to-b from-slate-100/70 to-slate-50 border-t border-slate-200/80 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ComplianceGrid />
        </div>
      </section>

      {/* 7. OFFICIAL CORPORATE MANIFESTO & POSTER SHOWCASE SECTION */}
      <section ref={aboutRef} className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Authentic Corporate Visual Poster */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white group">
                <img
                  src={CORPORATE_INFO.corporatePosterImg}
                  alt="Nova-Plus Lifesciences Official Corporate Poster"
                  className="w-full max-w-sm object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-4 text-left">
                  <div className="text-white">
                    <p className="text-[11px] font-bold text-teal-300 uppercase">Validated Corporate Release</p>
                    <p className="font-extrabold text-sm">Healthier Tomorrows Together</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Corporate Narrative & Landmarks */}
            <div className="lg:col-span-7 text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                <span>Our Heritage & Standards</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3D] tracking-tight">
                Nova-Plus Lifesciences Pvt Ltd
              </h2>

              <p className="text-sm font-semibold text-teal-800 italic">
                "Better Health • Brighter Tomorrow" — Health is Our Priority
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                Founded on the premise that therapeutic safety and clinical efficacy must go hand-in-hand, Nova-Plus Lifesciences operates cutting-edge pharmaceutical formulation units compliant with WHO-GMP and ISO 9001 standards. Our phytopharmaceutical extracts are rigorously verified using high-performance liquid chromatography (HPLC) to ensure consistent batch-to-batch bioequivalence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block font-bold mb-0.5">Corporate Helpline:</strong>
                  <a href={`tel:${CORPORATE_INFO.phone}`} className="text-teal-800 font-extrabold hover:underline">
                    {CORPORATE_INFO.phoneDisplay}
                  </a>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block font-bold mb-0.5">Official Web Presence:</strong>
                  <a href={CORPORATE_INFO.officialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-800 font-bold hover:underline">
                    {CORPORATE_INFO.website}
                  </a>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => scrollTo(partnerPortalRef)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0B1B3D] hover:bg-slate-900 shadow-md transition-all"
                >
                  Request Corporate Profile (PDF)
                </button>
                <button
                  onClick={() => setIsClinicalAiOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5"
                >
                  <Brain className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Clinical Pharmacopoeia Engine</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. B2B ENTERPRISE PARTNER PORTAL & LEAD FORM */}
      <section ref={partnerPortalRef} className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <LeadPortal preFillData={calcTransferData} />
      </section>

      {/* 9. FOOTER ELEMENT & REGULATORY MEDICAL DISCLAIMER */}
      <footer className="bg-[#0B1B3D] text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          {/* Main Footer Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Corporate Identity */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                  ⚚
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Nova-Plus Lifesciences</h3>
                  <span className="text-[11px] text-teal-300 font-mono">Pvt Ltd • Commercial Desk</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Advancing Healthcare through Safe & Effective Medicine. Specialized manufacturer of high-purity oral syrups, botanical phytomedicines, and effervescent dietary sachets.
              </p>
              <div className="text-xs text-slate-400 space-y-1 pt-1">
                <p>
                  <strong className="text-white">Helpline:</strong>{' '}
                  <a href={`tel:${CORPORATE_INFO.phone}`} className="text-teal-400 hover:underline">
                    {CORPORATE_INFO.phoneDisplay}
                  </a>
                </p>
                <p>
                  <strong className="text-white">Web:</strong>{' '}
                  <a href={CORPORATE_INFO.officialUrl} className="text-teal-400 hover:underline">
                    {CORPORATE_INFO.website}
                  </a>
                </p>
              </div>
            </div>

            {/* Col 2: Formulations Matrix */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-teal-300 mb-3">
                Syrups Division
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  <button onClick={() => scrollTo(productsRef)} className="hover:text-white transition-colors">
                    BroCo Cough Syrup (120ml)
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(productsRef)} className="hover:text-white transition-colors">
                    Ferolex-F Iron Syrup (120ml)
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(productsRef)} className="hover:text-white transition-colors">
                    ACINOX Antacid (120ml)
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(productsRef)} className="hover:text-white transition-colors">
                    Novafilm-M Multivitamin (120ml)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Sachets & Tools */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-teal-300 mb-3">
                Sachets & Tools
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  <button onClick={() => scrollTo(productsRef)} className="hover:text-white transition-colors">
                    Cran Bee Sachets (10s Pack)
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(matcherRef)} className="hover:text-white transition-colors">
                    Symptom-to-Medicine Matcher
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(calculatorRef)} className="hover:text-white transition-colors">
                    B2B Distribution Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsClinicalAiOpen(true)} className="hover:text-white transition-colors">
                    Clinical Pharmacopoeia AI
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Quality & Compliance */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-teal-300 mb-3">
                Compliance Standards
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>GMP Certified Facility</li>
                <li>WHO-GMP Export Alignment</li>
                <li>ISO 9001:2015 Management</li>
                <li>Ayush Approved Botanicals</li>
                <li>CoA Batch Release Protocol</li>
              </ul>
            </div>
          </div>

          {/* CRITICAL REGULATORY MEDICAL DISCLAIMER */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Regulatory Medical Disclaimer</span>
            </div>
            <p>
              <strong>Disclaimer:</strong> The information provided on this website is for educational and informational purposes only and does not substitute professional medical advice, diagnosis, or treatment. Always seek the advice of your physician, pharmacist, or qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
            </p>
          </div>

          {/* Copyright & Sub-bar */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Nova-Plus Lifesciences Pvt Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href={CORPORATE_INFO.officialUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Privacy Policy
              </a>
              <span>•</span>
              <a href={CORPORATE_INFO.officialUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Terms of Supply
              </a>
              <span>•</span>
              <a href={`tel:${CORPORATE_INFO.phone}`} className="hover:text-white">
                Contact: {CORPORATE_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Clinical Specification Modal */}
      <ProductSpecModal
        product={selectedProductForSpec}
        onClose={() => setSelectedProductForSpec(null)}
        onSelectForQuote={handleQuoteClickFromCard}
      />

      {/* Clinical AI Pharmacopoeia Modal (gemini-4-argon with high thinking) */}
      <ClinicalAIModal
        isOpen={isClinicalAiOpen}
        onClose={() => setIsClinicalAiOpen(false)}
      />
    </div>
  );
}
