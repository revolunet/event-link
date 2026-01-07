# Quickstart: Share URL Buttons

**Feature**: 002-share-url-buttons
**Date**: 2026-01-07

## Prerequisites

- Node.js 18+ installed
- Existing Event Link project from feature 001 (branch `001-calendar-event-form`)

## Setup

The project is already set up from feature 001. Checkout the feature branch:

```bash
git checkout 002-share-url-buttons
```

Install dependencies (if not already done):

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

## Testing the Share Feature

### Test Share URL Generation

1. Open `http://localhost:5173/`
2. Fill in event details (title, start/end times)
3. Click "Share" button below the calendar buttons
4. URL is copied to clipboard
5. Open the URL in a new tab to see buttons-only view

### Test Shared View

Open directly with URL parameters:

```
http://localhost:5173/?share=1&title=Test%20Event&start=2026-01-15T10:00&end=2026-01-15T11:00
```

Expected: Shows event title, date/time, and 3 calendar buttons (no form).

### Test Error Handling

Open with invalid data:

```
http://localhost:5173/?share=1&title=&start=invalid&end=2026-01-15T11:00
```

Expected: Shows error message with "Create a new event" link.

## Running Tests

### Unit Tests

```bash
npm test
```

New test files for this feature:
- `tests/unit/url-encoder.test.ts` - URL encoding/decoding tests

### E2E Tests

```bash
npm run test:e2e
```

New test file for this feature:
- `tests/integration/share.test.ts` - Share flow E2E tests

### Type Checking

```bash
npm run typecheck
```

## TDD Workflow

Per Constitution Principle I (Test-First):

1. **Write test first** for URL encoder:
   ```bash
   # Create tests/unit/url-encoder.test.ts
   # Run: npm test -- should FAIL
   ```

2. **Implement** `src/url-encoder.ts`:
   ```bash
   # Write minimal code to pass tests
   # Run: npm test -- should PASS
   ```

3. **Write E2E test** for share flow:
   ```bash
   # Create tests/integration/share.test.ts
   # Run: npm run test:e2e -- should FAIL
   ```

4. **Implement** UI and main.ts changes:
   ```bash
   # Update index.html, main.ts, styles.css
   # Run: npm run test:e2e -- should PASS
   ```

## Key Files to Modify

| File | Changes |
|------|---------|
| `src/url-encoder.ts` | NEW: encode/decode functions |
| `src/main.ts` | Add view mode detection, share button logic |
| `src/index.html` | Add share button section, event summary, error display |
| `src/styles.css` | Add styles for share button, buttons-only view |
| `tests/unit/url-encoder.test.ts` | NEW: URL encoder tests |
| `tests/integration/share.test.ts` | NEW: E2E share flow tests |

## Build

Create production build:

```bash
npm run build
```

Output in `dist/` directory. Deploy to any static hosting.
