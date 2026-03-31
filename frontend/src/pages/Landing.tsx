import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Aesthetic from '../components/landing/Aesthetic';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const nodesRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aestheticRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.node-card',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: nodesRef.current,
            start: 'top 60%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 55%',
            end: 'top 25%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.aesthetic-panel',
        { opacity: 0, x: (i: number) => (i % 2 === 0 ? -40 : 40), y: 40 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: aestheticRef.current,
            start: 'top 55%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.cta-content',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#09090B]">
      <Hero />

      <div className="relative bg-[#09090B] z-50">
        <section ref={nodesRef} className="relative py-48 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">Sovereign</span> Nodes
                <br />
                for the Next Era
              </h2>
              <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
                Decentralized infrastructure that empowers the sovereign individual.
                Built for resilience, designed for scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Distributed Consensus',
                  desc: 'Byzantine fault-tolerant protocols ensuring network integrity across global nodes.',
                  icon: 'network',
                },
                {
                  title: 'Zero-Knowledge Proofs',
                  desc: 'Privacy-preserving verification that reveals nothing beyond the validity of a statement.',
                  icon: 'shield',
                },
                {
                  title: 'Quantum Resistance',
                  desc: 'Post-quantum cryptographic primitives securing your assets against future threats.',
                  icon: 'lock',
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className="node-card group p-8 rounded-2xl bg-zinc-900/60 border border-red-600/15 backdrop-blur-xl transition-all duration-500 hover:border-red-600/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-600/10"
                >
                  <div className="w-16 h-16 rounded-xl bg-red-600/10 flex items-center justify-center mb-6 group-hover:bg-red-600/20 transition-colors duration-300">
                    {card.icon === 'network' && (
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    )}
                    {card.icon === 'shield' && (
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                    {card.icon === 'lock' && (
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={featuresRef}>
          <Features />
        </section>

        <section ref={aestheticRef}>
          <Aesthetic />
        </section>

        <section ref={ctaRef} className="relative py-48 px-6 md:px-12 lg:px-20">
          <div className="cta-content max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Enter the Void?
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join the sovereign revolution. Deploy your first node and experience
              the future of decentralized infrastructure.
            </p>
            <button className="px-8 py-4 border border-zinc-700 text-white font-medium rounded-lg hover:border-zinc-500 transition-all duration-300">
              View Documentation
            </button>
          </div>
        </section>

        <footer className="relative py-16 px-6 md:px-12 lg:px-20 border-t border-red-600/20 z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6">
                {['Twitter', 'GitHub', 'Discord'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-sm text-zinc-500 hover:text-red-500 transition-colors duration-300"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
