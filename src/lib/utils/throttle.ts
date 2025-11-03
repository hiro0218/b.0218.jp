type Procedure = (...args: unknown[]) => void;

function throttle<T extends Procedure>(callback: T): T {
  let isScheduled = false;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (!isScheduled) {
      isScheduled = true;
      window.requestAnimationFrame(() => {
        callback.apply(this, args);
        isScheduled = false;
      });
    }
  } as unknown as T;
}

export default throttle;
