export default function ChatInput({ input, setInput, onSend, loading, listening, onStartVoice, onStopVoice }) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend(input)}
        placeholder="Ask for routes, handbook, translations..."
        className="input-field flex-1 text-xs py-2.5"
        aria-label="AI message input"
        disabled={loading}
      />
      <button
        onClick={listening ? onStopVoice : onStartVoice}
        className={`btn-icon flex-shrink-0 transition-all ${
          listening ? 'bg-danger border-danger text-white shadow-glow-red' : 'btn-secondary border-border/60 hover:bg-surface-card'
        }`}
        aria-label={listening ? 'Stop voice transcription' : 'Start voice transcription'}
        title="Voice query speech input"
      >
        {listening ? (
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
        ) : (
          <span>🎤</span>
        )}
      </button>
      <button
        onClick={() => onSend(input)}
        className="btn-primary px-5 text-xs py-2.5"
        disabled={loading || !input.trim()}
      >
        Send
      </button>
    </div>
  );
}
