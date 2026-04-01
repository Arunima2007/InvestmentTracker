/**
 * InsightCard – renders a single AI insight with icon, type-based styling.
 */

const TYPE_STYLES = {
  warning: 'border-warning/40 bg-warning/5',
  tip:     'border-brand-400/40 bg-brand-400/5',
  success: 'border-success/40 bg-success/5',
  info:    'border-accent-400/40 bg-accent-400/5',
};

export default function InsightCard({ insight }) {
  const style = TYPE_STYLES[insight.type] || TYPE_STYLES.info;

  return (
    <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 transition-smooth hover:scale-[1.01] ${style}`}>
      <span className="text-xl mt-0.5 shrink-0">{insight.icon}</span>
      <p className="text-sm text-text-primary leading-relaxed">{insight.message}</p>
    </div>
  );
}
