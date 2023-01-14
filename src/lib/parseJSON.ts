export const parseJSON = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};
