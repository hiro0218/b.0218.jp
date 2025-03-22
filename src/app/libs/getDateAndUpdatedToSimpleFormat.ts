import { convertDateToSimpleFormat } from '@/lib/date';

type ReturnType = {
  date: string;
  updated?: string;
};

/**
 * 日付と更新日を yyyy-mm-dd の形式に変換
 */
export const getDateAndUpdatedToSimpleFormat = (date: string, updated?: string): ReturnType => {
  return {
    // date を yyyy-mm-dd の形式に変換
    date: convertDateToSimpleFormat(new Date(date)),
    // updated が存在する場合、yyyy-mm-dd の形式に変換
    ...(updated && { updated: convertDateToSimpleFormat(new Date(updated)) }),
  };
};
