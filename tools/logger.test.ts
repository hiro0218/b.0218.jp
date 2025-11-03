import { cyan, red, yellow } from 'picocolors';
import { error, info, warn } from './logger';

describe('Log functions', () => {
  it('should log error messages with the correct prefix', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const message = 'This is an error message';
    error(message);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`${red('error')} -`, message);
    consoleErrorSpy.mockRestore();
  });

  it('should log warning messages with the correct prefix', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const message = 'This is a warning message';
    warn(message);
    expect(consoleWarnSpy).toHaveBeenCalledWith(`${yellow('warn')}  -`, message);
    consoleWarnSpy.mockRestore();
  });

  it('should log info messages with the correct prefix', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const message = 'This is an info message';
    info(message);
    expect(consoleLogSpy).toHaveBeenCalledWith(`${cyan('info')}  -`, message);
    consoleLogSpy.mockRestore();
  });
});
