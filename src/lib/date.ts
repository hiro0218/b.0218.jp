const isInvalidDate = (date: Date) => {
  return Number.isNaN(date.getTime());
};

export const convertDateToSimpleFormat = (date: Date): string => {
  if (isInvalidDate(date)) {
    return '';
  }

  const formatter = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(date);
};

export const isSameDay = (dateA: Date, dateB: Date) => {
  if (isInvalidDate(dateB)) {
    return false;
  }

  return dateA.toLocaleDateString() === dateB.toLocaleDateString();
};
