import { describe, it, expect } from 'vitest';

// Mock market data for testing
const mockMarkets = [
  {
    id: 1,
    title: 'Lakers vs Warriors',
    eventType: 'sports',
    isTrending: true,
  },
  {
    id: 2,
    title: 'Bitcoin $100k',
    eventType: 'crypto',
    isTrending: true,
  },
  {
    id: 3,
    title: 'Taylor Swift Grammy',
    eventType: 'entertainment',
    isTrending: false,
  },
  {
    id: 4,
    title: 'S&P 500',
    eventType: 'finance',
    isTrending: true,
  },
  {
    id: 5,
    title: 'Ethereum vs Bitcoin',
    eventType: 'crypto',
    isTrending: false,
  },
];

describe('Markets Page Filtering', () => {
  describe('Trending Markets Filter', () => {
    it('should filter markets by trending status', () => {
      const trendingMarkets = mockMarkets.filter(m => m.isTrending);
      expect(trendingMarkets).toHaveLength(3);
      expect(trendingMarkets.every(m => m.isTrending)).toBe(true);
    });

    it('should return non-trending markets when filter is disabled', () => {
      const nonTrendingMarkets = mockMarkets.filter(m => !m.isTrending);
      expect(nonTrendingMarkets).toHaveLength(2);
      expect(nonTrendingMarkets.every(m => !m.isTrending)).toBe(true);
    });

    it('should return all markets when no filter is applied', () => {
      expect(mockMarkets).toHaveLength(5);
    });
  });

  describe('Event Type Filter', () => {
    it('should filter markets by event type', () => {
      const cryptoMarkets = mockMarkets.filter(m => m.eventType === 'crypto');
      expect(cryptoMarkets).toHaveLength(2);
      expect(cryptoMarkets.every(m => m.eventType === 'crypto')).toBe(true);
    });

    it('should return empty array for non-existent event type', () => {
      const unknownMarkets = mockMarkets.filter(m => m.eventType === 'unknown');
      expect(unknownMarkets).toHaveLength(0);
    });

    it('should filter sports markets', () => {
      const sportsMarkets = mockMarkets.filter(m => m.eventType === 'sports');
      expect(sportsMarkets).toHaveLength(1);
      expect(sportsMarkets[0].title).toBe('Lakers vs Warriors');
    });
  });

  describe('Combined Filters', () => {
    it('should apply both trending and event type filters', () => {
      const filtered = mockMarkets.filter(
        m => m.isTrending && m.eventType === 'crypto'
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Bitcoin $100k');
    });

    it('should return empty when no markets match combined filters', () => {
      const filtered = mockMarkets.filter(
        m => m.isTrending && m.eventType === 'entertainment'
      );
      expect(filtered).toHaveLength(0);
    });

    it('should filter trending sports markets', () => {
      const filtered = mockMarkets.filter(
        m => m.isTrending && m.eventType === 'sports'
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Lakers vs Warriors');
    });

    it('should filter trending finance markets', () => {
      const filtered = mockMarkets.filter(
        m => m.isTrending && m.eventType === 'finance'
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('S&P 500');
    });
  });

  describe('Trending Markets Statistics', () => {
    it('should calculate trending market count', () => {
      const trendingCount = mockMarkets.filter(m => m.isTrending).length;
      expect(trendingCount).toBe(3);
    });

    it('should calculate percentage of trending markets', () => {
      const trendingPercentage = 
        (mockMarkets.filter(m => m.isTrending).length / mockMarkets.length) * 100;
      expect(trendingPercentage).toBe(60);
    });

    it('should identify all trending market IDs', () => {
      const trendingIds = mockMarkets
        .filter(m => m.isTrending)
        .map(m => m.id);
      expect(trendingIds).toEqual([1, 2, 4]);
    });
  });

  describe('Filter State Management', () => {
    it('should maintain filter state when toggling trending', () => {
      let showTrendingOnly = false;
      let eventTypeFilter = 'all';

      // Toggle trending
      showTrendingOnly = true;
      let filtered = mockMarkets.filter(
        m => (eventTypeFilter === 'all' || m.eventType === eventTypeFilter) &&
             (!showTrendingOnly || m.isTrending)
      );
      expect(filtered).toHaveLength(3);

      // Change event type while trending is on
      eventTypeFilter = 'crypto';
      filtered = mockMarkets.filter(
        m => (eventTypeFilter === 'all' || m.eventType === eventTypeFilter) &&
             (!showTrendingOnly || m.isTrending)
      );
      expect(filtered).toHaveLength(1);

      // Toggle trending off
      showTrendingOnly = false;
      filtered = mockMarkets.filter(
        m => (eventTypeFilter === 'all' || m.eventType === eventTypeFilter) &&
             (!showTrendingOnly || m.isTrending)
      );
      expect(filtered).toHaveLength(2);
    });
  });
});
