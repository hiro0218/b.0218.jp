/**
 * PostContent のブロック間フロー余白。隣接ブロックの関係を 3 トーンで差別化する。
 * 見出し直結 (heading-tight, 詰める) < 本文リズム (reading, 既定) < ブロック隔離 (reference / navigation / section, 広げる)。
 * 一律 spacing にすると Use intent が平坦化し、階層感 (見出し) とコードの隔離感がともに弱まるため、用途ごとに分ける。
 */
const semanticSpacing = {
  'post-content-flow-heading-tight': { value: { base: '{spacing.300}' } },
  'post-content-flow-reading': { value: { base: '{spacing.400}' } },
  'post-content-flow-reference': { value: { base: '{spacing.600}' } },
  'post-content-flow-navigation': { value: { base: '{spacing.600}' } },
  'post-content-flow-section': { value: { base: '{spacing.600}' } },
};

export default semanticSpacing;
