/**
 * StatCard – small metric card (used on the dashboard).
 */

export default function StatCard({ label, value, icon, accent = 'brand-400' }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4 glow-hover transition-smooth">
      <div className={`w-12 h-12 rounded-xl bg-${accent}/10 flex items-center justify-center text-2xl shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{label}</p>
        <p className="text-xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
}
