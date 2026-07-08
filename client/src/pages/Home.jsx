import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { stadiumAPI, matchAPI } from '../services/api';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import { SkeletonGrid } from '../components/common/SkeletonLoader';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [stadiums, setStadiums] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([stadiumAPI.getAll(), matchAPI.getLive()])
      .then(([s, m]) => {
        setStadiums(s.data.data);
        setLiveMatches(m.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="skeleton h-12 w-48 rounded" />
        <SkeletonGrid count={4} />
        <div className="skeleton h-8 w-32 rounded mt-8" />
        <SkeletonGrid count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/80 to-surface-card p-6 lg:p-10 border border-border/40 shadow-glow-blue flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2 text-text-primary"
          >
            Welcome, {user?.name || 'Operator'}
          </motion.h1>
          <p className="text-sm lg:text-base text-text-secondary leading-relaxed max-w-xl">
            Intelligent operations suite for the FIFA World Cup 2026. Monitor live matches, crowds, transport plans, and volunteer shifts.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0 relative z-10">
          <Link to="/fan" className="btn-primary text-sm py-2 px-4 shadow-md">
            Fan Experience
          </Link>
          <Link to="/navigation" className="btn-secondary text-sm py-2 px-4 border-border/60 hover:bg-surface-elevated">
            Venue Maps
          </Link>
        </div>
        {/* Background Visual Element */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 text-[150px] hidden md:block select-none pointer-events-none">
          ⚽
        </div>
      </section>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Host Stadiums" value={stadiums.length} icon="🏟️" color="blue" delay={0} />
        <StatCard title="Live Matches" value={liveMatches.length} icon="🔴" color="red" subtitle="Happening now" delay={1} />
        <StatCard title="AI Operations" value="Online" icon="🤖" color="accent" subtitle="24/7 support active" delay={2} />
        <StatCard title="Crowd Telemetry" value="Active" icon="📡" color="green" subtitle="Real-time ingestion" delay={3} />
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl lg:text-2xl font-bold text-text-primary">Live Matches</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map((match) => (
              <motion.div
                key={match._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card border-l-4 border-danger/80 bg-surface-card hover:border-danger hover:shadow-glow-red transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <StatusBadge status="live" label="LIVE" />
                  <span className="text-xs font-semibold text-text-secondary truncate max-w-[150px]">
                    {match.stadium?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex-1 text-center font-bold text-base text-text-primary truncate">{match.homeTeam}</div>
                  <div className="text-xl lg:text-2xl font-black text-accent bg-surface-secondary px-3 py-1 rounded-xl shadow-inner tracking-wider">
                    {match.homeScore} - {match.awayScore}
                  </div>
                  <div className="flex-1 text-center font-bold text-base text-text-primary truncate">{match.awayTeam}</div>
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted mt-4 pt-3 border-t border-border/40">
                  <span>Attendance: {match.attendance?.toLocaleString()}</span>
                  <span>Temp: {match.weather?.temperature || 24}°C</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Host Stadiums */}
      <section className="space-y-4">
        <h2 className="text-xl lg:text-2xl font-bold text-text-primary">Host Venues</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {stadiums.map((stadium) => (
            <motion.div
              key={stadium._id}
              variants={itemVariants}
              className="card-hover p-6 bg-surface-card border-border/40 hover:border-accent/40"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-lg text-text-primary truncate max-w-[200px]">{stadium.name}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{stadium.city}, {stadium.country}</p>
                </div>
                <StatusBadge status="operational" label="Active" showDot />
              </div>
              <div className="mt-4 space-y-2.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-muted">Seating Capacity</span>
                  <span className="text-text-secondary">{stadium.capacity?.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent/80 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/40">
                {stadium.amenities?.slice(0, 3).map((a) => (
                  <span key={a} className="badge-muted text-[10px]">
                    {a}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
