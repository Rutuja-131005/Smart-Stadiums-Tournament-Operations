/**
 * Lightweight in-memory TTL cache for high-traffic API endpoints.
 *
 * Stores values with a configurable Time-To-Live (TTL). Expired entries are
 * lazily evicted on the next `get()` call. A periodic sweep runs every 60 s
 * to proactively remove stale keys and prevent memory leaks.
 *
 * @example
 *   import { MemoryCache } from '../utils/cache.js';
 *   const cache = new MemoryCache({ defaultTTL: 10000 }); // 10 s default
 *   cache.set('stadiums', stadiumList);
 *   const hit = cache.get('stadiums'); // returns stadiumList or null
 */

/**
 * @typedef {Object} CacheEntry
 * @property {*} value   - The cached value.
 * @property {number} expiry - Timestamp (ms) when this entry expires.
 */

export class MemoryCache {
  /**
   * Create a new MemoryCache instance.
   * @param {Object} [options]
   * @param {number} [options.defaultTTL=15000] - Default TTL in milliseconds.
   * @param {number} [options.sweepInterval=60000] - How often to sweep stale entries (ms).
   */
  constructor({ defaultTTL = 15000, sweepInterval = 60000 } = {}) {
    /** @type {Map<string, CacheEntry>} */
    this._store = new Map();
    this._defaultTTL = defaultTTL;

    // Periodic sweep to prevent unbounded growth
    this._sweepTimer = setInterval(() => this._sweep(), sweepInterval);
    if (this._sweepTimer.unref) this._sweepTimer.unref(); // don't keep process alive
  }

  /**
   * Retrieve a cached value. Returns `null` if the key is missing or expired.
   * @param {string} key
   * @returns {*|null}
   */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this._store.delete(key);
      return null;
    }
    return entry.value;
  }

  /**
   * Store a value under the given key with an optional TTL override.
   * @param {string} key
   * @param {*} value
   * @param {number} [ttl] - TTL in milliseconds (defaults to `defaultTTL`).
   */
  set(key, value, ttl) {
    this._store.set(key, {
      value,
      expiry: Date.now() + (ttl ?? this._defaultTTL),
    });
  }

  /**
   * Invalidate a specific key.
   * @param {string} key
   */
  del(key) {
    this._store.delete(key);
  }

  /**
   * Flush all cached entries.
   */
  flush() {
    this._store.clear();
  }

  /**
   * Returns the number of active (non-expired) entries.
   * @returns {number}
   */
  get size() {
    this._sweep();
    return this._store.size;
  }

  /**
   * Express middleware factory. Caches successful JSON responses.
   * @param {string} keyPrefix - A prefix used to namespace cache keys.
   * @param {number} [ttl] - TTL override in milliseconds.
   * @returns {Function} Express middleware.
   */
  middleware(keyPrefix, ttl) {
    return (req, res, next) => {
      const cacheKey = `${keyPrefix}:${req.originalUrl}`;
      const cached = this.get(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      // Monkey-patch res.json to intercept the response body
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.set(cacheKey, body, ttl);
        }
        return originalJson(body);
      };
      next();
    };
  }

  /** Remove all expired entries from the store. */
  _sweep() {
    const now = Date.now();
    for (const [key, entry] of this._store) {
      if (now > entry.expiry) this._store.delete(key);
    }
  }
}

// Singleton instance used across the application
const apiCache = new MemoryCache({ defaultTTL: 15000 });

export default apiCache;
