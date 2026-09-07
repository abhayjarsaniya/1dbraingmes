import React, { useState } from 'react';
import { useAdminStore } from '../../store/useStore';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('abhay@gmail.com');
  const [password, setPassword] = useState('Abhay1996#');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAdminStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your admin password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const success = await login(password, email);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid admin credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A051A] via-[#120B2E] to-[#0A051A] px-4 py-12 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-[#181135]/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-semibold uppercase tracking-wider mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Website
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-400/20 text-black">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">1D Brain Games CMS</h1>
          <p className="text-white/60 text-sm mt-1">Sign in to manage games, policies, and static assets</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-black uppercase tracking-wider text-sm rounded-xl shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In to Admin'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            Authorized admin credentials: <span className="text-amber-400 font-mono">abhay@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}

