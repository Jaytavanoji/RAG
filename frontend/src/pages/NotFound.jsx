import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="pt-24 min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 blur-[150px] rounded-full"></div>
      
      <div className="relative z-10 text-center space-y-8 max-w-lg">
        <div className="space-y-2">
          <span className="text-[120px] font-black font-headline text-[#D32F2F] opacity-20 block leading-none select-none">404</span>
          <h2 className="text-4xl font-headline font-extrabold text-white tracking-tighter -mt-12">Node Not Found</h2>
        </div>
        
        <p className="text-on-surface-variant leading-relaxed">
          The requested neural coordinate does not exist or has been sequestered by Sovereign protocols.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            to="/dashboard"
            className="bg-primary-container text-on-primary-container px-8 py-3 rounded-lg font-headline font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(211,47,47,0.3)]"
          >
            Return to Core
          </Link>
          <Link 
            to="/support"
            className="bg-surface-variant/20 text-on-surface px-8 py-3 rounded-lg font-headline font-bold text-sm uppercase tracking-widest border border-white/5 hover:bg-surface-variant/30 transition-all text-white"
          >
            Support Portal
          </Link>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#D32F2F 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    </div>
  );
};

export default NotFound;
