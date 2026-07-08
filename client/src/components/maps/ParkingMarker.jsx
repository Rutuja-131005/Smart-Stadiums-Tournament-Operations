import { motion } from 'framer-motion';
import { densityColor, borderDensityColor } from './MapSector';

export default function ParkingMarker({ parkingData, onClick }) {
  return (
    <div className="absolute bottom-2 right-4">
      <motion.button
        onClick={() => onClick(parkingData)}
        className="px-3 py-1.5 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md cursor-pointer"
        style={{
          backgroundColor: densityColor(parkingData.density),
          borderColor: borderDensityColor(parkingData.density),
          boxShadow: `0 0 8px ${densityColor(parkingData.density)}`,
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        🚘 Lot A: {parkingData.density}%
      </motion.button>
    </div>
  );
}
