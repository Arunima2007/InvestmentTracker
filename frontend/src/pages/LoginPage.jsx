/**
 * LoginPage – handles both login and signup in a single tabbed form.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, signup } from '../services/api';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { authenticate }      = useAuth();
  const navigate               = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = isLogin
        ? await login({ email: form.email, password: form.password })
        : await signup(form);

      authenticate(res.data.token, res.data.user);

      // If profile is complete → dashboard, else → profile setup
      if (res.data.user.profile_complete) {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{
           background: 'radial-gradient(ellipse at 50% 0%, rgba(124,77,255,0.15) 0%, transparent 60%)',
         }}>
      <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="text-center mb-8 relative">
          <span className="text-4xl mb-2 block">💎</span>
          <h1 className="gradient-text text-3xl font-bold">InvestWise</h1>
          <p className="text-text-secondary text-sm mt-1">Your AI-Powered Investment Companion</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-surface-200 rounded-lg p-1 relative">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-smooth cursor-pointer border-none
              ${isLogin ? 'bg-brand-500 text-white shadow-lg' : 'bg-transparent text-text-secondary hover:text-text-primary'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-smooth cursor-pointer border-none
              ${!isLogin ? 'bg-brand-500 text-white shadow-lg' : 'bg-transparent text-text-secondary hover:text-text-primary'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-text-secondary text-sm mb-1.5">Full Name</label>
              <input
                id="name" name="name" type="text" required
                value={form.name} onChange={handleChange}
                placeholder="Ananya Sharma"
                className="w-full px-4 py-2.5 rounded-lg bg-surface-200 border border-white/10
                           text-text-primary placeholder:text-text-muted focus:outline-none
                           focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-smooth"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-text-secondary text-sm mb-1.5">Email</label>
            <input
              id="email" name="email" type="email" required
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-200 border border-white/10
                         text-text-primary placeholder:text-text-muted focus:outline-none
                         focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-smooth"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-text-secondary text-sm mb-1.5">Password</label>
            <input
              id="password" name="password" type="password" required minLength={6}
              value={form.password} onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-200 border border-white/10
                         text-text-primary placeholder:text-text-muted focus:outline-none
                         focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-smooth"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white cursor-pointer border-none
                       bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500
                       shadow-lg shadow-brand-500/25 transition-smooth disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Processing…
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
