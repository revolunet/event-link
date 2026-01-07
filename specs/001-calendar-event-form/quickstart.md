# Quickstart: Calendar Event Form

**Date**: 2026-01-07
**Feature**: 001-calendar-event-form

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or pnpm 8+

## Initial Setup

```bash
# Clone and enter the repository
git clone <repository-url>
cd event-link

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default port).

## Project Structure

```
event-link/
├── src/
│   ├── index.html           # Single page HTML
│   ├── main.ts              # Entry point
│   ├── types.ts             # TypeScript interfaces
│   ├── validators.ts        # Form validation
│   ├── generators/
│   │   ├── google.ts        # Google Calendar URL
│   │   ├── outlook.ts       # Outlook URL
│   │   └── ical.ts          # iCal file generation
│   └── styles.css           # Responsive styles
├── tests/
│   ├── unit/                # Vitest unit tests
│   └── integration/         # Playwright E2E tests
├── specs/                   # Feature specifications
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Development Workflow

Following Constitution Principle I (Test-First):

1. **Write failing test** in `tests/unit/` or `tests/integration/`
2. **Run test** to confirm it fails: `npm run test`
3. **Implement** minimal code to pass
4. **Refactor** while keeping tests green

### Example: Adding a New Generator

```bash
# 1. Create test file
touch tests/unit/generators/yahoo.test.ts

# 2. Write test
cat > tests/unit/generators/yahoo.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { generateYahooUrl } from '../../../src/generators/yahoo';

describe('generateYahooUrl', () => {
  it('generates valid Yahoo Calendar URL', () => {
    const event = {
      title: 'Team Meeting',
      description: '',
      url: '',
      startDateTime: new Date('2026-01-15T10:00:00'),
      endDateTime: new Date('2026-01-15T11:00:00'),
    };

    const url = generateYahooUrl(event);

    expect(url).toContain('calendar.yahoo.com');
    expect(url).toContain('title=Team%20Meeting');
  });
});
EOF

# 3. Run test (should fail)
npm run test -- yahoo

# 4. Implement generator
# 5. Run test (should pass)
```

## Testing Calendar Links

To manually verify generated links work:

1. Fill out the form with test data
2. Click each calendar button
3. Verify the calendar app opens with correct:
   - Title
   - Start/end times
   - Description (if provided)
   - URL (if provided)

### Test Data

```
Title: Test Event
Description: This is a test event for verification
URL: https://example.com/meeting
Start: Tomorrow at 2:00 PM
End: Tomorrow at 3:00 PM
```

## Building for Production

```bash
# Build optimized bundle
npm run build

# Output is in dist/
ls -la dist/

# Preview locally
npm run preview
```

The `dist/` folder contains static files that can be deployed to any static hosting:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

## Troubleshooting

### TypeScript Errors

```bash
# Check for type errors without building
npm run typecheck
```

### Tests Failing

```bash
# Run specific test file
npm run test -- validators

# Run with verbose output
npm run test -- --reporter=verbose
```

### Playwright Issues

```bash
# Install browser binaries
npx playwright install

# Run E2E tests with UI
npm run test:e2e -- --ui
```
