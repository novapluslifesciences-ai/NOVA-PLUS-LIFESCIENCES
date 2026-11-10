import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Send,
  X,
  ShieldAlert,
  Beaker,
  CheckCircle2,
  HelpCircle,
  Loader2,
  BookOpen,
} from 'lucide-react';

interface ClinicalAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductContext?: string;
}

export const ClinicalAIModal: React.FC<ClinicalAIModalProps> = ({
  isOpen,
  onClose,
  initialProductContext = 'BroCo Cough Syrup & Ferolex-F',
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [productContext, setProductContext] = useState<string>(initialProductContext);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sourceNotice, setSourceNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickClinicalQueries = [
    {
      title: 'Iron Bisglycinate Bioavailability',
      query: 'Compare the intestinal absorption kinetics and GI tolerability of Iron Bisglycinate Chelate in Ferolex-F versus conventional ferrous sulfate in maternal anemia.',
    },
    {
      title: 'BroCo Ivy Saponin Mechanism',
      query: 'Explain how Hederacoside C and Alpha-Hederin in BroCo syrup modulate beta-2 adrenergic receptors to reduce mucus viscosity and relieve bronchospasm.',
    },
    {
      title: 'Cranberry PACs vs Antibiotics',
      query: 'Detail how Type-A Proanthocyanidins in Cran Bee Sachets mechanically block uropathogenic E. coli P-fimbrial adhesion without contributing to bacterial resistance.',
    },
    {
      title: 'Antacid Buffer Kinetics',
      query: 'What is the acid-neutralizing capacity and mucosal raft stabilization mechanism of ACINOX antacid in hyperchlorhydria and gastritis?',
    },
  ];

  const handleQuery = async (queryText?: string) => {
    const q = queryText || prompt;
    if (!q.trim()) return;

    setLoading(true);
    setResponse(null);
    setSourceNotice(null);

    try {
      const res = await fetch('/api/clinical-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          productContext,
        }),
      });

      const data = await res.json();
      setResponse(data.answer || 'No response recorded.');
      if (data.source || data.notice) {
        setSourceNotice(data.source || data.notice);
      }
    } catch (err: any) {
      console.error(err);
      setResponse(
        'The query could not be completed at this moment. Please refer to our validated clinical monographs or contact our chief medical officer directly.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-left my-6 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-900 to-teal-800 text-teal-300 flex items-center justify-center shadow-md">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 uppercase tracking-wider">
                Clinical Pharmacopoeia AI
              </span>
              <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                gemini-4-argon • High Thinking
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Biomedical Formulation & Pharmacological Intelligence
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Quick Query Suggestions */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Sample In-Depth Clinical Inquiries:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickClinicalQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(item.query);
                    handleQuery(item.query);
                  }}
                  className="p-2.5 rounded-xl text-left bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-all text-xs group"
                >
                  <p className="font-bold text-slate-900 group-hover:text-teal-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    {item.title}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{item.query}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Response Box */}
          {loading && (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <div>
                <p className="text-sm font-bold text-slate-900">Synthesizing Clinical Pharmacological Analysis...</p>
                <p className="text-xs text-slate-500">Engaging high-level biomedical reasoning and cross-referencing pharmaceutical monographs.</p>
              </div>
            </div>
          )}

          {response && !loading && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs text-teal-300 border-b border-white/10 pb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <BookOpen className="w-4 h-4" /> Validated Pharmacopoeial Dossier
                </span>
                <span className="font-mono text-[11px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                  gemini-4-argon [ThinkingLevel.HIGH]
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-2 max-h-72 overflow-y-auto pr-2">
                {response}
              </div>

              {sourceNotice && (
                <p className="text-[11px] text-slate-400 italic pt-2 border-t border-white/10">
                  {sourceNotice}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuery();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a clinical question about mechanisms, interactions, or dosage..."
              className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Analyze</span>
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center mt-2">
            Clinical AI is designed for medical professionals, clinicians, and researchers. Always confirm with official batch-specific Certificates of Analysis.
          </p>
        </div>
      </div>
    </div>
  );
};
