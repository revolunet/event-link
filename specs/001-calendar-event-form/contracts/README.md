# Contracts: Calendar Event Form

**Date**: 2026-01-07
**Feature**: 001-calendar-event-form

## No API Contracts Required

This feature operates entirely client-side per FR-007:

> "System MUST work entirely client-side without requiring a server or backend."

Therefore:
- No REST API endpoints
- No GraphQL schema
- No backend services

## External Service Integration

The application generates URLs for external calendar services but does not call any APIs:

| Service | Integration Type | Contract |
|---------|------------------|----------|
| Google Calendar | URL redirect | `https://calendar.google.com/calendar/r/eventedit?...` |
| Outlook.com | URL redirect | `https://outlook.live.com/calendar/0/action/compose?...` |
| iCal | File download | RFC 5545 VEVENT format |

See [research.md](../research.md) for detailed URL parameter specifications.

## Internal Contracts

The TypeScript interfaces in [data-model.md](../data-model.md) serve as the internal contracts between modules:

- `CalendarEvent` → input to all generator functions
- `ValidationResult` → output from validator
- `CalendarLinks` → output from generator orchestrator
