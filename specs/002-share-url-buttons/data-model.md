# Data Model: Share URL Buttons

**Date**: 2026-01-07
**Feature**: 002-share-url-buttons

## Entities

### Existing: CalendarEvent (from feature 001)

```typescript
interface CalendarEvent {
  title: string;
  description: string;
  url: string;
  startDateTime: Date;
  endDateTime: Date;
}
```

*No changes required to existing type.*

---

### New: ShareURLParams

Represents the URL query parameters for a shared event link.

```typescript
interface ShareURLParams {
  share: '1';
  title: string;
  start: string;  // ISO 8601 format: YYYY-MM-DDTHH:mm
  end: string;    // ISO 8601 format: YYYY-MM-DDTHH:mm
  desc?: string;  // Optional: event description
  url?: string;   // Optional: event URL
}
```

**Validation Rules**:
| Field | Rule | Error |
|-------|------|-------|
| `share` | Must equal `'1'` | Not a share URL |
| `title` | Non-empty string | "Event title is missing" |
| `start` | Valid ISO 8601 datetime | "Start date is invalid" |
| `end` | Valid ISO 8601 datetime | "End date is invalid" |
| `end` | Must be after `start` | "End time must be after start" |

---

### New: ParsedShareResult

Result of parsing a share URL, with success/error handling.

```typescript
type ParsedShareResult =
  | { success: true; event: CalendarEvent }
  | { success: false; error: string };
```

---

### New: ViewMode

Enum representing the current view state of the application.

```typescript
type ViewMode = 'form' | 'share' | 'error';
```

| Mode | Description |
|------|-------------|
| `form` | Normal mode: show event creation form |
| `share` | Shared link mode: show buttons-only view |
| `error` | Invalid share link: show error message |

---

## Functions

### encodeEventToURL

Encodes a CalendarEvent into a shareable URL.

```typescript
function encodeEventToURL(event: CalendarEvent, baseURL: string): string;
```

**Parameters**:
- `event`: The calendar event to encode
- `baseURL`: The base URL of the application (e.g., `https://example.com/`)

**Returns**: Full shareable URL with encoded event data

**Example**:
```typescript
const url = encodeEventToURL({
  title: "Team Meeting",
  description: "Discuss project updates",
  url: "",
  startDateTime: new Date("2026-01-15T10:00:00"),
  endDateTime: new Date("2026-01-15T11:00:00")
}, "https://eventlink.app/");

// Result: https://eventlink.app/?share=1&title=Team%20Meeting&desc=Discuss%20project%20updates&start=2026-01-15T10:00&end=2026-01-15T11:00
```

---

### parseShareURL

Parses URL query parameters into a CalendarEvent or error.

```typescript
function parseShareURL(searchParams: URLSearchParams): ParsedShareResult;
```

**Parameters**:
- `searchParams`: URL search parameters from `window.location.search`

**Returns**: ParsedShareResult with either the decoded event or an error message

**Example**:
```typescript
const params = new URLSearchParams("?share=1&title=Meeting&start=2026-01-15T10:00&end=2026-01-15T11:00");
const result = parseShareURL(params);

if (result.success) {
  console.log(result.event.title); // "Meeting"
} else {
  console.error(result.error); // "Event title is missing"
}
```

---

### getViewMode

Determines the current view mode based on URL parameters.

```typescript
function getViewMode(searchParams: URLSearchParams): ViewMode;
```

**Logic**:
1. If `share` parameter is not `'1'`, return `'form'`
2. If share URL parsing fails, return `'error'`
3. If share URL parsing succeeds, return `'share'`

---

### formatEventDateTime

Formats a date range for display in the shared view using 24-hour time format.

```typescript
function formatEventDateTime(start: Date, end: Date): string;
```

**Example output**: `"Jan 15, 2026 10:00 - 11:00"` (24h format, no AM/PM)

---

## State Transitions

```
┌──────────┐     URL has share=1     ┌──────────┐
│          │ ──────────────────────► │  Parse   │
│   Form   │                         │   URL    │
│   Mode   │ ◄────────────────────── │          │
│          │   "Create new event"    └────┬─────┘
└──────────┘         clicked              │
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
              ┌──────────┐         ┌──────────┐         ┌──────────┐
              │  Valid   │         │ Invalid  │         │ Missing  │
              │  Event   │         │  Data    │         │  Fields  │
              └────┬─────┘         └────┬─────┘         └────┬─────┘
                   │                    │                    │
                   ▼                    ▼                    ▼
              ┌──────────┐         ┌──────────────────────────────┐
              │  Share   │         │         Error Mode            │
              │   Mode   │         │  (show specific error msg)    │
              └──────────┘         └──────────────────────────────┘
```

---

## Relationships

```
CalendarEvent  ────►  encodeEventToURL()  ────►  Shareable URL String
                                                        │
                                                        ▼
                                               URLSearchParams
                                                        │
                                                        ▼
                                               parseShareURL()
                                                        │
                              ┌──────────────────────────┴──────────────────────────┐
                              ▼                                                      ▼
                      ParsedShareResult                                      ParsedShareResult
                      { success: true }                                      { success: false }
                              │                                                      │
                              ▼                                                      ▼
                       CalendarEvent                                           Error string
                              │
                              ▼
                    generateGoogleUrl()
                    generateOutlookUrl()
                    generateIcalFile()
```

---

## DOM Elements (New)

### Share Button Section

```html
<section id="share-section" class="share-section hidden">
  <button id="share-button" class="share-button" type="button">
    Share Event
  </button>
  <div class="share-url-display hidden">
    <input id="share-url-input" type="text" readonly>
    <button id="share-url-copy" class="copy-button" type="button">Copy</button>
  </div>
</section>
```

### Event Summary (for buttons-only view)

```html
<section id="event-summary" class="event-summary hidden">
  <h2 id="event-title"></h2>
  <p id="event-datetime" class="event-datetime"></p>
  <p id="event-description" class="event-description"></p>
</section>
```

### Error Display

```html
<section id="share-error" class="share-error hidden">
  <h2>Invalid Event Link</h2>
  <p id="error-message"></p>
  <a href="?" class="create-event-link">Create a new event</a>
</section>
```
