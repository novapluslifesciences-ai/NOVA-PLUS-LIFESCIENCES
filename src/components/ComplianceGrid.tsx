import React, { useState } from 'react';
import { COMPLIANCE_STANDARDS } from '../data/products';
import { ComplianceStandard } from '../types/pharmacy';
import {
  ShieldCheck,
  Award,
  CheckCircle,
  FileCheck,
  Building,
  Microscope,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const ComplianceGrid: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard | null>(null);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-2">
          <Award className="w-3.5 h-3.5 text-teal-600" />
          <span>Global Trust & Validation</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Rigorous Compliance & Pharmaceutical Certifications
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Our automated manufacturing facilities strictly operate under harmonized international standards, ensuring supreme therapeutic purity and patient safety across every batch.
        </p>
      </div>

      {/* Grid of Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COMPLIANCE_STANDARDS.map((std) => (
          <div
            key={std.id}
            onClick={() => setSelectedStandard(std)}
            className="glass-card rounded-2xl p-6 text-left border border-slate-200/90 hover:border-teal-400 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/15 transition-all" />

            <div>
              {/* Badge Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B1B3D] to-teal-800 text-teal-300 flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-teal-900 transition-colors">
                {std.title}
              </h3>
              <p className="text-xs text-teal-700 font-semibold mt-1">
                {std.accreditation}
              </p>
              <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                {std.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:text-teal-950">
              <span>View Audit Protocol</span>
              <ChevronRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Quality Trust Badges Bar */}
      <div className="mt-10 p-5 rounded-2xl bg-white/80 border border-slate-200 shadow-md grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center">
          <span className="w-2 h-2 rounded-full bg-teal-500 mb-1" />
          <span className="font-extrabold text-slate-900 text-sm">Committed to Quality</span>
          <span className="text-[11px] text-slate-500">100% In-House Testing</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 mb-1" />
          <span className="font-extrabold text-slate-900 text-sm">Safety & Wellness</span>
          <span className="text-[11px] text-slate-500">Zero Toxic Residues</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="w-2 h-2 rounded-full bg-amber-500 mb-1" />
          <span className="font-extrabold text-slate-900 text-sm">Cleanroom ISO 7/8</span>
          <span className="text-[11px] text-slate-500">Aseptic Production Suite</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="w-2 h-2 rounded-full bg-purple-500 mb-1" />
          <span className="font-extrabold text-slate-900 text-sm">Stability Assured</span>
          <span className="text-[11px] text-slate-500">ICH Q1A Climatic Zone IV</span>
        </div>
      </div>

      {/* Interactive Audit Modal */}
      {selectedStandard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-left">
            <button
              onClick={() => setSelectedStandard(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                  Accreditation Dossier
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedStandard.title}
                </h3>
              </div>
            </div>

            <div className="space-y-3 py-2 text-xs sm:text-sm text-slate-600">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <p>
                  <strong className="text-slate-900">Issuing Regulatory Body:</strong>{' '}
                  {selectedStandard.issuingBody}
                </p>
                <p>
                  <strong className="text-slate-900">Operational Scope:</strong>{' '}
                  {selectedStandard.scope}
                </p>
                <p>
                  <strong className="text-slate-900">Surveillance Audit Cycle:</strong>{' '}
                  {selectedStandard.inspectionCycle}
                </p>
              </div>

              <p className="leading-relaxed text-slate-700">
                {selectedStandard.description}
              </p>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Key Quality Control Checkpoints:
                </h4>
                <ul className="space-y-1.5">
                  {selectedStandard.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedStandard(null)}
                className="px-5 py-2 rounded-xl font-bold text-xs bg-[#0B1B3D] text-white hover:bg-slate-800 transition-colors"
              >
                Close Audit Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
