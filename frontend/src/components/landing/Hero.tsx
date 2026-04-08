import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';


export default function Hero() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setHeroLoaded(true);
    });

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const getCinematicValues = (scroll: number) => {
    if (scroll <= 400) {
      const progress = scroll / 400;
      return {
        scale: 1 + progress * 0.15,
        translateX: -progress * 30,
        translateY: progress * 10,
        brightness: 1 - progress * 0.1,
        contrast: 1 + progress * 0.05,
        opacity: 1,
        cutOpacity: 1,
        phase: 'drift',
        brandProgress: 0,
      };
    } else if (scroll <= 700) {
      const progress = (scroll - 400) / 300;
      return {
        scale: 1.15 + progress * 0.2,
        translateX: -30 - progress * 50,
        translateY: 10 + progress * 20,
        brightness: 0.9 - progress * 0.3,
        contrast: 1.05 + progress * 0.15,
        opacity: 1,
        cutOpacity: 1,
        phase: 'tension',
        brandProgress: 0,
      };
    } else if (scroll <= 800) {
      const progress = (scroll - 700) / 100;
      const cutProgress = Math.min(1, progress * 3);
      return {
        scale: 1.35 + progress * 0.1,
        translateX: -80 - progress * 20,
        translateY: 30 + progress * 10,
        brightness: 0.6 - progress * 0.6,
        contrast: 1.2,
        opacity: 1 - cutProgress,
        cutOpacity: 1 - cutProgress,
        phase: 'cut',
        brandProgress: 0,
      };
    } else {
      const revealStart = 800;
      const revealDuration: number = 600;
      const brandProgress = Math.min(1, (scroll - revealStart) / revealDuration);
      
      return {
        scale: 1.45,
        translateX: -100,
        translateY: 40,
        brightness: 0,
        contrast: 1,
        opacity: 0,
        cutOpacity: 0,
        phase: 'reveal',
        brandProgress,
      };
    }
  };

  const cinematic = getCinematicValues(scrollY);

  const getScrollIndicatorOpacity = () => {
    if (cinematic.phase === 'drift') {
      return Math.max(0, 1 - scrollY / 200);
    }
    return 0;
  };

  return (
    <div ref={heroRef} className="relative h-[250vh] bg-[#000000]">
      <div
        className={`fixed inset-0 w-full h-screen transition-opacity duration-100 ${
          heroLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translate3d(${cinematic.translateX}px, ${cinematic.translateY}px, 0) scale(${cinematic.scale})`,
          filter: `brightness(${cinematic.brightness}) contrast(${cinematic.contrast})`,
          opacity: cinematic.cutOpacity,
          zIndex: cinematic.phase === 'reveal' ? 0 : 30,
          pointerEvents: cinematic.phase === 'reveal' ? 'none' : 'auto',
          willChange: 'transform, opacity, filter',
        }}
      >
        <div className="absolute inset-0 bg-[#000000]">
          <div className="absolute inset-0 flex items-center justify-center pt-10">
            <img 
              src="/RegiNova.gif" 
              alt="RegiNova Animation" 
              className="max-w-[90%] max-h-[80vh] object-contain opacity-90 shadow-[0_0_100px_rgba(0,0,0,1)]" 
            />
          </div>
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 70% 40% at 50% 50%, transparent 0%, rgba(0,0,0,${0.2 + (cinematic.phase === 'tension' ? 0.3 : 0)}) 60%, rgba(0,0,0,${0.5 + (cinematic.phase === 'tension' ? 0.4 : 0)}) 100%),
              linear-gradient(to bottom, rgba(0,0,0,${cinematic.phase === 'tension' ? 0.4 : 0.1}) 0%, transparent 30%, transparent 70%, rgba(0,0,0,${cinematic.phase === 'tension' ? 0.6 : 0.3}) 100%)
            `,
          }}
        />
      </div>

      <div
        className="fixed inset-0 bg-black pointer-events-none"
        style={{
          opacity: cinematic.phase === 'reveal' ? 1 : 0,
          zIndex: 25,
          transition: 'opacity 0.05s ease-out',
        }}
      />

      <div
        className="fixed inset-0 flex flex-col items-center justify-center z-40"
        style={{
          opacity: cinematic.phase === 'reveal' ? Math.min(1, cinematic.brandProgress * 2) : 0,
          transform: `translateY(${cinematic.phase === 'reveal' ? 20 - cinematic.brandProgress * 20 : 20}px) scale(${cinematic.phase === 'reveal' ? 0.95 + cinematic.brandProgress * 0.05 : 0.95})`,
          transition: cinematic.phase === 'reveal' ? 'none' : 'opacity 0.3s ease-out, transform 0.3s ease-out',
        }}
      >
        {/* Rotating Scroll Logo */}
        <div 
          className="mb-2 relative"
          style={{
            opacity: cinematic.phase === 'reveal' ? Math.min(1, Math.max(0, (cinematic.brandProgress - 0.05) * 2.5)) : 0,
            transform: `scale(${0.8 + cinematic.brandProgress * 0.2}) translateY(${cinematic.phase === 'reveal' ? 10 - cinematic.brandProgress * 10 : 10}px)`,
          }}
        >
          <div className="w-32 h-32 md:w-56 md:h-56 lg:w-80 lg:h-80 rounded-full overflow-hidden border border-zinc-900 shadow-[0_0_80px_rgba(0,0,0,0.9)] relative z-10">
            <img 
              src="/RegiNova.gif" 
              alt="Brand Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          {/* Subtle Outer Glow tuned for larger size */}
          <div className="absolute inset-0 rounded-full bg-red-600/5 blur-3xl pointer-events-none transform scale-125"></div>
        </div>

        <h1
          className="text-6xl md:text-8xl lg:text-[120px] font-extrabold text-white tracking-tight"
          style={{
            textShadow: '0 0 60px rgba(220, 38, 38, 0.6), 0 0 120px rgba(220, 38, 38, 0.3)',
            letterSpacing: '-0.02em',
            opacity: cinematic.phase === 'reveal' ? Math.min(1, Math.max(0, (cinematic.brandProgress - 0.1) * 2)) : 0,
            transform: `translateY(${cinematic.phase === 'reveal' ? 30 - Math.max(0, (cinematic.brandProgress - 0.1) * 37.5) : 30}px)`,
          }}
        >
          RegiNova
        </h1>

        <p
          className="mt-6 text-sm md:text-lg uppercase tracking-[0.2em] text-zinc-400"
          style={{
            opacity: cinematic.phase === 'reveal' ? Math.min(1, Math.max(0, (cinematic.brandProgress - 0.3) * 2)) : 0,
            transform: `translateY(${cinematic.phase === 'reveal' ? 20 - Math.max(0, (cinematic.brandProgress - 0.3) * 28.6) : 20}px)`,
          }}
        >
          Experience the Sovereign Void
        </p>

        <div
          className="mt-12"
          style={{
            opacity: cinematic.phase === 'reveal' ? Math.min(1, Math.max(0, (cinematic.brandProgress - 0.5) * 2)) : 0,
            transform: `scale(${cinematic.phase === 'reveal' ? 0.9 + Math.max(0, (cinematic.brandProgress - 0.5) * 0.2) : 0.9})`,
          }}
        >
          <a href="/login" className="group relative px-10 py-5 bg-red-600 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/50">
            <span className="relative z-10 flex items-center gap-3 text-lg">
              Initiate Protocol
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </div>
      </div>

      <div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        style={{
          opacity: getScrollIndicatorOpacity(),
          transition: 'opacity 0.3s ease-out',
        }}
      >
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}
