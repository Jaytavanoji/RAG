import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#09090B]/70 backdrop-blur-xl shadow-lg shadow-black/40'
          : 'bg-transparent'
      }`}
      style={{ height: isScrolled ? '64px' : '80px' }}
    >
      <div className="h-full px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo and brand name removed per request */}
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="/login" className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30">
            Get Started
          </a>
        </div>
        <button className="md:hidden w-10 h-10 flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
