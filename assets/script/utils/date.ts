/**
 * convertDateToSimpleFormat
 * formatted YYYY/MM/DD
 * @param dateString
 */
export const convertDateToSimpleFormat = (dateString: string): string => {
  let date = '';

  // convert: string -> date
  try {
    if (typeof dateString === 'string') {
      date = new Date(dateString).toISOString();
    }
  } catch (e) {
    console.log(e);
  }

  if (date) {
    date = date.split('T')[0].replace(/-/g, '/');
  }

  return date;
};

/**
 * isSameDate
 * @param date
 * @param updated
 */
export const isSameDate = (date: string, updated: string): boolean => {
  return new Date(date).toDateString() === new Date(updated).toDateString();
};
