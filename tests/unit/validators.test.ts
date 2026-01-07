import { describe, it, expect } from 'vitest';
import { validateEvent } from '../../src/validators';
import type { CalendarEvent } from '../../src/types';

describe('validateEvent', () => {
  const validEvent: CalendarEvent = {
    title: 'Team Meeting',
    description: '',
    url: '',
    startDateTime: new Date('2026-01-15T10:00:00'),
    endDateTime: new Date('2026-01-15T11:00:00'),
  };

  describe('required fields', () => {
    it('returns valid for a complete event', () => {
      const result = validateEvent(validEvent);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns error when title is empty', () => {
      const event = { ...validEvent, title: '' };
      const result = validateEvent(event);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'title',
        message: 'Title is required',
      });
    });

    it('returns error when title is only whitespace', () => {
      const event = { ...validEvent, title: '   ' };
      const result = validateEvent(event);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'title',
        message: 'Title is required',
      });
    });
  });

  describe('date validation', () => {
    it('returns error when end date is before start date', () => {
      const event = {
        ...validEvent,
        startDateTime: new Date('2026-01-15T11:00:00'),
        endDateTime: new Date('2026-01-15T10:00:00'),
      };
      const result = validateEvent(event);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'endDateTime',
        message: 'End time must be after start time',
      });
    });

    it('returns error when end date equals start date', () => {
      const event = {
        ...validEvent,
        startDateTime: new Date('2026-01-15T10:00:00'),
        endDateTime: new Date('2026-01-15T10:00:00'),
      };
      const result = validateEvent(event);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'endDateTime',
        message: 'End time must be after start time',
      });
    });
  });

  describe('past date warning', () => {
    it('returns warning when start date is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const event = {
        ...validEvent,
        startDateTime: pastDate,
        endDateTime: new Date(pastDate.getTime() + 3600000),
      };
      const result = validateEvent(event);
      expect(result.isValid).toBe(true); // Still valid, just a warning
      expect(result.warnings).toContainEqual({
        field: 'startDateTime',
        message: 'Event start time is in the past',
      });
    });

    it('returns no warning when start date is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const event = {
        ...validEvent,
        startDateTime: futureDate,
        endDateTime: new Date(futureDate.getTime() + 3600000),
      };
      const result = validateEvent(event);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('multiple errors', () => {
    it('returns all errors when multiple fields are invalid', () => {
      const event = {
        ...validEvent,
        title: '',
        startDateTime: new Date('2026-01-15T11:00:00'),
        endDateTime: new Date('2026-01-15T10:00:00'),
      };
      const result = validateEvent(event);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
