export function deepFreeze<T>(obj: T): Readonly<T> {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const propNames = Object.getOwnPropertyNames(obj);

  for (const name of propNames) {
    const value = (obj as unknown)[name];
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}
