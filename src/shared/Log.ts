import { cyan, red, yellow } from 'picocolors';

const prefixes = {
  error: `${red('error')} -`,
  warn: `${yellow('warn')}  -`,
  info: `${cyan('info')}  -`,
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
