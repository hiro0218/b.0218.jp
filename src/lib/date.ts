/**
 * convertDateToSimpleFormat
 * formatted YYYY/MM/DD
 * @param dateString
 */
export const convertDateToSimpleFormat = (dateString: string): string => {
  return dateString.split('T')[0].replace(/-/g, '/');
};

export const isSameDay = (dateA: Date, dateB: Date) => {
  return dateA.toLocaleDateString() === dateB.toLocaleDateString();
};
