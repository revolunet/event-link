import type { CalendarEvent, ValidationResult, ValidationError, ValidationWarning } from './types';

/**
 * Validates a CalendarEvent and returns validation result with errors and warnings.
 * @param event - The calendar event to validate
 * @returns ValidationResult with isValid flag, errors array, and warnings array
 */
export function validateEvent(event: CalendarEvent): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate title (required, non-empty)
  if (!event.title || event.title.trim() === '') {
    errors.push({
      field: 'title',
      message: 'Title is required',
    });
  }

  // Validate end date is after start date
  if (event.endDateTime <= event.startDateTime) {
    errors.push({
      field: 'endDateTime',
      message: 'End time must be after start time',
    });
  }

  // Check for past date warning (FR-011)
  if (event.startDateTime < new Date()) {
    warnings.push({
      field: 'startDateTime',
      message: 'Event start time is in the past',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
