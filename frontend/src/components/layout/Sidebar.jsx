import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Neural Chat', icon: 'psychology', path: '/search' },
    { label: 'Ingest', icon: 'input', path: '/ingest' },
    { label: 'Analytics', icon: 'leaderboard', path: '/analytics' },
    { label: 'History', icon: 'history', path: '/history' },
    { label: 'Archive', icon: 'inventory_2', path: '/archive' },
    { label: 'Audit', icon: 'shield', path: '/audit' },
    { label: 'Notifications', icon: 'notifications', path: '/notifications' },
    { label: 'Entity Map', icon: 'hub', path: '/entity-map' },
    { label: 'Terminal', icon: 'terminal', path: '/terminal' },
    { label: 'Admin', icon: 'admin_panel_settings', path: '/admin' },
    { label: 'Node Console', icon: 'analytics', path: '/node-console' },
    { label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-[60] bg-[#1C1B1D] flex flex-col h-full py-6 border-r border-[#D32F2F]/10 shadow-[10px_0_30px_rgba(0,0,0,0.5)] font-['Inter'] text-sm font-medium">
      <div className="px-6 mb-10 flex items-center gap-3 group">
        <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white text-xl font-bold drop-shadow-[0_0_15px_#D32F2F] transition-transform duration-500 group-hover:scale-105">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
        </div>
        <div>
          <h1 className="font-headline font-extrabold text-[#D32F2F] tracking-tighter text-lg leading-none">Sovereign</h1>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Void Intelligence</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`${
              isActive(item.path)
                ? 'bg-[#D32F2F] text-white'
                : 'text-[#E4BEBA] hover:bg-[#353437]'
            } rounded-lg mx-2 flex items-center px-4 py-3 transition-transform duration-200 hover:translate-x-1`}
          >
            <span className="material-symbols-outlined mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;
