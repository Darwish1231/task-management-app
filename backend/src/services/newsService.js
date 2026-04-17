const axios = require('axios');
const Cache = require('../utils/cache');

/**
 * Queries Hacker News for relevant architectural programming stories based on title keywords.
 * Performs deep data normalization, ensuring NO raw endpoints are dumped.
 * @param {string} title - The task title (e.g. "Optimize PostgreSQL Queries")
 * @returns {Array} Array uniquely bounded to { headline, url }
 */
exports.fetchRelatedNews = async (title) => {
    if (!title) return [];
    
    // Quick Keyword Extraction by removing overly generic Stop words
    const stopWords = ['update', 'fix', 'the', 'and', 'for', 'a', 'to', 'in', 'on', 'with', 'from', 'about', 'issue', 'bug', 'create', 'make', 'do', 'refactor', 'code'];
    const keywords = title.toLowerCase()
        .split(/[^a-z0-9]+/i) // Split by any non-alphanumeric character safely
        .filter(word => word.length > 2 && !stopWords.includes(word))
        .join(' ');
        
    // Fall back to entire raw string if our filter scrubbed it completely
    const query = keywords.length > 0 ? keywords : title; 

    const cacheKey = `hn_news:${query}`;
    const cached = Cache.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await axios.get(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&hitsPerPage=3`);
        
        // Strict Data Normalization: Force map and only return essential metadata
        const normalizedNews = response.data.hits
            .filter(hit => hit.title && hit.url) // strict fallback mechanism
            .map(hit => ({
                headline: hit.title,
                url: hit.url
            }));
            
        Cache.set(cacheKey, normalizedNews, 600); // Save to pure memory cache for 10 minutes
        return normalizedNews;
    } catch (error) {
        // Handle API failures gracefully, avoid cascading backend crashes
        console.error(`Graceful Warning - Failed to fetch HackerNews for "${query}":`, error.message);
        return []; 
    }
};
