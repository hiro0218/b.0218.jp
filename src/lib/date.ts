const isInvalidDate = (date: Date): boolean => {
  return Number.isNaN(date.getTime());
};

export const convertDateToSimpleFormat = (date: Date): string => {
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
  const formatDateParts = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return formatDateParts(date);
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
  const isSameDateParts = (dateA: Date, dateB: Date): boolean => {
    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  };

  return isSameDateParts(dateA, dateB);
};
