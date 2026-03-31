const Profile = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8">
      {/* Profile Header */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-container to-transparent opacity-10 blur-2xl group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative glass-panel rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-2 border-primary-container p-1 bg-surface-container-lowest">
              <img 
                alt="Large Profile" 
                className="w-full h-full rounded-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr3Jc5IzuUNegG36KQtPK1jT9p0fJ55w0xjcVYSL7ItUiZubvOnvSXLh6FJU4elWG6T2BPpUmrLHBXTajexxZwcAEMRCReIG5DStQfYV7rCyzlBsSf2W9H5V8FivEyYhLbnxEf5zg433GIzYSNIFq6ETvcpEW9rJHET3HRWLzGpSvkg6K2_wnHgACazsezq7M4l0yD-eeftyLt7trK9nNFthaIja7HXZsXVeNsVOgrUrtVdb7Kc5HdhdCOeWH9KYAebggzpXYnPzLV"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-primary-container text-on-primary-container rounded-full shadow-lg hover:scale-110 transition-transform p-2">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface text-white">Alex Sovereign</h2>
              <span className="px-3 py-1 bg-primary-container/20 text-primary-container border border-primary-container/30 text-[10px] font-bold uppercase tracking-widest rounded-full self-start md:self-center">Admin Access</span>
            </div>
            <p className="text-on-surface-variant font-medium">Head of Neural Architecture • Global Intelligence Unit</p>
          </div>
        </div>
      </section>

      {/* Grid Layout for Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Personal Info & Security */}
        <div className="lg:col-span-7 space-y-8">
          {/* Personal Information */}
          <section className="glass-panel rounded-2xl p-6 bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary-container">person_edit</span>
              <h3 className="font-headline font-bold text-lg text-white">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
                <input className="w-full bg-surface-container-lowest border-none rounded-lg p-3 text-on-surface focus:ring-1 focus:ring-primary-container/30 transition-all outline-none text-white" type="text" defaultValue="Alex Sovereign"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                <input className="w-full bg-surface-container-lowest border-none rounded-lg p-3 text-on-surface focus:ring-1 focus:ring-primary-container/30 transition-all outline-none text-white" type="email" defaultValue="alex@sovereign.ai"/>
              </div>
            </div>
            <button className="mt-8 px-6 py-2 bg-primary-container text-on-primary-container font-bold rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg text-sm">Update Profile</button>
          </section>

          {/* Security Settings */}
          <section className="glass-panel rounded-2xl p-6 bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">shield_person</span>
                <h3 className="font-headline font-bold text-lg text-white">Security & Access</h3>
              </div>
              <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase">Status: Secure</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest/50 rounded-xl hover:bg-surface-container-lowest transition-colors border border-outline-variant/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-container">lock_reset</span>
                  </div>
                  <div className="text-white">
                    <p className="font-bold text-sm">Account Password</p>
                    <p className="text-xs text-on-surface-variant">Last changed 14 days ago</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-primary uppercase tracking-wider hover:underline">Change Password</button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: API Keys & Preferences */}
        <div className="lg:col-span-5 space-y-8">
          {/* API Access */}
          <section className="glass-panel rounded-2xl p-6 bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">key</span>
                <h3 className="font-headline font-bold text-lg text-white">API Access</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest/80 p-4 rounded-xl space-y-3 border border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Production: /api/search</span>
                  <button className="text-[10px] font-bold text-primary">Reveal</button>
                </div>
                <code className="block text-[11px] bg-background p-2 rounded text-primary/70 font-mono overflow-hidden whitespace-nowrap">sk_live_51Mv***********************Xp2</code>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="glass-panel rounded-2xl p-6 bg-[rgba(53,52,55,0.6)] backdrop-blur-[20px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary-container">settings_suggest</span>
              <h3 className="font-headline font-bold text-lg text-white">Preferences</h3>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-bold">Interface Theme</p>
                  <p className="text-[11px] text-on-surface-variant">Sovereign Void (Locked)</p>
                </div>
                <span className="material-symbols-outlined text-primary">dark_mode</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
