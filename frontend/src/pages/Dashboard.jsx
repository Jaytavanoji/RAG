import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiRequest } from '../api/config';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await apiRequest('/api/analytics');
        setData(result);
      } catch (err) {
        console.error('Failed to sync neural analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const metrics = data?.metrics || {
    total_documents: 0,
    total_queries: 0,
    active_tickets: 0,
    neural_integrity: '98.4%',
    vault_storage: '0 MB'
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Section / Welcome */}
      <section className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-2 text-white">Systems {data?.status || 'Operational'}</h2>
          <p className="text-on-surface-variant max-w-3xl leading-relaxed">Intelligence core at {metrics.neural_integrity} efficiency. Reviewing latest risk detection logs and neural session archives.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-semibold text-sm hover:bg-surface-bright transition-all border border-white/5">Export Logs</button>
          <button className="px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary-container/20">Launch Audit</button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="p-6 bg-surface-container-low rounded-xl border border-white/5 group hover:border-primary-container/30 transition-all duration-500 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-primary-container">database</span>
            </div>
            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Secure</span>
          </div>
          <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest mb-1">Vault Documents</p>
          <h3 className="text-3xl font-extrabold text-on-surface tracking-tight text-white">{metrics.total_documents} <span className="text-lg text-on-surface-variant/50">Files</span></h3>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container/20 to-transparent"></div>
        </div>

        {/* Stat Card 2 */}
        <div className="p-6 bg-surface-container-low rounded-xl border border-white/5 group hover:border-primary-container/30 transition-all duration-500 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-primary-container">query_stats</span>
            </div>
            <span className="text-[10px] font-bold text-primary-container bg-primary-container/10 px-2 py-1 rounded-full">Analytics</span>
          </div>
          <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest mb-1">Neural Queries</p>
          <h3 className="text-3xl font-extrabold text-on-surface tracking-tight text-white">{metrics.total_queries}</h3>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container/20 to-transparent"></div>
        </div>

        {/* Stat Card 3 */}
        <div className="p-6 bg-surface-container-low rounded-xl border border-white/5 group hover:border-primary-container/30 transition-all duration-500 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-primary-container">sd_storage</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-variant px-2 py-1 rounded-full">Usage</span>
          </div>
          <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest mb-1">Total Vault Footprint</p>
          <h3 className="text-3xl font-extrabold text-on-surface tracking-tight text-white">{metrics.vault_storage}</h3>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container/20 to-transparent"></div>
        </div>

        {/* Stat Card 4 */}
        <div className="p-6 bg-surface-container-low rounded-xl border border-white/5 group hover:border-primary-container/30 transition-all duration-500 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-primary-container">support_agent</span>
            </div>
            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest mb-1">Open Tickets</p>
          <h3 className="text-3xl font-extrabold text-on-surface tracking-tight text-white">{metrics.active_tickets}</h3>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container/20 to-transparent"></div>
        </div>
      </section>

      {/* Main Grid Bento */}
      <section className="grid grid-cols-12 gap-6">
        {/* Analytics Chart Card */}
        <div className="col-span-12 lg:col-span-8 p-8 bg-surface-container-low rounded-2xl border border-white/5 glass-panel">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-headline text-xl font-bold text-on-surface text-white">Neural Activity Monitor</h3>
              <p className="text-on-surface-variant text-sm">Real-time analysis of cross-node data flow</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-bold rounded-md bg-surface-variant text-on-surface hover:bg-surface-bright transition-colors">24H</button>
              <button className="px-3 py-1.5 text-xs font-bold rounded-md text-on-surface-variant hover:text-on-surface transition-colors">7D</button>
              <button className="px-3 py-1.5 text-xs font-bold rounded-md text-on-surface-variant hover:text-on-surface transition-colors">30D</button>
            </div>
          </div>
          {/* Simulated Chart Visualization */}
          <div className="h-64 flex items-end gap-1.5 px-2 relative group">
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
              <div className="w-full border-t border-dashed border-on-surface-variant"></div>
              <div className="w-full border-t border-dashed border-on-surface-variant"></div>
              <div className="w-full border-t border-dashed border-on-surface-variant"></div>
            </div>
            {/* Real Activities Bars */}
            {data?.neural_heatmap?.map((item, index) => (
              <div 
                key={index} 
                className="flex-1 bg-primary-container/60 rounded-t-sm transition-all duration-500 hover:bg-primary-container shadow-[0_0_10px_rgba(211,47,47,0.1)] group/bar relative"
                style={{ height: `${Math.min(100, (item.activity * 20) || 5)}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface p-2 rounded text-[8px] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-30 border border-white/10 uppercase tracking-tighter">
                  {item.date}: {item.activity} Queries
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Detection Panel */}
        <div className="col-span-12 lg:col-span-4 p-8 bg-surface-container-low rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_check</span>
              <h3 className="font-headline text-xl font-bold text-on-surface text-white">Security Status</h3>
            </div>
            <div className="space-y-4 text-on-surface-variant flex flex-col justify-center items-center py-8">
              <div className="text-center">
                <p className="text-xl font-bold text-green-400 mb-2">No Threats Detected</p>
                <p className="text-xs text-on-surface-variant">System operating within normal parameters</p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 text-sm font-bold text-primary hover:text-on-primary-container transition-colors border border-primary-container/20 rounded-lg hover:bg-primary-container/10">View Security Audit</button>
          </div>
        </div>

        {/* Recent Documents Section */}
        <div className="col-span-12 p-8 bg-surface-container-low rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-xl font-bold text-on-surface text-white">Intelligence Feed</h3>
            <div className="flex items-center gap-4 text-sm font-medium text-on-surface-variant">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> 12 New Files</span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-on-surface"><span className="material-symbols-outlined text-sm">filter_list</span> Filter</span>
            </div>
          </div>
          <div className="overflow-x-auto text-on-surface-variant">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-on-surface-variant/60 uppercase tracking-widest border-b border-white/5">
                  <th className="pb-4 font-bold">Document Name</th>
                  <th className="pb-4 font-bold">Category</th>
                  <th className="pb-4 font-bold">Timestamp</th>
                  <th className="pb-4 font-bold">Analysis Status</th>
                  <th className="pb-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.recent_documents?.length > 0 ? (
                  data.recent_documents.map((doc, i) => (
                    <tr key={i} className="group hover:bg-surface-container-high transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary-container">article</span>
                          <div>
                            <p className="text-sm font-bold text-on-surface text-white">{doc.filename}</p>
                            <p className="text-[10px]">Internal Intelligence</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-medium uppercase tracking-tighter">Sovereign Asset</td>
                      <td className="py-4 text-xs">{new Date(doc.created_at).toLocaleString()}</td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                          Analyzed
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">more_vert</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-xs uppercase tracking-widest opacity-30">
                      No intelligence assets found in vault.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Floating Quick Action Button */}
      <Link to="/terminal" className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container shadow-[0_10px_30px_rgba(211,47,47,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group z-50">
        <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform duration-500">terminal</span>
      </Link>
    </div>
  );
};

export default Dashboard;
