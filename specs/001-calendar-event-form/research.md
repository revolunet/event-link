# Research: Calendar Event Form

**Date**: 2026-01-07
**Feature**: 001-calendar-event-form

## Calendar Provider URL Formats

### Google Calendar

**Decision**: Use `https://calendar.google.com/calendar/r/eventedit` base URL

**URL Pattern**:
```
https://calendar.google.com/calendar/r/eventedit?text={title}&dates={start}/{end}&details={description}&location={url}
```

**Parameters**:
| Parameter | Required | Format | Notes |
|-----------|----------|--------|-------|
| `text` | Yes | URL-encoded string | Event title |
| `dates` | Yes | `YYYYMMDDTHHmmss/YYYYMMDDTHHmmss` | Start/end in ISO format, no separators |
| `details` | No | URL-encoded string | Event description |
| `location` | No | URL-encoded string | We'll use this for the event URL |
| `ctz` | No | Timezone ID (e.g., `America/New_York`) | Optional timezone specification |

**Date Format Details**:
- For timed events: `20201231T193000/20201231T223000` (local timezone assumed)
- For UTC: append `Z` suffix: `20201231T193000Z/20201231T223000Z`
- Dates must be concatenated with `/` separator

**Rationale**: The `/r/eventedit` endpoint is the modern, supported URL. The older `/render?action=TEMPLATE` still works but the newer format is preferred.

**Alternatives Considered**:
- Google Calendar API: Requires authentication, overkill for link generation
- `/render?action=TEMPLATE`: Legacy URL, less reliable

---

### Outlook Calendar

**Decision**: Use `https://outlook.live.com/calendar/0/action/compose` for broad compatibility

**URL Pattern**:
```
https://outlook.live.com/calendar/0/action/compose?subject={title}&body={description}&startdt={start}&enddt={end}&location={url}
```

**Parameters**:
| Parameter | Required | Format | Notes |
|-----------|----------|--------|-------|
| `subject` | Yes | URL-encoded string | Event title |
| `startdt` | Yes | `YYYY-MM-DDTHH:mm:ss` | ISO 8601 format |
| `enddt` | Yes | `YYYY-MM-DDTHH:mm:ss` | ISO 8601 format |
| `body` | No | URL-encoded string | Event description |
| `location` | No | URL-encoded string | We'll use this for the event URL |
| `allday` | No | `true`/`false` | Not needed (we only support timed events) |

**Date Format Details**:
- Without `Z` suffix: interpreted as user's local timezone
- With `Z` suffix: interpreted as UTC
- We'll omit `Z` to use local timezone (consistent with user input)

**Rationale**: `outlook.live.com` works for both personal Microsoft accounts and redirects appropriately. The `/action/compose` path is more reliable than `/deeplink/compose`.

**Alternatives Considered**:
- `outlook.office.com`: Only works for Office 365 business accounts
- `/deeplink/compose`: Has known bugs with query parameter parsing

---

### iCal (.ics file)

**Decision**: Generate downloadable .ics file using RFC 5545 VEVENT format

**File Structure**:
```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Event Link//EN
BEGIN:VEVENT
UID:{unique-id}@eventlink
DTSTAMP:{current-datetime}
DTSTART:{start-datetime}
DTEND:{end-datetime}
SUMMARY:{title}
DESCRIPTION:{description}
URL:{url}
END:VEVENT
END:VCALENDAR
```

**Required Fields**:
| Field | Format | Notes |
|-------|--------|-------|
| `UID` | String | Must be globally unique; use timestamp + random |
| `DTSTAMP` | `YYYYMMDDTHHmmssZ` | Current time when file generated (UTC) |
| `DTSTART` | `YYYYMMDDTHHmmss` | Event start (local) or with `Z` suffix (UTC) |
| `DTEND` | `YYYYMMDDTHHmmss` | Event end (local) or with `Z` suffix (UTC) |
| `SUMMARY` | Text | Event title |

**Optional Fields**:
| Field | Format | Notes |
|-------|--------|-------|
| `DESCRIPTION` | Text | Event description; newlines as `\n` |
| `URL` | URI | Event URL |
| `LOCATION` | Text | Could duplicate URL here for visibility |

**Text Escaping**:
- Commas: `\,`
- Semicolons: `\;`
- Newlines: `\n`
- Backslashes: `\\`

**Line Length**: Lines must not exceed 75 octets; fold with CRLF + space

**Rationale**: RFC 5545 is the universal standard supported by Apple Calendar, Google Calendar, Outlook, and all major calendar apps.

**Alternatives Considered**:
- vCalendar 1.0: Deprecated, less compatible
- hCalendar: HTML microformat, not suitable for downloads

---

## Implementation Decisions

### Timezone Handling

**Decision**: Use browser's local timezone; do not include timezone in generated URLs/files

**Rationale**:
- FR-007 requires client-side only operation
- Spec assumption states "Timezone handling will use the user's local timezone as detected by the browser"
- Users entering times naturally think in local time
- Omitting timezone suffix lets each calendar app interpret times in user's local zone

### URL Encoding

**Decision**: Use `encodeURIComponent()` for all parameter values

**Rationale**: Standard JavaScript function handles all special characters correctly for URL query strings.

### UID Generation for iCal

**Decision**: Use format `{timestamp}-{random}@eventlink.app`

**Rationale**: Guarantees uniqueness without server-side coordination. Example: `1704672000000-abc123@eventlink.app`

---

## Technology Stack Validation

### Vite + TypeScript

**Decision**: Confirmed as appropriate choice

**Rationale**:
- Vite provides fast dev server and optimized builds
- TypeScript strict mode satisfies Constitution Principle II (Type Safety)
- Zero runtime dependencies needed for URL generation
- Build output is static HTML/JS/CSS deployable anywhere

### No Framework Needed

**Decision**: Vanilla TypeScript sufficient

**Rationale**:
- Single page with 5 form fields
- Real-time updates achievable with native DOM events
- Constitution Principle III (Simplicity) favors minimal dependencies
- React/Vue/Svelte would add ~30-100KB for no benefit

---

## Sources

- [Google Calendar Event Links](https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md)
- [Outlook Calendar Deeplinks](https://interactiondesignfoundation.github.io/add-event-to-calendar-docs/services/outlook-web.html)
- [iCalendar RFC 5545](https://datatracker.ietf.org/doc/html/rfc5545)
- [iCalendar VEVENT Spec](https://icalendar.org/iCalendar-RFC-5545/3-6-1-event-component.html)
