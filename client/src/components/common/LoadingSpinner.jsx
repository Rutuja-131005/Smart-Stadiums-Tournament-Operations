import { motion } from 'framer-motion';

export default function LoadingSpinner({ fullScreen = false, size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className={`${sizes[size]} rounded-full border-2 border-border border-t-accent`}
        />
        <div className={`absolute inset-0 ${sizes[size]} rounded-full border-2 border-transparent border-b-secondary opacity-50 animate-spin-slow`} style={{ animationDirection: 'reverse' }} />
      </div>
      {text && (
        <p className="text-sm text-text-secondary font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-surface/80 backdrop-blur-sm flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      {spinner}
    </div>
  );
}
