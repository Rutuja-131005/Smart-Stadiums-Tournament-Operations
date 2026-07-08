import { useState } from 'react';
import { aiAPI } from '../services/api';

/**
 * Hook for Gemini AI API calls (chat, translate, navigate)
 */
export default function useGemini() {
  const [loading, setLoading] = useState(false);

  const chat = async (message, stadiumId, matchId) => {
    setLoading(true);
    try {
      const { data } = await aiAPI.chat({ message, stadiumId, matchId });
      return data.data;
    } finally {
      setLoading(false);
    }
  };

  const translate = async (text, targetLanguage) => {
    setLoading(true);
    try {
      const { data } = await aiAPI.translate({ text, targetLanguage });
      return data.data;
    } finally {
      setLoading(false);
    }
  };

  const navigate = async (from, to, stadiumId, accessibility) => {
    setLoading(true);
    try {
      const { data } = await aiAPI.navigate({ from, to, stadiumId, accessibility });
      return data.data;
    } finally {
      setLoading(false);
    }
  };

  return { loading, chat, translate, navigate };
}
