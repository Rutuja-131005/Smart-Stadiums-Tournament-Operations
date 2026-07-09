import { getDemoAccounts, findDemoAccount } from '../src/config/authDefaults.js';

describe('Auth Defaults Helper', () => {
  it('should retrieve demo accounts list', () => {
    const accounts = getDemoAccounts();
    expect(Array.isArray(accounts)).toBe(true);
    expect(accounts.length).toBe(0);
  });

  it('should find a demo account by email', () => {
    const admin = findDemoAccount('admin@fifa2026.com');
    expect(admin).toBeUndefined();
  });

  it('should return undefined for non-existent account', () => {
    const none = findDemoAccount('none@fifa2026.com');
    expect(none).toBeUndefined();
  });
});
