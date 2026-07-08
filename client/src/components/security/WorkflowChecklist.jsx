export default function WorkflowChecklist({ workflows }) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold">
          🛡️
        </div>
        <h3 className="font-bold text-base text-text-primary">Standard Safety Protocols</h3>
      </div>
      <p className="text-xs text-text-secondary">Execute standard operating procedures for active stadium incident profiles.</p>

      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {workflows.map((wf) => (
          <div key={wf.id} className="p-4 bg-surface-secondary border border-border rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-bold text-sm text-text-primary">{wf.name}</p>
              <span className="text-[10px] uppercase font-bold tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full">Ready</span>
            </div>
            <div className="space-y-2">
              {wf.steps.map((step, index) => (
                <label key={index} className="flex items-start gap-2.5 text-xs text-text-secondary cursor-pointer select-none">
                  <input type="checkbox" className="checkbox-field mt-0.5 rounded" />
                  <span>{step}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
