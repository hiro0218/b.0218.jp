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
export const isSameDate = (date: string, updated: string | null): boolean => {
  // 日付が入っていない場合は同日
  if (!updated) {
    return true;
  }

  return new Date(date).toDateString() === new Date(updated).toDateString();
};
