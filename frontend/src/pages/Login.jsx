import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { apiRequest } from '../api/config';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/api/auth/login', 'POST', { email, password });
      
      // Standardized storage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('isLoggedIn', 'true');
      if (data.user_id) {
        localStorage.setItem('user', JSON.stringify({ id: data.user_id }));
      }
      
      navigate('/dashboard');
    } catch (err) {
      // Standardized error message as requested
      setError('Invalid credentials. Neural key verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body sovereign-void-bg min-h-screen flex items-center justify-center p-6 selection:bg-primary-container selection:text-on-primary-container relative overflow-hidden">
      {/* Background Pulse Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="relative z-10 w-full max-w-[440px]">
        {/* Glassmorphic Auth Card */}
        <div className="glass-panel rounded-xl p-8 md:p-10 border-t border-white/5 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

          {/* Ashok Stambh Branding Section */}
          <div className="flex flex-col items-center mb-10 perspective-1000">
            <div className="ashok-stambh-3d mb-6 group cursor-pointer">
              <svg className="text-primary-container red-glow transition-all duration-700 hover:scale-110" fill="none" height="64" viewBox="0 0 64 64" width="64" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 4L26 12H38L32 4Z" fill="currentColor"></path>
                <rect fill="currentColor" height="30" rx="1" width="8" x="28" y="14"></rect>
                <circle cx="32" cy="52" r="8" stroke="currentColor" strokeWidth="2"></circle>
                <path d="M32 46V58M26 52H38" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"></path>
              </svg>
            </div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface-variant mb-1 text-white text-center">Sovereign AI</h1>
            <p className="font-label text-xs uppercase tracking-[0.2em] text-primary">Void Intelligence Access</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-surface-container-lowest p-1 rounded-lg mb-8">
            <button className="flex-1 py-2.5 text-sm font-semibold rounded-md bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20">
              Access
            </button>
            <Link to="/signup" className="flex-1 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center">
              SignUp
            </Link>
          </div>

          {/* Auth Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Sovereign ID Input */}
            <div className="space-y-2">
              <label className="block font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="sovereign-id">
                Sovereign ID
              </label>
              <div className="relative group input-focus-glow rounded-lg transition-all duration-300">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
                  fingerprint
                </span>
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0 transition-all font-body text-sm text-white"
                  id="sovereign-id"
                  name="sovereign-id"
                  placeholder="Enter Email Id"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Neural Key Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="block font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider" htmlFor="neural-key">
                  Enter Passcode
                </label>
                <Link className="text-[10px] font-semibold text-primary/70 hover:text-primary transition-colors uppercase tracking-widest" to="/reset-access">Forgot?</Link>
              </div>
              <div className="relative group input-focus-glow rounded-lg transition-all duration-300">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
                  vpn_key
                </span>
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0 transition-all font-body text-sm text-white"
                  id="neural-key"
                  name="neural-key"
                  placeholder="••••••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Primary CTA */}
            <div className="pt-2">
              {error && <p className="text-red-500 text-[10px] mb-4 text-center font-bold uppercase tracking-widest bg-red-500/10 py-2 rounded border border-red-500/20">{error}</p>}
              
              <button disabled={loading} className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/40 group relative overflow-hidden" type="submit">
                <span className="relative z-10 text-sm uppercase tracking-widest">{loading ? 'Verifying...' : 'Initiate Connection'}</span>
                <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </form>

          {/* Secondary Options */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-on-surface-variant/60 font-medium mb-4">Verification provided by Sovereign Core</p>
            <div className="flex justify-center gap-6">
              <button className="text-on-surface-variant/40 hover:text-primary transition-colors hover:scale-110 active:scale-90 transition-transform">
                <span className="material-symbols-outlined">qr_code_2</span>
              </button>
              <button className="text-on-surface-variant/40 hover:text-primary transition-colors hover:scale-110 active:scale-90 transition-transform">
                <span className="material-symbols-outlined">shield_person</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 flex justify-between px-2 text-[10px] text-on-surface-variant/40 font-medium uppercase tracking-[0.2em]">
          <span>Est. 2024</span>
          <div className="flex gap-4">
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="hover:text-primary transition-colors" href="#">Protocols</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Login;
