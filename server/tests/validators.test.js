import { registerSchema, loginSchema } from '../src/validators/auth.schema.js';
import { chatMessageSchema, translateSchema, navigateSchema } from '../src/validators/chat.schema.js';

describe('Zod Validation Schemas', () => {
  describe('Auth Schemas', () => {
    it('should validate correct registration payload', () => {
      const payload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'fan',
        preferredLanguage: 'en',
      };
      const result = registerSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should fail registration with invalid email', () => {
      const payload = {
        name: 'John Doe',
        email: 'not-an-email',
        password: 'Password123!',
      };
      const result = registerSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should fail registration with short password', () => {
      const payload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      };
      const result = registerSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should validate correct login payload', () => {
      const payload = {
        email: 'john@example.com',
        password: 'password123',
      };
      const result = loginSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });

  describe('Chat Schemas', () => {
    it('should validate correct chat message payload', () => {
      const payload = {
        message: 'Hello, this is a message',
        stadiumId: 'stadium-123',
      };
      const result = chatMessageSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should fail empty chat message', () => {
      const payload = {
        message: '   ',
      };
      const result = chatMessageSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
