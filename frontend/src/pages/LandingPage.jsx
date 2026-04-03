/**
 * LandingPage – premium "About Us" / marketing page.
 * Showcases features, how-it-works, and drives users to sign up.
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';

/* ── Feature data ───────────────────────── */
const FEATURES = [
  {
    icon: '📊',
    title: 'Smart Risk Profiling',
    desc: 'Our engine analyzes your savings ratio, income stability, and risk appetite to compute a personalized risk score — so you always invest within your comfort zone.',
    gradient: 'from-purple-500/20 to-indigo-500/20',
    border: 'border-purple-500/30',
  },
  {
    icon: '💼',
    title: 'AI-Powered Recommendations',
    desc: 'Get tailored asset allocation across bonds, equities, mutual funds, and high-growth assets — perfectly calibrated to your risk profile.',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
  },
  {
    icon: '📈',
    title: 'Wealth Projection',
    desc: 'Visualize your wealth growth year-by-year with compound interest calculations and monthly SIP contributions. See exactly where you\'ll be in 5, 10, or 20 years.',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
  },
  {
    icon: '🔮',
    title: '"What If" Simulator',
    desc: 'Adjust your monthly investment or risk level on the fly — charts update instantly so you can explore different financial futures in real time.',
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
  },
  {
    icon: '🤖',
    title: 'Personalized Insights',
    desc: 'Get actionable tips based on your unique financial profile — from emergency fund warnings to SIP optimization suggestions.',
    gradient: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-500/30',
  },
  {
    icon: '🛡️',
    title: 'Secure & Private',
    desc: 'Your data is protected with industry-standard JWT authentication and hashed passwords. We never share your financial information.',
    gradient: 'from-sky-500/20 to-indigo-500/20',
    border: 'border-sky-500/30',
  },
];

const STEPS = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up in seconds with just your name, email, and a password.', icon: '🔐' },
  { num: '02', title: 'Fill Your Financial Profile', desc: 'Tell us about your income, expenses, savings, investment goals, and risk tolerance.', icon: '📝' },
  { num: '03', title: 'Get Your Personalized Plan', desc: 'Our engine computes your risk score, recommends allocations, and projects your wealth growth.', icon: '🎯' },
  { num: '04', title: 'Explore & Optimize', desc: 'Use the What-If simulator to explore scenarios and refine your investment strategy.', icon: '🚀' },
];

const STATS = [
  { value: '3', label: 'Risk Profiles', suffix: '' },
  { value: '30', label: 'Year Projections', suffix: '+' },
  { value: '100', label: 'Secure', suffix: '%' },
  { value: '4', label: 'Asset Classes', suffix: '' },
];

/* ── Animated counter hook ──────────────── */
function useCountUp(end, duration = 1500, trigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, trigger]);
  return count;
}

/* ── Intersection observer hook ─────────── */
function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.2, ...options });
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);
  return [ref, inView];
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [statsRef, statsInView] = useInView();
  const [featuresRef, featuresInView] = useInView();

  const handleCTA = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  return (
    <div className="min-h-screen bg-surface-0 overflow-x-hidden">

      {/* ═══════════════════════════════════════
          NAVBAR
          ═══════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card flex items-center justify-between px-6 py-3"
           style={{ borderRadius: 0 }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <span className="gradient-text text-xl font-bold tracking-tight">InvestWise</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#features"
             className="hidden sm:inline text-text-secondary hover:text-text-primary text-sm transition-smooth no-underline">
            Features
          </a>
          <a href="#how-it-works"
             className="hidden sm:inline text-text-secondary hover:text-text-primary text-sm transition-smooth no-underline">
            How It Works
          </a>
          <button
            onClick={handleCTA}
            className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer border-none
                       bg-gradient-to-r from-brand-500 to-brand-600 text-white
                       hover:from-brand-400 hover:to-brand-500
                       shadow-lg shadow-brand-500/25 transition-smooth"
          >
            {isAuthenticated ? 'Dashboard' : 'Get Started'}
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 px-4 flex flex-col items-center text-center overflow-hidden">
        {/* Decorative background orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse"
             style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-brand-600/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Badge */}
        <div className="relative mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                        bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium
                        animate-[fadeInDown_0.6s_ease-out]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400"></span>
          </span>
          AI-Powered Investment Intelligence
        </div>

        {/* Headline */}
        <h1 className="relative text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 max-w-4xl
                       animate-[fadeInUp_0.8s_ease-out]">
          <span className="text-text-primary">Invest Smarter,</span>
          <br />
          <span className="gradient-text">Grow Faster</span>
        </h1>

        {/* Sub-headline */}
        <p className="relative text-text-secondary text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed
                      animate-[fadeInUp_1s_ease-out]">
          Your personal AI companion that analyzes your finances, recommends the perfect
          investment mix, and projects your wealth — all in one beautiful dashboard.
        </p>

        {/* CTA Buttons */}
        <div className="relative flex flex-col sm:flex-row gap-4 mb-16 animate-[fadeInUp_1.2s_ease-out]">
          <button
            onClick={handleCTA}
            className="px-8 py-3.5 rounded-xl text-lg font-bold cursor-pointer border-none
                       bg-gradient-to-r from-brand-500 to-accent-600 text-white
                       hover:from-brand-400 hover:to-accent-500
                       shadow-xl shadow-brand-500/30 transition-smooth hover:scale-105"
          >
            {isAuthenticated ? '📊 Go to Dashboard' : '🚀 Start Investing Wisely'}
          </button>
          <a href="#features"
             className="px-8 py-3.5 rounded-xl text-lg font-semibold cursor-pointer no-underline
                        bg-white/5 text-text-secondary border border-white/10
                        hover:bg-white/10 hover:text-text-primary transition-smooth">
            Learn More ↓
          </a>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="relative w-full max-w-5xl mx-auto animate-[fadeInUp_1.4s_ease-out]">
          <div className="glass-card p-4 sm:p-6 border border-white/5 overflow-hidden">
            <div className="grid grid-cols-4 gap-3 mb-4">
              {['💰 ₹85.4L', '📈 ₹56.4L', '⚡ 13.2%', '📅 ₹15,000'].map((stat, i) => (
                <div key={i} className="bg-surface-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-text-muted mb-1">{['Corpus', 'Gains', 'Returns', 'SIP'][i]}</p>
                  <p className="text-sm font-bold text-text-primary">{stat.split(' ').slice(1).join(' ')}</p>
                </div>
              ))}
            </div>
            {/* Mock chart area */}
            <div className="bg-surface-200 rounded-lg p-6 flex items-end gap-1 justify-center h-40">
              {[20, 28, 35, 42, 48, 56, 62, 70, 78, 85, 92, 100].map((h, i) => (
                <div key={i}
                     className="flex-1 rounded-t-sm transition-all duration-500"
                     style={{
                       height: `${h}%`,
                       background: `linear-gradient(to top, rgba(124,77,255,0.3), rgba(124,77,255,${0.4 + i * 0.05}))`,
                       animationDelay: `${i * 0.08}s`,
                     }} />
              ))}
            </div>
          </div>
          {/* Glow underneath */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════ */}
      <section ref={statsRef} className="py-12 px-4 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s, i) => {
            const count = useCountUp(parseInt(s.value), 1200, statsInView);
            return (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold gradient-text">
                  {count}{s.suffix}
                </p>
                <p className="text-text-muted text-sm mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES GRID
          ═══════════════════════════════════════ */}
      <section id="features" ref={featuresRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-14">
            <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-2">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything You Need to <span className="gradient-text">Invest Confidently</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              From risk analysis to wealth projection, InvestWise packs powerful tools
              into a simple, beautiful experience.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i}
                   className={`glass-card p-6 border ${f.border} glow-hover transition-smooth
                              hover:scale-[1.03] hover:-translate-y-1`}
                   style={{
                     opacity: featuresInView ? 1 : 0,
                     transform: featuresInView ? 'translateY(0)' : 'translateY(24px)',
                     transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
                   }}>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-3xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 px-4 relative">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          {/* Section Header */}
          <div className="text-center mb-14">
            <p className="text-accent-400 font-semibold text-sm uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Four Simple Steps to <span className="gradient-text">Financial Clarity</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              No jargon, no complexity. InvestWise guides you from zero to a personalized
              investment plan in minutes.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STEPS.map((s, i) => (
              <div key={i}
                   className="glass-card p-6 flex gap-5 items-start glow-hover transition-smooth hover:scale-[1.02]">
                {/* Number badge */}
                <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600
                               flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <span className="text-white font-bold text-lg">{s.num}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{s.icon}</span>
                    <h3 className="text-lg font-semibold text-text-primary">{s.title}</h3>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ALLOCATION PREVIEW
          ═══════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-2">Investment Strategies</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Allocations Tailored to <span className="gradient-text">Your Risk Level</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                level: 'Conservative', emoji: '🐢', risk: 'Low Risk',
                items: [{ name: 'Bonds', pct: 70, color: '#7c4dff' }, { name: 'Equity', pct: 30, color: '#06b6d4' }],
                desc: 'Capital preservation focused. Ideal for short horizons or risk-averse investors.',
              },
              {
                level: 'Balanced', emoji: '⚖️', risk: 'Medium Risk', featured: true,
                items: [{ name: 'Equity', pct: 50, color: '#7c4dff' }, { name: 'Bonds', pct: 30, color: '#06b6d4' }, { name: 'Mutual Funds', pct: 20, color: '#10b981' }],
                desc: 'A mix of growth and stability. Great for moderate risk appetite.',
              },
              {
                level: 'Aggressive', emoji: '🚀', risk: 'High Risk',
                items: [{ name: 'Equity', pct: 80, color: '#7c4dff' }, { name: 'High-Risk', pct: 20, color: '#f59e0b' }],
                desc: 'Maximum growth potential. Suited for long horizons and high tolerance.',
              },
            ].map((plan, i) => (
              <div key={i}
                   className={`glass-card p-6 transition-smooth hover:scale-[1.03] relative overflow-hidden
                              ${plan.featured ? 'border-brand-400/40 ring-1 ring-brand-400/20' : ''}`}>
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-brand-500 to-accent-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Popular
                  </div>
                )}
                <div className="text-center mb-5">
                  <span className="text-4xl">{plan.emoji}</span>
                  <h3 className="text-xl font-bold text-text-primary mt-2">{plan.level}</h3>
                  <p className="text-brand-400 text-sm font-medium">{plan.risk}</p>
                </div>
                {/* Bars */}
                <div className="space-y-3 mb-5">
                  {plan.items.map((item, j) => (
                    <div key={j}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-secondary">{item.name}</span>
                        <span className="text-text-primary font-semibold">{item.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-300 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000"
                             style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-text-muted text-xs leading-relaxed">{plan.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════ */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <span className="text-5xl mb-4 block">💎</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Ready to Take Control of Your <span className="gradient-text">Financial Future</span>?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            Join thousands of Gen Z investors who are building wealth the smart way.
            It takes less than 2 minutes to get started.
          </p>
          <button
            onClick={handleCTA}
            className="px-10 py-4 rounded-xl text-lg font-bold cursor-pointer border-none
                       bg-gradient-to-r from-brand-500 to-accent-600 text-white
                       hover:from-brand-400 hover:to-accent-500
                       shadow-xl shadow-brand-500/30 transition-smooth hover:scale-105"
          >
            {isAuthenticated ? '📊 Open Dashboard' : '🚀 Create Free Account'}
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            <span className="gradient-text font-bold">InvestWise</span>
          </div>
          <div className="flex gap-4 text-text-muted text-sm">
            <a href="#features" className="hover:text-text-primary transition-smooth no-underline text-text-muted">Features</a>
            <a href="#how-it-works" className="hover:text-text-primary transition-smooth no-underline text-text-muted">How It Works</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
