import { useState, useEffect } from 'react';
import { apiRequest } from '../api/config';

const Search = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await apiRequest('/api/history');
      setHistory(data);
    } catch (err) {
      console.error('Failed to sync neural history:', err);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await apiRequest('/api/search', 'POST', { query: userMessage.content });
      const aiMessage = { 
        role: 'assistant', 
        content: response?.answer || 'No answer generated', 
        sources: response?.sources || [] 
      };
      setMessages(prev => [...prev, aiMessage]);
      fetchHistory();
    } catch (err) {
      console.error('Search error:', err);
      const errorMessage = { role: 'assistant', content: 'Neural link interrupted. Please recalibrate your query.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden relative min-h-screen bg-surface">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-container/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Chat & Content Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface (Center) */}
        <section className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 pt-8 pb-32 overflow-y-auto custom-scrollbar">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-20 text-center">
              <span className="material-symbols-outlined text-6xl mb-4 text-primary">psychology</span>
              <p className="font-headline font-bold text-xl uppercase tracking-widest text-white">Neural Search Active</p>
              <p className="text-sm max-w-xs mt-2">Awaiting your query to synchronize with the policy knowledge base.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`mb-10 flex gap-6 items-start ${msg.role === 'user' ? 'self-end max-w-[85%]' : 'max-w-full'}`}>
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex-shrink-0 flex items-center justify-center border border-primary/10">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
              )}
              <div className={`flex-1 space-y-4 ${msg.role === 'user' ? 'bg-surface-container-high p-4 rounded-xl rounded-tr-none shadow-xl border-l-2 border-primary/30' : ''}`}>
                <div className="prose prose-invert max-w-none">
                  <p className={`text-sm leading-relaxed text-white ${msg.role === 'assistant' ? 'text-on-surface-variant' : ''}`}>
                    {msg.content}
                  </p>
                </div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-4 border-t border-outline-variant/10">
                    <h5 className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Verified Sources ({msg.sources.length})</h5>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, sIdx) => (
                        <div key={sIdx} className="bg-surface-container-lowest px-3 py-1.5 rounded-full text-[10px] border border-outline-variant/10 text-on-surface-variant flex items-center gap-2">
                          <span className="material-symbols-outlined text-[12px]">description</span> {src?.filename || 'Unknown'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="mb-10 flex gap-6 items-start animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex-shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary/30">sync</span>
              </div>
              <div className="h-4 bg-surface-container-high w-64 rounded"></div>
            </div>
          )}
        </section>

        {/* Side Panel (Session Intelligence) */}
        <aside className="w-80 bg-surface-container-low border-l border-outline-variant/5 flex flex-col hidden xl:flex">
          <div className="p-6 border-b border-outline-variant/5">
            <h3 className="font-headline font-bold text-sm text-on-surface mb-4 text-white uppercase tracking-widest">Neural Sessions</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded border border-primary/20 uppercase">RAG v3</span>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded border border-primary/20 uppercase">GROQ</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="mb-8">
              <h4 className="text-[10px] text-on-surface-variant/50 uppercase tracking-[0.2em] font-bold mb-4 text-white">History Logs</h4>
              <div className="space-y-4">
                {history.map((h, i) => (
                  <div key={i} className="group cursor-pointer" onClick={() => { setQuery(h.query); handleSearch(); }}>
                    <p className="text-xs text-on-surface-variant group-hover:text-on-surface line-clamp-2 transition-colors uppercase font-mono tracking-tighter">{h.query || 'Unknown query'}</p>
                    <span className="text-[9px] text-on-surface-variant/40 mt-1 block">{h.created_at ? new Date(h.created_at).toLocaleString() : (h.timestamp ? new Date(h.timestamp).toLocaleString() : '')}</span>
                  </div>
                ))}
                {history.length === 0 && <p className="text-[10px] opacity-20 uppercase tracking-widest">No neural traces</p>}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Chat Input */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-surface via-surface/90 to-transparent">
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center bg-surface-container-low border border-white/5 rounded-2xl p-2 shadow-2xl focus-within:border-primary/40 transition-all">
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-4 px-4 text-on-surface placeholder:text-on-surface-variant/30 text-white"
              placeholder="Query the sovereign knowledge base..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <div className="flex items-center gap-2 pr-2">
              <button 
                type="submit"
                disabled={loading || !query.trim()}
                className="flex items-center gap-2 bg-primary-container hover:brightness-110 disabled:opacity-50 text-on-primary-container px-6 py-2.5 rounded-xl font-headline font-bold text-sm transition-all shadow-lg shadow-primary-container/20 group"
              >
                {loading ? 'Processing...' : 'Process'} 
                {!loading && <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">send</span>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
