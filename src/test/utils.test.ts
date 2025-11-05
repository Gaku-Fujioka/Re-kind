import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime, getTodayString } from '../utils/date';

describe('date utils', () => {
  it('should format date correctly', () => {
    const timestamp = new Date('2024-01-15T10:30:00').getTime();
    const formatted = formatDate(timestamp);
    expect(formatted).toContain('2024');
    expect(formatted).toContain('01');
    expect(formatted).toContain('15');
  });

  it('should get today string', () => {
    const today = getTodayString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should format relative time', () => {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const formatted = formatRelativeTime(oneMinuteAgo);
    expect(formatted).toBeTruthy();
  });
});

