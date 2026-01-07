/**
 * Represents a calendar event with all required and optional fields.
 * This is the primary data structure passed to calendar link generators.
 */
export interface CalendarEvent {
  /** Event title (required, non-empty) */
  title: string;

  /** Event description (optional) */
  description: string;

  /** Event URL, e.g., video conference link (optional) */
  url: string;

  /** Event start date and time (required) */
  startDateTime: Date;

  /** Event end date and time (required, must be after startDateTime) */
  endDateTime: Date;
}

/**
 * Represents a validation error for a specific field.
 */
export interface ValidationError {
  /** Which field has the error */
  field: 'title' | 'startDateTime' | 'endDateTime';

  /** Human-readable error message */
  message: string;
}

/**
 * Represents a validation warning for a specific field.
 */
export interface ValidationWarning {
  /** Which field triggered the warning */
  field: 'startDateTime';

  /** Human-readable warning message */
  message: string;
}

/**
 * Result of validating a CalendarEvent.
 */
export interface ValidationResult {
  /** Whether the event data is valid */
  isValid: boolean;

  /** List of validation error messages, empty if valid */
  errors: ValidationError[];

  /** List of validation warnings (e.g., past date), empty if none */
  warnings: ValidationWarning[];
}

/**
 * Generated calendar links for all supported providers.
 */
export interface CalendarLinks {
  /** Google Calendar event creation URL */
  google: string;

  /** Outlook.com calendar event creation URL */
  outlook: string;

  /** iCal (.ics) file content as a data URL for download */
  ical: string;
}

/**
 * URL query parameters for a shared event link.
 */
export interface ShareURLParams {
  /** Must be '1' to indicate share mode */
  share: '1';

  /** Event title (required) */
  title: string;

  /** Start datetime in ISO 8601 format: YYYY-MM-DDTHH:mm */
  start: string;

  /** End datetime in ISO 8601 format: YYYY-MM-DDTHH:mm */
  end: string;

  /** Event description (optional) */
  desc?: string;

  /** Event URL (optional) */
  url?: string;
}

/**
 * Result of parsing a share URL.
 */
export type ParsedShareResult =
  | { success: true; event: CalendarEvent }
  | { success: false; error: string };

/**
 * View mode for the application.
 */
export type ViewMode = 'form' | 'share' | 'error';
