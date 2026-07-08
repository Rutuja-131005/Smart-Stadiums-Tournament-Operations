import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function ChatMessages({ messages, loading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[220px] max-h-[460px] mb-4 scrollbar" aria-live="polite">
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <MessageBubble message={msg} onCopy={msg.role !== 'user' ? copyToClipboard : undefined} />
          </motion.div>
        ))}
      </AnimatePresence>

      {loading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
