import heroGif from '../../assets/landing/RegiNova.gif';

export default function Aesthetic() {
  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#09090B] to-[#1a0505]" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <img src={heroGif} alt="" className="w-full h-full object-cover" />
      </div>
      <div
        className="absolute bottom-0 right-0 w-[60vw] h-[60vh] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <span className="text-xs uppercase tracking-[0.2em] text-red-500 mb-4 block">The Sovereign Aesthetic</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
              Design That Commands Presence
            </h2>
            <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
              <p>
                Every pixel is intentional. Every interaction is meaningful.
                The Sovereign Aesthetic represents a new paradigm in digital design—one that
                respects the user's attention and rewards their curiosity.
              </p>
              <p>
                Dark interfaces reduce eye strain while creating an atmosphere of focus and depth.
                Red accents guide the eye to what matters most, signaling action and importance
                without overwhelming the senses.
              </p>
              <p>
                Glassmorphism panels float above the void, creating layers of information that
                feel both tangible and ethereal. This is design for the next era of human-computer
                interaction.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="aesthetic-panel row-span-2 p-8 rounded-2xl bg-zinc-900/40 border border-red-600/20 backdrop-blur-xl">
              <span className="text-[120px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-600/50 to-red-600/10 leading-none">01</span>
              <p className="mt-4 text-xl text-white font-medium">Precision Typography</p>
            </div>

            <div className="aesthetic-panel p-6 rounded-2xl bg-zinc-900/40 border border-red-600/20 backdrop-blur-xl">
              <p className="text-sm text-zinc-400 mb-4">Color Palette</p>
              <div className="flex gap-3">
                {['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FFFFFF'].map((color, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border border-white/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="aesthetic-panel p-6 rounded-2xl bg-zinc-900/40 border border-red-600/20 backdrop-blur-xl overflow-hidden">
              <div
                className="h-32 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(127, 29, 29, 0.2) 50%, rgba(220, 38, 38, 0.1) 100%)',
                  animation: 'gradient-shift 6s ease-in-out infinite alternate',
                }}
              />
              <p className="mt-4 text-sm text-zinc-400">Animated Gradients</p>
            </div>

            <div className="aesthetic-panel row-span-2 p-8 rounded-2xl bg-zinc-900/40 border border-red-600/20 backdrop-blur-xl flex items-center justify-center">
              <span
                className="text-5xl font-bold text-red-500 whitespace-nowrap"
                style={{
                  writingMode: 'vertical-rl',
                  textShadow: '0 0 30px rgba(220, 38, 38, 0.5)',
                }}
              >
                SOVEREIGN
              </span>
            </div>

            <div className="aesthetic-panel p-6 rounded-2xl bg-zinc-900/40 border border-red-600/20 backdrop-blur-xl">
              <div className="h-20 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <span className="text-zinc-500 text-sm">Glass Effect</span>
              </div>
            </div>

            <div className="aesthetic-panel p-6 rounded-2xl bg-zinc-900/40 border border-red-600/20 backdrop-blur-xl">
              <p className="text-2xl italic text-white leading-snug">
                Premium Futuristic SaaS
              </p>
              <div className="mt-3 h-0.5 w-24 bg-gradient-to-r from-red-600 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
