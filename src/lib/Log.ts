import { cyan, red, yellow } from 'picocolors';

export const prefixes = {
  error: `${red('error')} -`,
  warn: `${yellow('warn')}  -`,
  info: `${cyan('info')}  -`,
};

export function error(...message: string[]) {
  console.error(prefixes.error, ...message);
}

export function warn(...message: string[]) {
  console.warn(prefixes.warn, ...message);
}

export function info(...message: string[]) {
  console.log(prefixes.info, ...message);
}
