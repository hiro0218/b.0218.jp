// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throttle<T extends (...args: any[]) => any>(callback: T): T {
  let scheduled = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...args: any[]) {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(() => {
        callback(...args);
        scheduled = false;
      });
    }
  } as T;
}

export default throttle;
