import React, { useState, useEffect } from 'react';
import { Product } from '../types/pharmacy';
import { PRODUCTS, CORPORATE_INFO } from '../data/products';
import confetti from 'canvas-confetti';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Send,
  FileCheck2,
  Download,
  Printer,
  CheckCircle,
  Clock,
  MapPin,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface PreFillQuoteData {
  product?: Product;
  units?: number;
  cartons?: number;
  pallets?: number;
  weightKg?: number;
  volumeCbm?: number;
  discountPercent?: number;
  estimatedCost?: number;
  shippingTier?: string;
  notes?: string;
}

interface LeadPortalProps {
  preFillData?: PreFillQuoteData | null;
}

export const LeadPortal: React.FC<LeadPortalProps> = ({ preFillData }) => {
  const [companyName, setCompanyName] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [country, setCountry] = useState<string>('United Arab Emirates');
  const [selectedProductId, setSelectedProductId] = useState<string>('broco-syrup');
  const [volumeUnits, setVolumeUnits] = useState<number>(2400);
  const [shippingTier, setShippingTier] = useState<string>('Standard Sea/Ground Freight');
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRfq, setSubmittedRfq] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync pre-fill data when received from calculator
  useEffect(() => {
    if (preFillData) {
      if (preFillData.product) setSelectedProductId(preFillData.product.id);
      if (preFillData.units) setVolumeUnits(preFillData.units);
      if (preFillData.shippingTier) setShippingTier(preFillData.shippingTier);
      if (preFillData.notes) setNotes(preFillData.notes);
    }
  }, [preFillData]);

  const currentProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/quote-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          contactPerson,
          email,
          phone,
          country,
          product: `${currentProduct.name} (${currentProduct.volume})`,
          volumeUnits,
          shippingTier,
          notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit procurement inquiry.');
      }

      setSubmittedRfq(data.record);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#0284c7', '#d97706'],
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Network error occurred. Please contact our corporate desk directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xl relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-2">
          <Building2 className="w-3.5 h-3.5 text-teal-600" />
          <span>Global Institutional Supply Network</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          B2B Enterprise Partner Portal & RFQ Ingestion
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Dedicated commercial desk for international distributors, hospital pharmacy networks, and governmental procurement bodies. Submit your institutional tender or request commercial export terms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Contact Landmarks & Direct Desk */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="rounded-2xl bg-gradient-to-br from-[#0B1B3D] via-[#0E2A54] to-slate-900 text-white p-6 sm:p-7 shadow-xl border border-blue-900 relative overflow-hidden">
            <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block mb-1">
              Official Corporate Landmarks
            </span>
            <h3 className="text-xl font-extrabold text-white">Nova-Plus Lifesciences Pvt Ltd</h3>
            <p className="text-xs text-blue-200 mt-1 italic">
              "{CORPORATE_INFO.mission}"
            </p>

            <div className="mt-6 space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-teal-300 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Official Commercial Helpline</span>
                  <a href={`tel:${CORPORATE_INFO.phone}`} className="font-extrabold text-white text-base hover:text-teal-300 transition-colors">
                    {CORPORATE_INFO.phoneDisplay}
                  </a>
                  <p className="text-[11px] text-slate-300">Intl Direct: {CORPORATE_INFO.internationalPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-cyan-300 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Authorized Web Portal</span>
                  <a
                    href={CORPORATE_INFO.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-teal-300 hover:underline"
                  >
                    {CORPORATE_INFO.website}
                  </a>
                  <p className="text-[11px] text-slate-300">WHO-GMP & Ayush Validated Database</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-amber-300 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Commercial Desk Operating Hours</span>
                  <p className="font-semibold text-white">Monday - Saturday: 08:30 - 18:00 (PKT / GMT+5)</p>
                  <p className="text-[11px] text-slate-300">24/7 Priority Emergency Hospital Supplies</p>
                </div>
              </div>
            </div>

            {/* Regulatory seal stamp */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1 text-teal-300 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Fast 4-Hour RFQ Response
              </span>
              <span>Export License # NP-EXP-9921</span>
            </div>
          </div>

          {/* Quick FAQ / Procurement Guidelines */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Procurement & Export Protocol:
            </h4>
            <p>
              • <strong>Minimum Order Quantities (MOQ):</strong> 500 units for standard catalog SKUs; custom institutional labeling available for orders exceeding 10,000 units.
            </p>
            <p>
              • <strong>Documentation Provided:</strong> Certificate of Analysis (CoA), Free Sale Certificate (FSC), CTD/ACTD dossiers, and Batch Release Sterility Reports.
            </p>
            <p>
              • <strong>Payment & Escrow:</strong> Confirmed Irrevocable LC at Sight or TT Wire Transfer.
            </p>
          </div>
        </div>

        {/* Right Column: Lead Ingestion Form or RFQ Pro-Forma Receipt */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md text-left">
          {submittedRfq ? (
            /* Official RFQ Pro-Forma Receipt & Printable Sheet */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-teal-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-teal-950 text-sm">
                    Quotation Request Successfully Registered!
                  </h4>
                  <p className="text-xs text-teal-800">
                    Reference ID: <strong className="font-mono text-slate-900">{submittedRfq.rfqId}</strong>. A dedicated commercial account executive has been assigned.
                  </p>
                </div>
              </div>

              {/* Printable Pro-Forma Letterhead */}
              <div id="printable-rfq" className="p-6 bg-slate-50 rounded-2xl border border-slate-300 space-y-4">
                <div className="flex items-start justify-between border-b pb-3 border-slate-200">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Nova-Plus Lifesciences Pvt Ltd</h3>
                    <p className="text-xs text-slate-500">Commercial Tender & Export Procurement Docket</p>
                    <p className="text-[11px] text-slate-400">Official Helpline: {CORPORATE_INFO.phoneDisplay}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      {submittedRfq.rfqId}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Date: {new Date(submittedRfq.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">Procuring Entity</span>
                    <strong className="text-slate-900">{submittedRfq.companyName}</strong>
                    <p className="text-slate-600">Attn: {submittedRfq.contactPerson}</p>
                    <p className="text-slate-600">{submittedRfq.email} | {submittedRfq.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">Destination & Shipping</span>
                    <strong className="text-slate-900">{submittedRfq.country}</strong>
                    <p className="text-slate-600">Tier: {submittedRfq.shippingTier}</p>
                    <p className="text-teal-700 font-semibold">Status: Under Regulatory Review</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{submittedRfq.product}</span>
                    <span className="font-mono font-bold text-slate-900">{submittedRfq.volumeUnits.toLocaleString()} Units</span>
                  </div>
                  {submittedRfq.notes && (
                    <p className="text-xs text-slate-500 italic mt-1 bg-white p-2 rounded border border-slate-200">
                      "{submittedRfq.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Formal RFQ Docket</span>
                </button>
                <button
                  onClick={() => setSubmittedRfq(null)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Submit Another Procurement Inquiry
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Ingestion Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 border-b pb-2 border-slate-100 flex items-center justify-between">
                <span>Enterprise Lead Ingestion Form</span>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Instant Commercial Routing
                </span>
              </h3>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Global Pharma Ltd"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Procurement Officer / Contact Name
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Dr. Hameed Khan, Head of Sourcing"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procurement@organization.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Telephone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Requested Product SKU
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.volume})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Volume Scale
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={volumeUnits}
                    onChange={(e) => setVolumeUnits(parseInt(e.target.value) || 100)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Country / Port of Discharge
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. UAE, Saudi Arabia, UK, Kenya"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Logistics Preference
                  </label>
                  <select
                    value={shippingTier}
                    onChange={(e) => setShippingTier(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Standard Sea/Ground Freight">Standard Freight (Sea / Ground)</option>
                    <option value="Priority Cold-Chain Express">Pharma Cold-Chain Controlled (2°-25°C)</option>
                    <option value="Air Cargo Expedited">Expedited Air Cargo Hub</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Tender Specifications / Special Requests
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify tender reference numbers, country drug registration dossier needs, customized packaging labels, or delivery schedules..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-blue-700 via-blue-800 to-teal-700 hover:from-blue-800 hover:to-teal-800 shadow-lg shadow-blue-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Ingestion Record...' : 'Submit Institutional RFQ Inquiry'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Submissions are logged directly into Nova-Plus Lifesciences Enterprise ERP with guaranteed 4-hour commercial SLA.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
