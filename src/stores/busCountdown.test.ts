import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime } from '@/utils/helpers';

describe('Bus countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update countdown every second', () => {
    const arrivalTime = new Date('2024-01-15T12:05:00Z').getTime();
    let lastDisplay = formatRelativeTime(arrivalTime);
    let changes = 0;

    const interval = setInterval(() => {
      const current = formatRelativeTime(arrivalTime);
      if (current !== lastDisplay) {
        changes++;
        lastDisplay = current;
      }
    }, 1000);

    vi.advanceTimersByTime(5000);
    clearInterval(interval);

    expect(changes).toBeGreaterThanOrEqual(4);
  });

  it('should show "Sad" when time passes', () => {
    const pastTime = new Date('2024-01-15T11:59:00Z').getTime();
    expect(formatRelativeTime(pastTime)).toBe('Sad');
  });

  it('should show seconds for near future', () => {
    const nearFuture = new Date('2024-01-15T12:00:30Z').getTime();
    expect(formatRelativeTime(nearFuture)).toBe('30s');
  });

  it('should show minutes for few minutes away', () => {
    const fewMinutes = new Date('2024-01-15T12:05:00Z').getTime();
    expect(formatRelativeTime(fewMinutes)).toBe('5 min');
  });
});