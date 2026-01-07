import type { CalendarEvent } from '../types';

/**
 * Formats a Date object to iCal's required format: YYYYMMDDTHHmmss
 */
function formatDateForIcal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Escapes special characters for iCal text fields.
 * Commas, semicolons, and backslashes need escaping per RFC 5545.
 */
function escapeIcalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

/**
 * Generates a unique identifier for the iCal event.
 */
function generateUid(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}@eventlink.app`;
}

/**
 * Generates an iCal (.ics) file content as a data URL for the given event.
 * @param event - The calendar event
 * @returns Data URL string containing the iCal file content
 */
export function generateIcalFile(event: CalendarEvent): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Event Link//EN',
    'BEGIN:VEVENT',
    `UID:${generateUid()}`,
    `DTSTAMP:${formatDateForIcal(new Date())}`,
    `DTSTART:${formatDateForIcal(event.startDateTime)}`,
    `DTEND:${formatDateForIcal(event.endDateTime)}`,
    `SUMMARY:${escapeIcalText(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeIcalText(event.description)}`);
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  const icalContent = lines.join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icalContent)}`;
}
