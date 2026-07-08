import { useState, useEffect } from 'react';
import { notificationAPI, stadiumAPI, matchAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [stadium, setStadium] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    Promise.all([notificationAPI.getReports(), stadiumAPI.getAll(), matchAPI.getLive()])
      .then(([r, s, m]) => {
        const reps = r.data.data;
        setReports(reps);
        setStadium(s.data.data[0]);
        setMatch(m.data.data[0]);
        if (reps.length > 0) setSelectedReport(reps[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const generateReport = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const { data } = await notificationAPI.generateReport({
        stadiumId: stadium._id,
        matchId: match?._id,
        type: 'match_day',
      });
      setReports((r) => [data.data, ...r]);
      setSelectedReport(data.data);
    } catch (err) {}
    finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Reports & Analytics</h1>
          <p className="text-sm text-text-secondary">AI-generated match-day summaries and operational telemetry logs</p>
        </div>
        <button
          onClick={generateReport}
          className="btn-primary flex items-center gap-2"
          disabled={generating}
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />
              Generating Executive Brief...
            </>
          ) : (
            <>
              <span>📋</span> Generate Match-Day Report
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Archive List Column */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-bold text-base text-text-primary">Report Archives</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {reports.length === 0 ? (
              <div className="card text-center py-12 text-text-secondary text-sm">No reports generated yet.</div>
            ) : (
              reports.map((r) => {
                const isSelected = selectedReport?._id === r._id;
                return (
                  <button
                    key={r._id}
                    onClick={() => setSelectedReport(r)}
                    className={`card-hover w-full text-left flex flex-col justify-between gap-3 ${
                      isSelected ? 'border-accent bg-accent/5 dark:bg-accent/5' : 'bg-surface-card border-border/40'
                    }`}
                  >
                    <div>
                      <p className={`text-sm text-text-primary ${isSelected ? 'font-bold' : 'font-semibold'}`}>{r.title}</p>
                      <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">
                        {r.type.replace('_', ' ')} · {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="badge-blue text-[9px]">
                        {r.generatedBy === 'ai' ? '🤖 AI Synthetic' : '👤 Manual Log'}
                      </span>
                      {isSelected && <span className="text-xs text-accent">Selected</span>}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Report Column */}
        <div className="lg:col-span-8 card space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div
                key={selectedReport._id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 flex-1"
              >
                <div className="border-b border-border/30 pb-4 space-y-2">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="font-extrabold text-lg text-text-primary">{selectedReport.title}</h3>
                    <span className="badge-accent text-[10px]">{selectedReport.generatedBy === 'ai' ? 'AI Executive brief' : 'Operations'}</span>
                  </div>
                  <p className="text-[10px] text-text-muted">
                    Telemetry Timestamp: {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed max-h-[360px] overflow-y-auto pr-1">
                  {selectedReport.content}
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-24 text-text-secondary text-sm flex-1 flex items-center justify-center">
                Select an archived executive brief on the left or generate a new match-day report.
              </div>
            )}
          </AnimatePresence>

          {/* Action Footer */}
          {selectedReport && (
            <div className="pt-4 border-t border-border/30 flex justify-end gap-2.5">
              <button
                onClick={() => window.print()}
                className="btn-secondary text-xs py-2 border-border/60 hover:bg-surface-elevated"
              >
                🖨️ Print Report
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([selectedReport.content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedReport.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="btn-primary text-xs py-2"
              >
                📥 Download Plaintext
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
