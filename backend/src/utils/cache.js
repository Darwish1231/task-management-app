const memoryCache = new Map();

class Cache {
    /**
     * Safely tuck away external API payloads with expiration bounds.
     * @param {string} key 
     * @param {any} value 
     * @param {number} ttlSeconds Default 60 seconds (Rate limit padding)
     */
    static set(key, value, ttlSeconds = 60) {
        memoryCache.set(key, {
            value,
            expiresAt: Date.now() + (ttlSeconds * 1000)
        });
    }

    /**
     * Hit the fast memory cache
     * @param {string} key 
     * @returns External data or null if expired
     */
    static get(key) {
        const item = memoryCache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiresAt) {
            memoryCache.delete(key);
            return null;
        }
        return item.value;
    }
}

module.exports = Cache;
