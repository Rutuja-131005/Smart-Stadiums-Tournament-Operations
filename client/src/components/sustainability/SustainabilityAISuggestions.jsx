export default function SustainabilityAISuggestions({ suggestions, onLoadSuggestions }) {
  return (
    <div className="card space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-full blur-2xl pointer-events-none" />
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
          <span>🌱</span>
          AI Optimization Suggestions
        </h3>
        <button
          onClick={onLoadSuggestions}
          className="btn-secondary text-xs border-border/60 hover:bg-surface-card"
        >
          Refresh AI Suggestions
        </button>
      </div>
      {suggestions.length === 0 ? (
        <div className="p-4 border border-dashed border-border rounded-xl text-xs text-text-muted text-center">
          No suggestions generated yet. Click refresh to query AI optimization rules.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((s, i) => (
            <div key={i} className="p-4 border border-success/20 bg-success-bg/10 rounded-xl text-xs text-text-secondary leading-relaxed">
              <p className="font-semibold text-success mb-1">Directive #{i + 1}</p>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
