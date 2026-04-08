import { useState, useEffect, Fragment } from 'react';
import { apiRequest } from '../api/config';

const Admin = () => {
  const [settings, setSettings] = useState({
    theme: 'void',
    language: 'en',
    email_notifications: true,
    security_alerts: true,
    ai_model: 'llama-3-70b-8192',
    max_results: 5,
    auto_archive: false
  });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsData, statsData] = await Promise.all([
        apiRequest('/api/settings'),
        apiRequest('/api/admin/stats')
      ]);
      if (settingsData?.data) {
        setSettings(settingsData.data);
      }
      if (statsData?.data) {
        setStats(statsData.data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequest('/api/admin/settings', 'PUT', settings);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="p-24 text-center text-white opacity-20 uppercase tracking-widest">Loading admin panel...</div>;

  return (
    <div className="pt-24 min-h-screen bg-background relative overflow-hidden pb-12">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-tertiary-container/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-10 relative z-10">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <span className="text-primary tracking-[0.2em] font-headline uppercase block text-xs font-black">System Configuration</span>
            <h2 className="text-5xl font-black font-headline tracking-tighter text-white leading-none">Sovereign Admin Management</h2>
            {stats && (
              <div className="flex gap-6 text-xs text-on-surface-variant">
                <span>Documents: {stats.total_documents}</span>
                <span>Queries: {stats.total_queries}</span>
                <span>Tickets: {stats.total_tickets}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchData}
              className="px-6 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-headline font-bold text-sm hover:bg-surface-bright transition-all border border-white/5 text-white"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-headline font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-container/30 disabled:opacity-50"
            >
              {saving ? 'Syncing...' : 'Apply Sync'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 md:col-span-7 bg-surface-variant/10 backdrop-blur-2xl rounded-xl p-8 flex flex-col justify-between border border-white/5 shadow-2xl">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary-container">palette</span>
                <h3 className="text-xl font-bold font-headline tracking-tight text-white">UI Preferences</h3>
              </div>
              <p className="text-on-surface-variant/70 text-sm mb-8 max-w-md">Control the ocular presence of the RegiNova terminal. The Void mode optimizes for high-intelligence concentration.</p>
              <div className="space-y-4">
                <div 
                  onClick={() => updateSetting('theme', 'void')}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${settings.theme === 'void' ? 'bg-surface-container-lowest border-primary-container/40' : 'bg-surface-container-lowest/30 border-white/5 opacity-60 hover:opacity-100'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0E0E10] rounded border border-primary-container/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-container">dark_mode</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">Locked Void</p>
                      <p className="text-xs text-on-surface-variant/50">OLED-deep blacks and primary highlights</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${settings.theme === 'void' ? 'border-primary-container' : 'border-white/10'}`}>
                    {settings.theme === 'void' && <div className="w-3 h-3 bg-primary-container rounded-full shadow-[0_0_8px_#D32F2F]"></div>}
                  </div>
                </div>
                <div 
                  onClick={() => updateSetting('theme', 'dynamic')}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${settings.theme === 'dynamic' ? 'bg-surface-container-lowest border-primary-container/40' : 'bg-surface-container-lowest/30 border-white/5 opacity-60 hover:opacity-100'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container-highest/20 rounded flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant/40">auto_awesome</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-zinc-400">Dynamic Adaptive</p>
                      <p className="text-xs text-on-surface-variant/30">Follows system rhythm and light cycles</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${settings.theme === 'dynamic' ? 'border-primary-container' : 'border-white/10'}`}>
                    {settings.theme === 'dynamic' && <div className="w-3 h-3 bg-primary-container rounded-full shadow-[0_0_8px_#D32F2F]"></div>}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="col-span-12 md:col-span-5 bg-surface-variant/10 backdrop-blur-2xl rounded-xl p-8 border border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary-container">hub</span>
              <h3 className="text-xl font-bold font-headline tracking-tight text-white">Protocols</h3>
            </div>
            <div className="space-y-6">
              {[
                { key: 'email_notifications', label: 'Secure Webhook', sub: 'Transmit payloads via HTTPS POST' },
                { key: 'security_alerts', label: 'Neural Pulse', sub: 'Direct browser-stream notifications' }
              ].map((p, i) => (
                <React.Fragment key={p.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{p.label}</p>
                      <p className="text-xs text_on_surface_variant/50 font-body">{p.sub}</p>
                    </div>
                    <button 
                      onClick={() => updateSetting(p.key, !settings[p.key])}
                      className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${settings[p.key] ? 'bg-primary-container' : 'bg-surface-container-highest'}`}
                    >
                      <div className={`w-4 h-4 rounded-full transition-all ${settings[p.key] ? 'bg-on-primary-container ml-auto shadow-[0_0_8px_white]' : 'bg-on-surface-variant ml-0'}`}></div>
                    </button>
                  </div>
                  {i < 1 && <div className="h-px bg-white/5"></div>}
                </React.Fragment>
              ))}
            </div>
          </section>

          <section className="col-span-12 md:col-span-4 bg-surface-variant/10 backdrop-blur-2xl rounded-xl p-8 border border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary-container">lan</span>
              <h3 className="text-xl font-bold font-headline tracking-tight text-white">Node Affinity</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-surface-container-lowest border-l-2 border-primary-container rounded-r flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_#D32F2F]"></div>
                  <span className="text-xs font-bold uppercase tracking-tight">Bharat-01 (Delhi)</span>
                </div>
                <span className="text-[10px] text-primary-container bg-primary-container/10 px-2 py-0.5 rounded border border-primary-container/20 font-black">ACTIVE</span>
              </div>
              <div className="p-3 bg-zinc-900/40 rounded flex justify-between items-center opacity-70 grayscale">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                  <span className="text-xs font-bold text-zinc-400">Europe-West (Zurich)</span>
                </div>
                <span className="text-[10px] text-zinc-600 font-mono">140ms</span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 text-[10px] font-headline font-black text-on-surface-variant/60 hover:text-primary-container transition-colors uppercase tracking-[0.2em] border border-white/5 rounded-lg hover:bg-white/5">
              Refresh Latency
            </button>
          </section>

          <section className="col-span-12 md:col-span-8 bg-surface-variant/10 backdrop-blur-2xl rounded-xl p-8 relative overflow-hidden border border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 -rotate-12 translate-x-8 -translate-y-8 blur-3xl"></div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">key</span>
                <h3 className="text-xl font-bold font-headline tracking-tight text-white">Security Keys</h3>
              </div>
              <button className="text-primary-container text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:brightness-125 transition-all bg-primary-container/10 px-4 py-2 rounded-lg border border-primary-container/20">
                <span className="material-symbols-outlined text-sm">add</span>
                Generate New
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-on-surface-variant/40 border-b border-white/5">
                    <th className="pb-4 font-headline uppercase font-black tracking-widest text-[10px]">Identifer</th>
                    <th className="pb-4 font-headline uppercase font-black tracking-widest text-[10px]">Permissions</th>
                    <th className="pb-4 font-headline uppercase font-black tracking-widest text-[10px]">Created</th>
                    <th className="pb-4 font-headline uppercase font-black tracking-widest text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white uppercase tracking-tight">production_root_01</span>
                        <span className="text-[10px] font-mono text-zinc-600">RN-XXXX-8829</span>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="flex gap-2">
                        <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border border-red-500/10">Read/Write</span>
                        <span className="bg-primary-container/10 text-primary-container px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border border-primary-container/10">Admin</span>
                      </div>
                    </td>
                    <td className="py-5 text-on-surface-variant/60 font-body text-xs uppercase">Oct 12, 2023</td>
                    <td className="py-5 text-right">
                      <button className="p-2 text-zinc-600 hover:text-primary-container transition-colors">
                        <span className="material-symbols-outlined">delete_forever</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;
