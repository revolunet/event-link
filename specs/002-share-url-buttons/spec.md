# Feature Specification: Share URL Buttons

**Feature Branch**: `002-share-url-buttons`
**Created**: 2026-01-07
**Status**: Draft
**Input**: User description: "add a button that allow to share an URL to this page that will only show the 3 buttons google, outlook, ICS"

## Clarifications

### Session 2026-01-07

- Q: Where should the Share button be placed in relation to the calendar buttons? → A: Add as a new button row below the calendar buttons section
- Q: What time format should be used for displaying event times? → A: Use 24-hour format (e.g., 14:00 instead of 2:00 PM)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Shareable Link (Priority: P1)

As a user who has created a calendar event, I want to generate a shareable URL that I can send to others, so they can see only the calendar buttons (Google, Outlook, iCal) without the form, and add the event to their calendar with a single click.

**Why this priority**: This is the core feature - without the ability to generate and share the URL, the entire feature has no value. This enables the primary use case of sharing event details with others.

**Independent Test**: Can be fully tested by creating an event, clicking the share button, and verifying a URL is generated that contains the event data.

**Acceptance Scenarios**:

1. **Given** I have filled in valid event details (title, start/end datetime), **When** I click the "Share" button, **Then** a shareable URL is generated that encodes the event information
2. **Given** I have generated a shareable URL, **When** I copy it, **Then** I can paste it anywhere to share with others
3. **Given** the calendar buttons are not visible (invalid form data), **When** I look for the share button, **Then** the share button is not visible

---

### User Story 2 - View Shared Event Page (Priority: P2)

As a recipient of a shared event link, I want to see only the three calendar buttons (Google, Outlook, iCal) when I open the link, so I can quickly add the event to my preferred calendar without seeing the event creation form.

**Why this priority**: This completes the sharing workflow - recipients need to see a clean, focused view with just the action buttons. Without this, the shared URL would show the full form which defeats the purpose.

**Independent Test**: Can be fully tested by opening a shared URL in a new browser and verifying only the calendar buttons appear, with no form fields visible.

**Acceptance Scenarios**:

1. **Given** I receive a shared event URL, **When** I open it in my browser, **Then** I see only the event title, dates, and three calendar buttons (Google, Outlook, iCal)
2. **Given** I am viewing a shared event page, **When** I click the Google Calendar button, **Then** it opens Google Calendar with the event pre-filled
3. **Given** I am viewing a shared event page, **When** I click the Outlook button, **Then** it opens Outlook Calendar with the event pre-filled
4. **Given** I am viewing a shared event page, **When** I click the iCal button, **Then** an .ics file downloads with the event details
5. **Given** I am viewing a shared event page, **When** I look at the page, **Then** the form fields (title, description, URL, dates inputs) are not visible

---

### User Story 3 - Copy Share Link (Priority: P3)

As a user who has generated a shareable link, I want to easily copy it to my clipboard, so I can quickly paste it into emails, messages, or social media.

**Why this priority**: This enhances usability but the feature works without it (users could manually copy from the URL bar). Adding a dedicated copy button improves the user experience.

**Independent Test**: Can be fully tested by clicking the copy button and pasting the result to verify the correct URL was copied.

**Acceptance Scenarios**:

1. **Given** I have generated a shareable URL, **When** I click the copy button next to the share URL, **Then** the URL is copied to my clipboard and I see visual confirmation
2. **Given** I have copied the shareable URL, **When** I paste it somewhere, **Then** the full shareable URL is pasted correctly

---

### Edge Cases

- What happens when someone tries to access a shared URL with invalid or corrupted event data?
  - System displays a friendly error message and suggests creating a new event
- What happens when the event data in the URL is incomplete (missing required fields)?
  - System displays what information is available and indicates what's missing
- What happens when a shared URL has expired or very old date formats?
  - System still displays the event (past dates are allowed with a warning on the creation form, shared links should work regardless)
- What happens when the share button is clicked but clipboard access is denied?
  - System shows the URL in a text field that users can manually select and copy

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a "Share" button in a dedicated row below the calendar buttons section, visible when calendar buttons are displayed
- **FR-002**: System MUST generate a shareable URL that encodes the event title, description, URL, start datetime, and end datetime
- **FR-003**: System MUST display a "buttons-only" view when the page is loaded with event data in the URL
- **FR-004**: The buttons-only view MUST hide the event creation form (all input fields)
- **FR-005**: The buttons-only view MUST display the event title and date/time information in 24-hour format
- **FR-006**: The buttons-only view MUST display the three calendar buttons (Google, Outlook, iCal) with copy icons
- **FR-007**: System MUST provide a way to copy the shareable URL to clipboard
- **FR-008**: System MUST show visual feedback when the URL is copied successfully
- **FR-009**: System MUST gracefully handle invalid or malformed shared URLs with user-friendly error messages
- **FR-010**: The shareable URL MUST be human-readable in the address bar (URL-encoded but not obfuscated)

### Key Entities

- **Shared Event URL**: A URL containing encoded event data (title, description, url, start datetime, end datetime) that can be shared and opened by others
- **Buttons-Only View**: A simplified page view showing only event information and calendar buttons, without the creation form

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can generate and copy a shareable URL in under 5 seconds from having valid event data
- **SC-002**: Recipients can add an event to their calendar within 10 seconds of opening a shared link
- **SC-003**: 100% of shared URLs correctly preserve all event information (title, description, URL, dates)
- **SC-004**: Shared page loads and displays buttons within 2 seconds on standard connections
- **SC-005**: 95% of users can successfully share an event link on their first attempt without confusion

## Assumptions

- The existing calendar button functionality (Google, Outlook, iCal) works correctly and will be reused in the shared view
- The URL encoding will use standard web-safe characters to ensure compatibility across all browsers and sharing platforms
- The shared view does not require user authentication - anyone with the link can view and use it
- Event data is encoded in the URL itself (no server-side storage required) to maintain the client-side-only architecture
- The copy functionality will use the same clipboard mechanism already implemented for calendar link copying
