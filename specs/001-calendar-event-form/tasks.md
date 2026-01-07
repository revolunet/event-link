# Tasks: Calendar Event Form

**Input**: Design documents from `/specs/001-calendar-event-form/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: REQUIRED per Constitution Principle I (Test-First). All tests must be written and fail before implementation.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3 (maps to user stories from spec.md)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization with TypeScript, Vite, and testing tools

- [x] T001 Create project directory structure per plan.md layout
- [x] T002 Initialize npm project with package.json (name: event-link, type: module)
- [x] T003 [P] Install and configure TypeScript 5.x with strict mode in tsconfig.json
- [x] T004 [P] Install and configure Vite as dev server and build tool in vite.config.ts
- [x] T005 [P] Install and configure Vitest for unit testing in vitest.config.ts
- [x] T006 [P] Install and configure Playwright for E2E testing in playwright.config.ts
- [x] T007 [P] Configure ESLint with TypeScript rules in eslint.config.js
- [x] T008 Add npm scripts to package.json: dev, build, test, test:e2e, lint, typecheck

**Checkpoint**: `npm run dev` starts server, `npm run test` runs (no tests yet)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, HTML structure, and base styles that all user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create TypeScript interfaces (CalendarEvent, ValidationResult, CalendarLinks) in src/types.ts
- [x] T010 Create base HTML structure with form container and output area in src/index.html
- [x] T011 [P] Create base responsive styles (form layout, mobile-first) in src/styles.css
- [x] T012 [P] Create empty entry point that imports types in src/main.ts

**Checkpoint**: Foundation ready - `npm run typecheck` passes, page renders empty form shell

---

## Phase 3: User Story 1 - Create Basic Calendar Event (Priority: P1)

**Goal**: User fills title + start/end datetime, sees clickable calendar buttons with copy icons

**Independent Test**: Fill form with valid data → 3 calendar buttons appear → clicking opens calendar app

### Tests for User Story 1 (TDD - MUST FAIL FIRST)

- [x] T013 [P] [US1] Unit test for validateEvent() in tests/unit/validators.test.ts
- [x] T014 [P] [US1] Unit test for generateGoogleUrl() in tests/unit/generators/google.test.ts
- [x] T015 [P] [US1] Unit test for generateOutlookUrl() in tests/unit/generators/outlook.test.ts
- [x] T016 [P] [US1] Unit test for generateIcalFile() in tests/unit/generators/ical.test.ts
- [x] T017 [US1] E2E test for basic event creation flow in tests/integration/form.test.ts

### Implementation for User Story 1

- [x] T018 [US1] Implement validateEvent() with required field and date validation in src/validators.ts
- [x] T019 [US1] Implement past date warning logic in src/validators.ts (FR-011)
- [x] T020 [P] [US1] Implement generateGoogleUrl() per research.md format in src/generators/google.ts
- [x] T021 [P] [US1] Implement generateOutlookUrl() per research.md format in src/generators/outlook.ts
- [x] T022 [P] [US1] Implement generateIcalFile() per research.md format in src/generators/ical.ts
- [x] T023 [US1] Add title input field with label and validation error display to src/index.html
- [x] T024 [US1] Add start datetime input field with label and validation error display to src/index.html
- [x] T025 [US1] Add end datetime input field with label and validation error display to src/index.html
- [x] T026 [US1] Add calendar button section (Google, Outlook, iCal) with copy icons to src/index.html
- [x] T027 [US1] Implement real-time form handling and link generation in src/main.ts (FR-012)
- [x] T028 [US1] Implement validation error display and past date warning in src/main.ts
- [x] T029 [US1] Wire up calendar buttons to open URLs / download .ics in src/main.ts

**Checkpoint**: User Story 1 fully functional - form validates, links generate in real-time, buttons work

---

## Phase 4: User Story 2 - Add Event Details (Priority: P2)

**Goal**: User can add optional description and URL fields that appear in generated calendar events

**Independent Test**: Add description/URL → verify they appear in generated calendar event

### Tests for User Story 2 (TDD - MUST FAIL FIRST)

- [x] T030 [P] [US2] Update Google generator test to verify description/URL inclusion in tests/unit/generators/google.test.ts
- [x] T031 [P] [US2] Update Outlook generator test to verify description/URL inclusion in tests/unit/generators/outlook.test.ts
- [x] T032 [P] [US2] Update iCal generator test to verify description/URL inclusion in tests/unit/generators/ical.test.ts

### Implementation for User Story 2

- [x] T033 [US2] Add description textarea field with label to src/index.html
- [x] T034 [US2] Add URL input field with label to src/index.html
- [x] T035 [US2] Update generateGoogleUrl() to include description and URL in src/generators/google.ts
- [x] T036 [US2] Update generateOutlookUrl() to include description and URL in src/generators/outlook.ts
- [x] T037 [US2] Update generateIcalFile() to include description and URL in src/generators/ical.ts
- [x] T038 [US2] Update main.ts to read optional fields and pass to generators

**Checkpoint**: User Story 2 complete - optional fields included in generated calendar events

---

## Phase 5: User Story 3 - Share Event Links (Priority: P3)

**Goal**: User can copy calendar links to share with others via any channel

**Independent Test**: Click copy icon → link copied to clipboard → paste in new browser → calendar opens

### Tests for User Story 3 (TDD - MUST FAIL FIRST)

- [x] T039 [US3] E2E test for copy link functionality in tests/integration/form.test.ts

### Implementation for User Story 3

- [x] T040 [US3] Implement clipboard copy functionality for each calendar link in src/main.ts
- [x] T041 [US3] Add visual feedback (tooltip/animation) when link copied successfully in src/main.ts
- [x] T042 [US3] Style copy icons and feedback states in src/styles.css

**Checkpoint**: All user stories complete - full share workflow functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks and documentation

- [x] T043 [P] Add mobile-specific style adjustments for touch inputs in src/styles.css
- [x] T044 [P] Add accessibility attributes (aria-labels, form labels) to src/index.html
- [x] T045 Run full test suite (unit + E2E) and verify all pass
- [x] T046 Build production bundle with `npm run build` and verify output
- [x] T047 Validate against quickstart.md setup instructions
- [x] T048 Create README.md with usage instructions and deployment guide

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 - MVP delivery
- **Phase 4 (US2)**: Depends on Phase 2 - can run parallel to US1 if needed
- **Phase 5 (US3)**: Depends on Phase 3 (needs buttons to exist)
- **Phase 6 (Polish)**: Depends on all desired user stories

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories - standalone MVP
- **US2 (P2)**: No dependencies on US1 - adds independent optional fields
- **US3 (P3)**: Depends on US1 (needs calendar buttons to add copy functionality)

### Within Each User Story (TDD Flow)

1. Write ALL tests for the story FIRST (T013-T017 for US1)
2. Run tests → verify they FAIL
3. Implement code to make tests pass
4. Refactor while keeping tests green
5. Story complete when all tests pass

### Parallel Opportunities

```text
Phase 1 parallel:
  T003, T004, T005, T006, T007 (all config files)

Phase 2 parallel:
  T011, T012 (styles and main.ts)

US1 tests parallel:
  T013, T014, T015, T016 (all unit tests)

US1 implementation parallel:
  T020, T021, T022 (all generators)

US2 tests parallel:
  T030, T031, T032 (all generator test updates)

Phase 6 parallel:
  T043, T044 (styles and accessibility)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Form works, links generate, buttons open calendars
5. Deploy/demo - this is a working MVP!

### Incremental Delivery

1. Setup + Foundational → Project builds and runs
2. User Story 1 → MVP: Basic event creation works
3. User Story 2 → Enhanced: Optional details supported
4. User Story 3 → Complete: Full share workflow
5. Polish → Production-ready

### TDD Reminder (Constitution Principle I)

For EVERY implementation task:
1. Locate the corresponding test task
2. Write the test FIRST
3. Run test → MUST FAIL (red)
4. Write minimal code to pass (green)
5. Refactor if needed
6. Commit

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story
- Constitution requires TDD - never skip the test-first step
- `npm run test` should be run frequently during development
- Commit after each task or logical group completes
- Stop at any checkpoint to validate independently
