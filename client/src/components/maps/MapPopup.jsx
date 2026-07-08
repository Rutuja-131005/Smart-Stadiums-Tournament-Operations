import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { borderDensityColor } from './MapSector';

export default function MapPopup({ selectedZone, onDismiss }) {
  return (
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
          <button onClick={onDismiss} className="btn-secondary py-1 px-3 text-xs">
            Dismiss
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
