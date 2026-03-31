import { Shield, Zap, Cpu, Activity, Lock, Globe } from 'lucide-react';

const features = [
  {
    title: 'Neural Consensus',
    desc: 'Advanced BFT protocols optimized for high-throughput sovereign networks.',
    icon: Activity,
    color: 'from-red-600 to-red-400'
  },
  {
    title: 'Zero-Leak Privacy',
    desc: 'Fully encrypted state transitions utilizing next-gen ZK-SNARK primitives.',
    icon: Shield,
    color: 'from-orange-600 to-red-600'
  },
  {
    title: 'Quantum Guard',
    desc: 'Lattice-based cryptography securing assets against future adversarial compute.',
    icon: Lock,
    color: 'from-red-500 to-orange-500'
  },
  {
    title: 'Sovereign Compute',
    desc: 'Isolated execution environments ensuring absolute compute integrity.',
    icon: Cpu,
    color: 'from-red-700 to-red-500'
  },
  {
    title: 'Global Mesh',
    desc: 'Ultra-low latency peer-to-peer networking across decentralized clusters.',
    icon: Globe,
    color: 'from-red-400 to-orange-400'
  },
  {
    title: 'Atomic Velocity',
    desc: 'Sub-second finality for mission-critical digital operations.',
    icon: Zap,
    color: 'from-orange-500 to-red-400'
  }
];

export default function Features() {
  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Engineered for <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">Power</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            The RegiNova protocol integrates military-grade security with 
            unrivaled performance to build the future of decentralized infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group p-8 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl hover:border-red-600/30 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-6 opacity-80 group-hover:opacity-100 transition-opacity`}>
                <div className="w-full h-full bg-zinc-900 rounded-[10px] flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                {feature.desc}
              </p>
              
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Active Protection</span>
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
