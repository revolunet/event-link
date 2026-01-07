<!--
  ============================================================================
  SYNC IMPACT REPORT
  ============================================================================
  Version change: N/A (initial) → 1.0.0

  Modified principles: N/A (initial creation)

  Added sections:
  - Core Principles (3): Test-First, Type Safety, Simplicity
  - Development Workflow
  - Quality Standards
  - Governance

  Removed sections: N/A (initial)

  Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ No changes needed (generic)
  - .specify/templates/spec-template.md: ✅ No changes needed (generic)
  - .specify/templates/tasks-template.md: ✅ No changes needed (generic)
  - .specify/templates/checklist-template.md: ✅ No changes needed (generic)
  - .specify/templates/agent-file-template.md: ✅ No changes needed (generic)

  Follow-up TODOs: None
  ============================================================================
-->

# Event Link Constitution

## Core Principles

### I. Test-First (NON-NEGOTIABLE)

Test-Driven Development is mandatory for all feature implementation:

- Tests MUST be written before implementation code
- Tests MUST fail before implementation begins (Red phase)
- Implementation MUST only satisfy failing tests (Green phase)
- Refactoring MUST NOT change test outcomes (Refactor phase)
- No PR may be merged without passing tests covering new functionality

**Rationale**: TDD ensures correctness by design, prevents regression, and produces
testable architecture. Calendar URL generation requires precision—malformed URLs
break user calendar imports silently.

### II. Type Safety

Strict typing is required throughout the codebase:

- All function parameters and return types MUST be explicitly typed
- Type inference is permitted only for local variables with obvious types
- Generic types MUST be constrained appropriately
- `any`, `unknown`, or equivalent escape hatches MUST NOT be used except at
  system boundaries with explicit validation
- Runtime type validation MUST occur at all external input boundaries

**Rationale**: Calendar data involves dates, timezones, and structured formats
(iCal, Google Calendar URLs). Type errors in these domains cause silent failures
that users discover only when events appear at wrong times or fail to import.

### III. Simplicity (YAGNI)

Start simple; add complexity only when proven necessary:

- Implement the minimal solution that satisfies current requirements
- Do NOT add features, abstractions, or configurability for hypothetical futures
- Prefer inline code over abstractions until duplication exceeds 3 occurrences
- Remove dead code immediately—do not comment it out "for later"
- Each new dependency MUST be justified with a specific, current need

**Rationale**: Event Link has a focused scope—generating calendar URLs. Premature
abstraction obscures the simple URL-building logic and increases maintenance burden
without delivering user value.

## Development Workflow

### Code Review Requirements

- All changes MUST be reviewed before merging to main
- Reviewers MUST verify adherence to constitution principles
- PRs MUST include tests demonstrating the change works as intended
- PRs SHOULD be small and focused on a single concern

### Testing Gates

- Unit tests MUST pass before merge
- Integration tests MUST verify URL generation produces valid calendar imports
- Test coverage for new code SHOULD exceed 80%

## Quality Standards

### Code Organization

- Functions SHOULD do one thing and do it well
- Files SHOULD have a single, clear responsibility
- Imports MUST be organized and unused imports removed
- Formatting MUST be consistent (enforced by automated tooling)

### Documentation

- Public APIs MUST have documentation describing purpose and usage
- Complex logic MUST have inline comments explaining "why" not "what"
- README MUST include quickstart instructions for new contributors

## Governance

This constitution supersedes all other development practices in case of conflict.

### Amendment Process

1. Propose amendment with rationale in a PR modifying this file
2. All active contributors MUST review and approve
3. Update version number according to semantic versioning:
   - MAJOR: Principle removal or fundamental redefinition
   - MINOR: New principle or significant guidance expansion
   - PATCH: Clarifications and wording improvements
4. Document changes in Sync Impact Report header

### Compliance

- All PRs MUST be checked against constitution principles
- Violations MUST be resolved before merge
- Complexity beyond constitution guidance MUST be justified in PR description

**Version**: 1.0.0 | **Ratified**: 2026-01-07 | **Last Amended**: 2026-01-07
