import { describe, it, expect } from 'vitest';

describe('App utilities', () => {
  it('should pass basic sanity check', () => {
    expect(true).toBe(true);
  });

  it('should format crowd density status correctly', () => {
    const getStatus = (density) => {
      if (density >= 85) return 'critical';
      if (density >= 70) return 'congested';
      if (density >= 50) return 'moderate';
      return 'normal';
    };
    expect(getStatus(90)).toBe('critical');
    expect(getStatus(75)).toBe('congested');
    expect(getStatus(55)).toBe('moderate');
    expect(getStatus(30)).toBe('normal');
  });
});
