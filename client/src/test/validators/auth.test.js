import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../../validators/auth.schema.js';

describe('Client Zod Schemas', () => {
  describe('Login Schema', () => {
    it('should validate login payload correctly', () => {
      const res = loginSchema.safeParse({ email: 'fan@fifa2026.com', password: 'password' });
      expect(res.success).toBe(true);
    });

    it('should fail validation on missing password', () => {
      const res = loginSchema.safeParse({ email: 'fan@fifa2026.com', password: '' });
      expect(res.success).toBe(false);
    });
  });

  describe('Register Schema', () => {
    it('should validate registration payload correctly', () => {
      const res = registerSchema.safeParse({
        name: 'New Fan',
        email: 'newfan@fifa2026.com',
        password: 'Password123!',
        role: 'fan',
      });
      expect(res.success).toBe(true);
    });

    it('should reject register with short password', () => {
      const res = registerSchema.safeParse({
        name: 'New Fan',
        email: 'newfan@fifa2026.com',
        password: '123',
      });
      expect(res.success).toBe(false);
    });
  });
});
