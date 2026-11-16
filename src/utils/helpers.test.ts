import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { haversineDistance, formatDistance, formatDuration, formatRelativeTime, formatDelay, getStationUrl, parseStationFromUrl, generateShareText, debounce, clamp } from '@/utils/helpers';

describe('helpers', () => {
  describe('haversineDistance', () => {
    it('should calculate distance between two points', () => {
      const dist = haversineDistance(43.8563, 18.4131, 43.8592, 18.4215);
      expect(dist).toBeGreaterThan(0);
      expect(dist).toBeLessThan(2000);
    });

    it('should return 0 for same coordinates', () => {
      const dist = haversineDistance(43.8563, 18.4131, 43.8563, 18.4131);
      expect(dist).toBe(0);
    });

    it('should be symmetric', () => {
      const dist1 = haversineDistance(43.8563, 18.4131, 43.8592, 18.4215);
      const dist2 = haversineDistance(43.8592, 18.4215, 43.8563, 18.4131);
      expect(dist1).toBeCloseTo(dist2, 5);
    });
  });

  describe('formatDistance', () => {
    it('should format meters for distances under 1km', () => {
      expect(formatDistance(500)).toBe('500 m');
      expect(formatDistance(999)).toBe('999 m');
    });

    it('should format kilometers for distances 1km and over', () => {
      expect(formatDistance(1000)).toBe('1.0 km');
      expect(formatDistance(1500)).toBe('1.5 km');
      expect(formatDistance(12345)).toBe('12.3 km');
    });
  });

  describe('formatDuration', () => {
    it('should format minutes for under 60', () => {
      expect(formatDuration(5)).toBe('5 min');
      expect(formatDuration(45)).toBe('45 min');
    });

    it('should format hours and minutes for 60+', () => {
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(75)).toBe('1h 15min');
      expect(formatDuration(135)).toBe('2h 15min');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "Sad" for past times', () => {
      expect(formatRelativeTime(Date.now() - 1000)).toBe('Sad');
    });

    it('should show seconds for under 1 minute', () => {
      expect(formatRelativeTime(Date.now() + 30000)).toBe('30s');
    });

    it('should show minutes for under 1 hour', () => {
      expect(formatRelativeTime(Date.now() + 300000)).toBe('5 min');
    });
  });

  describe('formatDelay', () => {
    it('should show "Na vrijeme" for no delay', () => {
      expect(formatDelay(0)).toBe('Na vrijeme');
      expect(formatDelay(-5)).toBe('Na vrijeme');
    });

    it('should show delay in minutes', () => {
      expect(formatDelay(5)).toBe('Kasni 5 min');
      expect(formatDelay(10)).toBe('Kasni 10 min');
    });
  });

  describe('getStationUrl', () => {
    it('should generate correct station URL', () => {
      const url = getStationUrl('gimnazija', 'https://example.com');
      expect(url).toBe('https://example.com/Unbound/#/?station=gimnazija');
    });
  });

  describe('parseStationFromUrl', () => {
    it('should parse station from URL', () => {
      const originalSearch = window.location.search;
      Object.defineProperty(window, 'location', {
        value: { search: '?station=gimnazija' },
        writable: true
      });
      expect(parseStationFromUrl()).toBe('gimnazija');
      Object.defineProperty(window, 'location', {
        value: { search: originalSearch },
        writable: true
      });
    });

    it('should return null for no station param', () => {
      const originalSearch = window.location.search;
      Object.defineProperty(window, 'location', {
        value: { search: '' },
        writable: true
      });
      expect(parseStationFromUrl()).toBeNull();
      Object.defineProperty(window, 'location', {
        value: { search: originalSearch },
        writable: true
      });
    });
  });

  describe('generateShareText', () => {
    it('should generate share text with station name and URL', () => {
      const text = generateShareText('Gimnazija', 'https://example.com/station');
      expect(text).toContain('Gimnazija');
      expect(text).toContain('https://example.com/station');
      expect(text).toContain('Unbound');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should delay function execution', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      expect(fn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should only call once for multiple rapid calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      debounced();
      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('clamp', () => {
    it('should clamp value to min', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should clamp value to max', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should return value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
  });
});