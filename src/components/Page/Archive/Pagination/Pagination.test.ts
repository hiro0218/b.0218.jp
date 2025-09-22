import { describe, expect, it } from 'vitest';
import { parsePageNumber } from '../utils/parsePageNumber';

describe('Pagination Input Validation', () => {
  describe('parsePageNumber', () => {
    const totalPages = 10;

    it('should return 1 for null input', () => {
      expect(parsePageNumber(null, 1, totalPages)).toBe(1);
    });

    it('should return 1 for undefined input', () => {
      expect(parsePageNumber(undefined, 1, totalPages)).toBe(1);
    });

    it('should return 1 for empty string', () => {
      expect(parsePageNumber('', 1, totalPages)).toBe(1);
    });

    it('should return 1 for NaN values', () => {
      expect(parsePageNumber('abc', 1, totalPages)).toBe(1);
      expect(parsePageNumber('!@#', 1, totalPages)).toBe(1);
    });

    it('should return 1 for negative values', () => {
      expect(parsePageNumber('-1', 1, totalPages)).toBe(1);
      expect(parsePageNumber('-100', 1, totalPages)).toBe(1);
    });

    it('should return 1 for zero', () => {
      expect(parsePageNumber('0', 1, totalPages)).toBe(1);
    });

    it('should return valid page numbers as-is', () => {
      expect(parsePageNumber('1', 1, totalPages)).toBe(1);
      expect(parsePageNumber('5', 1, totalPages)).toBe(5);
      expect(parsePageNumber('10', 1, totalPages)).toBe(10);
    });

    it('should clamp to totalPages for values exceeding maximum', () => {
      expect(parsePageNumber('11', 1, totalPages)).toBe(10);
      expect(parsePageNumber('100', 1, totalPages)).toBe(10);
      expect(parsePageNumber('999999', 1, totalPages)).toBe(10);
    });

    it('should handle floating point numbers by truncating', () => {
      expect(parsePageNumber('3.14', 1, totalPages)).toBe(3);
      expect(parsePageNumber('5.99', 1, totalPages)).toBe(5);
    });

    it('should handle strings with leading/trailing spaces', () => {
      expect(parsePageNumber(' 5 ', 1, totalPages)).toBe(5);
      expect(parsePageNumber('  1  ', 1, totalPages)).toBe(1);
    });

    it('should handle edge case when totalPages is 1', () => {
      expect(parsePageNumber('5', 1, 1)).toBe(1);
      expect(parsePageNumber('0', 1, 1)).toBe(1);
      expect(parsePageNumber('-1', 1, 1)).toBe(1);
    });
  });
});
