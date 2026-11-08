import { css } from '@/ui/styled';

// Stack にしない。Stack の gap は段の数値だけで、余白の役割 section（幅によって 64 → 96 に変わる）を渡せないため
export const pageSections = css`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-section);
`;
