import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/config';
import { Link } from 'react-router-dom';

const History = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await apiRequest('/api/documents');
      setDocuments(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      console.error('Failed to sync temporal logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc?.filename?.toLowerCase().includes(search.toLowerCase())
  );

      {/* Bento Filters */}
  return (
    <div className="max-w-7xl mx-auto px-10 py-12 relative z-10 min-h-screen">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-primary-container/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <h1 className="font-headline text-5xl font-extrabold text-on-surface tracking-tight mb-4 text-white">
            Session Archival & <span className="text-primary-container">Temporal Logs</span>
          </h1>
          <p className="text-on-surface-variant font-body text-lg leading-relaxed">
            Trace every intelligence cycle and document verification across the Sovereign mesh. Refined history for absolute auditability.
          </p>
        </div>
        <div className="w-full md:w-96">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#D32F2F]">search</span>
            <input 
              className="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary-container/30 transition-all outline-none text-white text-sm" 
              placeholder="Search sessions or filenames..." 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bento Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="md:col-span-2 glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4 bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-container">Entity Filter</span>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-primary-container text-on-primary-container rounded-full text-[10px] font-bold uppercase tracking-tighter">All Records</button>
            <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant hover:bg-surface-bright transition-colors rounded-full text-[10px] font-bold uppercase tracking-tighter">Processed</button>
            <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant hover:bg-surface-bright transition-colors rounded-full text-[10px] font-bold uppercase tracking-tighter">Neural Weights</button>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4 bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-container">Health Status</span>
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2 text-xs text-white">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 100% Integrity
             </div>
             <div className="flex items-center gap-2 text-xs text-on-surface-variant">
               <span className="w-2 h-2 rounded-full bg-primary/40"></span> No Anomalies
             </div>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4 bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-container">Temporal Frame</span>
          <div className="text-xs font-bold text-white uppercase opacity-40">UTC Synchronization Active</div>
        </div>
      </div>

      {/* History Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-white opacity-20 uppercase tracking-[0.3em]">Recalibrating Temporal Data...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-20 text-center text-white opacity-20 uppercase tracking-[0.3em]">No Temporal Records Identified</div>
        ) : (
          filteredDocs.map((doc, idx) => (
            <Link 
              key={idx} 
              to={`/viewer/${doc.id}`}
              className="group relative bg-surface-container-low hover:bg-surface-container-high transition-all duration-300 rounded-xl p-6 border-l-4 border-primary-container flex flex-col md:flex-row md:items-center gap-6 cursor-pointer"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-headline font-bold text-lg text-on-surface text-white group-hover:text-primary transition-colors">{doc.filename}</h3>
                  <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-[10px] font-bold uppercase tracking-tighter rounded border border-green-500/20">Verified</span>
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">schedule</span> {new Date(doc.created_at).toLocaleString()}</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">database</span> {doc.chunk_count} chunks</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">fingerprint</span> RN-{doc.id.slice(0,8)}</span>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Empty Space Footer */}
      <div className="mt-20 flex flex-col items-center justify-center text-center opacity-30">
        <div className="w-16 h-1px bg-gradient-to-r from-transparent via-[#D32F2F] to-transparent mb-6"></div>
        <p className="text-xs uppercase tracking-[0.4em] font-headline text-on-surface-variant">End of Temporal Logs</p>
      </div>
    </div>
  );
};

export default History;
