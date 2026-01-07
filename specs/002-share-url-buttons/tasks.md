# Tasks: Share URL Buttons

**Input**: Design documents from `/specs/002-share-url-buttons/`
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

## Phase 1: Setup (Types & Module Structure)

**Purpose**: Add new types and create URL encoder module structure

- [x] T001 Add ShareURLParams, ParsedShareResult, and ViewMode types to src/types.ts
- [x] T002 Create empty src/url-encoder.ts module with function stubs

**Checkpoint**: Types compile, stubs ready for TDD

---

## Phase 2: Foundational (URL Encoding Core)

**Purpose**: Core URL encoding/decoding logic that all user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Unit test for encodeEventToURL() in tests/unit/url-encoder.test.ts
- [x] T004 [P] Unit test for parseShareURL() in tests/unit/url-encoder.test.ts
- [x] T005 [P] Unit test for getViewMode() in tests/unit/url-encoder.test.ts
- [x] T006 Implement encodeEventToURL() in src/url-encoder.ts
- [x] T007 Implement parseShareURL() with validation in src/url-encoder.ts
- [x] T008 Implement getViewMode() in src/url-encoder.ts
- [x] T009 Implement formatEventDateTime() for date display in src/url-encoder.ts

**Checkpoint**: `npm run test` passes for URL encoder - encoding/decoding works correctly

---

## Phase 3: User Story 1 - Generate Shareable Link (Priority: P1)

**Goal**: User can generate a shareable URL from a valid event and see the URL displayed

**Independent Test**: Fill form with valid data → click Share button → URL is generated and displayed

### Tests for User Story 1 (TDD - MUST FAIL FIRST)

- [x] T010 [P] [US1] E2E test for share button visibility in tests/integration/share.test.ts
- [x] T011 [P] [US1] E2E test for URL generation on share click in tests/integration/share.test.ts

### Implementation for User Story 1

- [x] T012 [US1] Add share section HTML structure (share button, URL display) to src/index.html per data-model.md
- [x] T013 [US1] Add share section CSS styles (button row below calendar buttons) to src/styles.css
- [x] T014 [US1] Implement share button visibility logic in src/main.ts (visible when calendar buttons shown)
- [x] T015 [US1] Implement share URL generation on button click in src/main.ts
- [x] T016 [US1] Display generated URL in readonly input field in src/main.ts

**Checkpoint**: User Story 1 fully functional - share button appears, generates URL, displays it

---

## Phase 4: User Story 2 - View Shared Event Page (Priority: P2)

**Goal**: Opening a shared URL shows buttons-only view with event info (no form)

**Independent Test**: Open URL with share=1 and event params → see event summary and calendar buttons, no form

### Tests for User Story 2 (TDD - MUST FAIL FIRST)

- [x] T017 [P] [US2] E2E test for buttons-only view on valid share URL in tests/integration/share.test.ts
- [x] T018 [P] [US2] E2E test for form hidden in share mode in tests/integration/share.test.ts
- [x] T019 [P] [US2] E2E test for error view on invalid share URL in tests/integration/share.test.ts

### Implementation for User Story 2

- [x] T020 [US2] Add event summary HTML section (title, datetime, description) to src/index.html
- [x] T021 [US2] Add share error HTML section with create-new-event link to src/index.html
- [x] T022 [US2] Add CSS for event summary and error sections to src/styles.css
- [x] T023 [US2] Add CSS for view-share body class (hides form, shows summary) to src/styles.css
- [x] T024 [US2] Implement view mode detection on page load in src/main.ts
- [x] T025 [US2] Implement share mode rendering (parse URL, display event, generate links) in src/main.ts
- [x] T026 [US2] Implement error mode rendering with specific error messages in src/main.ts

**Checkpoint**: User Story 2 fully functional - shared URLs show buttons-only view, errors handled

---

## Phase 5: User Story 3 - Copy Share Link (Priority: P3)

**Goal**: User can copy the share URL to clipboard with visual feedback

**Independent Test**: Click copy button next to share URL → URL copied, visual confirmation shown

### Tests for User Story 3 (TDD - MUST FAIL FIRST)

- [x] T027 [P] [US3] E2E test for copy button functionality in tests/integration/share.test.ts
- [x] T028 [P] [US3] E2E test for copy success visual feedback in tests/integration/share.test.ts

### Implementation for User Story 3

- [x] T029 [US3] Add copy button with icon to share URL display section in src/index.html
- [x] T030 [US3] Add CSS for copy button and copied state in src/styles.css
- [x] T031 [US3] Implement copy to clipboard for share URL in src/main.ts (reuse existing clipboard logic)
- [x] T032 [US3] Implement visual feedback on successful copy in src/main.ts

**Checkpoint**: All user stories complete - full share workflow functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks and edge case handling

- [x] T033 [P] Add "Create your own event" link in shared view footer in src/index.html
- [x] T034 [P] Add accessibility attributes (aria-labels) to share elements in src/index.html
- [x] T035 Run full test suite (unit + E2E) and verify all pass
- [x] T036 Build production bundle with `npm run build` and verify output
- [x] T037 Test shared URL in different browsers (Chrome, Firefox, Safari)
- [x] T038 Validate URL length stays under 2000 characters for typical events

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 - Core share generation
- **Phase 4 (US2)**: Depends on Phase 2 - Can run parallel to US1
- **Phase 5 (US3)**: Depends on Phase 3 (needs share URL display to exist)
- **Phase 6 (Polish)**: Depends on all user stories

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories - standalone share generation
- **US2 (P2)**: No dependencies on US1 - standalone buttons-only view (both use same URL encoder from Phase 2)
- **US3 (P3)**: Depends on US1 (needs share URL display element to add copy button)

### Within Each User Story (TDD Flow)

1. Write ALL tests for the story FIRST (e.g., T010-T011 for US1)
2. Run tests → verify they FAIL
3. Implement code to make tests pass
4. Refactor while keeping tests green
5. Story complete when all tests pass

### Parallel Opportunities

```text
Phase 2 parallel tests:
  T003, T004, T005 (all unit tests for url-encoder)

US1 tests parallel:
  T010, T011 (share button E2E tests)

US2 tests parallel:
  T017, T018, T019 (buttons-only view E2E tests)

US3 tests parallel:
  T027, T028 (copy functionality E2E tests)

Phase 6 parallel:
  T033, T034 (HTML updates)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup types and stubs
2. Complete Phase 2: URL encoder with tests
3. Complete Phase 3: User Story 1 (share button + URL generation)
4. **STOP and VALIDATE**: User can generate shareable URLs
5. Deploy/demo - this is a working MVP!

### Incremental Delivery

1. Setup + Foundational → URL encoding works
2. User Story 1 → MVP: Share button generates URLs
3. User Story 2 → Recipients can view shared links
4. User Story 3 → Copy to clipboard enhancement
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
