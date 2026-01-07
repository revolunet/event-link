import type { CalendarEvent } from './types';
import { validateEvent } from './validators';
import { generateGoogleUrl } from './generators/google';
import { generateOutlookUrl } from './generators/outlook';
import { generateIcalFile } from './generators/ical';
import { encodeEventToURL, parseShareURL, getViewMode, formatEventDateTime } from './url-encoder';

// DOM Elements - Form
const form = document.getElementById('event-form') as HTMLFormElement;
const titleInput = document.getElementById('title') as HTMLInputElement;
const startDateTimeInput = document.getElementById('start-datetime') as HTMLInputElement;
const endDateTimeInput = document.getElementById('end-datetime') as HTMLInputElement;
const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
const urlInput = document.getElementById('url') as HTMLInputElement;

const titleError = document.getElementById('title-error') as HTMLDivElement;
const startDateTimeError = document.getElementById('start-datetime-error') as HTMLDivElement;
const startDateTimeWarning = document.getElementById('start-datetime-warning') as HTMLDivElement;
const endDateTimeError = document.getElementById('end-datetime-error') as HTMLDivElement;

// DOM Elements - Calendar Links
const calendarLinksSection = document.getElementById('calendar-links') as HTMLElement;
const googleButton = document.getElementById('google-button') as HTMLAnchorElement;
const outlookButton = document.getElementById('outlook-button') as HTMLAnchorElement;
const icalButton = document.getElementById('ical-button') as HTMLAnchorElement;

const googleCopyButton = document.getElementById('google-copy') as HTMLButtonElement;
const outlookCopyButton = document.getElementById('outlook-copy') as HTMLButtonElement;
const icalCopyButton = document.getElementById('ical-copy') as HTMLButtonElement;

// DOM Elements - Share
const shareSection = document.getElementById('share-section') as HTMLElement;
const shareButton = document.getElementById('share-button') as HTMLButtonElement;
const shareUrlDisplay = document.getElementById('share-url-display') as HTMLDivElement;
const shareUrlInput = document.getElementById('share-url-input') as HTMLInputElement;
const shareUrlCopyButton = document.getElementById('share-url-copy') as HTMLButtonElement;

// DOM Elements - Share View
const eventSummary = document.getElementById('event-summary') as HTMLElement;
const eventTitle = document.getElementById('event-title') as HTMLHeadingElement;
const eventDatetime = document.getElementById('event-datetime') as HTMLParagraphElement;
const eventDescription = document.getElementById('event-description') as HTMLParagraphElement;

// DOM Elements - Error View
const shareError = document.getElementById('share-error') as HTMLElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

// DOM Elements - Footer
const shareFooter = document.getElementById('share-footer') as HTMLElement;

// Current links state
let currentLinks = {
  google: '',
  outlook: '',
  ical: '',
};

// Current event (for share mode)
let currentEvent: CalendarEvent | null = null;

/**
 * Gets the current form values as a CalendarEvent object
 */
function getFormEvent(): CalendarEvent {
  return {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    url: urlInput.value.trim(),
    startDateTime: startDateTimeInput.value ? new Date(startDateTimeInput.value) : new Date(0),
    endDateTime: endDateTimeInput.value ? new Date(endDateTimeInput.value) : new Date(0),
  };
}

/**
 * Clears all error and warning messages
 */
function clearMessages(): void {
  titleError.textContent = '';
  startDateTimeError.textContent = '';
  startDateTimeWarning.textContent = '';
  endDateTimeError.textContent = '';

  titleInput.classList.remove('error');
  startDateTimeInput.classList.remove('error');
  endDateTimeInput.classList.remove('error');
}

/**
 * Displays validation errors and warnings
 */
function displayValidation(event: CalendarEvent): boolean {
  clearMessages();

  const result = validateEvent(event);

  // Display errors
  for (const error of result.errors) {
    if (error.field === 'title') {
      titleError.textContent = error.message;
      titleInput.classList.add('error');
    } else if (error.field === 'endDateTime') {
      endDateTimeError.textContent = error.message;
      endDateTimeInput.classList.add('error');
    }
  }

  // Display warnings
  for (const warning of result.warnings) {
    if (warning.field === 'startDateTime') {
      startDateTimeWarning.textContent = warning.message;
    }
  }

  return result.isValid;
}

/**
 * Updates the calendar links based on current form values
 */
function updateCalendarLinks(): void {
  const event = getFormEvent();

  // Check if form has minimum required data
  if (!event.title || !startDateTimeInput.value || !endDateTimeInput.value) {
    calendarLinksSection.classList.add('hidden');
    shareSection.classList.add('hidden');
    return;
  }

  const isValid = displayValidation(event);

  if (!isValid) {
    calendarLinksSection.classList.add('hidden');
    shareSection.classList.add('hidden');
    return;
  }

  // Store current event for share
  currentEvent = event;

  // Generate links
  currentLinks.google = generateGoogleUrl(event);
  currentLinks.outlook = generateOutlookUrl(event);
  currentLinks.ical = generateIcalFile(event);

  // Update button hrefs
  googleButton.href = currentLinks.google;
  outlookButton.href = currentLinks.outlook;
  icalButton.href = currentLinks.ical;

  // Show calendar links section and share section
  calendarLinksSection.classList.remove('hidden');
  shareSection.classList.remove('hidden');
}

/**
 * Copies text to clipboard and shows feedback
 */
async function copyToClipboard(text: string, button: HTMLButtonElement): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    button.classList.add('copied');
    setTimeout(() => {
      button.classList.remove('copied');
    }, 2000);
  } catch {
    // Fallback for older browsers or when clipboard API fails
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    button.classList.add('copied');
    setTimeout(() => {
      button.classList.remove('copied');
    }, 2000);
  }
}

/**
 * Generates and displays the share URL
 */
function generateShareURL(): void {
  if (!currentEvent) return;

  const baseURL = window.location.origin + window.location.pathname;
  const shareUrl = encodeEventToURL(currentEvent, baseURL);

  shareUrlInput.value = shareUrl;
  shareUrlDisplay.classList.remove('hidden');
}

/**
 * Renders the share view (buttons-only mode)
 */
function renderShareView(event: CalendarEvent): void {
  // Set body class for CSS-based hiding
  document.body.classList.add('view-share');

  // Display event summary
  eventTitle.textContent = event.title;
  eventDatetime.textContent = formatEventDateTime(event.startDateTime, event.endDateTime);
  eventDescription.textContent = event.description || '';
  eventSummary.classList.remove('hidden');

  // Generate and display calendar links
  currentLinks.google = generateGoogleUrl(event);
  currentLinks.outlook = generateOutlookUrl(event);
  currentLinks.ical = generateIcalFile(event);

  googleButton.href = currentLinks.google;
  outlookButton.href = currentLinks.outlook;
  icalButton.href = currentLinks.ical;

  calendarLinksSection.classList.remove('hidden');

  // Show footer with create-event link
  shareFooter.classList.remove('hidden');
}

/**
 * Renders the error view
 */
function renderErrorView(error: string): void {
  document.body.classList.add('view-error');
  errorMessage.textContent = error;
  shareError.classList.remove('hidden');
}

/**
 * Parses hash fragment as URLSearchParams
 */
function getHashParams(): URLSearchParams {
  const hash = window.location.hash.slice(1); // Remove leading #
  return new URLSearchParams(hash);
}

/**
 * Initializes the application based on URL parameters
 */
function initializeApp(): void {
  const searchParams = getHashParams();
  const viewMode = getViewMode(searchParams);

  if (viewMode === 'form') {
    // Normal form mode - set up event listeners
    initializeFormMode();
  } else if (viewMode === 'share') {
    // Share mode - display buttons-only view
    const result = parseShareURL(searchParams);
    if (result.success) {
      renderShareView(result.event);
    }
  } else if (viewMode === 'error') {
    // Error mode - display error message
    const result = parseShareURL(searchParams);
    if (!result.success) {
      renderErrorView(result.error);
    }
  }
}

/**
 * Initializes form mode event listeners
 */
function initializeFormMode(): void {
  // Event listeners for real-time validation
  titleInput.addEventListener('input', updateCalendarLinks);
  startDateTimeInput.addEventListener('input', updateCalendarLinks);
  endDateTimeInput.addEventListener('input', updateCalendarLinks);
  descriptionInput.addEventListener('input', updateCalendarLinks);
  urlInput.addEventListener('input', updateCalendarLinks);

  // Prevent form submission (client-side only app)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  // Copy button handlers
  googleCopyButton.addEventListener('click', () => {
    if (currentLinks.google) {
      copyToClipboard(currentLinks.google, googleCopyButton);
    }
  });

  outlookCopyButton.addEventListener('click', () => {
    if (currentLinks.outlook) {
      copyToClipboard(currentLinks.outlook, outlookCopyButton);
    }
  });

  icalCopyButton.addEventListener('click', () => {
    if (currentLinks.ical) {
      copyToClipboard(currentLinks.ical, icalCopyButton);
    }
  });

  // Share button handler
  shareButton.addEventListener('click', generateShareURL);

  // Share URL copy button handler
  shareUrlCopyButton.addEventListener('click', () => {
    const shareUrl = shareUrlInput.value;
    if (shareUrl) {
      copyToClipboard(shareUrl, shareUrlCopyButton);
    }
  });

  // Initialize with any existing values (useful for browser back/forward)
  updateCalendarLinks();
}

// Initialize the app
initializeApp();
