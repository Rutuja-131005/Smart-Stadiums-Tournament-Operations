import { useState } from 'react';
import MapSector from './MapSector';
import MapPopup from './MapPopup';
import ParkingMarker from './ParkingMarker';
import MapLegend from './MapLegend';

export default function StadiumMap({ zones = [], stadium, height = '400px' }) {
  const [selectedZone, setSelectedZone] = useState(null);

  const getZoneData = (keywords) => {
    const keyArray = Array.isArray(keywords) ? keywords : [keywords];
    const matched = zones.find((z) => {
      const name = (z.zoneName || z.name || z.zoneId || '').toLowerCase();
      return keyArray.some((k) => name.includes(k.toLowerCase()));
    });
    return matched || { zoneName: keywords[0], density: 10, status: 'normal', wheelchairAccessible: true };
  };

  const northData = getZoneData(['north', 'gate a']);
  const southData = getZoneData(['south', 'gate b']);
  const eastData = getZoneData(['east', 'section 112']);
  const westData = getZoneData(['west', 'concourse']);
  const parkingData = getZoneData(['parking', 'lot']);

  const sectors = [
    { id: 'north_stand', label: 'North Stand', data: northData, x: 100, y: 15, width: 200, height: 42, textX: 200, textY: 32, subtextY: 46 },
    { id: 'south_stand', label: 'South Stand', data: southData, x: 100, y: 243, width: 200, height: 42, textX: 200, textY: 260, subtextY: 274 },
    { id: 'west_stand', label: 'West Stand', data: westData, x: 15, y: 72, width: 70, height: 156, textX: 50, textY: 130, subtextY: 158, isVertical: true },
    { id: 'east_stand', label: 'East Stand', data: eastData, x: 315, y: 72, width: 70, height: 156, textX: 350, textY: 130, subtextY: 158, isVertical: true },
  ];

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-border/40 relative bg-surface-secondary/40 flex flex-col items-center justify-center p-4 select-none" role="img" aria-label="Circular Stadium Seating Chart Layout">
      <div className="absolute top-3 left-4 flex flex-col">
        <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Interactive Seating Layout</span>
        <span className="text-xs font-semibold text-text-primary mt-0.5">{stadium?.name || 'MetLife Stadium'}</span>
      </div>

      <MapLegend />

      <svg viewBox="0 0 400 300" className="w-full max-w-lg aspect-[4/3]">
        <circle cx="200" cy="150" r="140" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6, 6" className="text-border/40" />
        <circle cx="200" cy="150" r="105" fill="none" stroke="currentColor" strokeWidth="1" className="text-border/20" />

        {/* Soccer Pitch */}
        <g transform="translate(140, 115)">
          <rect width="120" height="70" rx="3" fill="#065f46" stroke="#ffffff" strokeWidth="1.2" opacity="0.85" />
          <line x1="60" y1="0" x2="60" y2="70" stroke="#ffffff" strokeWidth="1.2" />
          <circle cx="60" cy="35" r="18" fill="none" stroke="#ffffff" strokeWidth="1.2" />
          <rect x="0" y="15" width="20" height="40" fill="none" stroke="#ffffff" strokeWidth="1.2" />
          <rect x="100" y="15" width="20" height="40" fill="none" stroke="#ffffff" strokeWidth="1.2" />
          <text x="60" y="38" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="bold" letterSpacing="1">FWC 26</text>
        </g>

        {sectors.map((sec) => (
          <MapSector key={sec.id} sector={sec} onClick={setSelectedZone} />
        ))}
      </svg>

      <ParkingMarker parkingData={parkingData} onClick={setSelectedZone} />
      <MapPopup selectedZone={selectedZone} onDismiss={() => setSelectedZone(null)} />
    </div>
  );
}
