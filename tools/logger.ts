import { styleText } from 'node:util';

const prefixes = {
  error: `${styleText('red', 'error')} -`,
  warn: `${styleText('yellow', 'warn')}  -`,
  info: `${styleText('cyan', 'info')}  -`,
};

export function error(...message: string[]): void {
  console.error(prefixes.error, ...message);
}

export function warn(...message: string[]): void {
  console.warn(prefixes.warn, ...message);
}

export function info(...message: string[]): void {
  console.log(prefixes.info, ...message);
}
