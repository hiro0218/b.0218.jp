import { convertDateToSimpleFormat, convertToISO8601WithTimezone, isSameDay } from './date';

describe('Date Utility Functions', () => {
  describe('convertDateToSimpleFormat', () => {
    it('should convert a date string with format "yyyy-mm-ddThh:mm:ss" to "yyyy/mm/dd"', () => {
      const date = new Date('2022-01-01T10:30:00');
      expect(convertDateToSimpleFormat(date)).toBe('2022/01/01');
    });
  });

  describe('isSameDay', () => {
    it('should return true if two dates are on the same day', () => {
      const dateA = new Date('2022-01-01T10:30:00');
      const dateB = new Date('2022-01-01T22:30:00');
      expect(isSameDay(dateA, dateB)).toBe(true);
    });

    it('should return false if one of the dates is invalid', () => {
      const dateA = new Date('2022-01-01T10:30:00');
      const dateB = new Date('invalid date');
      expect(isSameDay(dateA, dateB)).toBe(false);
    });

    it('should return false if two dates are not on the same day', () => {
      const dateA = new Date('2022-01-01T10:30:00');
      const dateB = new Date('2022-01-02T22:30:00');
      expect(isSameDay(dateA, dateB)).toBe(false);
    });
  });

  describe('convertToISO8601WithTimezone', () => {
    it('should convert date-only string to ISO 8601 with timezone', () => {
      expect(convertToISO8601WithTimezone('2025-12-13')).toBe('2025-12-13T00:00:00+09:00');
    });

    it('should convert datetime string to ISO 8601 with timezone', () => {
      expect(convertToISO8601WithTimezone('2025-12-13T10:30:00')).toBe('2025-12-13T10:30:00+09:00');
    });

    it('should return as-is if timezone already present', () => {
      expect(convertToISO8601WithTimezone('2025-12-13T10:30:00+09:00')).toBe('2025-12-13T10:30:00+09:00');
      expect(convertToISO8601WithTimezone('2025-12-13T10:30:00Z')).toBe('2025-12-13T10:30:00Z');
    });

    it('should use custom timezone when provided', () => {
      expect(convertToISO8601WithTimezone('2025-12-13', '-05:00')).toBe('2025-12-13T00:00:00-05:00');
    });

    it('should handle invalid date gracefully', () => {
      expect(convertToISO8601WithTimezone('invalid-date')).toBe('invalid-date');
    });
  });
});
