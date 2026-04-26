import { describe, expect, it } from 'vitest';
import { isAgentFile } from './utils';

describe('isAgentFile', () => {
  it('should return true for CLAUDE.md', () => {
    expect(isAgentFile('CLAUDE.md')).toBe(true);
  });

  it('should return true for AGENTS.md', () => {
    expect(isAgentFile('AGENTS.md')).toBe(true);
  });

  it('should be case-insensitive', () => {
    expect(isAgentFile('claude.md')).toBe(true);
    expect(isAgentFile('Agents.MD')).toBe(true);
  });

  it('should return false for legitimate pages', () => {
    expect(isAgentFile('about.md')).toBe(false);
    expect(isAgentFile('privacy.md')).toBe(false);
  });
});
