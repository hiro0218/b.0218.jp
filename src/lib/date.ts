const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const isInvalidDate = (date: Date) => {
  return Number.isNaN(date.getTime());
};

export const convertDateToSimpleFormat = (date: Date): string => {
  if (isInvalidDate(date)) {
    return '';
  }

  return dateFormatter.format(date);
};

export const isSameDay = (dateA: Date, dateB: Date) => {
  if (isInvalidDate(dateB)) {
    return false;
  }

  return dateA.toLocaleDateString() === dateB.toLocaleDateString();
};
