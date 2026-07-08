import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const densityColor = (density) => {
  if (density >= 85) return 'rgba(239, 68, 68, 0.85)'; // Red
  if (density >= 70) return 'rgba(249, 115, 22, 0.85)'; // Orange
  if (density >= 50) return 'rgba(245, 158, 11, 0.85)'; // Yellow
  return 'rgba(34, 197, 94, 0.85)'; // Green
};

const borderDensityColor = (density) => {
  if (density >= 85) return 'rgb(239, 68, 68)';
  if (density >= 70) return 'rgb(249, 115, 22)';
  if (density >= 50) return 'rgb(245, 158, 11)';
  return 'rgb(34, 197, 94)';
};

export default function StadiumMap({ zones = [], stadium, height = '400px' }) {
  const [selectedZone, setSelectedZone] = useState(null);

  // Match zones from parent props to visual sectors
  const getZoneData = (keywords) => {
    const keyArray = Array.isArray(keywords) ? keywords : [keywords];
    const matched = zones.find((z) => {
      const name = (z.zoneName || z.name || z.zoneId || '').toLowerCase();
      return keyArray.some((k) => name.includes(k.toLowerCase()));
    });
    return matched || { zoneName: keywords[0], density: 10, status: 'normal', wheelchairAccessible: true };
  };

  // Pre-fetch data for different sectors
  const northData = getZoneData(['north', 'gate a']);
  const southData = getZoneData(['south', 'gate b']);
  const eastData = getZoneData(['east', 'section 112']);
  const westData = getZoneData(['west', 'concourse']);
  const parkingData = getZoneData(['parking', 'lot']);

  const sectors = [
    {
      id: 'north_stand',
      label: 'North Stand',
      data: northData,
      x: 100, y: 15, width: 200, height: 42,
      textX: 200, textY: 32, subtextY: 46
    },
    {
      id: 'south_stand',
      label: 'South Stand',
      data: southData,
      x: 100, y: 243, width: 200, height: 42,
      textX: 200, textY: 260, subtextY: 274
    },
    {
      id: 'west_stand',
      label: 'West Stand',
      data: westData,
      x: 15, y: 72, width: 70, height: 156,
      textX: 50, textY: 130, subtextY: 158, isVertical: true
    },
    {
      id: 'east_stand',
      label: 'East Stand',
      data: eastData,
      x: 315, y: 72, width: 70, height: 156,
      textX: 350, textY: 130, subtextY: 158, isVertical: true
    }
  ];

  return (
    <div 
      style={{ height }} 
      className="w-full rounded-2xl overflow-hidden border border-border/40 relative bg-surface-secondary/40 flex flex-col items-center justify-center p-4 select-none"
      role="img" 
      aria-label="Circular Stadium Seating Chart Layout"
    >
      <div className="absolute top-3 left-4 flex flex-col">
        <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Interactive Seating Layout</span>
        <span className="text-xs font-semibold text-text-primary mt-0.5">{stadium?.name || 'MetLife Stadium'}</span>
      </div>

      {/* SVG Canvas for precise rendering and labels formatting */}
      <svg 
        viewBox="0 0 400 300" 
        className="w-full max-w-lg aspect-[4/3]"
      >
        {/* Outer Circular Stadium Boundary */}
        <circle cx="200" cy="150" r="140" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6, 6" className="text-border/40" />

        {/* Concentric Bowl boundary */}
        <circle cx="200" cy="150" r="105" fill="none" stroke="currentColor" strokeWidth="1" className="text-border/20" />

        {/* Soccer Pitch in the Center */}
        <g transform="translate(140, 115)">
          <rect width="120" height="70" rx="3" fill="#065f46" stroke="#ffffff" strokeWidth="1.2" opacity="0.85" />
          {/* Halfway line */}
          <line x1="60" y1="0" x2="60" y2="70" stroke="#ffffff" strokeWidth="1.2" />
          {/* Center Circle */}
          <circle cx="60" cy="35" r="18" fill="none" stroke="#ffffff" strokeWidth="1.2" />
          {/* Penalty boxes */}
          <rect x="0" y="15" width="20" height="40" fill="none" stroke="#ffffff" strokeWidth="1.2" />
          <rect x="100" y="15" width="20" height="40" fill="none" stroke="#ffffff" strokeWidth="1.2" />
          <text x="60" y="38" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold" letterSpacing="1">FWC 26</text>
        </g>

        {/* Clickable Stands with responsive text wrapping */}
        {sectors.map((sec) => {
          const color = densityColor(sec.data.density);
          const borderColor = borderDensityColor(sec.data.density);

          return (
            <g 
              key={sec.id} 
              onClick={() => setSelectedZone(sec.data)}
              className="cursor-pointer group"
            >
              <rect
                x={sec.x}
                y={sec.y}
                width={sec.width}
                height={sec.height}
                rx="10"
                fill={color}
                stroke={borderColor}
                strokeWidth="1.5"
                className="transition-all duration-200 group-hover:brightness-110"
                style={{ filter: `drop-shadow(0 0 4px ${color})` }}
              />
              {sec.isVertical ? (
                <>
                  <text x={sec.textX} y={sec.textY} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" className="pointer-events-none uppercase tracking-wide">
                    {sec.label.split(' ')[0]}
                  </text>
                  <text x={sec.textX} y={sec.textY + 13} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" className="pointer-events-none uppercase tracking-wide">
                    {sec.label.split(' ')[1]}
                  </text>
                  <text x={sec.textX} y={sec.subtextY} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" className="pointer-events-none">
                    {sec.data.density}%
                  </text>
                </>
              ) : (
                <>
                  <text x={sec.textX} y={sec.textY} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" className="pointer-events-none uppercase tracking-wide">
                    {sec.label}
                  </text>
                  <text x={sec.textX} y={sec.subtextY} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" className="pointer-events-none">
                    Load: {sec.data.density}%
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Parking Lot external indicator */}
      <div className="absolute bottom-2 right-4">
        <motion.button
          onClick={() => setSelectedZone(parkingData)}
          className="px-3 py-1.5 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md cursor-pointer"
          style={{
            backgroundColor: densityColor(parkingData.density),
            borderColor: borderDensityColor(parkingData.density),
            boxShadow: `0 0 8px ${densityColor(parkingData.density)}`
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          🚘 Lot A: {parkingData.density}%
        </motion.button>
      </div>

      {/* Selected zone details HUD overlay popup */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 inset-x-4 card p-4 border border-border/80 shadow-2xl bg-surface-card flex justify-between items-center z-30"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-text-primary">{selectedZone.zoneName || selectedZone.name}</h4>
              <div className="flex gap-4 text-xs text-text-secondary">
                <p>
                  Density: <span className="font-bold" style={{ color: borderDensityColor(selectedZone.density) }}>{selectedZone.density}%</span>
                </p>
                <p className="capitalize">Flow: {selectedZone.status || 'normal'}</p>
                {selectedZone.wheelchairAccessible !== false && <p>♿ Step-Free</p>}
              </div>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="btn-secondary py-1 px-3 text-xs"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
