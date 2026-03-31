import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/config';

const TicketStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      let ticketId = id;
      if (!ticketId) {
        const ticketsData = await apiRequest('/api/tickets');
        const tickets = Array.isArray(ticketsData) ? ticketsData : (ticketsData?.data || []);
        if (tickets.length > 0) {
          ticketId = tickets[0].id;
        } else {
          setLoading(false);
          return;
        }
      }
      const data = await apiRequest(`/api/tickets/${ticketId}`);
      setTicket({
        ...data,
        subject: data.title,
        messages: data.replies || []
      });
    } catch (err) {
      console.error('Failed to sync neural ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    if (e) e.preventDefault();
    if (!reply.trim() || !ticket) return;

    try {
      await apiRequest(`/api/tickets/${ticket.id}/reply`, 'POST', { message: reply });
      setReply('');
      fetchTicket();
    } catch (err) {
      alert('Transmission failed. Neural feedback loop interrupted.');
    }
  };

  if (loading) return <div className="p-24 text-center text-white opacity-20 uppercase tracking-widest">Synchronizing Neural Stream...</div>;
  if (!ticket) return <div className="p-24 text-center text-white opacity-20 uppercase tracking-widest">No Active Tickets Detected.</div>;

  return (
    <div className="pt-24 min-h-screen bg-background relative overflow-x-hidden pb-12">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/5 blur-[150px] -z-10 rounded-full"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-red-600/5 blur-[120px] -z-10 rounded-full"></div>

      <div className="p-8 max-w-7xl mx-auto grid grid-cols-12 gap-8 relative z-10">
        {/* Ticket Header Section */}
        <div className="col-span-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${
                    ticket.priority === 'Critical' ? 'bg-error/20 text-error border-error/50' : 'bg-red-950/40 text-red-500 border-red-900/50'
                  }`}>{ticket.priority}</span>
                <span className="text-zinc-500 font-mono text-sm uppercase">RN-{ticket.id.slice(0,6)}</span>
              </div>
              <h2 className="text-4xl font-black font-headline tracking-tight text-white leading-none">{ticket.subject}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Current Status</p>
                <p className="text-red-500 font-bold flex items-center gap-2 justify-end">
                  <span className={`w-2 h-2 rounded-full ${ticket.status === 'Open' ? 'bg-red-600 animate-pulse' : 'bg-emerald-500'}`}></span>
                  {ticket.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Column: Timeline & Health Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Vertical Stepper */}
          <section className="bg-surface-variant/10 backdrop-blur-2xl rounded-xl p-8 border border-white/5 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8">Process Lifecycle</h3>
            <div className="space-y-0">
              {/* Step 1 */}
              <div className="relative flex gap-6 pb-10">
                <div className="absolute left-4 top-8 bottom-0 w-px bg-zinc-800"></div>
                <div className="relative z-10 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <span className="material-symbols-outlined text-sm text-zinc-400">check</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-300">Ticket Raised</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">System triggered via user directive.</p>
                  <span className="text-[10px] font-mono text-zinc-600 mt-2 block">{new Date(ticket.created_at).toLocaleString()}</span>
                </div>
              </div>
              {/* Step 2 (Active based on status) */}
              <div className="relative flex gap-6 pb-10">
                <div className="absolute left-4 top-8 bottom-0 w-px bg-zinc-800"></div>
                <div className="relative z-10 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_20px_#D32F2F]">
                  <span className="material-symbols-outlined text-sm text-white animate-pulse">sync</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-500">{ticket.status === 'Open' ? 'Neural Review In Progress' : 'Solution Deployed'}</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {ticket.status === 'Open' ? 'Sovereign entities are analyzing the reported anomaly.' : 'The reported anomaly has been archived and resolved.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* System Health Stats */}
          <section className="bg-surface-variant/10 backdrop-blur-2xl rounded-xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[60px]"></div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 font-headline">System Context</h3>
            <div className="space-y-4">
              <div className="bg-zinc-950/40 p-4 rounded-lg border border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Category</span>
                <div className="text-lg font-black text-on-surface mt-1 text-white">{ticket.category}</div>
              </div>
              <div className="bg-zinc-950/40 p-4 rounded-lg border border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Description</span>
                <div className="text-xs text-zinc-500 mt-2 leading-relaxed">{ticket.description}</div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Chat Transcript */}
        <div className="col-span-12 lg:col-span-8">
          <section className="bg-surface-variant/10 backdrop-blur-2xl rounded-xl h-[720px] border border-white/5 shadow-2xl flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-red-950/40 flex items-center justify-center border border-red-900/30">
                    <span className="material-symbols-outlined text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-zinc-900"></span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-headline">Sovereign Feedback</h3>
                  <p className="text-xs text-zinc-500">Autonomous Defense Layer</p>
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {ticket.messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 max-w-[85%] ${msg.sender === 'User' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${msg.sender === 'User' ? 'bg-zinc-800 border-white/5' : 'bg-red-950/20 border-red-900/20'}`}>
                    <span className="material-symbols-outlined text-xs text-zinc-400">
                      {msg.sender === 'User' ? 'person' : 'memory'}
                    </span>
                  </div>
                  <div className={`space-y-2 ${msg.sender === 'User' ? 'text-right' : ''}`}>
                    <div className={`p-4 rounded-xl shadow-sm border ${msg.sender === 'User' ? 'bg-red-600/10 border-red-600/20 text-white rounded-tr-none' : 'bg-zinc-900/50 border-white/5 text-on-surface-variant rounded-tl-none'}`}>
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {ticket.messages.length === 0 && (
                <div className="text-center py-12 opacity-20 uppercase tracking-[0.2em] text-xs text-white">
                  Neural stream quiet. Awaiting sovereign review.
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleReply} className="p-6 border-t border-white/5 bg-zinc-950/20">
              <div className="flex items-center gap-4 bg-zinc-900/50 p-2 pl-4 rounded-xl border border-white/5 focus-within:border-red-600/40 transition-shadow">
                <input 
                  className="flex-1 bg-transparent border-none text-sm focus:ring-0 text-zinc-300 placeholder-zinc-600 font-body" 
                  placeholder="Respond to Sovereign Core..." 
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!reply.trim()}
                  className="bg-primary-container text-on-primary-container w-10 h-10 rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(211,47,47,0.2)] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TicketStatus;
