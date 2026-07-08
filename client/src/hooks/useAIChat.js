import { useState, useRef } from 'react';
import { aiAPI } from '../services/api';

/**
 * Hook for AI chat functionality
 */
export default function useAIChat({ stadiumId, matchId, preferredLanguage } = {}) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your FIFA World Cup 2026 AI assistant. Ask me about navigation, crowd levels, transport, or match info." },
  ]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: 'user', content: text.trim() }]);
    setLoading(true);
    try {
      const { data } = await aiAPI.chat({ message: text.trim(), stadiumId, matchId });
      setMessages((m) => [...m, { role: 'assistant', content: data.data.message }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I encountered an error. Please re-submit.' }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Voice recognition is not supported in this browser.' }]);
      return;
    }
    const recognition = new SR();
    recognition.lang = preferredLanguage || 'en-US';
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

  return { messages, loading, listening, sendMessage, startVoice, stopVoice };
}
