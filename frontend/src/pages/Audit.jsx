const Audit = () => {
  return (
    <div className="pt-24 min-h-screen p-8 space-y-8">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface flex items-center gap-3 text-white border-none">
            Security Audit Center <span className="text-primary-container text-lg inline-flex items-center bg-primary-container/10 px-3 py-1 rounded-full border border-primary-container/20">LIVE</span>
          </h2>
          <p className="text-on-surface-variant/70 mt-2 font-body max-w-xl">Real-time encryption monitoring and threat mitigation for RegiNova Sovereign Neural Networks.</p>
        </div>
        <div className="flex gap-3 text-white">
          <button className="px-6 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-headline font-bold text-sm border border-outline-variant/20 hover:bg-surface-bright transition-all">Export Report</button>
          <button className="px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-headline font-bold text-sm shadow-[0_4px_20px_rgba(211,47,47,0.3)] hover:scale-105 transition-all">Initiate Lockdown</button>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6 min-h-[800px]">
        {/* Global Threat Map (Hero Bento) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl relative overflow-hidden group border border-white/5">
          <div className="absolute top-6 left-6 z-10">
            <h3 className="font-headline font-bold text-lg text-on-surface tracking-tight text-white">Active Connection Topology</h3>
            <p className="text-xs text-on-surface-variant/50">Monitoring 1,429 Node Endpoints</p>
          </div>
          <div className="absolute top-6 right-6 z-10 flex gap-4 bg-[#131315]/80 backdrop-blur-md p-3 rounded-lg border border-white/5 text-white">
            <div className="text-center">
              <p className="text-[10px] text-on-surface-variant/50 uppercase font-bold">Latency</p>
              <p className="text-sm font-headline font-bold text-secondary">24ms</p>
            </div>
            <div className="w-[1px] bg-white/10"></div>
            <div className="text-center">
              <p className="text-[10px] text-on-surface-variant/50 uppercase font-bold">Threats</p>
              <p className="text-sm font-headline font-bold text-primary-container">03</p>
            </div>
          </div>

          {/* Mock Map Visualization */}
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1C1B1D] via-[#131315] to-[#0E0E10] flex items-center justify-center min-h-[400px]">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full border border-primary-container/20 animate-pulse"></div>
              <div className="absolute inset-8 rounded-full border border-primary-container/10"></div>
              <div className="absolute inset-20 rounded-full border border-primary-container/5"></div>
              <img
                alt="3D digital globe"
                className="w-full h-full object-contain opacity-40 mix-blend-screen"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsDC6ufKE7uV-Zo89fmUDfFRjQhlfiZtbU4kPN3pFteSpyscVDvVCi_7SqhOywsWFZfcOPe0VTlQX1Nb-UJA6HexyS128owBCOk91ZV8VOu38mv5Qsaiib0CqPLarp8asTzRh8rUFleJJyX-DdENLY5Z6yaknprm9qER3mRyvTZjWk2tn45HqYtSC8zDPxp0c9h4Dt-1NviMRFz6amh9f0QMMByu6dNU9gjk45cEyi0JcRJ_xHAodXe-bcTEnOXTk8SR-_MniDKvpv"
              />
              {/* Pulse Markers */}
              <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-primary-container rounded-full shadow-[0_0_15px_#D32F2F]"></div>
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-secondary rounded-full shadow-[0_0_10px_#FDC400]"></div>
              <div className="absolute top-1/2 right-1/2 w-2 h-2 bg-primary-container rounded-full shadow-[0_0_10px_#D32F2F]"></div>
            </div>
          </div>

          {/* Floating Legend */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-center px-4 py-3 bg-surface-container-high/40 backdrop-blur-xl rounded-lg border border-white/5 gap-4">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                <span className="text-xs font-medium text-on-surface-variant">Sovereign Node</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-xs font-medium text-on-surface-variant">External Relay</span>
              </div>
            </div>
            <div className="text-[10px] text-on-surface-variant/40 font-mono tracking-tighter">LOC: 40.7128° N, 74.0060° W | SYNC: ACTIVE</div>
          </div>
        </div>

        {/* Node-to-Node Decryption Log */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl flex flex-col overflow-hidden border border-white/5 h-full">
          <div className="p-6 border-b border-white/5">
            <div className="flex justify-between items-start text-white">
              <h3 className="font-headline font-bold text-lg text-on-surface">Decryption Stream</h3>
              <span className="material-symbols-outlined text-primary-container text-sm animate-spin">sync</span>
            </div>
            <p className="text-xs text-on-surface-variant/50 mt-1">Live traffic packet inspection</p>
          </div>
          <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-4 bg-surface-container-lowest/50">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="space-y-1">
                <p className="text-primary-container">[14:22:{i + 10}] INCOMING_HANDSHAKE: NODE_0{94 + i}</p>
                <p className="text-on-surface-variant/60">ALGO: RSA_AES_256_GCM</p>
                <p className="text-secondary font-bold uppercase">Status: Verified</p>
              </div>
            ))}
            <div className="space-y-1 border-l-2 border-primary-container/20 pl-3">
              <p className="text-primary-container">[14:22:25] ANOMALY_DETECTED: PKT_772</p>
              <p className="text-primary font-bold">TYPE: MALFORMED_HEADER</p>
              <p className="text-on-surface-variant/60">ACTION: DROP_PACKET</p>
            </div>
          </div>
          <div className="p-3 bg-surface-container-high border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Listening for packets...</span>
            </div>
          </div>
        </div>

        {/* IP/Geo Access Logs */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-6 space-y-6 border border-white/5 h-fit">
          <div className="flex justify-between items-center text-white">
            <div>
              <h3 className="font-headline font-bold text-lg text-on-surface">Access Log Analysis</h3>
              <p className="text-xs text-on-surface-variant/50">Cross-referenced with global threat database</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-[10px] font-bold uppercase tracking-wider hover:bg-surface-bright border border-white/5">Filter</button>
              <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-[10px] font-bold uppercase tracking-wider hover:bg-surface-bright text-primary-container border border-primary-container/20">High Risk Only</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-on-surface-variant/40 border-b border-white/5">
                <tr>
                  <th className="pb-3 font-headline font-bold uppercase text-[10px]">Source IP</th>
                  <th className="pb-3 font-headline font-bold uppercase text-[10px]">Location</th>
                  <th className="pb-3 font-headline font-bold uppercase text-[10px]">Credential</th>
                  <th className="pb-3 font-headline font-bold uppercase text-[10px]">Risk Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-on-surface-variant">
                {[
                  { ip: '212.14.88.201', loc: 'Frankfurt, DE', cred: 'Sudo Admin', risk: 'LOW', color: 'secondary' },
                  { ip: '45.231.11.4', loc: 'St. Petersburg, RU', cred: 'Guest', risk: 'CRITICAL', color: 'primary-container' },
                  { ip: '104.22.7.21', loc: 'San Jose, US', cred: 'System Monitor', risk: 'SAFE', color: 'secondary' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-mono text-on-surface text-white">{row.ip}</td>
                    <td className="py-4">{row.loc}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded bg-surface-container-high text-[10px] font-bold text-white/80">{row.cred}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className={`h-full ${row.risk === 'CRITICAL' ? 'bg-primary-container' : 'bg-secondary'} ${row.risk === 'CRITICAL' ? 'w-[88%]' : 'w-[12%]'}`}></div>
                        </div>
                        <span className={`text-[10px] font-bold ${row.risk === 'CRITICAL' ? 'text-primary-container' : 'text-on-surface-variant'}`}>{row.risk}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Automated Risk Mitigation Timeline */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl p-6 border border-white/5 h-fit">
          <h3 className="font-headline font-bold text-lg text-on-surface mb-6 text-white">Mitigation Queue</h3>
          <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
            <div className="relative pl-8">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border-4 border-surface-container-low text-green-500">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
              <div className="text-white">
                <p className="text-sm font-bold">Isolate Node_B7</p>
                <p className="text-[11px] text-on-surface-variant/60 mt-1">Suspected credential stuffing attempt blocked.</p>
                <p className="text-[10px] text-green-500 font-bold mt-2 uppercase">Completed 2m ago</p>
              </div>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-container/20 flex items-center justify-center border-4 border-surface-container-low text-primary-container">
                <span className="material-symbols-outlined text-[14px] animate-pulse">shield</span>
              </div>
              <div className="text-white">
                <p className="text-sm font-bold">Rotate Global RSA Keys</p>
                <p className="text-[11px] text-on-surface-variant/60 mt-1">Scheduled rotation due to entropy threshold alert.</p>
                <div className="mt-3 w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container w-[45%]"></div>
                </div>
                <p className="text-[10px] text-primary-container font-bold mt-2 uppercase">In Progress (45%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Packets Scanned', val: '8.24M', sub: '+12% vs last hr', color: 'secondary' },
          { label: 'Network Integrity', val: '99.98%', sub: 'OPTIMAL', color: 'secondary' },
          { label: 'Active AI Sentinels', val: '24', sub: 'ALL SYSTEMS GO', color: 'text-on-surface-variant' },
          { label: 'Encryption Strength', val: 'PQC-3', sub: 'POST-QUANTUM', color: 'secondary' }
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-high/40 p-5 rounded-xl border border-white/5 backdrop-blur-sm text-white">
            <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h4 className="text-2xl font-black font-headline">{stat.val}</h4>
              <span className={`text-[10px] font-bold ${stat.color === 'secondary' ? 'text-secondary' : 'text-on-surface-variant/60'}`}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Audit;
