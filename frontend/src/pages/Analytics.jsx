import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/config';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiRequest('/api/analytics');
      setStats(data);
    } catch (err) {
      console.error('Failed to sync neural stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-24 text-center text-white opacity-20 uppercase tracking-widest">Synchronizing Neural Metrics...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header & Filters */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-primary tracking-[0.2em] font-medium text-[10px] uppercase">Intelligence Metrics</p>
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight text-white">Network Analytics</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container-low p-1 rounded-lg">
            <button className="px-4 py-1.5 rounded-md text-xs font-medium bg-surface-container-high text-on-surface shadow-sm text-white">24H</button>
            <button className="px-4 py-1.5 rounded-md text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors">7D</button>
            <button className="px-4 py-1.5 rounded-md text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors">30D</button>
          </div>
          <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-xs font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary-container/20">
            Generate Report
          </button>
        </div>
      </header>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Neural Processing Efficiency Line Chart */}
        <section className="col-span-12 lg:col-span-8 glass-panel p-6 rounded-xl relative overflow-hidden glow-effect bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface text-white">Query Activity Timeline</h3>
              <p className="text-on-surface-variant text-xs">Historical search queries and processing trends</p>
            </div>
          </div>

          {/* Real Activity Chart */}
          <div className="h-64 flex items-end justify-between gap-1 relative overflow-hidden">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="h-px w-full bg-on-surface"></div>
              <div className="h-px w-full bg-on-surface"></div>
              <div className="h-px w-full bg-on-surface"></div>
              <div className="h-px w-full bg-on-surface"></div>
            </div>
            {stats?.neural_heatmap && stats.neural_heatmap.length > 0 ? (
              stats.neural_heatmap.map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-primary-container/60 rounded-t-sm transition-all duration-300 hover:bg-primary-container shadow-[0_0_10px_rgba(211,47,47,0.1)] group/bar relative"
                  style={{ height: `${Math.min(100, Math.max(5, (item.activity * 15)))}%` }}
                  title={`${item.date}: ${item.activity} queries`}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest p-2 rounded text-[10px] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 border border-white/10 uppercase tracking-tighter text-white">
                    {item.activity}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm opacity-50">
                No activity data available
              </div>
            )}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">
            <span>Earlier</span>
            <span>Recent</span>
          </div>
        </section>

        {/* Vault Storage Gauge */}
        <section className="col-span-12 lg:col-span-4 glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center glow-effect bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
          <div className="w-full text-left mb-6">
            <h3 className="font-headline text-lg font-bold text-on-surface text-white">Vault Storage</h3>
            <p className="text-on-surface-variant text-xs">Document ingestion and capacity metrics</p>
          </div>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-container-low" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="8"></circle>
              <circle 
                className="text-primary-container transition-all duration-500" 
                cx="96" 
                cy="96" 
                fill="transparent" 
                r="80" 
                stroke="currentColor" 
                strokeDasharray="502" 
                strokeDashoffset={502 - (502 * (stats?.total_documents || 0) / 100)}
                strokeLinecap="round" 
                strokeWidth="10"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-headline font-extrabold text-on-surface text-white">{stats?.total_documents || 0}</span>
              <span className="text-xs font-medium text-primary uppercase tracking-tighter">Documents</span>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full mt-6 gap-2">
            <div className="bg-surface-container-low p-3 rounded-lg text-on-surface-variant">
              <p className="text-[10px] uppercase">Queries</p>
              <p className="text-sm font-bold text-white">{stats?.total_queries || 0}</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg text-on-surface-variant">
              <p className="text-[10px] uppercase">Footprint</p>
              <p className="text-sm font-bold text-white">{stats?.total_size || '0 MB'}</p>
            </div>
          </div>
        </section>

        {/* System Status Summary */}
        <section className="col-span-12 glass-panel p-6 rounded-xl glow-effect bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface text-white">System Status</h3>
              <p className="text-on-surface-variant text-xs">Real-time platform health and performance metrics</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-surface-container-low border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-on-surface-variant uppercase">Processing Status</span>
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
              </div>
              <p className="text-sm text-white font-semibold">Optimal</p>
              <p className="text-[10px] text-on-surface-variant mt-1">Average latency: {stats?.average_processing_time_ms?.toFixed(0) || 0}ms</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-container-low border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-on-surface-variant uppercase">Documents Indexed</span>
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
              </div>
              <p className="text-sm text-white font-semibold">{stats?.total_documents || 0} Files</p>
              <p className="text-[10px] text-on-surface-variant mt-1">Total tokens: {stats?.total_tokens_used || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-container-low border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-on-surface-variant uppercase">Query Volume</span>
                <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
              </div>
              <p className="text-sm text-white font-semibold">{stats?.total_queries || 0} Queries</p>
              <p className="text-[10px] text-on-surface-variant mt-1">Latest activity within session</p>
            </div>
          </div>
        </section>

        {/* Auxiliary Data Cards */}
        {[
          { label: 'Vault Documents', value: stats?.total_documents ?? 0, icon: 'database', trend: 'Synced', trendColor: 'text-secondary-container' },
          { label: 'Neural Queries', value: stats?.total_queries ?? 0, icon: 'psychology', trend: 'Active', trendColor: 'text-primary' },
          { label: 'Vault Footprint', value: stats?.total_size ?? '0 MB', icon: 'memory', trend: 'Normal', trendColor: 'text-tertiary' },
          { label: 'Open Tickets', value: stats?.total_tickets ?? 0, icon: 'confirmation_number', trend: 'In Review', trendColor: 'text-primary' }
        ].map((card, idx) => (
          <div key={idx} className="col-span-12 md:col-span-6 lg:col-span-3 glass-panel p-5 rounded-xl border-t border-white/5 bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-primary text-xl">{card.icon}</span>
              <span className={`text-[10px] font-bold ${card.trendColor}`}>{card.trend}</span>
            </div>
            <h4 className="text-on-surface-variant text-xs mb-1">{card.label}</h4>
            <p className="text-2xl font-headline font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <div className="relative rounded-xl overflow-hidden h-48 group">
          <img
            alt="Server room visualization"
            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDbyqdQIZ721ZyCbe1NaSRJJiErnA3lvUif2KJ8PqxetzdpG4NhsAIrzPw1uM_E_8TtNOP8O0SICK3jUD7TBTX6RnLIvvuSaNkvmIixfeeM09qnAbF1g4opkywr1IxIpMEQRJKcdj9a65jQwyT9aDv9Nrxz0gZDklHwDrEYFXZcL54iKNGaVcBVUtdNIfzoc4mc7XgeEYFFeptOQUbVSwrMzvLxalnYRqdxbzmrtq1y90S4JM1zW1uky_V3VcAaDbgMNz2nLYcAwBD"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">Node Infrastructure</p>
            <h5 className="text-lg font-bold text-white">Central European Hub</h5>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h5 className="font-headline font-bold text-on-surface mb-2 text-white">Intelligence Summary</h5>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {stats?.total_queries > 0 
                ? `System has processed ${stats.total_queries} intelligent queries across ${stats.total_documents} indexed documents. Average processing latency: ${stats.average_processing_time_ms?.toFixed(1) || '0'}ms. Platform operating within normal parameters.`
                : 'No queries processed yet. Upload documents and run searches to see performance metrics.'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs cursor-pointer hover:translate-x-1 transition-transform mt-4">
            <span>View search history</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Analytics;
