// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throttle<T extends (...args: any[]) => any>(callback: T): T {
  let isScheduled = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...args: any[]) {
    if (!isScheduled) {
      isScheduled = true;
      window.requestAnimationFrame(() => {
        callback(...args);
        isScheduled = false;
      });
    }
  } as T;
}

export default throttle;
