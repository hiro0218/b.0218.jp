import { describe, expect, it } from 'vitest';
import { convertDateToSimpleFormat } from '@/lib/utils/date';
import { getDateAndUpdatedToSimpleFormat } from './getDateAndUpdatedToSimpleFormat';

describe('getDateAndUpdatedToSimpleFormat', () => {
  it('should convert date to yyyy-mm-dd format', () => {
    const date = '2023-10-01T00:00:00Z';
    const expectedDate = convertDateToSimpleFormat(new Date(date));
    const result = getDateAndUpdatedToSimpleFormat(date);
    expect(result.date).toBe(expectedDate);
    expect(result.updated).toBeUndefined();
  });

  it('should convert both date and updated to yyyy-mm-dd format', () => {
    const date = '2023-10-01T00:00:00Z';
    const updated = '2023-10-02T00:00:00Z';
    const expectedDate = convertDateToSimpleFormat(new Date(date));
    const expectedUpdated = convertDateToSimpleFormat(new Date(updated));
    const result = getDateAndUpdatedToSimpleFormat(date, updated);
    expect(result.date).toBe(expectedDate);
    expect(result.updated).toBe(expectedUpdated);
  });

  it('should handle invalid date formats gracefully', () => {
    const date = 'invalid-date';
    const updated = 'invalid-updated';
    const result = getDateAndUpdatedToSimpleFormat(date, updated);
    expect(result.date).toBe('Invalid Date');
    expect(result.updated).toBe('Invalid Date');
  });
});
