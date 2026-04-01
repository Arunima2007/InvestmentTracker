/**
 * ProfilePage – collects the user's financial profile.
 * On submit, saves to backend and navigates to the dashboard.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveProfile } from '../services/api';
import Navbar from '../components/Navbar';

const GOALS = [
  { value: 'retirement', label: '🏖️  Retirement' },
  { value: 'house',      label: '🏠  Buy a House' },
  { value: 'travel',     label: '✈️  Travel Fund' },
  { value: 'education',  label: '🎓  Education' },
  { value: 'wedding',    label: '💍  Wedding' },
  { value: 'emergency',  label: '🛡️  Emergency Fund' },
];

const RISK_LEVELS = [
  { value: 'low',    label: 'Low',    emoji: '🐢', desc: 'Preserve capital, slow & steady' },
  { value: 'medium', label: 'Medium', emoji: '⚖️', desc: 'Balance growth with safety' },
  { value: 'high',   label: 'High',   emoji: '🚀', desc: 'Maximize growth, accept volatility' },
];

const STABILITY = [
  { value: 'stable',   label: 'Stable (salaried)' },
  { value: 'moderate', label: 'Moderate (freelance)' },
  { value: 'unstable', label: 'Unstable (gig / seasonal)' },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    monthly_income:   user?.monthly_income   || '',
    monthly_expenses: user?.monthly_expenses || '',
    current_savings:  user?.current_savings  || '',
    financial_goal:   user?.financial_goal   || 'retirement',
    time_horizon:     user?.time_horizon     || 10,
    risk_tolerance:   user?.risk_tolerance   || 'medium',
    income_stability: user?.income_stability || 'stable',
    monthly_sip:      user?.monthly_sip      || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await saveProfile({
        ...form,
        monthly_income:   parseFloat(form.monthly_income),
        monthly_expenses: parseFloat(form.monthly_expenses),
        current_savings:  parseFloat(form.current_savings),
        time_horizon:     parseInt(form.time_horizon, 10),
        monthly_sip:      parseFloat(form.monthly_sip) || 0,
      });
      updateUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-surface-200 border border-white/10 ' +
    'text-text-primary placeholder:text-text-muted focus:outline-none ' +
    'focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-smooth';

  return (
    <div className="min-h-screen bg-surface-0">
      <Navbar />
      <main className="pt-20 pb-12 px-4 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Your Financial Profile</h1>
          <p className="text-text-secondary">
            Tell us about your finances so we can craft personalized investment recommendations.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Income & Expenses ──────────────── */}
          <section className="glass-card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <span>💰</span> Income & Expenses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="monthly_income" className="block text-text-secondary text-sm mb-1.5">
                  Monthly Income (₹)
                </label>
                <input id="monthly_income" name="monthly_income" type="number" min="0" required
                       value={form.monthly_income} onChange={handleChange}
                       placeholder="50000" className={inputClass} />
              </div>
              <div>
                <label htmlFor="monthly_expenses" className="block text-text-secondary text-sm mb-1.5">
                  Monthly Expenses (₹)
                </label>
                <input id="monthly_expenses" name="monthly_expenses" type="number" min="0" required
                       value={form.monthly_expenses} onChange={handleChange}
                       placeholder="30000" className={inputClass} />
              </div>
              <div>
                <label htmlFor="current_savings" className="block text-text-secondary text-sm mb-1.5">
                  Current Savings (₹)
                </label>
                <input id="current_savings" name="current_savings" type="number" min="0" required
                       value={form.current_savings} onChange={handleChange}
                       placeholder="200000" className={inputClass} />
              </div>
              <div>
                <label htmlFor="monthly_sip" className="block text-text-secondary text-sm mb-1.5">
                  Monthly SIP (₹)
                </label>
                <input id="monthly_sip" name="monthly_sip" type="number" min="0"
                       value={form.monthly_sip} onChange={handleChange}
                       placeholder="5000" className={inputClass} />
              </div>
            </div>
          </section>

          {/* ── Goal & Horizon ─────────────────── */}
          <section className="glass-card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <span>🎯</span> Goal & Time Horizon
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="financial_goal" className="block text-text-secondary text-sm mb-1.5">
                  Financial Goal
                </label>
                <select id="financial_goal" name="financial_goal"
                        value={form.financial_goal} onChange={handleChange}
                        className={inputClass}>
                  {GOALS.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="time_horizon" className="block text-text-secondary text-sm mb-1.5">
                  Time Horizon: <span className="text-brand-300 font-semibold">{form.time_horizon} years</span>
                </label>
                <input id="time_horizon" name="time_horizon" type="range"
                       min="1" max="30" value={form.time_horizon} onChange={handleChange}
                       className="w-full accent-brand-500 mt-2" />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>1 yr</span><span>15 yrs</span><span>30 yrs</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Risk Tolerance ─────────────────── */}
          <section className="glass-card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <span>📊</span> Risk Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {RISK_LEVELS.map(r => (
                <button
                  key={r.value} type="button"
                  onClick={() => setForm({ ...form, risk_tolerance: r.value })}
                  className={`p-4 rounded-xl border text-left transition-smooth cursor-pointer
                    ${form.risk_tolerance === r.value
                      ? 'border-brand-400 bg-brand-400/10 shadow-lg shadow-brand-500/10'
                      : 'border-white/10 bg-surface-200 hover:border-white/20'}`}
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <p className="font-semibold text-text-primary mt-2">{r.label}</p>
                  <p className="text-xs text-text-muted mt-1">{r.desc}</p>
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="income_stability" className="block text-text-secondary text-sm mb-1.5">
                Income Stability
              </label>
              <select id="income_stability" name="income_stability"
                      value={form.income_stability} onChange={handleChange}
                      className={inputClass}>
                {STABILITY.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </section>

          {/* ── Submit ─────────────────────────── */}
          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-white cursor-pointer border-none
                       bg-gradient-to-r from-brand-500 to-accent-600
                       hover:from-brand-400 hover:to-accent-500
                       shadow-lg shadow-brand-500/20 transition-smooth disabled:opacity-50 text-lg"
          >
            {loading ? 'Saving…' : '🚀  Generate My Investment Plan'}
          </button>
        </form>
      </main>
    </div>
  );
}
