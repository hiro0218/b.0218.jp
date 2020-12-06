/**
 * convertDateToSimpleFormat
 * formatted YYYY/MM/DD
 * @param dateString
 */
export const convertDateToSimpleFormat = (dateString: string): string => {
  return dateString.split('T')[0].replace(/-/g, '/');
};

/**
 * isSameDate
 * @param date
 * @param updated
 */
export const isSameDate = (date: string, updated: string): boolean => {
  return new Date(date).toDateString() === new Date(updated).toDateString();
};
