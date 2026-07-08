import { useState, useRef } from 'react';
import { aiAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function AIChatPanel({ stadiumId, matchId, className = '' }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your FIFA World Cup 2026 AI assistant. Ask me about navigation, crowd levels, transport, or match info." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

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
      setMessages((m) => [...m, { role: 'assistant', content: 'Voice speech recognition API is not supported in this browser.' }]);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = user?.preferredLanguage || 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => sendMessage(e.results[0][0].transcript);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className={`card flex flex-col h-full ${className}`} role="region" aria-label="AI Assistant Panel">
      <ChatHeader />
      <ChatMessages messages={messages} loading={loading} />
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        loading={loading}
        listening={listening}
        onStartVoice={startVoice}
        onStopVoice={stopVoice}
      />
    </div>
  );
}
