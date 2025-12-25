export const isEmptyQuery = (query: string | undefined | null): boolean => {
  return !query?.trim();
};

/**
 * Type guard for filtering out null, undefined, empty strings, and empty arrays
 *
 * Enables TypeScript to narrow the type from `T | null | undefined` to `T`
 */
export const isValidValue = <T>(value: T | null | undefined): value is T => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
};
