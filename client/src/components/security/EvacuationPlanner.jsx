import { motion, AnimatePresence } from 'framer-motion';

export default function EvacuationPlanner({
  evacZone,
  setEvacZone,
  evacReason,
  setEvacReason,
  evacPlan,
  setEvacPlan,
  generating,
  onGenerate,
}) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center font-bold">
          ⚡
        </div>
        <h3 className="font-bold text-base text-text-primary">AI Emergency Evacuation Routing</h3>
      </div>
      <p className="text-xs text-text-secondary">Generate step-free, crowd-balanced redirection instructions using generative routing matrices.</p>

      <div className="space-y-3.5">
        <div>
          <label htmlFor="affectedZone" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">Affected Stadium Zone</label>
          <input
            id="affectedZone"
            value={evacZone}
            onChange={(e) => setEvacZone(e.target.value)}
            className="input-field"
            placeholder="Affected zone (e.g. Gate A)"
          />
        </div>
        <div>
          <label htmlFor="reason" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">Trigger Incident Reason</label>
          <textarea
            id="reason"
            value={evacReason}
            onChange={(e) => setEvacReason(e.target.value)}
            className="input-field h-24"
            placeholder="Reason for routing updates..."
          />
        </div>
        <button
          onClick={onGenerate}
          className="btn-primary w-full bg-danger hover:bg-red-600 focus:ring-danger text-white py-3"
          disabled={generating}
        >
          {generating ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating evacuation layout...
            </div>
          ) : (
            'Generate Evacuation Plan'
          )}
        </button>
      </div>

      <AnimatePresence>
        {evacPlan && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-surface-secondary border border-border rounded-xl mt-4"
          >
            <h4 className="font-bold text-xs text-text-primary mb-2 flex items-center justify-between">
              <span>Evacuation Instructions</span>
              <button
                onClick={() => setEvacPlan('')}
                className="text-[10px] text-text-muted hover:text-text-primary"
              >
                Clear
              </button>
            </h4>
            <div className="text-xs text-text-secondary leading-relaxed whitespace-pre-line prose max-w-none">
              {evacPlan}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
