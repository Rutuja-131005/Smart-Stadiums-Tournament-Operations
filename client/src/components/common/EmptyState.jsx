import { motion } from 'framer-motion';

const illustrations = {
  'no-data': (
    <svg className="w-24 h-24 text-text-muted opacity-50" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="45" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M38 45h24M50 33v24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M30 80h40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 85h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  search: (
    <svg className="w-24 h-24 text-text-muted opacity-50" viewBox="0 0 100 100" fill="none">
      <circle cx="42" cy="42" r="22" stroke="currentColor" strokeWidth="2" />
      <path d="M58 58l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M35 42h14M42 35v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  error: (
    <svg className="w-24 h-24 text-danger opacity-50" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" />
      <path d="M50 35v20M50 62v3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
};

export default function EmptyState({
  icon = 'no-data',
  title = 'No data available',
  description = 'There\'s nothing to show here yet.',
  action,
  actionLabel = 'Try Again',
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="mb-6 animate-float">
        {illustrations[icon] || illustrations['no-data']}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm">{description}</p>
      {action && (
        <button onClick={action} className="btn-secondary mt-6 text-sm">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
