const isInvalidDate = (date: Date): boolean => {
  return Number.isNaN(date.getTime());
};

const formatDateParts = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const convertDateToSimpleFormat = (date: Date): string => {
  if (isInvalidDate(date)) {
    return 'Invalid Date';
  }

  /**
   * @workaround パフォーマンスコストが高い場合があるため、toLocaleDateStringの使用を避けている
   * ```typescript
   * return date.toLocaleDateString('ja-JP', {
   *  year: 'numeric',
   *  month: '2-digit',
   *  day: '2-digit',
   * });
   * ```
   */
  return formatDateParts(date);
};

const isSameDateParts = (dateA: Date, dateB: Date): boolean => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

export const isSameDay = (dateA: Date, dateB: Date): boolean => {
  if (isInvalidDate(dateA) || isInvalidDate(dateB)) {
    return false;
  }

  /**
   * @workaround パフォーマンスコストが高い場合があるため、toLocaleDateStringの使用を避けている
   * ```typescript
   * return dateA.toLocaleDateString() === dateB.toLocaleDateString();
   * ```
   */
  return isSameDateParts(dateA, dateB);
};
