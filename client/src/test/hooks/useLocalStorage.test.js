import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../../hooks/useLocalStorage.js';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with initialValue if key is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-val'));
    expect(result.current[0]).toBe('default-val');
  });

  it('should set and update localStorage value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-val'));

    act(() => {
      result.current[1]('new-val');
    });

    expect(result.current[0]).toBe('new-val');
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('new-val'));
  });

  it('should remove value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-val'));

    act(() => {
      result.current[1]('new-val');
    });
    expect(result.current[0]).toBe('new-val');

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('default-val');
    expect(window.localStorage.getItem('test-key')).toBeNull();
  });
});
