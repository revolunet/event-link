import { describe, it, expect } from 'vitest';
import { generateOutlookUrl } from '../../../src/generators/outlook';
import type { CalendarEvent } from '../../../src/types';

describe('generateOutlookUrl', () => {
  const baseEvent: CalendarEvent = {
    title: 'Team Meeting',
    description: '',
    url: '',
    startDateTime: new Date('2026-01-15T10:00:00'),
    endDateTime: new Date('2026-01-15T11:00:00'),
  };

  it('generates a valid Outlook Calendar URL', () => {
    const url = generateOutlookUrl(baseEvent);
    expect(url).toContain('outlook.live.com/calendar');
  });

  it('includes the event subject', () => {
    const url = generateOutlookUrl(baseEvent);
    // URLSearchParams encodes spaces as + or %20
    expect(url).toMatch(/subject=Team[+%20]Meeting/);
  });

  it('includes start and end dates in ISO format', () => {
    const url = generateOutlookUrl(baseEvent);
    // Format: YYYY-MM-DDTHH:mm:ss (colons encoded as %3A)
    expect(url).toContain('startdt=');
    expect(url).toContain('enddt=');
    expect(url).toMatch(/startdt=\d{4}-\d{2}-\d{2}T\d{2}%3A\d{2}%3A\d{2}/);
    expect(url).toMatch(/enddt=\d{4}-\d{2}-\d{2}T\d{2}%3A\d{2}%3A\d{2}/);
  });

  it('URL-encodes special characters in subject', () => {
    const event = { ...baseEvent, title: 'Meeting & Discussion' };
    const url = generateOutlookUrl(event);
    // Spaces can be + or %20, & is encoded as %26
    expect(url).toMatch(/subject=Meeting[+%20]%26[+%20]Discussion/);
  });

  it('handles titles with quotes', () => {
    const event = { ...baseEvent, title: "John's Meeting" };
    const url = generateOutlookUrl(event);
    expect(url).toContain('subject=John');
    expect(url).not.toContain("'"); // Should be encoded
  });

  it('includes description as body when provided', () => {
    const event = { ...baseEvent, description: 'Discuss project updates' };
    const url = generateOutlookUrl(event);
    expect(url).toContain('body=');
    expect(url).toMatch(/body=Discuss[+%20]project[+%20]updates/);
  });

  it('includes URL as location when provided', () => {
    const event = { ...baseEvent, url: 'https://example.com/meeting' };
    const url = generateOutlookUrl(event);
    expect(url).toContain('location=');
    expect(url).toContain('example.com');
  });
});
