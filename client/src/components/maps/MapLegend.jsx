export default function MapLegend() {
  const levels = [
    { color: 'rgba(34, 197, 94, 0.85)', label: '< 50%' },
    { color: 'rgba(245, 158, 11, 0.85)', label: '50-69%' },
    { color: 'rgba(249, 115, 22, 0.85)', label: '70-84%' },
    { color: 'rgba(239, 68, 68, 0.85)', label: '≥ 85%' },
  ];

  return (
    <div className="absolute top-3 right-4 flex gap-2">
      {levels.map((l) => (
        <div key={l.label} className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
          <span className="text-[9px] text-text-secondary font-medium">{l.label}</span>
        </div>
      ))}
    </div>
  );
}
