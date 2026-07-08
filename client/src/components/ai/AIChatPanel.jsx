import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// Simple helper to parse basic markdown elements (bold, bullet points, numbers) for premium visuals
function parseMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let content = line;
    // Bold translation **bold**
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-text-primary">$1</strong>');
    
    // Bullet list formatting
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <li key={idx} className="list-disc list-inside ml-2.5 text-xs text-text-secondary my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />
      );
    }
    // Numbered list formatting
    const numMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      return (
        <li key={idx} className="list-decimal list-inside ml-2.5 text-xs text-text-secondary my-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: numMatch[2] }} />
      );
    }
    return (
      <p key={idx} className="text-xs text-text-secondary leading-relaxed mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: content }} />
    );
  });
}

export default function AIChatPanel({ stadiumId, matchId, className = '' }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your FIFA World Cup 2026 AI assistant. Ask me about navigation, crowd levels, transport, or match info." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await aiAPI.chat({ message: text.trim(), stadiumId, matchId });
      setMessages((m) => [...m, { role: 'assistant', content: data.data.message }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I encountered an error communicating with the coordinator node. Please re-submit.' }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Voice speech recognition API is not supported in this browser. Please use keyboard input.' }]);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = user?.preferredLanguage || 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`card flex flex-col h-full ${className}`} role="region" aria-label="AI Assistant Panel">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="w-3 h-3 rounded-full bg-fifa-green animate-pulse" aria-hidden="true" />
        <h3 className="font-semibold text-gray-900 dark:text-white">FIFA Operations AI</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[220px] max-h-[460px] mb-4 scrollbar" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`group relative max-w-[80%] p-4.5 rounded-2xl border ${
                  isUser
                    ? 'bg-accent/10 border-accent/20 text-text-primary rounded-tr-none'
                    : 'bg-surface-secondary border-border/40 text-text-secondary rounded-tl-none'
                }`}>
                  {isUser ? (
                    <p className="text-xs font-semibold leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="space-y-1">
                      {parseMarkdown(msg.content)}
                    </div>
                  )}

                  {/* Copy button */}
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(msg.content)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-text-muted hover:text-text-primary"
                      title="Copy response"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="bg-surface-secondary border border-border/40 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask for routes, handbook, translations..."
          className="input-field flex-1 text-xs py-2.5"
          aria-label="AI message input"
          disabled={loading}
        />
        <button
          onClick={listening ? stopVoice : startVoice}
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
          onClick={() => sendMessage(input)}
          className="btn-primary px-5 text-xs py-2.5"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
