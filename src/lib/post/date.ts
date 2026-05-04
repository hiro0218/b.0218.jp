import { convertDateToSimpleFormat } from '@/lib/utils/date';

export type DateAndUpdatedSimpleFormat = {
  date: string;
  updated?: string;
};

export const getDateAndUpdatedToSimpleFormat = (date: string, updated?: string): DateAndUpdatedSimpleFormat => {
  return {
    date: convertDateToSimpleFormat(new Date(date)),
    ...(updated && { updated: convertDateToSimpleFormat(new Date(updated)) }),
  };
};
