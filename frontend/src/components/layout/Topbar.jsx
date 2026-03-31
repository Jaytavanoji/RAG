import { Link } from 'react-router-dom';

const Topbar = () => {
  return (
    <header className="h-16 flex items-center justify-between px-8 sticky top-0 z-40 bg-[#131315]/80 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="h-10 w-96 bg-surface-container-lowest rounded-full flex items-center px-4 border border-white/5 focus-within:border-primary-container/30 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
          <input 
            className="bg-transparent border-none text-sm w-full focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50" 
            placeholder="Search intelligence vault..." 
            type="text"
          />
          <span className="text-[10px] bg-surface-variant px-1.5 py-0.5 rounded text-on-surface-variant font-mono">⌘K</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-surface-container-low rounded-xl px-2 py-1 gap-2 border border-white/5">
          <Link to="/support" className="p-2 text-on-surface-variant hover:text-primary transition-all duration-300 hover:bg-white/5 rounded-lg active:scale-90" title="System Support">
            <span className="material-symbols-outlined text-[22px]">help_outline</span>
          </Link>
          
          <Link to="/notifications" className="p-2 text-on-surface-variant hover:text-primary transition-all duration-300 hover:bg-white/5 rounded-lg active:scale-90 relative" title="Notifications">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full border-2 border-[#131315]"></span>
          </Link>

          <button 
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              window.location.href = '/';
            }}
            className="p-2 text-on-surface-variant hover:text-red-500 transition-all duration-300 hover:bg-red-500/5 rounded-lg active:scale-90" 
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </button>
        </div>
        
        <Link to="/profile" className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right">
            <p className="text-xs font-bold text-on-surface">Alex Sovereign</p>
            <p className="text-[10px] text-primary uppercase tracking-tighter">Admin Access</p>
          </div>
          <img 
            alt="User profile avatar" 
            className="w-10 h-10 rounded-full border border-primary-container/20 p-0.5 object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkLRtIVZUkvUOtmJOSrESbL7kmyZ7zuHSJlvNO1bsBU1lD86ghAJ5AcE0xQtkUkRhj7HLcewYR1S69jEJSY1fvGszo5RwEuwq6cV7TaQkocVeLnvYs38JHDxJItlioYmHrlu567gRjuYrAvg_UNLXQiTfwXNSVYVFManHwBXq-QG5SJm5ddSRt4yLKl1hljoZYVMqQtPV80480_AsD2Fk2l2ZdVqycpJz3YavzSl6J5O6zRqpL-l2X_4LcZD4_Q2fMmlpNbVN8q8mH"
          />
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
