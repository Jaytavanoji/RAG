import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/config';

const Support = () => {
  const [faqCategories, setFaqCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const data = await apiRequest('/api/support/faqs');
      setFaqCategories(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Getting Started': 'rocket_launch',
      'Account': 'account_circle',
      'Technical': 'build',
      'Billing': 'payments'
    };
    return icons[category] || 'help';
  };

  return (
    <div className="max-w-6xl mx-auto p-12 space-y-12">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4 max-w-2xl">
          <span className="font-headline uppercase tracking-[3px] text-xs text-primary-container font-bold">Support Portal</span>
          <h2 className="text-5xl font-headline font-extrabold tracking-tight text-on-surface text-wrap-balance leading-tight text-white">
            How can we facilitate your <span className="text-primary-container">Sovereign Intelligence</span> today?
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Access our comprehensive documentation, troubleshooting guides, and direct support channels for RegiNova AI deployment.
          </p>
        </div>
        <Link 
          to="/raise-ticket"
          className="bg-primary-container text-on-primary-container px-8 py-4 rounded-lg font-headline font-bold text-sm uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_30px_rgba(211,47,47,0.3)] group whitespace-nowrap"
        >
          <span className="material-symbols-outlined">confirmation_number</span>
          Raise Ticket
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </section>

      <div className="grid grid-cols-1 gap-8 relative">
        {loading ? (
          <div className="text-center py-12 text-on-surface-variant opacity-30">Loading FAQs...</div>
        ) : faqCategories.length > 0 ? (
          faqCategories.map((category) => (
            <div key={category.category} className="bg-surface-variant/10 backdrop-blur-2xl p-8 rounded-xl border border-white/5 relative group overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container">{getCategoryIcon(category.category)}</span>
                </div>
                <h3 className="font-headline text-xl font-bold tracking-tight text-white">{category.category}</h3>
              </div>
              <div className="space-y-4">
                {category.faqs.map((faq) => (
                  <details key={faq.id} className="group bg-surface-container-low/40 rounded-lg overflow-hidden transition-all duration-300 border border-white/5">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                      <span className="font-medium text-white/90">{faq.question}</span>
                      <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-on-surface-variant">expand_more</span>
                    </summary>
                    <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-surface-variant/10 backdrop-blur-2xl p-8 rounded-xl border border-white/5">
            <p className="text-on-surface-variant text-center">No FAQs available. Please raise a ticket for assistance.</p>
          </div>
        )}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-high p-6 rounded-xl space-y-4 hover:bg-surface-bright transition-colors duration-300 border border-white/5">
          <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-primary-container">menu_book</span>
          </div>
          <h4 className="font-headline font-bold text-lg text-white">Documentation</h4>
          <p className="text-on-surface-variant text-sm">Comprehensive guides and technical API references for developers.</p>
          <a className="inline-flex items-center gap-2 text-primary text-sm font-bold group" href="#">
            Explore Docs <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">open_in_new</span>
          </a>
        </div>
        <div className="bg-surface-container-high p-6 rounded-xl space-y-4 hover:bg-surface-bright transition-colors duration-300 border border-white/5">
          <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-primary-container">forum</span>
          </div>
          <h4 className="font-headline font-bold text-lg text-white">Community Forum</h4>
          <p className="text-on-surface-variant text-sm">Join the network of Sovereign AI users to share insights and solutions.</p>
          <a className="inline-flex items-center gap-2 text-primary text-sm font-bold group" href="#">
            Join Discussion <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">open_in_new</span>
          </a>
        </div>
        <div className="bg-surface-container-high p-6 rounded-xl space-y-4 hover:bg-surface-bright transition-colors duration-300 border border-white/5">
          <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-primary-container">terminal</span>
          </div>
          <h4 className="font-headline font-bold text-lg text-white">Status Node</h4>
          <p className="text-on-surface-variant text-sm">Real-time monitoring of RegiNova AI infrastructure and services.</p>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            All Systems Operational
          </div>
        </div>
      </section>

      <footer className="pt-12 flex justify-between items-center text-[10px] font-headline uppercase tracking-[2px] text-on-surface-variant/40">
        <span>© 2024 RegiNova Artificial Intelligence</span>
        <div className="flex gap-8">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors" href="#">Compliance</a>
        </div>
      </footer>
    </div>
  );
};

export default Support;
