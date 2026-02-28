type DebouncedFunction<T extends unknown[]> = ((...args: T) => void) & {
  cancel: () => void;
};

const debounce = <T extends unknown[]>(callback: (...args: T) => unknown, time = 250): DebouncedFunction<T> => {
  let timeout: number | undefined;

  const debounced = (...args: T): void => {
    if (timeout !== undefined) {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => {
      callback(...args);
      timeout = undefined;
    }, time);
  };

  debounced.cancel = () => {
    if (timeout !== undefined) {
      window.clearTimeout(timeout);
      timeout = undefined;
    }
  };

  return debounced;
};

export default debounce;
