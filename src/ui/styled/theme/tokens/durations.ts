import type { TokenValues } from './types';

const durationValues: TokenValues<'durations'> = {
  fast: { value: '0.1s' },
  normal: { value: '0.15s' },
  slow: { value: '0.2s' },
  slower: { value: '0.3s' },
  slowest: { value: '0.4s' },
};

export default durationValues;
