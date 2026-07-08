const densityColor = (density) => {
  if (density >= 85) return 'rgba(239, 68, 68, 0.85)';
  if (density >= 70) return 'rgba(249, 115, 22, 0.85)';
  if (density >= 50) return 'rgba(245, 158, 11, 0.85)';
  return 'rgba(34, 197, 94, 0.85)';
};

const borderDensityColor = (density) => {
  if (density >= 85) return 'rgb(239, 68, 68)';
  if (density >= 70) return 'rgb(249, 115, 22)';
  if (density >= 50) return 'rgb(245, 158, 11)';
  return 'rgb(34, 197, 94)';
};

export default function MapSector({ sector, onClick }) {
  const color = densityColor(sector.data.density);
  const borderColor = borderDensityColor(sector.data.density);

  return (
    <g onClick={() => onClick(sector.data)} className="cursor-pointer group">
      <rect
        x={sector.x} y={sector.y}
        width={sector.width} height={sector.height}
        rx="10" fill={color} stroke={borderColor} strokeWidth="1.5"
        className="transition-all duration-200 group-hover:brightness-110"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      {sector.isVertical ? (
        <>
          <text x={sector.textX} y={sector.textY} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" className="pointer-events-none uppercase tracking-wide">
            {sector.label.split(' ')[0]}
          </text>
          <text x={sector.textX} y={sector.textY + 13} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" className="pointer-events-none uppercase tracking-wide">
            {sector.label.split(' ')[1]}
          </text>
          <text x={sector.textX} y={sector.subtextY} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" className="pointer-events-none">
            {sector.data.density}%
          </text>
        </>
      ) : (
        <>
          <text x={sector.textX} y={sector.textY} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" className="pointer-events-none uppercase tracking-wide">
            {sector.label}
          </text>
          <text x={sector.textX} y={sector.subtextY} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" className="pointer-events-none">
            Load: {sector.data.density}%
          </text>
        </>
      )}
    </g>
  );
}

export { densityColor, borderDensityColor };
