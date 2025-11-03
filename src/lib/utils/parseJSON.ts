export const parseJSON = <T>(value: string): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};
