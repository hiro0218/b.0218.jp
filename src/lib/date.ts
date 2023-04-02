const isInvalidDate = (date: Date) => {
  return Number.isNaN(date.getTime());
};

export const convertDateToSimpleFormat = (date: string): string => {
  return date.split('T')[0].replace(/-/g, '/');
};

export const isSameDay = (dateA: Date, dateB: Date) => {
  if (isInvalidDate(dateB)) {
    return false;
  }

  return dateA.toLocaleDateString() === dateB.toLocaleDateString();
};
