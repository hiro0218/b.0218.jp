import * as Log from '@/lib/Log';

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export function handleError(error: unknown, message?: string): void {
  if (error instanceof TypeError) {
    Log.error('Fetch Error:', error.message, message);
  } else if (error instanceof DOMException) {
    if (error.name === 'TimeoutError') {
      Log.error('Timeout Error:', error.message, message);
    } else {
      Log.error('Abort Error:', error.message, message);
    }
  } else if (error instanceof NetworkError) {
    Log.error('Network Error:', error.message, message);
  } else if (error instanceof SyntaxError) {
    Log.error('JSON Error:', error.message, message);;
  } else {
    Log.error('Occurred unexpected error:', error.toString(), message);
  }
}
