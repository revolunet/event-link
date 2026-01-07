import { describe, it, expect } from 'vitest';
import {
  encodeEventToURL,
  parseShareURL,
  getViewMode,
  formatEventDateTime,
} from '../../src/url-encoder';
import type { CalendarEvent } from '../../src/types';

/**
 * Helper to parse hash params from a URL
 */
function getHashParams(url: string): URLSearchParams {
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) return new URLSearchParams();
  return new URLSearchParams(url.slice(hashIndex + 1));
}

describe('url-encoder', () => {
  // Test data
  const baseEvent: CalendarEvent = {
    title: 'Team Meeting',
    description: 'Discuss project updates',
    url: 'https://meet.example.com/123',
    startDateTime: new Date('2026-01-15T10:00:00'),
    endDateTime: new Date('2026-01-15T11:00:00'),
  };

  const baseURL = 'https://eventlink.app/';

  describe('encodeEventToURL', () => {
    it('should encode a basic event to URL with share=1 parameter', () => {
      const url = encodeEventToURL(baseEvent, baseURL);
      expect(url).toContain('share=1');
    });

    it('should encode event title', () => {
      const url = encodeEventToURL(baseEvent, baseURL);
      const params = getHashParams(url);
      expect(params.get('title')).toBe('Team Meeting');
    });

    it('should encode start datetime in ISO 8601 format', () => {
      const url = encodeEventToURL(baseEvent, baseURL);
      expect(url).toContain('start=2026-01-15T10%3A00');
    });

    it('should encode end datetime in ISO 8601 format', () => {
      const url = encodeEventToURL(baseEvent, baseURL);
      expect(url).toContain('end=2026-01-15T11%3A00');
    });

    it('should encode description when provided', () => {
      const url = encodeEventToURL(baseEvent, baseURL);
      const params = getHashParams(url);
      expect(params.get('desc')).toBe('Discuss project updates');
    });

    it('should encode URL when provided', () => {
      const url = encodeEventToURL(baseEvent, baseURL);
      expect(url).toContain('url=');
      expect(url).toContain('meet.example.com');
    });

    it('should omit description when empty', () => {
      const event = { ...baseEvent, description: '' };
      const url = encodeEventToURL(event, baseURL);
      expect(url).not.toContain('desc=');
    });

    it('should omit URL when empty', () => {
      const event = { ...baseEvent, url: '' };
      const url = encodeEventToURL(event, baseURL);
      expect(url).not.toContain('url=');
    });

    it('should handle special characters in title', () => {
      const event = { ...baseEvent, title: 'Meeting & Planning <Session>' };
      const url = encodeEventToURL(event, baseURL);
      const params = getHashParams(url);
      expect(params.get('title')).toBe('Meeting & Planning <Session>');
    });

    it('should produce a valid URL', () => {
      const url = encodeEventToURL(baseEvent, baseURL);
      expect(() => new URL(url)).not.toThrow();
    });

    it('should use the provided base URL', () => {
      const url = encodeEventToURL(baseEvent, 'https://example.com/app/');
      expect(url.startsWith('https://example.com/app#')).toBe(true);
    });

    it('should use hash fragment instead of query string', () => {
      const url = encodeEventToURL(baseEvent, baseURL);
      expect(url).toContain('#share=1');
      expect(url).not.toContain('?share=1');
    });
  });

  describe('parseShareURL', () => {
    it('should parse a valid share URL into a CalendarEvent', () => {
      const params = new URLSearchParams(
        '?share=1&title=Team%20Meeting&start=2026-01-15T10:00&end=2026-01-15T11:00'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.event.title).toBe('Team Meeting');
      }
    });

    it('should parse start and end datetimes correctly', () => {
      const params = new URLSearchParams(
        '?share=1&title=Test&start=2026-01-15T10:00&end=2026-01-15T11:00'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.event.startDateTime.getFullYear()).toBe(2026);
        expect(result.event.startDateTime.getMonth()).toBe(0); // January
        expect(result.event.startDateTime.getDate()).toBe(15);
        expect(result.event.startDateTime.getHours()).toBe(10);
        expect(result.event.startDateTime.getMinutes()).toBe(0);
        expect(result.event.endDateTime.getHours()).toBe(11);
      }
    });

    it('should parse optional description', () => {
      const params = new URLSearchParams(
        '?share=1&title=Test&start=2026-01-15T10:00&end=2026-01-15T11:00&desc=My%20description'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.event.description).toBe('My description');
      }
    });

    it('should parse optional URL', () => {
      const params = new URLSearchParams(
        '?share=1&title=Test&start=2026-01-15T10:00&end=2026-01-15T11:00&url=https%3A%2F%2Fexample.com'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.event.url).toBe('https://example.com');
      }
    });

    it('should return error when title is missing', () => {
      const params = new URLSearchParams(
        '?share=1&start=2026-01-15T10:00&end=2026-01-15T11:00'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('title');
      }
    });

    it('should return error when title is empty', () => {
      const params = new URLSearchParams(
        '?share=1&title=&start=2026-01-15T10:00&end=2026-01-15T11:00'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('title');
      }
    });

    it('should return error when start date is missing', () => {
      const params = new URLSearchParams(
        '?share=1&title=Test&end=2026-01-15T11:00'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toContain('start');
      }
    });

    it('should return error when start date is invalid', () => {
      const params = new URLSearchParams(
        '?share=1&title=Test&start=invalid&end=2026-01-15T11:00'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toContain('start');
      }
    });

    it('should return error when end date is missing', () => {
      const params = new URLSearchParams(
        '?share=1&title=Test&start=2026-01-15T10:00'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toContain('end');
      }
    });

    it('should return error when end date is invalid', () => {
      const params = new URLSearchParams(
        '?share=1&title=Test&start=2026-01-15T10:00&end=invalid'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toContain('end');
      }
    });

    it('should return error when end is before start', () => {
      const params = new URLSearchParams(
        '?share=1&title=Test&start=2026-01-15T11:00&end=2026-01-15T10:00'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toContain('after');
      }
    });

    it('should set empty string for missing optional description', () => {
      const params = new URLSearchParams(
        '?share=1&title=Test&start=2026-01-15T10:00&end=2026-01-15T11:00'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.event.description).toBe('');
      }
    });

    it('should set empty string for missing optional URL', () => {
      const params = new URLSearchParams(
        '?share=1&title=Test&start=2026-01-15T10:00&end=2026-01-15T11:00'
      );
      const result = parseShareURL(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.event.url).toBe('');
      }
    });
  });

  describe('getViewMode', () => {
    it('should return "form" when share parameter is not present', () => {
      const params = new URLSearchParams('');
      expect(getViewMode(params)).toBe('form');
    });

    it('should return "form" when share parameter is not "1"', () => {
      const params = new URLSearchParams('?share=0');
      expect(getViewMode(params)).toBe('form');
    });

    it('should return "share" when share=1 and URL is valid', () => {
      const params = new URLSearchParams(
        '?share=1&title=Test&start=2026-01-15T10:00&end=2026-01-15T11:00'
      );
      expect(getViewMode(params)).toBe('share');
    });

    it('should return "error" when share=1 but URL is invalid', () => {
      const params = new URLSearchParams('?share=1&title=');
      expect(getViewMode(params)).toBe('error');
    });

    it('should return "error" when share=1 but required fields are missing', () => {
      const params = new URLSearchParams('?share=1');
      expect(getViewMode(params)).toBe('error');
    });
  });

  describe('URL length constraints', () => {
    it('should produce URLs under 2000 characters for typical events', () => {
      const event: CalendarEvent = {
        title: 'Team Meeting with Product, Engineering, and Design Teams',
        description: 'This is a typical meeting description that covers the agenda items including: sprint review, retrospective, planning session for next quarter, and discussion of upcoming product releases. We will also review the current roadmap.',
        url: 'https://meet.google.com/abc-defg-hij',
        startDateTime: new Date('2026-01-15T10:00:00'),
        endDateTime: new Date('2026-01-15T11:30:00'),
      };
      const url = encodeEventToURL(event, 'https://eventlink.app/');
      expect(url.length).toBeLessThan(2000);
    });

    it('should handle maximum reasonable content', () => {
      const event: CalendarEvent = {
        title: 'A'.repeat(100), // 100 char title
        description: 'B'.repeat(500), // 500 char description
        url: 'https://example.com/' + 'c'.repeat(100), // ~120 char URL
        startDateTime: new Date('2026-01-15T10:00:00'),
        endDateTime: new Date('2026-01-15T11:00:00'),
      };
      const url = encodeEventToURL(event, 'https://eventlink.app/');
      // Even with substantial content, URL should be manageable
      expect(url.length).toBeLessThan(2000);
    });
  });

  describe('formatEventDateTime', () => {
    it('should format same-day event', () => {
      const start = new Date('2026-01-15T10:00:00');
      const end = new Date('2026-01-15T11:00:00');
      const result = formatEventDateTime(start, end);
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2026');
      expect(result).toContain('10:00');
      expect(result).toContain('11:00');
    });

    it('should handle multi-day events', () => {
      const start = new Date('2026-01-15T10:00:00');
      const end = new Date('2026-01-16T11:00:00');
      const result = formatEventDateTime(start, end);
      expect(result).toContain('15');
      expect(result).toContain('16');
    });

    it('should format time in 24h format for morning', () => {
      const start = new Date('2026-01-15T09:00:00');
      const end = new Date('2026-01-15T10:00:00');
      const result = formatEventDateTime(start, end);
      expect(result).toContain('09:00');
      expect(result).toContain('10:00');
      expect(result).not.toMatch(/AM|PM/i);
    });

    it('should format time in 24h format for afternoon', () => {
      const start = new Date('2026-01-15T14:00:00');
      const end = new Date('2026-01-15T15:00:00');
      const result = formatEventDateTime(start, end);
      expect(result).toContain('14:00');
      expect(result).toContain('15:00');
      expect(result).not.toMatch(/AM|PM/i);
    });
  });
});
