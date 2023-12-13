import { convertDateToSimpleFormat, isSameDay } from './date';

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
