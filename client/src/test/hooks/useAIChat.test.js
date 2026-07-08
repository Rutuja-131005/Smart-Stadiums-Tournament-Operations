import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAIChat from '../../hooks/useAIChat.js';
import { aiAPI } from '../../services/api.js';

// Mock the AI API
vi.mock('../../services/api.js', () => ({
  aiAPI: {
    chat: vi.fn(),
  },
}));

describe('useAIChat Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with welcome message', () => {
    const { result } = renderHook(() => useAIChat());
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('assistant');
  });

  it('should successfully send a message and add assistant response', async () => {
    aiAPI.chat.mockResolvedValueOnce({
      data: {
        data: {
          message: 'This is the AI response',
        },
      },
    });

    const { result } = renderHook(() => useAIChat({ stadiumId: '123' }));

    await act(async () => {
      await result.current.sendMessage('Hello AI');
    });

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[1].role).toBe('user');
    expect(result.current.messages[1].content).toBe('Hello AI');
    expect(result.current.messages[2].role).toBe('assistant');
    expect(result.current.messages[2].content).toBe('This is the AI response');
  });

  it('should handle API failure gracefully', async () => {
    aiAPI.chat.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('Hello AI');
    });

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[2].content).toContain('Sorry, I encountered an error');
  });
});
