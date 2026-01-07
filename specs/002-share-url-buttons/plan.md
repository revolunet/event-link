# Implementation Plan: Share URL Buttons

**Branch**: `002-share-url-buttons` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-share-url-buttons/spec.md`

## Summary

Extend the Event Link application to support shareable URLs that display a "buttons-only" view. When a user creates an event, they can generate a URL that encodes all event data. Recipients opening this URL see only the event information and three calendar buttons (Google, Outlook, iCal) without the creation form. This builds on the existing client-side architecture with no backend requirements.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled) - established in feature 001
**Primary Dependencies**: Vanilla TypeScript + Vite (existing stack)
**Storage**: N/A (event data encoded in URL; no persistence)
**Testing**: Vitest for unit tests; Playwright for E2E tests (existing)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Single static web page (extending existing)
**Performance Goals**: Page load < 2s (SC-004); URL generation < 100ms
**Constraints**: Client-side only; URL must be human-readable (FR-010); max URL length ~2000 chars for browser compatibility
**Scale/Scope**: Single page extension; adds share button + buttons-only view mode

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Test-First | Tests before implementation | ✅ PASS | Existing test infrastructure; new tests for URL encoding/decoding and view modes |
| II. Type Safety | Strict TypeScript, explicit types | ✅ PASS | Extend existing types; explicit URLSearchParams handling |
| III. Simplicity | Minimal dependencies, no premature abstraction | ✅ PASS | Uses browser-native URLSearchParams; no new dependencies |

**Gate Status**: ✅ All principles satisfied. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-share-url-buttons/
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
├── index.html           # Update: add share button row, buttons-only view elements
├── main.ts              # Update: URL parsing, view mode switching, share logic
├── types.ts             # Update: add SharedEventData type if needed
├── validators.ts        # Existing (reuse for shared URL validation)
├── url-encoder.ts       # NEW: encode/decode event data to/from URL
├── generators/
│   ├── google.ts        # Existing (reuse)
│   ├── outlook.ts       # Existing (reuse)
│   └── ical.ts          # Existing (reuse)
└── styles.css           # Update: share button, buttons-only view styles

tests/
├── unit/
│   ├── validators.test.ts    # Existing
│   ├── url-encoder.test.ts   # NEW: encode/decode tests
│   └── generators/           # Existing
│       ├── google.test.ts
│       ├── outlook.test.ts
│       └── ical.test.ts
└── integration/
    ├── form.test.ts          # Existing
    └── share.test.ts         # NEW: share flow E2E tests
```

**Structure Decision**: Extends existing single project structure. New `url-encoder.ts` module encapsulates URL encoding/decoding logic, keeping main.ts focused on view orchestration. This follows Constitution Principle III (Simplicity) by isolating a single responsibility.

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
| II. Type Safety | Strict TypeScript, explicit types | ✅ PASS | All new types defined in data-model.md (ShareURLParams, ParsedShareResult, ViewMode) |
| III. Simplicity | Minimal dependencies | ✅ PASS | Uses only browser-native URLSearchParams; no new dependencies added |

**Post-Design Gate Status**: ✅ All principles satisfied. Ready for task generation.
