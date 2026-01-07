# Data Model: Calendar Event Form

**Date**: 2026-01-07
**Feature**: 001-calendar-event-form

## Overview

This feature operates entirely client-side with no persistent storage. All data exists only in memory during the user's session. The data model defines TypeScript types for form state and calendar link generation.

## Core Types

### CalendarEvent

Represents the user's input for creating a calendar event.

```typescript
/**
 * Represents a calendar event with all required and optional fields.
 * This is the primary data structure passed to calendar link generators.
 */
interface CalendarEvent {
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
```

### ValidationResult

Represents the outcome of form validation.

```typescript
/**
 * Result of validating a CalendarEvent.
 */
interface ValidationResult {
  /** Whether the event data is valid */
  isValid: boolean;

  /** List of validation error messages, empty if valid */
  errors: ValidationError[];

  /** List of validation warnings (e.g., past date), empty if none */
  warnings: ValidationWarning[];
}

interface ValidationError {
  /** Which field has the error */
  field: 'title' | 'startDateTime' | 'endDateTime';

  /** Human-readable error message */
  message: string;
}

interface ValidationWarning {
  /** Which field triggered the warning */
  field: 'startDateTime';

  /** Human-readable warning message */
  message: string;
}
```

### CalendarLinks

Represents the generated calendar links for all providers.

```typescript
/**
 * Generated calendar links for all supported providers.
 * Each property is a URL string or null if generation failed.
 */
interface CalendarLinks {
  /** Google Calendar event creation URL */
  google: string;

  /** Outlook.com calendar event creation URL */
  outlook: string;

  /** iCal (.ics) file content as a data URL for download */
  ical: string;
}
```

## Validation Rules

Derived from functional requirements:

| Field | Rule | FR Reference |
|-------|------|--------------|
| `title` | Required, non-empty string | FR-002 |
| `startDateTime` | Required, valid Date object | FR-002, FR-009 |
| `endDateTime` | Required, valid Date object | FR-002, FR-009 |
| `endDateTime` | Must be after `startDateTime` | FR-005 |
| `startDateTime` | Warn if in the past (don't block) | FR-011 |
| `description` | Optional, any string | FR-003 |
| `url` | Optional, any string (not validated as URL) | FR-003 |

## State Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                      FORM STATE                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    user types    ┌──────────────┐             │
│  │  Empty   │ ───────────────> │  Partial     │             │
│  └──────────┘                  └──────────────┘             │
│       │                              │                       │
│       │                              │ required fields set   │
│       │                              ▼                       │
│       │                        ┌──────────────┐             │
│       │                        │  Validating  │             │
│       │                        └──────────────┘             │
│       │                         │           │               │
│       │                   valid │           │ invalid       │
│       │                         ▼           ▼               │
│       │              ┌──────────────┐ ┌──────────────┐      │
│       │              │ Links Shown  │ │ Errors Shown │      │
│       │              └──────────────┘ └──────────────┘      │
│       │                    │                 │              │
│       │                    │  user edits     │ user fixes   │
│       │                    └────────┬────────┘              │
│       │                             │                       │
│       │                             ▼                       │
│       │                    ┌──────────────┐                 │
│       └───────────────────>│  Validating  │ (re-validate)  │
│                            └──────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Key Behaviors**:
- Validation runs in real-time as user types (FR-012)
- Links update automatically when validation passes
- Errors display inline next to invalid fields (FR-006)
- Warnings (past date) display but don't block link generation (FR-011)
- Form state preserved during error correction (FR-008)

## No Persistence

Per FR-007 (client-side only) and the spec assumptions:
- No localStorage or sessionStorage used
- No cookies stored
- Form resets on page refresh
- No server-side data transmission
