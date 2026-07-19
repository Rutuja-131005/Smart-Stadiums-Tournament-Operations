import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const stats = [
  { value: '16', label: 'Host Cities', icon: '📍' },
  { value: '48', label: 'Qualified Teams', icon: '⚽' },
  { value: '104', label: 'Total Matches', icon: '📅' },
  { value: '6M+', label: 'Expected Fans', icon: '👥' },
];

const features = [
  {
    title: 'AI Operational Command',
    desc: 'Generative AI summaries, instant incident resolution plans, and automated dispatch guides for volunteer operations.',
    icon: '🤖',
    color: 'accent',
  },
  {
    title: 'Real-time Crowd Analytics',
    desc: 'Live occupancy tracking, heatmap overlays, and Predictive Congestion Modeling to optimize gate flow and routes.',
    icon: '📊',
    color: 'blue',
  },
  {
    title: 'Multi-Modal Transport Hub',
    desc: 'Dynamic shuttle schedules, parking utilization trackers, and real-time traffic delay recommendations.',
    icon: '🚌',
    color: 'green',
  },
  {
    title: 'Accessible & Eco-Smart',
    desc: 'Step-free route guidance, screen reader compatibility, and sustainable power/waste optimization widgets.',
    icon: '🌱',
    color: 'gold',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-surface text-text-primary overflow-hidden">
      {/* Background visual element */}
      <div className="absolute top-0 inset-x-0 h-[640px] bg-gradient-to-b from-secondary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation header */}
      <header className="sticky top-0 z-50 bg-surface/50 backdrop-blur-glass border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.jpg" 
            alt="Smart Stadium Logo" 
            className="w-9 h-9 rounded-xl object-cover shadow-md" 
          />
          <div>
            <span className="font-bold text-sm leading-tight block">Smart Stadiums</span>
            <p className="text-[10px] text-accent font-semibold tracking-wider uppercase">FIFA World Cup 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="btn-primary text-sm px-5 py-2">
            Launch Dashboard
          </Link>
        </div>
      </header>
 
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card border border-border text-xs font-semibold tracking-wide text-accent mb-6"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
          </span>
          Next-Gen AI Operational Hub
        </motion.div>
 
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1] mb-6"
        >
          Elevating FIFA World Cup 2026 <span className="gradient-text">Operations with AI</span>
        </motion.h2>
 
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-text-secondary max-w-3xl leading-relaxed mb-10"
        >
          A unified, premium operations command center leveraging generative AI to streamline crowd safety, volunteer coordination, venue routing, and real-time decision support.
        </motion.p>
 
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex justify-center"
        >
          <Link to="/dashboard" className="btn-primary text-lg px-10 py-4 shadow-xl">
            Launch Command Center
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-12 max-w-7xl mx-auto border-y border-border/40 bg-surface-secondary/20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <span className="text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight">
                {stat.value}
              </span>
              <span className="text-sm text-text-secondary mt-1 font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Engineered for Mega-Event Management
          </h3>
          <p className="text-text-secondary text-base mt-4 max-w-2xl mx-auto">
            From smart stadium entries to local shuttle coordination, keep control of the entire tournament flow with predictive algorithms.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {features.map((feat) => (
            <motion.div
              key={feat.title}
              variants={itemVariants}
              className="card-hover p-8 bg-surface-card/60 backdrop-blur-sm border-border/50 flex gap-5 items-start"
            >
              <div className="p-4 rounded-xl bg-surface-elevated text-3xl shadow-inner flex-shrink-0">
                {feat.icon}
              </div>
              <div>
                <h4 className="text-lg font-bold text-text-primary mb-2.5">{feat.title}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Interactive Mock Preview section */}
      <section className="px-6 py-20 bg-surface-secondary/40 border-t border-border/40">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-semibold text-secondary">
              🤖 Intelligent Assistant
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary leading-tight">
              Instant AI Directives at Your Fingertips
            </h3>
            <p className="text-text-secondary leading-relaxed">
              Every system role has access to our context-aware generative AI assistant. It parses live telemetry to recommend crowd redirections, generate emergency workflows, translate user request speech instantly, and formulate sustainability reports.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">✓</div>
                <p className="text-sm text-text-secondary font-medium">Automatic speech recognition & translation</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">✓</div>
                <p className="text-sm text-text-secondary font-medium">Actionable insights with live Mongoose database logs</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">✓</div>
                <p className="text-sm text-text-secondary font-medium">Optimized route overlays on dynamic Mapbox/Leaflet models</p>
              </div>
            </div>
          </div>

          {/* Assistant Preview mockup */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="card-glass border-border/60 p-5 shadow-2xl relative"
            >
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border/60">
                <span className="w-3.5 h-3.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-text-primary">AI Operations Desk</span>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-hidden text-sm">
                <div className="p-3 bg-surface-card rounded-xl border border-border/40 text-text-secondary">
                  How can I help you today?
                </div>
                <div className="p-3 bg-accent/10 border border-accent/20 text-accent rounded-xl text-right max-w-[80%] ml-auto">
                  Alert: Gate B is showing moderate crowd congestion. Generate routing suggestions.
                </div>
                <div className="p-4 bg-surface-elevated rounded-xl border border-border/60 text-text-secondary space-y-2">
                  <p className="font-semibold text-text-primary">AI Recommendation Output:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Redirect incoming Section 105 fans to Gate C (7-minute walk).</li>
                    <li>Update dynamic digital boards near parking Lot A.</li>
                    <li>Dispatch two volunteer helpers to Gate B intersection.</li>
                  </ol>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-surface-secondary/80 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-bold text-sm">
              26
            </div>
            <span className="font-bold text-sm text-text-primary">Smart Stadiums Command Hub</span>
          </div>
          <p className="text-xs text-text-muted">
            &copy; 2026 FIFA World Cup Operations. All rights reserved. Hackathon Demonstration Edition.
          </p>
        </div>
      </footer>
    </div>
  );
}
