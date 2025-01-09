import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { SITE_NAME } from '@/constant';
import { styled } from '@/ui/styled/dynamic';

export const Logo = () => {
  return (
    <Anchor className="link-style link-style--hover-effect" href="/" prefetch={false}>
      <img src="/logo.v2.svg" alt={SITE_NAME} height="25" width="80" />
    </Anchor>
  );
};

const Anchor = styled(_Anchor)`
  display: flex;
  align-items: center;
  padding: var(--space-1);
  pointer-events: auto;
`;
