import { Title } from '@/components/UI/Title';
import { AUTHOR } from '@/constant';
import { mobile } from '@/lib/mediaQuery';
import { styled } from '@/ui/styled';

const ICON_SIZE = 128;

export const Hero = () => {
  return (
    <Container>
      <Avatar>
        <img src={AUTHOR.ICON_LOCAL} height={ICON_SIZE} width={ICON_SIZE} alt="" />
      </Avatar>
      <Title
        heading="Hello, I'm hiro."
        paragraph="I was a web backend developer and native app developer. Currently I am a web frontend developer."
      />
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  gap: 1rem;
`;

const Avatar = styled.div`
  flex-shrink: 0;
  width: ${ICON_SIZE}px;

  ${mobile} {
    width: ${ICON_SIZE / 1.6}px;
  }

  img {
    border: 5px solid var(--backgrounds-1);
    border-radius: 100%;
  }
`;
