import { styled } from '@/ui/styled';

// 行どうしの間隔は、一律の row-gap にしない。余白の役割が、ヘッダー → 本文（page）と本文 → フッター（section）で違うため。
// フッターの上の余白は、Footer 自身ではなく配置先のここが持つ（Zero Margin Principle）。
// MainContainer の padding-bottom には持たせない。スキップリンクで main に焦点が当たると、UA の焦点枠が padding の分まで広がるため
export const Layout = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100dvh;

  isolation: isolate;

  > footer {
    margin-top: var(--spacing-section);
  }
`;
