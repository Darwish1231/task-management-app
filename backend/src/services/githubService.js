const axios = require('axios');
const Cache = require('../utils/cache');

/**
 * Fetches issue metadata from GitHub API.
 * @param {string} issuePath - The formatted issue path (e.g. "facebook/react/issues/28735")
 * @returns {Object|null} The issue data or null if fetch fails.
 */
exports.fetchIssueData = async (issuePath) => {
    if (!issuePath) return null;

    try {
        // Support either raw URL "https://github.com/owner/repo/issues/1" or "owner/repo/issues/1"
        const cleanPath = issuePath.replace('https://github.com/', '').trim();
        
        const cacheKey = `gh_issue:${cleanPath}`;
        const cached = Cache.get(cacheKey);
        if (cached) return cached;

        const response = await axios.get(`https://api.github.com/repos/${cleanPath}`);
        
        const issueData = {
            title: response.data.title,
            state: response.data.state, // 'open' or 'closed'
            labels: response.data.labels.map(l => l.name.toLowerCase()),
            url: response.data.html_url,
            comments: response.data.comments
        };

        Cache.set(cacheKey, issueData, 300); // Cache API result for 5 minutes safely
        return issueData;
    } catch (error) {
        console.error(`Error fetching GitHub data for ${issuePath}:`, error.message);
        // We gracefully return null to indicate data failure without breaking the app
        return null;
    }
};
