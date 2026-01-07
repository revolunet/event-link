import { describe, it, expect } from 'vitest';
import { generateIcalFile } from '../../../src/generators/ical';
import type { CalendarEvent } from '../../../src/types';

/**
 * Helper to extract and decode iCal content from data URL
 */
function decodeIcalDataUrl(dataUrl: string): string {
  const prefix = 'data:text/calendar;charset=utf-8,';
  return decodeURIComponent(dataUrl.slice(prefix.length));
}

describe('generateIcalFile', () => {
  const baseEvent: CalendarEvent = {
    title: 'Team Meeting',
    description: '',
    url: '',
    startDateTime: new Date('2026-01-15T10:00:00'),
    endDateTime: new Date('2026-01-15T11:00:00'),
  };

  it('generates valid iCal format with VCALENDAR wrapper', () => {
    const dataUrl = generateIcalFile(baseEvent);
    const ical = decodeIcalDataUrl(dataUrl);
    expect(ical).toContain('BEGIN:VCALENDAR');
    expect(ical).toContain('END:VCALENDAR');
  });

  it('includes VERSION and PRODID', () => {
    const dataUrl = generateIcalFile(baseEvent);
    const ical = decodeIcalDataUrl(dataUrl);
    expect(ical).toContain('VERSION:2.0');
    expect(ical).toContain('PRODID:');
  });

  it('generates VEVENT component', () => {
    const dataUrl = generateIcalFile(baseEvent);
    const ical = decodeIcalDataUrl(dataUrl);
    expect(ical).toContain('BEGIN:VEVENT');
    expect(ical).toContain('END:VEVENT');
  });

  it('includes required VEVENT fields', () => {
    const dataUrl = generateIcalFile(baseEvent);
    const ical = decodeIcalDataUrl(dataUrl);
    expect(ical).toContain('UID:');
    expect(ical).toContain('DTSTAMP:');
    expect(ical).toContain('DTSTART:');
    expect(ical).toContain('DTEND:');
    expect(ical).toContain('SUMMARY:Team Meeting');
  });

  it('formats dates correctly', () => {
    const dataUrl = generateIcalFile(baseEvent);
    const ical = decodeIcalDataUrl(dataUrl);
    // Format: YYYYMMDDTHHmmss
    expect(ical).toMatch(/DTSTART:\d{8}T\d{6}/);
    expect(ical).toMatch(/DTEND:\d{8}T\d{6}/);
  });

  it('generates unique UID for each call', () => {
    const dataUrl1 = generateIcalFile(baseEvent);
    const dataUrl2 = generateIcalFile(baseEvent);
    const ical1 = decodeIcalDataUrl(dataUrl1);
    const ical2 = decodeIcalDataUrl(dataUrl2);
    const uid1 = ical1.match(/UID:(.+)/)?.[1];
    const uid2 = ical2.match(/UID:(.+)/)?.[1];
    expect(uid1).toBeDefined();
    expect(uid2).toBeDefined();
    expect(uid1).not.toBe(uid2);
  });

  it('escapes special characters in title', () => {
    const event = { ...baseEvent, title: 'Meeting, Discussion; Notes' };
    const dataUrl = generateIcalFile(event);
    const ical = decodeIcalDataUrl(dataUrl);
    // Commas and semicolons should be escaped
    expect(ical).toContain('SUMMARY:Meeting\\, Discussion\\; Notes');
  });

  it('returns a data URL for download', () => {
    const dataUrl = generateIcalFile(baseEvent);
    expect(dataUrl).toMatch(/^data:text\/calendar;charset=utf-8,/);
  });

  it('includes description when provided', () => {
    const event = { ...baseEvent, description: 'Discuss project updates' };
    const dataUrl = generateIcalFile(event);
    const ical = decodeIcalDataUrl(dataUrl);
    expect(ical).toContain('DESCRIPTION:Discuss project updates');
  });

  it('includes URL when provided', () => {
    const event = { ...baseEvent, url: 'https://example.com/meeting' };
    const dataUrl = generateIcalFile(event);
    const ical = decodeIcalDataUrl(dataUrl);
    expect(ical).toContain('URL:https://example.com/meeting');
  });
});
