import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

const NAME = 'Alice';
const SRC = 'https://example.com/alice.png';

describe('Avatar', () => {
  it('src がある場合、画像を表示する', () => {
    const { container } = render(<Avatar name={NAME} src={SRC} />);
    const img = container.querySelector('img');

    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe(SRC);
    expect(screen.queryByText('A')).toBeNull();
  });

  it('src が無い場合、イニシャルを表示する', () => {
    const { container } = render(<Avatar name={NAME} src={null} />);

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('A')).not.toBeNull();
  });

  it('画像の読み込みに失敗した場合、イニシャルへ切り替える', () => {
    const { container } = render(<Avatar name={NAME} src={SRC} />);
    const img = container.querySelector('img');

    act(() => {
      img?.dispatchEvent(new Event('error'));
    });

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('A')).not.toBeNull();
  });

  it('size を指定した場合、width/height に反映する', () => {
    const { container } = render(<Avatar name={NAME} size={48} src={SRC} />);
    const img = container.querySelector('img');

    expect(img?.getAttribute('width')).toBe('48');
    expect(img?.getAttribute('height')).toBe('48');
  });
});
