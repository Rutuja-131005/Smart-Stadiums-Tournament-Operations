import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function AnimatedCounter({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const num = typeof value === 'number' ? value : parseInt(value?.toString().replace(/[^0-9]/g, '') || '0', 10);
    if (isNaN(num)) { setDisplay(value); return; }
    const start = prevRef.current;
    const diff = num - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    prevRef.current = num;
  }, [value, duration]);

  return typeof value === 'number' || !isNaN(parseInt(value)) ? display.toLocaleString() : value;
}

const iconColors = {
  accent: 'from-accent/20 to-accent/5 text-accent border-accent/20',
  blue: 'from-secondary/20 to-secondary/5 text-secondary border-secondary/20',
  green: 'from-success/20 to-success/5 text-success border-success/20',
  gold: 'from-warning/20 to-warning/5 text-warning border-warning/20',
  red: 'from-danger/20 to-danger/5 text-danger border-danger/20',
};

const lightIconColors = {
  accent: 'from-emerald-100 to-emerald-50 text-emerald-600 border-emerald-200',
  blue: 'from-blue-100 to-blue-50 text-blue-600 border-blue-200',
  green: 'from-green-100 to-green-50 text-green-600 border-green-200',
  gold: 'from-amber-100 to-amber-50 text-amber-600 border-amber-200',
  red: 'from-red-100 to-red-50 text-red-600 border-red-200',
};

export default function StatCard({ title, value, subtitle, icon, trend, color = 'accent', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className="card-hover group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-secondary dark:text-text-secondary text-gray-500 truncate">
            {title}
          </p>
          <p className="text-2xl lg:text-3xl font-bold mt-1.5 text-text-primary dark:text-text-primary text-gray-900">
            <AnimatedCounter value={value} />
          </p>
          {subtitle && (
            <p className="text-xs text-text-muted dark:text-text-muted text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend !== undefined && trend !== null && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
              trend > 0 ? 'text-danger' : 'text-success'
            }`}>
              <svg className={`w-3.5 h-3.5 ${trend < 0 ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
              {Math.abs(trend)}% vs last hour
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br border ${iconColors[color]} dark:${iconColors[color]} ${lightIconColors[color]} text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
