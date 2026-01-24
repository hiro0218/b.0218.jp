import { describe, expect, it } from 'vitest';
import { hasRequiredFrontmatter, isAgentFile } from './utils';

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

describe('hasRequiredFrontmatter', () => {
  it('should return true for valid frontmatter with string date', () => {
    expect(hasRequiredFrontmatter({ title: 'Test', date: '2024-01-01' })).toBe(true);
  });

  it('should return true for valid frontmatter with Date object', () => {
    expect(hasRequiredFrontmatter({ title: 'Test', date: new Date('2024-01-01') })).toBe(true);
  });

  it('should return false for missing title', () => {
    expect(hasRequiredFrontmatter({ date: '2024-01-01' })).toBe(false);
  });

  it('should return false for missing date', () => {
    expect(hasRequiredFrontmatter({ title: 'Test' })).toBe(false);
  });

  it('should return false for empty title', () => {
    expect(hasRequiredFrontmatter({ title: '  ', date: '2024-01-01' })).toBe(false);
  });

  it('should return false for empty date', () => {
    expect(hasRequiredFrontmatter({ title: 'Test', date: '' })).toBe(false);
  });

  it('should return false for null data', () => {
    expect(hasRequiredFrontmatter(null)).toBe(false);
  });

  it('should return false for undefined data', () => {
    expect(hasRequiredFrontmatter(undefined)).toBe(false);
  });
});
