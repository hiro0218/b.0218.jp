import { styled } from '@/ui/styled';

// 親の gap は使わず、margin-top で本文との間隔を持つ。本文の下の余白（広告の group など）と相殺し、大きい方だけが残るため
export const PostActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-400);
  margin-top: var(--spacing-600);
`;
