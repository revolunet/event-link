# Implementation Plan: Calendar Event Form

**Branch**: `001-calendar-event-form` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-calendar-event-form/spec.md`

## Summary

Build a static single-page web application that allows users to create calendar events by filling out a form (title, description, URL, start/end date-time). The app generates shareable calendar links in real-time for Google Calendar, Outlook, and iCal (.ics download). No backend required—all logic runs client-side.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)
**Primary Dependencies**: Vanilla TypeScript (no framework) for simplicity; Vite for build/dev server
**Storage**: N/A (no persistence required—form state lives in memory)
**Testing**: Vitest for unit tests; Playwright for integration tests
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge—last 2 years)
**Project Type**: Single static web page
**Performance Goals**: Page load < 2s (SC-004); real-time link generation < 100ms
**Constraints**: Client-side only (FR-007); no server dependencies; must work offline after initial load
**Scale/Scope**: Single page, ~5 form fields, 3 calendar provider outputs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Test-First | Tests before implementation | ✅ PASS | Vitest + Playwright configured; TDD workflow planned |
| II. Type Safety | Strict TypeScript, explicit types | ✅ PASS | TypeScript strict mode; no `any` types |
| III. Simplicity | Minimal dependencies, no premature abstraction | ✅ PASS | Vanilla TS + Vite only; no framework overhead |

**Gate Status**: ✅ All principles satisfied. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-calendar-event-form/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── index.html           # Single page HTML
├── main.ts              # Entry point, event handlers
├── types.ts             # CalendarEvent type definitions
├── validators.ts        # Form validation logic
├── generators/
│   ├── google.ts        # Google Calendar URL generator
│   ├── outlook.ts       # Outlook URL generator
│   └── ical.ts          # iCal/.ics file generator
└── styles.css           # Basic responsive styling

tests/
├── unit/
│   ├── validators.test.ts
│   └── generators/
│       ├── google.test.ts
│       ├── outlook.test.ts
│       └── ical.test.ts
└── integration/
    └── form.test.ts     # Playwright end-to-end tests
```

**Structure Decision**: Single project structure selected. No backend needed (FR-007 specifies client-side only). The `generators/` folder isolates calendar-specific URL generation logic for testability per Constitution Principle I.

## Complexity Tracking

> No violations. Structure follows Simplicity principle.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | — | — |

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design completion.*

| Principle | Requirement | Status | Verification |
|-----------|-------------|--------|--------------|
| I. Test-First | Tests before implementation | ✅ PASS | Test structure defined in `tests/`; TDD workflow in quickstart.md |
| II. Type Safety | Strict TypeScript, explicit types | ✅ PASS | All interfaces defined in data-model.md with explicit types |
| III. Simplicity | Minimal dependencies | ✅ PASS | Only Vite + Vitest + Playwright; no framework overhead |

**Post-Design Gate Status**: ✅ All principles satisfied. Ready for task generation.
