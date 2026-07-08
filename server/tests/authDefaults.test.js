import { getDemoAccounts, findDemoAccount } from '../src/config/authDefaults.js';

describe('Auth Defaults Helper', () => {
  it('should retrieve demo accounts list', () => {
    const accounts = getDemoAccounts();
    expect(Array.isArray(accounts)).toBe(true);
    expect(accounts.length).toBeGreaterThan(0);
    expect(accounts[0].email).toBeDefined();
    expect(accounts[0].password).toBeDefined();
  });

  it('should find a demo account by email', () => {
    const admin = findDemoAccount('admin@fifa2026.com');
    expect(admin).toBeDefined();
    expect(admin.role).toBe('admin');
    expect(admin.password).toBe('admin123');
  });

  it('should return undefined for non-existent account', () => {
    const none = findDemoAccount('none@fifa2026.com');
    expect(none).toBeUndefined();
  });
});
