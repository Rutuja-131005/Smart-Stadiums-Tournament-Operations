import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const credentials = require('./credentials.json');

/**
 * Get all demo accounts from credentials.json
 * @returns {Array} Array of demo account objects
 */
export const getDemoAccounts = () => credentials.demoAccounts;

/**
 * Find a demo account by email
 * @param {string} email
 * @returns {object|undefined}
 */
export const findDemoAccount = (email) =>
  credentials.demoAccounts.find((a) => a.email === email);

export default credentials;
