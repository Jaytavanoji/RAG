import { useState, useEffect } from 'react';
import { apiRequest } from '../api/config';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'void',
    language: 'en',
    email_notifications: true,
    security_alerts: true,
    ai_model: 'llama-3-70b-8192',
    max_results: 5,
    auto_archive: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await apiRequest('/api/settings');
      if (data?.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequest('/api/settings', 'PUT', settings);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="p-24 text-center text-white opacity-20 uppercase tracking-widest">Loading configuration...</div>;

  return (
    <div className="pt-24 min-h-screen bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-10 py-12 relative z-10">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-xs text-primary-container tracking-[0.2em] font-headline uppercase block mb-2 font-bold">System Configuration</span>
            <h2 className="text-5xl font-black font-headline tracking-tighter text-on-surface leading-none text-white border-none">Global Settings</h2>
          </div>
          <div className="flex gap-3 text-white">
            <button 
              onClick={fetchSettings}
              className="px-6 py-2 rounded-lg bg-surface-container-high text-on-surface-variant font-headline font-bold text-sm hover:bg-surface-bright transition-all border border-white/10"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-2 rounded-lg bg-primary-container text-on-primary-container font-headline font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-container/30 disabled:opacity-50"
            >
              {saving ? 'Syncing...' : 'Apply Sync'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6 text-white">
          <section className="col-span-12 md:col-span-7 glass-panel rounded-xl p-8 flex flex-col justify-between border border-white/5 bg-surface-container-low/40">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary-container">palette</span>
                <h3 className="text-xl font-bold font-headline tracking-tight">UI Preferences</h3>
              </div>
              <p className="text-on-surface-variant/70 text-sm mb-8 max-w-md">Control the ocular presence of the RegiNova terminal. The Void mode optimizes for high-intelligence concentration.</p>
              <div className="space-y-4">
                <div 
                  onClick={() => updateSetting('theme', 'void')}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${settings.theme === 'void' ? 'bg-surface-container-lowest border-primary-container/40' : 'bg-surface-container-lowest/30 border-white/5 opacity-60 hover:opacity-100'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded border border-primary-container/20 flex items-center justify-center text-primary-container">
                      <span className="material-symbols-outlined">dark_mode</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Locked Void</p>
                      <p className="text-xs text-on-surface-variant/50">OLED-deep blacks and primary highlights</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${settings.theme === 'void' ? 'border-primary-container' : 'border-white/10'}`}>
                    {settings.theme === 'void' && <div className="w-3 h-3 bg-primary-container rounded-full"></div>}
                  </div>
                </div>
                <div 
                  onClick={() => updateSetting('theme', 'dynamic')}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${settings.theme === 'dynamic' ? 'bg-surface-container-lowest border-primary-container/40' : 'bg-surface-container-lowest/30 border-white/5 opacity-60 hover:opacity-100'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container-highest rounded flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Dynamic Adaptive</p>
                      <p className="text-xs text-on-surface-variant/50">Follows system rhythm and light cycles</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${settings.theme === 'dynamic' ? 'border-primary-container' : 'border-white/10'}`}>
                    {settings.theme === 'dynamic' && <div className="w-3 h-3 bg-primary-container rounded-full"></div>}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="col-span-12 md:col-span-5 glass-panel rounded-xl p-8 border border-white/5 bg-surface-container-low/40">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary-container">hub</span>
              <h3 className="text-xl font-bold font-headline tracking-tight">Notification Protocols</h3>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">Email Notifications</p>
                    <p className="text-xs text-on-surface-variant/50">Receive updates via email</p>
                  </div>
                  <button 
                    onClick={() => updateSetting('email_notifications', !settings.email_notifications)}
                    className={`w-12 h-6 ${settings.email_notifications ? 'bg-primary-container' : 'bg-surface-container-highest'} rounded-full relative flex items-center px-1 transition-colors duration-300`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full ${settings.email_notifications ? 'ml-auto' : ''} transition-all`}></div>
                  </button>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">Security Alerts</p>
                    <p className="text-xs text-on-surface-variant/50">Critical security notifications</p>
                  </div>
                  <button 
                    onClick={() => updateSetting('security_alerts', !settings.security_alerts)}
                    className={`w-12 h-6 ${settings.security_alerts ? 'bg-primary-container' : 'bg-surface-container-highest'} rounded-full relative flex items-center px-1 transition-colors duration-300`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full ${settings.security_alerts ? 'ml-auto' : ''} transition-all`}></div>
                  </button>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">Auto Archive</p>
                    <p className="text-xs text-on-surface-variant/50">Automatically archive old documents</p>
                  </div>
                  <button 
                    onClick={() => updateSetting('auto_archive', !settings.auto_archive)}
                    className={`w-12 h-6 ${settings.auto_archive ? 'bg-primary-container' : 'bg-surface-container-highest'} rounded-full relative flex items-center px-1 transition-colors duration-300`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full ${settings.auto_archive ? 'ml-auto' : ''} transition-all`}></div>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="col-span-12 md:col-span-4 glass-panel rounded-xl p-8 border border-white/5 bg-surface-container-low/40">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary-container">lan</span>
              <h3 className="text-xl font-bold font-headline tracking-tight">AI Configuration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-on-surface-variant/50 uppercase tracking-wider block mb-2">AI Model</label>
                <select 
                  value={settings.ai_model}
                  onChange={(e) => updateSetting('ai_model', e.target.value)}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary-container focus:outline-none"
                >
                  <option value="llama-3-70b-8192">LLaMA 3 70B</option>
                  <option value="llama-3-8b-8192">LLaMA 3 8B</option>
                  <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant/50 uppercase tracking-wider block mb-2">Max Results</label>
                <select 
                  value={settings.max_results}
                  onChange={(e) => updateSetting('max_results', parseInt(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary-container focus:outline-none"
                >
                  <option value={3}>3 results</option>
                  <option value={5}>5 results</option>
                  <option value={10}>10 results</option>
                </select>
              </div>
            </div>
          </section>

          <section className="col-span-12 md:col-span-8 glass-panel rounded-xl p-8 border border-white/5 bg-surface-container-low/40 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 text-white">
                <span className="material-symbols-outlined text-primary-container">key</span>
                <h3 className="text-xl font-bold font-headline tracking-tight">Security Keys</h3>
              </div>
              <button className="text-primary-container text-sm font-bold flex items-center gap-1 hover:brightness-125 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
                Generate New
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-on-surface-variant/40 border-b border-white/5">
                    <th className="pb-4 uppercase tracking-[0.2em] text-[10px] font-bold">Identifier</th>
                    <th className="pb-4 uppercase tracking-[0.2em] text-[10px] font-bold">Permissions</th>
                    <th className="pb-4 text-right uppercase tracking-[0.2em] text-[10px] font-bold">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">production_root_01</span>
                        <span className="text-[10px] font-mono text-on-surface-variant">NODE-ALPHA-HID-8829</span>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="flex gap-2">
                        <span className="bg-primary-container/10 text-primary-container px-2 py-0.5 rounded text-[10px] font-bold border border-primary-container/20">Full Admin</span>
                      </div>
                    </td>
                    <td className="py-5 text-right">
                      <button className="p-2 text-on-surface-variant/40 hover:text-primary-container transition-colors">
                        <span className="material-symbols-outlined text-sm">settings_backup_restore</span>
                      </button>
                      <button className="p-2 text-on-surface-variant/40 hover:text-primary-container transition-colors">
                        <span className="material-symbols-outlined text-sm">delete</span>
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

export default Settings;
