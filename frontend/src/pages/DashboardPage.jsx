/**
 * DashboardPage – the main investment dashboard.
 *
 * Renders:
 *  1. Key stats (corpus, gains, allocation)
 *  2. Pie chart  – asset allocation
 *  3. Line chart – wealth projection over time
 *  4. What-If simulator (SIP + risk sliders)
 *  5. AI Insights cards
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer as PieRC, Legend,
} from 'recharts';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { predictInvestment} from '../services/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import InsightCard from '../components/InsightCard';

// ── Chart colours ──────────────────────
const PIE_COLORS = ['#7c4dff', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
const ASSET_LABELS = {
  bonds: 'Bonds',
  equity: 'Equity',
  mutual_funds: 'Mutual Funds',
  high_risk_assets: 'High-Risk Assets',
};

const RISK_OPTIONS = [
  { value: 'low', label: '🐢 Low' },
  { value: 'medium', label: '⚖️ Medium' },
  { value: 'high', label: '🚀 High' },
];

/** Format ₹ amounts nicely */
const fmt = (n) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${n?.toLocaleString('en-IN') || 0}`;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── State ────────────────────────────
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // What-if controls
  const [wipSip, setWipSip]     = useState(user?.monthly_sip || 5000);
  const [wipRisk, setWipRisk]   = useState(user?.computed_risk_level || user?.risk_tolerance || 'medium');
  const [simulating, setSimulating] = useState(false);

  // ── Fetch projection data ───────────
  const mapRiskToNumber = (risk) => {
  if (!risk) return 1;
  const value = String(risk).toLowerCase();

  if (value === 'low') return 0;
  if (value === 'medium') return 1;
  if (value === 'high') return 2;

  return 1;
};

const mapStabilityToNumber = (stability) => {
  if (!stability) return 1;
  const value = String(stability).toLowerCase();

  if (value === 'unstable' || value === 'low') return 0;
  if (value === 'moderate' || value === 'medium') return 1;
  if (value === 'stable' || value === 'high') return 2;

  return 1;
};

const mapGoalToAmount = (goal, income) => {
  const value = String(goal || '').toLowerCase();

  if (value === 'retirement') return 10000000;
  if (value === 'house') return 5000000;
  if (value === 'car') return 1000000;
  if (value === 'travel') return 300000;
  if (value === 'education') return 2000000;

  // fallback based on income
  return Math.max((income || 50000) * 60, 1000000);
};

const fetchData = useCallback(async (sip, risk) => {
  try {
    const income = Number(user?.monthly_income ?? 0);

    const payload = {
      monthly_income: income,
      monthly_expenses: Number(user?.monthly_expenses ?? 0),
      current_savings: Number(user?.current_savings ?? 0),
      monthly_sip: Number(sip ?? user?.monthly_sip ?? 0),
      financial_goal: Number(
        user?.financial_goal_amount ??
        user?.goal_amount ??
        mapGoalToAmount(user?.financial_goal, income)
      ),
      time_horizon_years: Number(user?.time_horizon ?? 0),
      risk_profile: mapRiskToNumber(
        risk ?? user?.computed_risk_level ?? user?.risk_tolerance
      ),
      income_stability: mapStabilityToNumber(user?.income_stability),
    };

    const res = await predictInvestment(payload);

    setData(res.data);
    setError('');
  } catch (err) {
    if (err.response?.status === 400) {
      navigate('/profile');
    }

    setError(err.response?.data?.error || 'Failed to load data');
  }
}, [navigate, user]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    fetchData(wipSip, wipRisk).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── What-if simulate ────────────────
  const handleSimulate = async () => {
    setSimulating(true);
    await fetchData(wipSip, wipRisk);
    setSimulating(false);
  };

  // ── Derived data ────────────────────
  const allocation = data?.allocation || {};
const pieData = Object.entries(allocation).map(([key, val]) => ({
  name: key,
  value: val,
}));

const projections = data?.projection_series || [];
const insights = data?.personalized_recommendations || [];
const finalCorpus = data?.projected_corpus || 0;
const annualReturn = data?.annual_return_assumption || 0;
const confidence = data?.confidence || 0;
const topFactors = data?.top_factors || [];
const goalProbability = data?.goal_probability || 0;
const baseRecommendation = data?.base_recommendation || '';
const adjustedRecommendation = data?.recommended_investment_type || '';
const adjustmentReason = data?.adjustment_reason || '';
const comparison = data?.scenario_comparison || {};

const totalGains =
  projections.length > 0
    ? (projections[projections.length - 1]?.corpus || 0) -
      (projections[projections.length - 1]?.total_invested || 0)
    : 0;
  // ── Loading / error states ──────────
  if (loading) {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-brand-400 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-text-secondary">Crunching your numbers…</p>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-surface-0">
    <Navbar />
    <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
      {/* ── Header ─────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-1">Investment Dashboard</h1>
          <p className="text-text-secondary text-sm">
            Personalized plan • {user?.financial_goal?.replace(/^\w/, c => c.toUpperCase())} goal
            • {user?.time_horizon} year horizon
          </p>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="mt-3 sm:mt-0 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer
                     bg-white/5 text-text-secondary border border-white/10
                     hover:bg-brand-500/20 hover:text-brand-300 hover:border-brand-400/40
                     transition-smooth"
        >
          ✏️ Edit Profile
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      {/* ── Stat Cards ─────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Expected Corpus" value={fmt(finalCorpus)} icon="💰" />
        <StatCard label="Total Gains" value={fmt(totalGains)} icon="📈" />
        <StatCard label="Annual Return" value={`${(annualReturn * 100).toFixed(1)}%`} icon="⚡" />
        <StatCard label="Monthly SIP" value={fmt(wipSip)} icon="📅" />
      </div>

      {/* ── Confidence + Goal Probability ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recommendation Confidence</h2>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-text-muted text-sm">Base Recommendation</p>
                <p className="text-text-primary text-xl font-semibold">
                  {baseRecommendation || adjustedRecommendation || '—'}
                </p>
              </div>

              <div>
                <p className="text-text-muted text-sm">Final Recommendation</p>
                <p className="text-brand-300 text-xl font-semibold">
                  {adjustedRecommendation || '—'}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-text-muted text-sm">Confidence Score</p>
                <p className="text-text-primary text-sm font-medium">
                  {Math.round((confidence || 0) * 100)}%
                </p>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
                  style={{ width: `${Math.round((confidence || 0) * 100)}%` }}
                />
              </div>
            </div>

            <p className="text-text-secondary text-sm">
              {adjustmentReason || 'No contextual adjustment applied.'}
            </p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Goal Success Probability</h2>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-text-muted text-sm">Likelihood of achieving goal</p>
              <p className="text-text-primary text-sm font-medium">
                {Math.round((goalProbability || 0) * 100)}%
              </p>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${Math.round((goalProbability || 0) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-surface-200 px-4 py-3">
            <div>
              <p className="text-text-muted text-sm">Goal Status</p>
              <p className="text-text-primary font-semibold">{data?.goal_status || '—'}</p>
            </div>
            <div>
              <p className="text-text-muted text-sm">Suggested SIP</p>
              <p className="text-brand-300 font-semibold">
                {fmt(data?.suggested_required_sip || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Why this recommendation ─────────────────── */}
      {topFactors?.length > 0 && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Why this recommendation?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topFactors.map((factor, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-surface-200 px-4 py-3 text-text-secondary"
              >
                {factor}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Charts Row ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="glass-card p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Asset Allocation</h2>
          <PieRC width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip
                contentStyle={{
                  background: '#181d35',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: '#f1f5f9' }}
                formatter={(val) => `${val}%`}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(val) => (
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>{val}</span>
                )}
              />
            </PieChart>
          </PieRC>
        </div>

        {/* Area / Line Chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Wealth Growth Projection</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={projections} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c4dff" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7c4dff" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="year"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(v) => `Y${v}`}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(v) => fmt(v)}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  background: '#181d35',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#f1f5f9' }}
                formatter={(val) => fmt(val)}
                labelFormatter={(v) => `Year ${v}`}
              />
              <Area
                type="monotone"
                dataKey="corpus"
                stroke="#7c4dff"
                fill="url(#corpusGrad)"
                strokeWidth={2.5}
                name="Corpus"
              />
              <Area
                type="monotone"
                dataKey="total_invested"
                stroke="#06b6d4"
                fill="url(#investedGrad)"
                strokeWidth={2}
                name="Invested"
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Scenario Comparison ─────────────────── */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Scenario Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-surface-200 p-4">
            <p className="text-text-muted text-sm">Base Strategy</p>
            <p className="text-text-primary font-semibold">
              {comparison?.base_recommendation || baseRecommendation || '—'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface-200 p-4">
            <p className="text-text-muted text-sm">Adjusted Strategy</p>
            <p className="text-brand-300 font-semibold">
              {comparison?.adjusted_recommendation || adjustedRecommendation || '—'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface-200 p-4">
            <p className="text-text-muted text-sm">Goal Status</p>
            <p className="text-text-primary font-semibold">
              {comparison?.goal_status || data?.goal_status || '—'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface-200 p-4">
            <p className="text-text-muted text-sm">Projected Corpus</p>
            <p className="text-text-primary font-semibold">
              {fmt(comparison?.projected_corpus || finalCorpus || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* ── What-If Simulator ──────────── */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2">
          <span>🔮</span> What-If Simulator
        </h2>
        <p className="text-text-muted text-sm mb-5">
          Adjust your monthly SIP or risk level and see how your wealth projection changes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          {/* SIP Slider */}
          <div>
            <label className="block text-text-secondary text-sm mb-2">
              Monthly SIP: <span className="text-brand-300 font-semibold">{fmt(wipSip)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="500"
              value={wipSip}
              onChange={(e) => setWipSip(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>₹0</span>
              <span>₹50K</span>
              <span>₹1L</span>
            </div>
          </div>

          {/* Risk Toggle */}
          <div>
            <label className="block text-text-secondary text-sm mb-2">Risk Level</label>
            <div className="flex gap-2">
              {RISK_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setWipRisk(r.value)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-smooth cursor-pointer border
                    ${
                      wipRisk === r.value
                        ? 'border-brand-400 bg-brand-400/15 text-brand-300'
                        : 'border-white/10 bg-surface-200 text-text-secondary hover:border-white/20'
                    }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Simulate Button */}
          <div>
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="w-full py-2.5 rounded-lg font-semibold text-white cursor-pointer border-none
                         bg-gradient-to-r from-brand-500 to-accent-600
                         hover:from-brand-400 hover:to-accent-500
                         shadow-lg shadow-brand-500/20 transition-smooth disabled:opacity-50"
            >
              {simulating ? 'Simulating…' : '⚡ Simulate'}
            </button>
          </div>
        </div>
      </div>

      {/* ── AI Insights ────────────────── */}
      {insights.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span>🤖</span> AI Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((ins, i) => (
              <InsightCard key={i} insight={ins} />
            ))}
          </div>
        </div>
      )}
    </main>
  </div>
);
}
