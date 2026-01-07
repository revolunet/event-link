import type { CalendarEvent } from '../types';

/**
 * Formats a Date object to Google Calendar's required format: YYYYMMDDTHHmmss
 */
function formatDateForGoogle(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Generates a Google Calendar URL for the given event.
 * @param event - The calendar event
 * @returns Google Calendar URL string
 */
export function generateGoogleUrl(event: CalendarEvent): string {
  const baseUrl = 'https://calendar.google.com/calendar/r/eventedit';

  const params = new URLSearchParams();
  params.set('text', event.title);

  const startFormatted = formatDateForGoogle(event.startDateTime);
  const endFormatted = formatDateForGoogle(event.endDateTime);
  params.set('dates', `${startFormatted}/${endFormatted}`);

  if (event.description) {
    params.set('details', event.description);
  }

  if (event.url) {
    params.set('location', event.url);
  }

  return `${baseUrl}?${params.toString()}`;
}
