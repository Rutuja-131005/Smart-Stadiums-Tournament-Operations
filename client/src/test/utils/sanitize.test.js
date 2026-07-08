import { describe, it, expect } from 'vitest';
import { sanitizeHTML, sanitizeText } from '../../utils/sanitize.js';

describe('Sanitize Utility', () => {
  it('should clean raw script tags from HTML', () => {
    const dirty = '<p>Hello <script>alert("hack")</script>world</p>';
    const clean = sanitizeHTML(dirty);
    expect(clean).toBe('<p>Hello world</p>');
  });

  it('should allow safe tags', () => {
    const dirty = '<strong>Hello</strong> <em>World</em>';
    const clean = sanitizeHTML(dirty);
    expect(clean).toBe('<strong>Hello</strong> <em>World</em>');
  });

  it('should strip all HTML tags in sanitizeText', () => {
    const dirty = '<p>Hello <strong>world</strong></p>';
    const clean = sanitizeText(dirty);
    expect(clean).toBe('Hello world');
  });
});
