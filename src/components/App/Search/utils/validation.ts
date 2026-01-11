export const isEmptyQuery = (query: string | undefined | null): boolean => {
  return !query?.trim();
};
