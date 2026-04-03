/**
 * InsightCard – renders a single AI insight with icon, type-based styling.
 */

const TYPE_STYLES = {
  warning: 'border-warning/40 bg-warning/5',
  tip: 'border-brand-400/40 bg-brand-400/5',
  success: 'border-success/40 bg-success/5',
  info: 'border-accent-400/40 bg-accent-400/5',
};

function inferInsightMeta(text = '') {
  const lower = text.toLowerCase();

  if (
    lower.includes('too low') ||
    lower.includes('at risk') ||
    lower.includes('limited') ||
    lower.includes('reduce')
  ) {
    return { type: 'warning', icon: '⚠️' };
  }

  if (
    lower.includes('strong') ||
    lower.includes('on track') ||
    lower.includes('supports') ||
    lower.includes('well aligned')
  ) {
    return { type: 'success', icon: '✅' };
  }

  if (
    lower.includes('important') ||
    lower.includes('may improve') ||
    lower.includes('consider') ||
    lower.includes('can improve')
  ) {
    return { type: 'tip', icon: '💡' };
  }

  return { type: 'info', icon: 'ℹ️' };
}

export default function InsightCard({ insight }) {
  const isString = typeof insight === 'string';

  const message = isString ? insight : insight?.message || '';
  const meta = isString ? inferInsightMeta(message) : {
    type: insight?.type || 'info',
    icon: insight?.icon || 'ℹ️',
  };

  const style = TYPE_STYLES[meta.type] || TYPE_STYLES.info;

  return (
    <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 transition-smooth hover:scale-[1.01] ${style}`}>
      <span className="text-xl mt-0.5 shrink-0">{meta.icon}</span>
      <p className="text-sm text-text-primary leading-relaxed">{message}</p>
    </div>
  );
}
