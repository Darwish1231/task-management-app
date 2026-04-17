const axios = require('axios');
const newsService = require('../src/services/newsService');

// Mock Axios
jest.mock('axios');

describe('News Service API Integrations', () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should cleanly extract keywords and fetch related news from Algolia HN', async () => {
        const mockHits = [
            { title: 'React Hooks Deep Dive', url: 'http://tech.com/1' },
            { title: 'Why UI bugs happen', url: 'http://tech.com/2' }
        ];

        axios.get.mockResolvedValue({ data: { hits: mockHits } });

        // Generic stop words should be intelligently removed
        const results = await newsService.fetchRelatedNews('Fix the annoying UI bug in React');
        
        expect(results.length).toBe(2);
        expect(results[0].headline).toBe('React Hooks Deep Dive');
        expect(results[1].url).toBe('http://tech.com/2');
        
        // Assert keywords were correctly scrubbed (ignoring 'fix', 'the', 'in', 'bug', 'ui' is two letters so usually not scrubbed unless < 3 length)
        // Actually our keyword extractor filters length>2 and stopWords
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('annoying%20react'));
    });

    it('should return an empty array if Algolia upstream API fails (Graceful Error Handling)', async () => {
        axios.get.mockRejectedValue(new Error('Algolia Server 500'));
        
        const results = await newsService.fetchRelatedNews('PostgreSQL deadlocks');
        expect(results).toEqual([]);
    });
});
