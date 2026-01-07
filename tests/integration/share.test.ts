import { test, expect } from '@playwright/test';

test.describe('Share URL Feature', () => {
  test.describe('User Story 1 - Generate Shareable Link', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('share button is visible when calendar buttons are shown', async ({ page }) => {
      // Fill in valid event data
      await page.fill('#title', 'Team Meeting');
      await page.fill('#start-datetime', '2026-01-15T10:00');
      await page.fill('#end-datetime', '2026-01-15T11:00');

      // Share button should be visible
      await expect(page.locator('#share-button')).toBeVisible();
    });

    test('share button is hidden when form is invalid', async ({ page }) => {
      // Leave form incomplete
      await page.fill('#start-datetime', '2026-01-15T10:00');
      await page.fill('#end-datetime', '2026-01-15T11:00');
      // Title is empty

      // Share section should be hidden
      await expect(page.locator('#share-section')).toBeHidden();
    });

    test('clicking share button generates URL and displays it', async ({ page }) => {
      await page.fill('#title', 'Team Meeting');
      await page.fill('#start-datetime', '2026-01-15T10:00');
      await page.fill('#end-datetime', '2026-01-15T11:00');

      await page.click('#share-button');

      // URL display should be visible
      const shareUrlInput = page.locator('#share-url-input');
      await expect(shareUrlInput).toBeVisible();

      // URL should contain expected parameters in hash
      const shareUrl = await shareUrlInput.inputValue();
      expect(shareUrl).toContain('#share=1');
      expect(shareUrl).toContain('title=');
      expect(shareUrl).toContain('start=');
      expect(shareUrl).toContain('end=');
    });

    test('generated URL contains correct event data', async ({ page }) => {
      await page.fill('#title', 'Team Meeting');
      await page.fill('#description', 'Discuss project');
      await page.fill('#start-datetime', '2026-01-15T10:00');
      await page.fill('#end-datetime', '2026-01-15T11:00');

      await page.click('#share-button');

      const shareUrl = await page.locator('#share-url-input').inputValue();
      const url = new URL(shareUrl);
      // Parse hash params (hash is in format #key=value&key2=value2)
      const params = new URLSearchParams(url.hash.slice(1));

      expect(params.get('share')).toBe('1');
      expect(params.get('title')).toBe('Team Meeting');
      expect(params.get('desc')).toBe('Discuss project');
      expect(params.get('start')).toContain('2026-01-15');
      expect(params.get('end')).toContain('2026-01-15');
    });
  });

  test.describe('User Story 2 - View Shared Event Page', () => {
    test('shared URL shows buttons-only view with event info', async ({ page }) => {
      // Navigate directly to a share URL (using hash)
      await page.goto('/#share=1&title=Team%20Meeting&start=2026-01-15T10:00&end=2026-01-15T11:00');

      // Form should be hidden
      await expect(page.locator('#event-form')).toBeHidden();

      // Event summary should be visible
      await expect(page.locator('#event-summary')).toBeVisible();
      await expect(page.locator('#event-title')).toContainText('Team Meeting');

      // Calendar buttons should be visible
      await expect(page.locator('[data-calendar="google"]')).toBeVisible();
      await expect(page.locator('[data-calendar="outlook"]')).toBeVisible();
      await expect(page.locator('[data-calendar="ical"]')).toBeVisible();
    });

    test('shared URL shows event datetime formatted nicely', async ({ page }) => {
      await page.goto('/#share=1&title=Test&start=2026-01-15T10:00&end=2026-01-15T11:00');

      const datetime = page.locator('#event-datetime');
      await expect(datetime).toBeVisible();
      const text = await datetime.textContent();
      expect(text).toContain('Jan');
      expect(text).toContain('15');
      expect(text).toContain('2026');
    });

    test('shared URL shows description when provided', async ({ page }) => {
      await page.goto('/#share=1&title=Test&start=2026-01-15T10:00&end=2026-01-15T11:00&desc=Project%20planning');

      await expect(page.locator('#event-description')).toContainText('Project planning');
    });

    test('form is hidden in share mode', async ({ page }) => {
      await page.goto('/#share=1&title=Test&start=2026-01-15T10:00&end=2026-01-15T11:00');

      // All form groups should be hidden
      await expect(page.locator('#event-form')).toBeHidden();
      await expect(page.locator('#title')).toBeHidden();
      await expect(page.locator('#start-datetime')).toBeHidden();
    });

    test('invalid share URL shows error with create-event link', async ({ page }) => {
      await page.goto('/#share=1&title=');

      // Error section should be visible
      await expect(page.locator('#share-error')).toBeVisible();

      // Should show create-event link within the error section
      const createLink = page.locator('#share-error .create-event-link');
      await expect(createLink).toBeVisible();
      await expect(createLink).toHaveAttribute('href', './');
    });

    test('clicking create-event link returns to form mode', async ({ page }) => {
      await page.goto('/#share=1&title=');

      await page.click('#share-error .create-event-link');

      // Form should now be visible
      await expect(page.locator('#event-form')).toBeVisible();
      await expect(page.locator('#share-error')).toBeHidden();
    });

    test('calendar buttons work in share view', async ({ page }) => {
      await page.goto('/#share=1&title=Test%20Event&start=2026-01-15T10:00&end=2026-01-15T11:00');

      // Google button should have correct URL
      const googleButton = page.locator('[data-calendar="google"]');
      const href = await googleButton.getAttribute('href');
      expect(href).toContain('calendar.google.com');
      expect(href).toContain('Test');
    });
  });

  test.describe('User Story 3 - Copy Share Link', () => {
    test('copy button is visible next to share URL', async ({ page }) => {
      await page.goto('/');
      await page.fill('#title', 'Team Meeting');
      await page.fill('#start-datetime', '2026-01-15T10:00');
      await page.fill('#end-datetime', '2026-01-15T11:00');

      await page.click('#share-button');

      await expect(page.locator('#share-url-copy')).toBeVisible();
    });

    test('clicking copy button shows visual feedback', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-write']);

      await page.goto('/');
      await page.fill('#title', 'Team Meeting');
      await page.fill('#start-datetime', '2026-01-15T10:00');
      await page.fill('#end-datetime', '2026-01-15T11:00');

      await page.click('#share-button');
      await page.click('#share-url-copy');

      // Button should show copied state
      await expect(page.locator('#share-url-copy')).toHaveClass(/copied/);
    });
  });
});
