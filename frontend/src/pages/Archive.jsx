import { useState, useEffect } from 'react';
import { apiRequest } from '../api/config';

const Archive = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      const data = await apiRequest('/api/archive');
      setArchives(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      console.error('Failed to sync archive:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (archiveId) => {
    try {
      await apiRequest(`/api/archive/${archiveId}/restore`, 'POST');
      fetchArchives();
    } catch (err) {
      console.error('Failed to restore:', err);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="pt-24 px-8 pb-12 min-h-screen">
      <div className="mb-12 flex justify-between items-end">
        <div className="max-w-2xl">
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-2 text-white border-none">Archive Vault</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">Secured repository of dormant intelligence. Items here are in cryptographic stasis.</p>
        </div>
        <div className="flex gap-4 text-white">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface-variant font-semibold hover:bg-surface-container-high transition-colors text-sm">
            <span className="material-symbols-outlined text-sm">settings_backup_restore</span>
            Restore All
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:brightness-110 transition-colors text-sm">
            <span className="material-symbols-outlined text-sm">auto_delete</span>
            Deep Purge
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12 text-on-surface-variant opacity-30">Accessing archive vault...</div>
      ) : archives.length > 0 ? (
        <div className="grid grid-cols-12 gap-6">
          {archives.map((archive) => (
            <div 
              key={archive.id}
              className="group relative overflow-hidden rounded-xl bg-surface-container-low min-h-[200px] border border-white/5"
            >
              <div className="relative p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary-container/20 text-[#D32F2F] text-[10px] font-bold uppercase tracking-widest border border-[#D32F2F]/20">
                      {archive.status === 'Dormant' ? 'High Priority Cold Storage' : archive.status}
                    </span>
                    <span className="text-on-surface-variant/40 text-xs font-mono">ID: {archive.archive_id || 'N_ARCH_'}</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface text-white">{archive.filename}</h3>
                  <p className="text-on-surface-variant/80 mt-2 max-w-md">Type: {archive.file_type} | Size: {archive.file_size_mb} MB</p>
                </div>
                <div className="flex items-center gap-8 mt-8 text-white">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-tighter">Last Access</span>
                    <span className="text-sm font-bold">{formatDate(archive.last_accessed)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-tighter">Encryption</span>
                    <span className="text-sm font-bold italic">{archive.encryption_level}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-tighter">Status</span>
                    <span className="text-sm font-bold text-[#D32F2F]">{archive.status}</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#131315]/80 backdrop-blur-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 backdrop-blur-md">
                  <span className="material-symbols-outlined text-3xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <p className="text-on-surface font-headline font-bold mb-6 text-white text-lg">Access Restricted</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleRestore(archive.id)}
                    className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-bold text-xs hover:brightness-110 transition-all"
                  >
                    RESTORE
                  </button>
                  <button className="bg-surface-container-highest text-on-surface px-6 py-2 rounded-lg font-bold text-xs hover:bg-surface-bright transition-all text-white">DETAILS</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-low min-h-[400px] border border-white/5">
            <img 
              alt="Neural Network Visualization" 
              className="absolute inset-0 w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgDXCGAXwZmWRchlHjWgLfI5RCvnSKkKzbItofUftc_DoqW4vC5Lf1nTfsjVMF8If7puCk2W_rNm1bYaicJYM8tQojDv7dpSD8NzFh8ScZLuWfJN7Hk0ss7RC1i687S3RYIlTgyWAaskSa1nbZQ8xbWWhGP_qqcE5rWmqXehPWfbX2qIY_OfYfRaFkD_clchsZezjTrgvyq8HeYC-M9ubWXsUPZoQ-3yUYuviYiwdn3xICPdYJlteP0XsOgh2tzuJu5vm0qhtxn4lO"
            />
            <div className="relative p-8 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary-container/20 text-[#D32F2F] text-[10px] font-bold uppercase tracking-widest border border-[#D32F2F]/20">High Priority Cold Storage</span>
                  <span className="text-on-surface-variant/40 text-xs font-mono">ID: N_ARCH_EMPTY</span>
                </div>
                <h3 className="font-headline text-3xl font-bold text-on-surface text-white">Archive Vault Empty</h3>
                <p className="text-on-surface-variant/80 mt-2 max-w-md">No archived documents yet. Archive documents from your vault to see them here.</p>
              </div>
            </div>
          </div>
          <div className="col-span-4 group relative overflow-hidden rounded-xl bg-surface-container-low min-h-[400px] border border-white/5">
            <div className="p-8 flex flex-col h-full">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-6 border border-white/5 text-white">
                <span className="material-symbols-outlined text-on-surface-variant">description</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-2 text-white">No Expired Documents</h3>
              <p className="text-on-surface-variant/70 text-sm leading-relaxed mb-8">All documents are within their active retention period.</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 p-6 rounded-xl bg-surface-container-lowest border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></div>
            <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Vault Status: Secure</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-tighter">Total Archived Data</span>
            <span className="text-sm font-bold text-white">{archives.length} Items</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-tighter">Auto-Purge Cycle</span>
            <span className="text-sm font-bold text-white">90 Days</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-bold">Protocol</span>
          <span className="text-xs px-2 py-1 bg-surface-container-highest rounded font-mono text-on-surface border border-white/10 text-white">VOID-S8-ARCHIVE</span>
        </div>
      </div>
    </div>
  );
};

export default Archive;
