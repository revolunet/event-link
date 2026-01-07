import type { CalendarEvent, ParsedShareResult, ViewMode } from './types';

/**
 * Formats a Date to ISO 8601 local datetime string (YYYY-MM-DDTHH:mm).
 */
function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Parses an ISO 8601 local datetime string to a Date.
 * Returns null if invalid.
 */
function parseDateTimeLocal(str: string): Date | null {
  if (!str) return null;
  const date = new Date(str);
  if (isNaN(date.getTime())) return null;
  return date;
}

/**
 * Encodes a CalendarEvent into a shareable URL.
 *
 * @param event - The calendar event to encode
 * @param baseURL - The base URL of the application
 * @returns Full shareable URL with encoded event data
 */
export function encodeEventToURL(event: CalendarEvent, baseURL: string): string {
  const params = new URLSearchParams();

  params.set('share', '1');
  params.set('title', event.title);
  params.set('start', formatDateTimeLocal(event.startDateTime));
  params.set('end', formatDateTimeLocal(event.endDateTime));

  if (event.description) {
    params.set('desc', event.description);
  }

  if (event.url) {
    params.set('url', event.url);
  }

  const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  return `${base}#${params.toString()}`;
}

/**
 * Parses URL query parameters into a CalendarEvent or error.
 *
 * @param searchParams - URL search parameters from window.location.search
 * @returns ParsedShareResult with either the decoded event or an error message
 */
export function parseShareURL(searchParams: URLSearchParams): ParsedShareResult {
  const title = searchParams.get('title');
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const desc = searchParams.get('desc');
  const url = searchParams.get('url');

  // Validate required fields
  if (!title || title.trim() === '') {
    return { success: false, error: 'Event title is missing' };
  }

  if (!start) {
    return { success: false, error: 'Start date is missing' };
  }

  const startDateTime = parseDateTimeLocal(start);
  if (!startDateTime) {
    return { success: false, error: 'Start date is invalid' };
  }

  if (!end) {
    return { success: false, error: 'End date is missing' };
  }

  const endDateTime = parseDateTimeLocal(end);
  if (!endDateTime) {
    return { success: false, error: 'End date is invalid' };
  }

  if (endDateTime <= startDateTime) {
    return { success: false, error: 'End time must be after start' };
  }

  return {
    success: true,
    event: {
      title: title.trim(),
      description: desc || '',
      url: url || '',
      startDateTime,
      endDateTime,
    },
  };
}

/**
 * Determines the current view mode based on URL parameters.
 *
 * @param searchParams - URL search parameters from window.location.search
 * @returns ViewMode ('form', 'share', or 'error')
 */
export function getViewMode(searchParams: URLSearchParams): ViewMode {
  const share = searchParams.get('share');

  if (share !== '1') {
    return 'form';
  }

  const result = parseShareURL(searchParams);

  if (result.success) {
    return 'share';
  }

  return 'error';
}

/**
 * Formats a date range for display in the shared view.
 *
 * @param start - Start date
 * @param end - End date
 * @returns Formatted string like "Jan 15, 2026 10:00 - 11:00"
 */
export function formatEventDateTime(start: Date, end: Date): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const startDate = start.toLocaleDateString('en-US', dateOptions);
  const startTime = start.toLocaleTimeString('en-US', timeOptions);
  const endDate = end.toLocaleDateString('en-US', dateOptions);
  const endTime = end.toLocaleTimeString('en-US', timeOptions);

  // Same day
  if (startDate === endDate) {
    return `${startDate} ${startTime} - ${endTime}`;
  }

  // Different days
  return `${startDate} ${startTime} - ${endDate} ${endTime}`;
}
