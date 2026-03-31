import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { apiRequest } from '../api/config';

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Verification mismatch: Passwords do not correlate.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Security Cipher must be at least 6 characters.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Access Identifier format is invalid.');
      setLoading(false);
      return;
    }

    try {
      const data = await apiRequest('/api/auth/signup', 'POST', { 
        email, 
        password, 
        full_name: fullName 
      });
      
      setSuccess(true);
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Node Registration Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body sovereign-void-bg min-h-screen flex items-center justify-center p-6 selection:bg-primary-container selection:text-on-primary-container relative">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <main className="relative z-10 w-full max-w-[440px]">
        <div className="glass-panel rounded-xl p-8 md:p-10 border-t border-white/5 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center mb-10 perspective-1000">
            <div className="ashok-stambh-3d mb-6 group cursor-pointer">
              <svg className="text-primary-container red-glow transition-all duration-700 hover:scale-110" fill="none" height="64" viewBox="0 0 64 64" width="64" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 4L26 12H38L32 4Z" fill="currentColor"></path>
                <rect fill="currentColor" height="30" rx="1" width="8" x="28" y="14"></rect>
                <circle cx="32" cy="52" r="8" stroke="currentColor" strokeWidth="2"></circle>
                <path d="M32 46V58M26 52H38" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"></path>
              </svg>
            </div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface-variant mb-1 text-white">Sovereign AI</h1>
            <p className="font-label text-xs uppercase tracking-[0.2em] text-primary">Void Intelligence Access</p>
          </div>

          <div className="flex bg-surface-container-lowest p-1 rounded-lg mb-8">
            <Link to="/login" className="flex-1 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center">
              Access
            </Link>
            <button className="flex-1 py-2.5 text-sm font-semibold rounded-md bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20">
              SignUp
            </button>
          </div>

          {success ? (
            <div className="bg-primary-container/10 border border-primary/20 p-6 rounded-lg text-center space-y-4 animate-in fade-in zoom-in duration-500">
              <span className="material-symbols-outlined text-4xl text-primary block">verified_user</span>
              <h2 className="text-xl font-headline font-bold text-white uppercase tracking-wider">Node Registered</h2>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Identity authorized in the Sovereign Core. You may now initiate access connection.</p>
              <Link to="/login" className="block w-full bg-primary-container text-on-primary-container font-headline font-bold py-3 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-xs uppercase tracking-widest shadow-lg shadow-black/40">
                Access Node
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSignup}>
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="block font-label text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="signup-name">
                  Access Identity
                </label>
                <div className="relative group input-focus-glow rounded-lg transition-all duration-300">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors text-lg">
                    person
                  </span>
                  <input 
                    className="w-full bg-surface-container-lowest border-none rounded-lg py-3.5 pl-12 pr-4 text-white placeholder:text-on-surface-variant/30 focus:ring-0 transition-all font-body text-sm" 
                    id="signup-name" 
                    name="signup-name" 
                    placeholder="Full Intelligence Name" 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block font-label text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="signup-email">
                  Access Identifier
                </label>
                <div className="relative group input-focus-glow rounded-lg transition-all duration-300">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors text-lg">
                    alternate_email
                  </span>
                  <input 
                    className="w-full bg-surface-container-lowest border-none rounded-lg py-3.5 pl-12 pr-4 text-white placeholder:text-on-surface-variant/30 focus:ring-0 transition-all font-body text-sm" 
                    id="signup-email" 
                    name="signup-email" 
                    placeholder="email@sovereign.ai" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block font-label text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="signup-password">
                  Security Cipher
                </label>
                <div className="relative group input-focus-glow rounded-lg transition-all duration-300">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors text-lg">
                    lock_open
                  </span>
                  <input 
                    className="w-full bg-surface-container-lowest border-none rounded-lg py-3.5 pl-12 pr-4 text-white placeholder:text-on-surface-variant/30 focus:ring-0 transition-all font-body text-sm" 
                    id="signup-password" 
                    name="signup-password" 
                    placeholder="••••••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="block font-label text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="signup-confirm">
                  Verify Cipher
                </label>
                <div className="relative group input-focus-glow rounded-lg transition-all duration-300">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors text-lg">
                    verified_user
                  </span>
                  <input 
                    className="w-full bg-surface-container-lowest border-none rounded-lg py-3.5 pl-12 pr-4 text-white placeholder:text-on-surface-variant/30 focus:ring-0 transition-all font-body text-sm" 
                    id="signup-confirm" 
                    name="signup-confirm" 
                    placeholder="••••••••••••" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                {error && <p className="text-red-500 text-[10px] mb-4 text-center font-bold uppercase tracking-widest bg-red-500/10 py-2 rounded border border-red-500/20">{error}</p>}
                
                <button disabled={loading} className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/40 group relative overflow-hidden" type="submit">
                  <span className="relative z-10 uppercase tracking-widest text-sm text-on-primary-container">{loading ? 'Registering...' : 'Register Node'}</span>
                  <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">how_to_reg</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </form>
          )}

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/10"></div>
            </div>
            <span className="relative px-3 bg-[#1e1e20] text-[9px] uppercase tracking-[0.3em] text-on-surface-variant/30 font-bold">External Gateways</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-lg hover:bg-surface-bright transition-all group">
              <svg className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.264-2.09 4.413-1.33 1.33-3.14 2.189-5.75 2.189-4.5 0-8.09-3.65-8.09-8.09s3.59-8.09 8.09-8.09c2.44 0 4.29.97 5.69 2.33l2.35-2.35C18.65 2.89 15.93 1.5 12.48 1.5 6.4 1.5 1.5 6.4 1.5 12.48s4.9 10.98 10.98 10.98c3.28 0 5.76-1.08 7.73-3.13 2.04-2.04 2.69-4.88 2.69-7.17 0-.7-.06-1.37-.18-2.04h-10.27z"></path>
              </svg>
              <span className="text-[10px] font-bold text-on-surface-variant/60 group-hover:text-on-surface uppercase tracking-widest">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-lg hover:bg-surface-bright transition-all group">
              <svg className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
              </svg>
              <span className="text-[10px] font-bold text-on-surface-variant/60 group-hover:text-on-surface uppercase tracking-widest">GitHub</span>
            </button>
          </div>
        </div>
      
        <footer className="mt-8 flex flex-col items-center gap-4 text-white">
          <div className="flex gap-6">
            <a className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-colors font-bold" href="#">Protocol Status</a>
            <a className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-colors font-bold" href="#">Legal Terms</a>
          </div>
          <p className="text-[9px] text-on-surface-variant/20 tracking-tighter uppercase font-semibold">© 2024 REGINOVA CORP. SOVEREIGN CLASS AI AUTHENTICATION REQUIRED.</p>
        </footer>
      </main>
    </div>
  );
};

export default Signup;
