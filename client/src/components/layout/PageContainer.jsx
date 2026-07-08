import { useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PageContainer() {
  const location = useLocation();

  return (
    <main id="main-content" className="flex-1 p-4 lg:p-6 overflow-auto">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.div>
    </main>
  );
}
