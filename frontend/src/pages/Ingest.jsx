import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../api/config';

const Ingest = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessions, setSessions] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await apiRequest('/api/documents');
      setSessions(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      console.error('Failed to fetch ingestion sessions:', err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress(50);
      await apiRequest('/api/upload', 'POST', formData, true);
      
      setProgress(100);
      setFile(null);
      fetchSessions();
      alert('Intelligence Asset Locked in Vault.');
    } catch (err) {
      alert(err.message || 'Transmission failed.');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="pt-8 min-h-screen p-12 bg-surface">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D32F2F] font-black mb-2 block">System Protocol</span>
            <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface text-white">Intelligence Ingestion Workflow</h2>
            <p className="text-on-surface-variant mt-2 max-w-xl font-light">Transform unstructured data into sovereign knowledge assets through our neural extraction pipeline.</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/40 mb-1">Workflow Status</div>
            <div className="flex items-center gap-2 text-primary font-bold font-headline">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Active Link
            </div>
          </div>
        </div>

        {/* Multi-step Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-white">
          <div className={`p-4 rounded-lg flex items-center gap-4 border-l-4 transition-all ${progress < 50 ? 'bg-surface-container-low border-primary shadow-lg border-y border-r border-white/5' : 'bg-surface-container-lowest opacity-50 border border-white/5'}`}>
            <div className={`w-10 h-10 rounded flex items-center justify-center font-bold ${progress < 50 ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>01</div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Step One</p>
              <p className="font-headline font-bold text-sm">Source Selection</p>
            </div>
          </div>
          <div className={`p-4 rounded-lg flex items-center gap-4 border-l-4 transition-all ${(progress >= 50 && progress < 100) ? 'bg-surface-container-low border-primary shadow-lg border-y border-r border-white/5' : 'bg-surface-container-lowest opacity-50 border border-white/5'}`}>
            <div className={`w-10 h-10 rounded flex items-center justify-center font-bold ${(progress >= 50 && progress < 100) ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>02</div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Step Two</p>
              <p className="font-headline font-bold text-sm">Neural Syncing</p>
            </div>
          </div>
          <div className={`p-4 rounded-lg flex items-center gap-4 border-l-4 transition-all ${progress === 100 ? 'bg-surface-container-low border-primary shadow-lg border-y border-r border-white/5' : 'bg-surface-container-lowest opacity-50 border border-white/5'}`}>
            <div className={`w-10 h-10 rounded flex items-center justify-center font-bold ${progress === 100 ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>03</div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Step Three</p>
              <p className="font-headline font-bold text-sm">Extraction</p>
            </div>
          </div>
        </div>

        {/* Wizard Canvas */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <div className="glass-panel p-8 md:p-12 rounded-xl relative overflow-hidden border border-white/5 bg-surface-container-low/40">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/10 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-headline font-bold mb-6 text-white">Source Selection</h3>
                {/* Drop Zone */}
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-outline-variant/30 rounded-xl p-12 md:p-16 flex flex-col items-center justify-center bg-surface-container-lowest/50 hover:bg-surface-container-low/80 hover:border-primary-container/50 transition-all group cursor-pointer mb-8 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-primary-container/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-4xl text-primary-container font-light">
                      {file ? 'check_circle' : 'upload_file'}
                    </span>
                  </div>
                  <p className="text-xl font-headline font-medium mb-2 text-white">
                    {file ? file.name : 'Drag and drop artifacts here'}
                  </p>
                  <p className="text-on-surface-variant text-sm mb-6">Support for PDF, JSON, TXT, and Neural Streams (Max 2GB)</p>
                  <button className="px-8 py-3 bg-surface-container-highest border border-outline-variant/30 rounded-lg text-sm font-bold hover:bg-surface-bright transition-colors text-white">
                    {file ? 'Change Asset' : 'Browse Local Grid'}
                  </button>
                </div>
                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      <span>Stream Integrity</span>
                      <span className="text-white">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-container shadow-[0_0_15px_#D32F2F] transition-all duration-500 relative"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end pt-6">
                  <button 
                    disabled={!file || uploading}
                    onClick={handleUpload}
                    className={`w-full md:w-auto px-10 py-4 font-headline font-bold rounded-lg transition-all flex items-center justify-center gap-3 ${!file || uploading ? 'bg-surface-container-highest text-on-surface-variant opacity-50 cursor-not-allowed' : 'bg-primary-container text-on-primary-container hover:scale-[1.02] active:scale-95'}`}
                  >
                    {uploading ? 'Vaulting...' : 'Initiate Secure Ingest'}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contextual Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6 text-white">
            <div className="bg-surface-container-low p-6 rounded-xl border border-white/5">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black mb-4">Neural Configuration</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded bg-surface-container-high border border-primary-container/20">
                  <span className="material-symbols-outlined text-primary-container mt-1">psychology_alt</span>
                  <div>
                    <p className="text-sm font-bold">Groq-Llama3</p>
                    <p className="text-xs text-on-surface-variant/60 leading-relaxed">High-fidelity reasoning for sensitive legislative documents.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="mt-12">
          <h3 className="text-xl font-headline font-bold mb-8 flex items-center gap-3 text-white">
            <span className="w-1 h-6 bg-primary-container rounded-full"></span>
            Recent Ingestion Sessions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, i) => (
              <div key={i} className="bg-surface-container-low rounded-xl p-6 hover:bg-surface-container-high transition-colors group cursor-pointer border border-white/5 text-white">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center text-primary-container">
                      <span className="material-symbols-outlined">policy</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-sm truncate max-w-[150px]">{session?.filename || 'Unknown'}</h5>
                      <p className="text-[10px] text-on-surface-variant">Processed {session?.created_at ? new Date(session.created_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <span className="bg-primary-container/10 text-primary-container text-[8px] font-black px-2 py-1 rounded border border-primary-container/20 uppercase tracking-widest">Completed</span>
                </div>
                <div className="p-3 bg-surface-container-lowest rounded border border-white/5">
                  <p className="text-[9px] text-on-surface-variant uppercase mb-1 tracking-tighter">Summary Extraction</p>
                  <p className="text-[10px] line-clamp-2 opacity-60 leading-tight">{session.summary || 'Summary unavailable.'}</p>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="col-span-full py-12 text-center text-xs uppercase tracking-widest opacity-30 text-white">
                No ingestion traces detected in current neural layer.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ingest;
