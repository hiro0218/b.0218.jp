const isInvalidDate = (date: Date) => {
  return Number.isNaN(date.getTime());
};

export const convertDateToSimpleFormat = (date: Date): string => {
  if (isInvalidDate(date)) {
    return '';
  }

  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}/${month}/${day}`;
};

export const isSameDay = (dateA: Date, dateB: Date) => {
  if (isInvalidDate(dateB)) {
    return false;
  }

  return dateA.toLocaleDateString() === dateB.toLocaleDateString();
};
