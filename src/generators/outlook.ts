import type { CalendarEvent } from '../types';

/**
 * Formats a Date object to Outlook's required format: YYYY-MM-DDTHH:mm:ss
 */
function formatDateForOutlook(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * Generates an Outlook Calendar URL for the given event.
 * @param event - The calendar event
 * @returns Outlook Calendar URL string
 */
export function generateOutlookUrl(event: CalendarEvent): string {
  const baseUrl = 'https://outlook.live.com/calendar/0/action/compose';

  const params = new URLSearchParams();
  params.set('subject', event.title);
  params.set('startdt', formatDateForOutlook(event.startDateTime));
  params.set('enddt', formatDateForOutlook(event.endDateTime));

  if (event.description) {
    params.set('body', event.description);
  }

  if (event.url) {
    params.set('location', event.url);
  }

  return `${baseUrl}?${params.toString()}`;
}
