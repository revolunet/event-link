import { describe, it, expect } from 'vitest';
import { generateGoogleUrl } from '../../../src/generators/google';
import type { CalendarEvent } from '../../../src/types';

describe('generateGoogleUrl', () => {
  const baseEvent: CalendarEvent = {
    title: 'Team Meeting',
    description: '',
    url: '',
    startDateTime: new Date('2026-01-15T10:00:00'),
    endDateTime: new Date('2026-01-15T11:00:00'),
  };

  it('generates a valid Google Calendar URL', () => {
    const url = generateGoogleUrl(baseEvent);
    expect(url).toContain('calendar.google.com/calendar/r/eventedit');
  });

  it('includes the event title', () => {
    const url = generateGoogleUrl(baseEvent);
    // URLSearchParams encodes spaces as + or %20
    expect(url).toMatch(/text=Team[+%20]Meeting/);
  });

  it('includes start and end dates in correct format', () => {
    const url = generateGoogleUrl(baseEvent);
    // Format: YYYYMMDDTHHmmss/YYYYMMDDTHHmmss (/ is encoded as %2F)
    expect(url).toContain('dates=');
    expect(url).toMatch(/dates=\d{8}T\d{6}%2F\d{8}T\d{6}/);
  });

  it('URL-encodes special characters in title', () => {
    const event = { ...baseEvent, title: 'Meeting & Discussion' };
    const url = generateGoogleUrl(event);
    // Spaces can be + or %20, & is encoded as %26
    expect(url).toMatch(/text=Meeting[+%20]%26[+%20]Discussion/);
  });

  it('handles titles with quotes', () => {
    const event = { ...baseEvent, title: "John's Meeting" };
    const url = generateGoogleUrl(event);
    expect(url).toContain('text=John');
    expect(url).not.toContain("'"); // Should be encoded
  });

  it('includes description when provided', () => {
    const event = { ...baseEvent, description: 'Discuss project updates' };
    const url = generateGoogleUrl(event);
    expect(url).toContain('details=');
    expect(url).toMatch(/details=Discuss[+%20]project[+%20]updates/);
  });

  it('includes URL as location when provided', () => {
    const event = { ...baseEvent, url: 'https://example.com/meeting' };
    const url = generateGoogleUrl(event);
    expect(url).toContain('location=');
    expect(url).toContain('example.com');
  });
});
