import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIChatPanel from '../ai/AIChatPanel';

export default function FloatingAIButton({ stadiumId, matchId }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-[80]">
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface ${
            isOpen ? 'bg-danger text-white hover:bg-red-600' : 'bg-accent text-surface hover:bg-accent-hover'
          }`}
          aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          title="AI Assistant"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
              </span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Slide-over Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 0.98, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-[75] bg-surface-secondary dark:bg-surface-secondary border-l border-border dark:border-border shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-surface-card">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                    AI
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-text-primary">FIFA Operations AI</h3>
                    <p className="text-[10px] text-accent font-semibold uppercase tracking-wider">Tournament Command Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-ghost p-1.5 text-text-muted hover:text-text-primary"
                  aria-label="Close panel"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Chat Panel */}
              <div className="flex-1 overflow-hidden p-4">
                <AIChatPanel stadiumId={stadiumId} matchId={matchId} className="h-full border-none shadow-none p-0 bg-transparent dark:bg-transparent" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
