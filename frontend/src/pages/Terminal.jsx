import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../api/config';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const fetchHistory = async () => {
    try {
      const data = await apiRequest('/api/terminal/history');
      const logs = Array.isArray(data) ? data : (data?.data || []);
      if (logs.length > 0) {
        setHistory(logs.map(log => ({
          type: log.output_type,
          content: log.output_type === 'user' ? `root@reginova:~$ ${log.command}` : log.output
        })));
      } else {
        setHistory([
          { type: 'system', content: '[SYSTEM] Initializing RegiNova Sovereign Core v4.2.0...' },
          { type: 'system', content: '[SYSTEM] Loading encrypted neural weights...' },
          { type: 'success', content: 'DONE: 14,829 layers initialized successfully.' },
          { type: 'system', content: '[SYSTEM] Type "help" for available commands.' }
        ]);
      }
    } catch (err) {
      setHistory([
        { type: 'system', content: '[SYSTEM] Initializing RegiNova Sovereign Core v4.2.0...' },
        { type: 'system', content: '[SYSTEM] Loading encrypted neural weights...' },
        { type: 'success', content: 'DONE: 14,829 layers initialized successfully.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCommand = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const cmd = input.trim();
      setHistory([...history, { type: 'user', content: `root@reginova:~$ ${cmd}` }]);
      setInput('');
      
      try {
        const result = await apiRequest('/api/terminal/execute', 'POST', { command: cmd });
        if (result) {
          setHistory(prev => [...prev, { type: result.output_type || 'system', content: result.output }]);
        }
      } catch (err) {
        setHistory(prev => [...prev, { type: 'error', content: 'Neural link interrupted. Command failed.' }]);
      }
    }
  };

  return (
    <div className="p-8 h-[calc(100vh-64px)] flex flex-col space-y-8">
      <div className="flex justify-between items-end">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-primary-container/20 text-primary-container text-[10px] font-bold uppercase tracking-widest rounded border border-primary-container/20">Active Node</span>
            <span className="text-on-surface-variant text-xs font-mono opacity-50">ID: RN-9902-TERMINAL</span>
          </div>
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight leading-tight text-white">Sovereign Command Console</h2>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 mb-1 font-bold">System Load</span>
            <div className="w-32 h-1 bg-surface-container-high rounded-full overflow-hidden border border-white/5">
              <div className="w-2/3 h-full bg-primary-container shadow-[0_0_10px_rgba(211,47,47,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        <div className="col-span-12 lg:col-span-9 flex flex-col bg-surface-container-low/60 backdrop-blur-xl rounded-xl overflow-hidden border border-white/5 shadow-2xl relative">
          <div className="h-10 bg-surface-container-highest/40 flex items-center justify-between px-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
              </div>
              <span className="ml-4 text-[11px] font-mono text-on-surface-variant opacity-60">root@reginova-ai:~/kernel/neural-net</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-on-surface-variant opacity-60">
              <span>CPU: 42%</span>
              <span>MEM: 12.4GB</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed space-y-2 custom-scrollbar">
            {loading ? (
              <p className="text-primary-container">Initializing neural interface...</p>
            ) : (
              history.map((line, i) => (
                <p 
                  key={i} 
                  className={`${
                    line.type === 'system' ? 'text-on-surface-variant opacity-50' :
                    line.type === 'success' ? 'text-green-400/80' :
                    line.type === 'warning' ? 'text-primary-container font-bold' :
                    line.type === 'user' ? 'text-on-surface text-white' :
                    line.type === 'progress' ? 'text-primary-container' : 'text-on-surface-variant'
                  }`}
                >
                  {line.content}
                </p>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="h-16 bg-surface-container-lowest/80 border-t border-white/5 px-6 flex items-center gap-3">
            <span className="font-mono text-primary-container font-bold text-lg">❯</span>
            <input 
              className="bg-transparent border-none focus:ring-0 w-full font-mono text-on-surface placeholder:text-on-surface-variant/20 text-sm text-white"
              placeholder="Enter command..."
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              autoFocus
            />
            <div className="flex items-center gap-3 ml-4">
              <span className="text-[10px] font-mono text-on-surface-variant/30 font-bold tracking-tighter">UTF-8</span>
              <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">memory</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:col-span-3 lg:flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="bg-surface-container-low/40 backdrop-blur-xl rounded-xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-headline uppercase tracking-widest text-on-surface-variant font-bold">System Health</h3>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1">
                  <span className="opacity-60">Neural Stability</span>
                  <span className="text-primary-container font-bold">99.8%</span>
                </div>
                <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="w-[99.8%] h-full bg-primary-container shadow-[0_0_10px_rgba(211,47,47,0.3)]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1">
                  <span className="opacity-60">Memory Usage</span>
                  <span className="text-on-surface text-white">74%</span>
                </div>
                <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="w-[74%] h-full bg-on-surface-variant opacity-60"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-surface-container-low/40 backdrop-blur-xl rounded-xl p-5 border border-white/5 flex flex-col overflow-hidden">
            <h3 className="text-xs font-headline uppercase tracking-widest text-on-surface-variant font-bold mb-4">Active Processes</h3>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {[
                { name: 'kernel_daemon', id: '0421', status: 'Background sync active' },
                { name: 'nlp_engine_v4', id: '0988', status: 'Processing chat-query-7...' },
                { name: 'sec_vault_listener', id: '0011', status: 'Monitoring access logs' },
                { name: 'analytical_opt', id: 'ACTV', status: 'Running simulation...', active: true }
              ].map((proc, i) => (
                <div 
                  key={i}
                  className={`p-3 rounded-lg border transition-all ${
                    proc.active ? 'bg-primary-container/10 border-primary-container/30' : 'bg-surface-container-high/40 border-white/5 hover:bg-surface-container-high'
                  } cursor-pointer group`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-mono font-bold ${proc.active ? 'text-primary-container' : 'text-primary-fixed-dim'}`}>{proc.name}</span>
                    <span className={`text-[9px] font-mono opacity-40 ${proc.active ? 'text-primary-container' : ''}`}>{proc.id}</span>
                  </div>
                  <div className="text-[10px] text-on-surface-variant opacity-60">{proc.status}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="bg-primary-container rounded-xl p-5 shadow-lg shadow-primary-container/20 group hover:scale-[1.02] transition-all cursor-pointer border border-white/10 active:scale-95">
            <div className="flex items-center gap-3 text-on-primary-container">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <div className="text-left">
                <div className="text-sm font-bold font-headline uppercase tracking-tight">Reboot Node</div>
                <div className="text-[10px] opacity-70 font-medium">Restart all local services</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
