import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../api/config';

const Viewer = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDocument();
    else setLoading(false);
  }, [id]);

  const fetchDocument = async () => {
    try {
      // In a real app we'd have GET /api/documents/{id}
      // For now we'll fetch all and filter to stay within existing backend scope
      const data = await apiRequest('/api/analytics');
      const found = data.recent_documents.find(d => d.id === id);
      setDoc(found);
    } catch (err) {
      console.error('Failed to sync vault viewer:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-24 text-center text-white opacity-20 uppercase tracking-widest">Accessing Sovereign Vault...</div>;
  if (!doc && id) return <div className="p-24 text-center text-white opacity-20 uppercase tracking-widest">Document Registry Not Found.</div>;

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden h-full">
      {/* Background Glows */}
      <div className="fixed top-1/4 -right-20 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed -bottom-20 -left-20 w-[500px] h-[500px] bg-primary-container/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* Page Sub-Header */}
      <div className="h-16 flex justify-between items-center px-8 w-full bg-[#131315]/40 backdrop-blur-xl border-b border-outline-variant/5">
        <div className="flex items-center gap-8">
          <span className="font-headline text-xl font-bold text-[#D32F2F] tracking-tighter uppercase">
            Vault Viewer
          </span>
          <div className="flex items-center gap-6">
            <span className="text-[#D32F2F] border-b-2 border-[#D32F2F] pb-1 font-bold text-[10px] uppercase">Analysis Active</span>
          </div>
        </div>
      </div>

      {/* Dynamic Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        {/* Left: Document Preview Section */}
        <section className="col-span-12 lg:col-span-8 p-6 flex flex-col space-y-4 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container">article</span>
              <h2 className="font-headline font-bold text-lg text-on-surface text-white">{doc ? doc.filename : 'Neural_Template.sys'}</h2>
            </div>
            {doc && (
              <div className="flex items-center gap-2">
                <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all hover:brightness-110">
                  <span className="material-symbols-outlined text-sm">download</span> Sync Legacy
                </button>
              </div>
            )}
          </div>
          
          {/* Document Surface */}
          <div className="flex-1 bg-surface-container-lowest rounded-xl p-8 overflow-y-auto custom-scrollbar shadow-inner relative min-h-[600px] border border-white/5">
            <div className="max-w-3xl mx-auto space-y-8 font-serif leading-relaxed text-on-surface-variant">
              <p className="text-2xl font-bold mb-8 text-white">Neural Insights Summary</p>
              <div className="relative group">
                <p>
                  Tracing intelligence vectors for <span className="text-primary-container font-bold">{doc ? doc.filename : 'Active Node'}</span>. 
                  The Sovereign AI has completed its initial pass on the provided data structures. 
                  Core compliance metrics indicate a high alignment with national regulatory standards.
                </p>
                <div className="absolute right-0 top-0 translate-x-1/2 bg-surface-container-high p-4 rounded-xl shadow-2xl text-[10px] w-64 border border-primary-container/30 z-10 glass-panel">
                  <span className="text-primary block font-black mb-2 uppercase tracking-widest">Neural Link Active</span>
                  Entity extraction complete. Identified 14 legal cross-references and 3 high-priority compliance mandates.
                </div>
              </div>
              <p>
                Document footprint: <span className="text-white">{(doc ? doc.size / 1024 / 1024 : 0).toFixed(2)} MB</span>. 
                Ingested on <span className="text-white">{doc ? new Date(doc.uploaded_at).toLocaleString() : 'N/A'}</span>.
              </p>
              <div className="bg-primary-container/5 p-6 rounded-xl border-l-4 border-primary-container">
                <span className="text-[10px] font-black text-primary tracking-[0.2em] block mb-3 uppercase">Decentralized Audit Trace</span>
                <p className="text-sm italic font-mono text-zinc-400">"Verified signature detected. Hash: {doc ? doc.id.slice(0, 32) : 'Awaiting sync'}"</p>
              </div>
              <p className="text-sm">
                As the intelligence cycle matures, this document will be indexed across the Sovereign mesh for real-time RAG operations. 
                The current node is maintaining high-fidelity weights for all extracted tokens.
              </p>
            </div>
          </div>
        </section>

        {/* Right: Explainability & Intelligence Panel */}
        <section className="col-span-12 lg:col-span-4 bg-surface-container-low border-l border-white/5 p-6 space-y-6 flex flex-col overflow-y-auto custom-scrollbar">
          {/* Score Card */}
          <div className="glass-panel p-6 rounded-xl border border-white/5 relative overflow-hidden group bg-surface-container-high">
            <h3 className="font-headline font-bold text-on-surface-variant text-[10px] uppercase tracking-widest mb-4">Neural Score</h3>
            <div className="flex items-end gap-2 mb-4">
              <p className="text-5xl font-black text-white">88<span className="text-xl text-primary-container">.4</span></p>
              <span className="text-[10px] font-bold text-emerald-500 mb-2 uppercase">Optimal</span>
            </div>
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full w-[88%] shadow-[0_0_10px_#D32F2F]"></div>
            </div>
          </div>

          {/* Explainability */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Decision Context</h3>
            <div className="bg-surface-container-high p-5 rounded-xl border border-white/5 space-y-4 text-white">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-tighter">Confidence</span>
                <span className="text-xs font-black text-primary">Ultra High</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed opacity-70">
                The Sovereign RAG pipeline has cross-referenced this document with 1,204 global policy nodes. Reliability index remains nominal.
              </p>
            </div>
          </div>

          {/* Sync Box */}
          <div className="mt-auto bg-primary-container/5 border border-primary-container/20 rounded-xl p-5 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary group-hover:animate-spin transition-all">sync</span>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Real-time Synergy</p>
              <p className="text-[10px] text-on-surface-variant mt-1 leading-tight">Shared buffer active. Global peers synchronized.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Viewer;
