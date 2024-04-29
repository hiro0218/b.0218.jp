const debounce = <T>(callback: (...args: T[]) => unknown, time = 250) => {
  let timeout: number;
  return (...args: T[]) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => callback(...args), time);
  };
};

export default debounce;
