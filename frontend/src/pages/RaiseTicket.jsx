import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/config';

const RaiseTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Neural Node Error',
    priority: 'Medium',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please provide a subject and detailed description.');
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequest('/api/tickets', 'POST', formData);
      navigate(`/ticket-status/${result[0].id}`); 
    } catch (err) {
      alert(err.message || 'Transmission failed. Sovereign review unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <div className="pt-24 min-h-screen bg-background relative overflow-x-hidden custom-scrollbar pb-12">
      {/* Ambient Glow Background */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-container/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary-container/3 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-8 relative z-10">
        {/* Form Header */}
        <header className="mb-10 text-center">
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2 text-wrap-balance text-white">
            Raise Support Ticket
          </h2>
          <p className="text-on-surface-variant/70 font-body text-sm">
            Detail your intelligence anomaly or system request for immediate Sovereign review.
          </p>
        </header>

        {/* Glass Ticket Container */}
        <section className="bg-surface-variant/10 backdrop-blur-2xl rounded-xl p-8 border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(211,47,47,0.05)]">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Grid Layout for Subject & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[2px] font-bold text-on-surface-variant/60 ml-1">Subject</label>
                <input 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container/20 transition-all text-on-surface placeholder:text-on-surface-variant/20" 
                  placeholder="Brief summary of the issue..." 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[2px] font-bold text-on-surface-variant/60 ml-1">Category</label>
                <div className="relative">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container/20 transition-all text-on-surface appearance-none cursor-pointer"
                  >
                    <option>Neural Node Error</option>
                    <option>Access Restriction</option>
                    <option>Latency Issue</option>
                    <option>Other</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/40">expand_more</span>
                </div>
              </div>
            </div>

            {/* Priority Level (Segmented Control) */}
            <div className="space-y-3">
              <label className="block text-[10px] uppercase tracking-[2px] font-bold text-on-surface-variant/60 ml-1">Priority Level</label>
              <div className="grid grid-cols-4 gap-2 p-1.5 bg-surface-container-lowest rounded-xl">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      formData.priority === p 
                        ? p === 'Critical' ? 'bg-error/20 text-error border border-error/30' : 'bg-surface-variant/40 text-on-surface border border-white/5'
                        : 'text-on-surface-variant/60 hover:bg-surface-bright'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[2px] font-bold text-on-surface-variant/60 ml-1">Detailed Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container/20 transition-all text-on-surface placeholder:text-on-surface-variant/20 resize-none" 
                placeholder="Provide full context of the anomaly..." 
                rows="5"
              ></textarea>
            </div>

            {/* Attachment Drag & Drop */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[2px] font-bold text-on-surface-variant/60 ml-1">Attachments</label>
              <div className="border-2 border-dashed border-white/5 rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-lowest/30 hover:bg-surface-container-lowest/50 transition-all group cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 group-hover:text-primary-container transition-colors mb-2">upload_file</span>
                <p className="text-xs text-on-surface-variant/50">Drag logs or screenshots here, or <span className="text-primary-container font-bold">browse</span></p>
                <p className="text-[10px] text-on-surface-variant/20 mt-1">Maximum file size: 25MB (PDF, PNG, JSON, LOG)</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <Link to="/support" className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-[2px] hover:text-on-surface transition-colors px-6">
                Cancel
              </Link>
              <Link
                to="/ticket-status"
                className="bg-primary-container hover:scale-[1.02] active:scale-95 transition-all px-10 py-4 rounded-lg flex items-center gap-3 shadow-[0_0_20px_rgba(211,47,47,0.3)] group"
              >
                <span className="text-sm font-headline font-extrabold uppercase tracking-widest text-on-primary-container">Submit Ticket</span>
                <span className="material-symbols-outlined text-on-primary-container text-lg group-hover:translate-x-1 transition-transform">send</span>
              </Link>
            </div>
          </form>
        </section>

        {/* Footer Info */}
        <footer className="mt-8 flex justify-center items-center gap-8 opacity-40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            <span className="text-[9px] uppercase tracking-[1px] text-on-surface">Encrypted Channel</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xs">timer</span>
            <span className="text-[9px] uppercase tracking-[1px] text-on-surface">Avg Response: 4.2 mins</span>
          </div>
        </footer>
      </div>

      {/* Visual Polish Overlay */}
      <div className="fixed inset-0 pointer-events-none border-[1rem] border-background z-20 opacity-50"></div>
    </div>
  );
};

export default RaiseTicket;
