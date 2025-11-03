import * as Log from '~/tools/logger';

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

class AbortError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AbortError';
  }
}

export function handleError(error: unknown, message?: string): void {
  let errorMessage: string;
  let errorType: string;

  switch (true) {
    case error instanceof TypeError:
      errorType = 'Fetch Error';
      errorMessage = error.message;
      break;
    case error instanceof TimeoutError:
      errorType = 'Timeout Error';
      errorMessage = error.message;
      break;
    case error instanceof AbortError:
      errorType = 'Abort Error';
      errorMessage = error.message;
      break;
    case error instanceof NetworkError:
      errorType = 'Network Error';
      errorMessage = error.message;
      break;
    default:
      errorType = 'Occurred unexpected error';
      errorMessage = String(error);
      break;
  }

  Log.error(`${errorType}:`, errorMessage, message);
}
