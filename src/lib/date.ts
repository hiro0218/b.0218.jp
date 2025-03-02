const isInvalidDate = (date: Date): boolean => {
  return Number.isNaN(date.getTime());
};

export const convertDateToSimpleFormat = (date: Date): string => {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const isSameDay = (dateA: Date, dateB: Date): boolean => {
  if (isInvalidDate(dateA) || isInvalidDate(dateB)) {
    return false;
  }

  return dateA.toLocaleDateString() === dateB.toLocaleDateString();
};
