# Research: Share URL Buttons

**Date**: 2026-01-07
**Feature**: 002-share-url-buttons

## URL Encoding Strategy

### Event Data in URL Hash Fragment

**Decision**: Use URL hash fragment with URLSearchParams encoding

**URL Pattern**:
```
https://[host]/#share=1&title={title}&desc={description}&url={url}&start={startDateTime}&end={endDateTime}
```

**Parameters**:
| Parameter | Required | Format | Notes |
|-----------|----------|--------|-------|
| `share` | Yes | `1` | Flag indicating shared/buttons-only mode |
| `title` | Yes | URL-encoded string | Event title |
| `start` | Yes | ISO 8601 (`YYYY-MM-DDTHH:mm`) | Start datetime |
| `end` | Yes | ISO 8601 (`YYYY-MM-DDTHH:mm`) | End datetime |
| `desc` | No | URL-encoded string | Event description |
| `url` | No | URL-encoded string | Event URL |

**Rationale**:
- Query parameters are human-readable (FR-010)
- URLSearchParams handles all encoding automatically
- ISO 8601 dates are unambiguous and compact
- Short parameter names reduce URL length

**Alternatives Considered**:
- Hash fragment (`#share=...`): Not sent to server if needed later; harder to debug
- Base64 encoded JSON: Not human-readable, violates FR-010
- Path segments (`/share/title/...`): Would require server-side routing configuration

---

### URL Length Constraints

**Decision**: Target maximum 2000 characters for universal browser compatibility

**Research**:
- Most browsers support 2000+ character URLs
- IE historically limited to 2083 characters
- Some social media platforms truncate at ~2000 characters
- Description field is the main variable-length component

**Mitigation**:
- Truncate description if URL exceeds 1800 characters (leaves 200 char buffer)
- Show warning to user when truncation occurs
- Title limited to reasonable length (typically <100 chars)

**Rationale**: Prioritize compatibility across browsers and sharing platforms. Most events have short descriptions, and truncation is preferable to broken links.

---

## View Mode Detection

### URL-Based Mode Switching

**Decision**: Check for `share=1` parameter on page load to determine view mode

**Logic Flow**:
```
On page load:
  1. Parse URL query parameters
  2. If share=1 present:
     a. Extract event data from URL
     b. Validate required fields (title, start, end)
     c. If valid: show buttons-only view with event info
     d. If invalid: show error message with link to create new event
  3. If share=1 not present:
     a. Show normal form view (existing behavior)
```

**Rationale**: Simple flag-based detection is clear and debuggable. No routing library needed, keeping with Constitution Principle III (Simplicity).

---

### Buttons-Only View Implementation

**Decision**: Hide form elements via CSS class toggle; show event summary section

**Approach**:
- Add `view-share` class to body when in share mode
- CSS hides `.form-group` and shows `.event-summary` based on body class
- Event summary displays: title (heading), formatted date/time, description (if present)
- Calendar buttons remain visible with identical functionality

**Rationale**:
- Single page, no separate HTML files needed
- CSS-based toggling is simple and performant
- Reuses all existing calendar button logic

**Layout** (buttons-only view):
```
┌─────────────────────────────────┐
│         Event Link              │
│  "Add this event to calendar"   │
├─────────────────────────────────┤
│  📅 Team Meeting                │  ← Event title (h2)
│  Jan 15, 2026 10:00 - 11:00     │  ← Formatted datetime (24h)
│  Discuss project updates        │  ← Description (if any)
├─────────────────────────────────┤
│  [Google Calendar] [📋]         │
│  [Outlook]         [📋]         │
│  [iCal (.ics)]     [📋]         │
├─────────────────────────────────┤
│  [Create your own event →]      │  ← Link to form mode
└─────────────────────────────────┘
```

---

## Share Button Behavior

### Generate & Copy Flow

**Decision**: Generate URL on click, copy to clipboard, show success feedback

**Flow**:
1. User clicks "Share" button
2. Build URL with current event data using URLSearchParams
3. Copy URL to clipboard using existing clipboard utility
4. Show "Copied!" feedback (reuse `.copied` class animation)
5. URL is also displayed in a readonly text field for manual copy fallback

**Rationale**: Immediate clipboard copy is the primary action users expect. Text field fallback handles clipboard permission issues (edge case from spec).

---

## Error Handling for Shared URLs

### Invalid/Malformed URL Data

**Decision**: Show friendly error with option to create new event

**Validation Rules**:
| Field | Validation | Error Message |
|-------|------------|---------------|
| `share` | Must be `1` | N/A (just show form mode) |
| `title` | Non-empty after decode | "Event title is missing" |
| `start` | Valid ISO 8601 date | "Start date is invalid" |
| `end` | Valid ISO 8601 date | "End date is invalid" |
| `end > start` | End after start | "End time must be after start" |

**Error Display**:
```
┌─────────────────────────────────┐
│  ⚠️ Invalid Event Link          │
│                                 │
│  {specific error message}       │
│                                 │
│  [Create a new event →]         │
└─────────────────────────────────┘
```

**Rationale**: Specific error messages help users understand what went wrong. Always provide a clear path forward (create new event).

---

## Browser Compatibility

### URLSearchParams Support

**Decision**: Use native URLSearchParams (supported in all target browsers)

**Browser Support**:
- Chrome 49+ (2016)
- Firefox 44+ (2016)
- Safari 10.1+ (2017)
- Edge 17+ (2018)

**Rationale**: All modern browsers support URLSearchParams natively. No polyfill needed given our "last 2 years" target platform requirement.

---

## Implementation Decisions Summary

| Decision | Choice | Key Rationale |
|----------|--------|---------------|
| URL format | Query parameters | Human-readable (FR-010) |
| Encoding | URLSearchParams | Native, handles edge cases |
| Date format | ISO 8601 | Compact, unambiguous |
| Max URL length | 2000 chars | Universal compatibility |
| Mode detection | `share=1` flag | Simple, no routing needed |
| View toggle | CSS class on body | No separate pages |
| Error handling | Specific messages | Clear user guidance |
