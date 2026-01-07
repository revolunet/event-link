import { test, expect } from '@playwright/test';

test.describe('Event Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays the form with all required fields', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Event Link');
    await expect(page.locator('#title')).toBeVisible();
    await expect(page.locator('#start-datetime')).toBeVisible();
    await expect(page.locator('#end-datetime')).toBeVisible();
  });

  test('shows calendar buttons when valid data is entered', async ({ page }) => {
    // Fill in required fields
    await page.fill('#title', 'Team Meeting');
    await page.fill('#start-datetime', '2026-01-15T10:00');
    await page.fill('#end-datetime', '2026-01-15T11:00');

    // Calendar links section should be visible
    await expect(page.locator('#calendar-links')).toBeVisible();

    // All three calendar buttons should be present
    await expect(page.locator('[data-calendar="google"]')).toBeVisible();
    await expect(page.locator('[data-calendar="outlook"]')).toBeVisible();
    await expect(page.locator('[data-calendar="ical"]')).toBeVisible();
  });

  test('hides calendar links when title is empty', async ({ page }) => {
    await page.fill('#start-datetime', '2026-01-15T10:00');
    await page.fill('#end-datetime', '2026-01-15T11:00');
    // Leave title empty

    // Calendar links should be hidden (no error shown until form is complete)
    await expect(page.locator('#calendar-links')).toBeHidden();
  });

  test('shows validation error when end time is before start time', async ({ page }) => {
    await page.fill('#title', 'Team Meeting');
    await page.fill('#start-datetime', '2026-01-15T11:00');
    await page.fill('#end-datetime', '2026-01-15T10:00');

    // Error message should be visible
    await expect(page.locator('#end-datetime-error')).toBeVisible();
    // Calendar links should be hidden
    await expect(page.locator('#calendar-links')).toBeHidden();
  });

  test('updates links in real-time as user types', async ({ page }) => {
    await page.fill('#title', 'Initial Title');
    await page.fill('#start-datetime', '2026-01-15T10:00');
    await page.fill('#end-datetime', '2026-01-15T11:00');

    // Get initial Google URL
    const googleLink = page.locator('[data-calendar="google"]');
    const initialHref = await googleLink.getAttribute('href');

    // Update title
    await page.fill('#title', 'Updated Title');

    // URL should have changed
    const updatedHref = await googleLink.getAttribute('href');
    expect(updatedHref).not.toBe(initialHref);
    // URLSearchParams encodes spaces as + or %20
    expect(updatedHref).toMatch(/Updated[+%20]Title/);
  });

  test('Google Calendar button has correct URL format', async ({ page }) => {
    await page.fill('#title', 'Team Meeting');
    await page.fill('#start-datetime', '2026-01-15T10:00');
    await page.fill('#end-datetime', '2026-01-15T11:00');

    const googleLink = page.locator('[data-calendar="google"]');
    const href = await googleLink.getAttribute('href');

    expect(href).toContain('calendar.google.com/calendar/r/eventedit');
    // URLSearchParams encodes spaces as + or %20
    expect(href).toMatch(/text=Team[+%20]Meeting/);
    expect(href).toContain('dates=');
  });

  test('Outlook button has correct URL format', async ({ page }) => {
    await page.fill('#title', 'Team Meeting');
    await page.fill('#start-datetime', '2026-01-15T10:00');
    await page.fill('#end-datetime', '2026-01-15T11:00');

    const outlookLink = page.locator('[data-calendar="outlook"]');
    const href = await outlookLink.getAttribute('href');

    expect(href).toContain('outlook.live.com/calendar');
    // URLSearchParams encodes spaces as + or %20
    expect(href).toMatch(/subject=Team[+%20]Meeting/);
    expect(href).toContain('startdt=');
    expect(href).toContain('enddt=');
  });

  test('iCal button downloads .ics file', async ({ page }) => {
    await page.fill('#title', 'Team Meeting');
    await page.fill('#start-datetime', '2026-01-15T10:00');
    await page.fill('#end-datetime', '2026-01-15T11:00');

    const icalLink = page.locator('[data-calendar="ical"]');
    const href = await icalLink.getAttribute('href');

    expect(href).toMatch(/^data:text\/calendar;charset=utf-8,/);
    expect(href).toContain('BEGIN%3AVCALENDAR');
    expect(href).toContain('END%3AVCALENDAR');
  });

  test('copy buttons are visible and clickable', async ({ page }) => {
    await page.fill('#title', 'Team Meeting');
    await page.fill('#start-datetime', '2026-01-15T10:00');
    await page.fill('#end-datetime', '2026-01-15T11:00');

    // Copy buttons should be visible
    await expect(page.locator('#google-copy')).toBeVisible();
    await expect(page.locator('#outlook-copy')).toBeVisible();
    await expect(page.locator('#ical-copy')).toBeVisible();
  });

  test('copy button shows visual feedback when clicked', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-write']);

    await page.fill('#title', 'Team Meeting');
    await page.fill('#start-datetime', '2026-01-15T10:00');
    await page.fill('#end-datetime', '2026-01-15T11:00');

    const copyButton = page.locator('#google-copy');
    await copyButton.click();

    // Button should have 'copied' class after clicking
    await expect(copyButton).toHaveClass(/copied/);
  });
});
