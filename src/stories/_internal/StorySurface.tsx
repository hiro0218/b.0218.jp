import type { CSSProperties, ReactNode } from 'react';

type StorySurfaceLayout = 'centered' | 'fullscreen' | 'padded' | string;

type StoryWidthProps = {
  children: ReactNode;
  inlineSize?: string;
  maxInlineSize?: string;
};

type StoryStackProps = {
  children: ReactNode;
  gap?: CSSProperties['gap'];
  style?: CSSProperties;
};

type StoryGridProps = StoryStackProps & {
  minItemWidth?: string;
};

type StoryFrameProps = {
  title: string;
  caption?: string;
  inlineSize?: string;
  children: ReactNode;
};

const stackStyle: CSSProperties = {
  display: 'grid',
  alignItems: 'start',
};

const frameHeadingStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-sizes-sm)',
  fontWeight: 'var(--font-weights-bold)',
  lineHeight: 'var(--line-heights-sm)',
  color: 'var(--colors-gray-1000)',
  textWrap: 'balance',
};

const frameCaptionStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-sizes-xs)',
  lineHeight: 'var(--line-heights-md)',
  color: 'var(--colors-gray-900)',
  textWrap: 'pretty',
};

export const storybookBaseStyles = `
  [data-storybook-surface] h2 {
    font-size: var(--font-sizes-h4);
    font-weight: var(--font-weights-bolder);
    line-height: var(--line-heights-sm);
    margin: 0;
  }
  [data-storybook-surface] h3 {
    font-size: var(--font-sizes-h6);
    font-weight: var(--font-weights-bold);
    line-height: var(--line-heights-sm);
    margin: 0;
  }
  [data-storybook-surface] code {
    font-family: var(--fonts-family-monospace);
    font-size: var(--font-sizes-xs);
  }
`;

export function getStorybookSurfaceStyle(layout: StorySurfaceLayout): CSSProperties {
  if (layout === 'fullscreen') {
    return { minHeight: '100vh', padding: 0 };
  }
  if (layout === 'centered') {
    return { padding: 'var(--spacing-3)' };
  }
  return { padding: 'var(--spacing-4)' };
}

export function StoryWidth({ children, inlineSize = '100%', maxInlineSize }: StoryWidthProps) {
  return (
    <div
      style={{
        inlineSize: inlineSize === '100%' ? '100%' : `min(${inlineSize}, 100%)`,
        maxInlineSize,
        marginInline: 'auto',
      }}
    >
      {children}
    </div>
  );
}

export function StoryStack({ children, gap = 'var(--spacing-3)', style }: StoryStackProps) {
  return <div style={{ ...stackStyle, gap, ...style }}>{children}</div>;
}

export function StoryGrid({ children, gap = 'var(--spacing-3)', minItemWidth = '18rem', style }: StoryGridProps) {
  return (
    <div
      style={{
        ...stackStyle,
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minItemWidth}, 100%), 1fr))`,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function StoryFrame({ title, caption, inlineSize, children }: StoryFrameProps) {
  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-1)', minInlineSize: 0 }}>
      <header style={{ display: 'grid', gap: 'var(--spacing-½)' }}>
        <h3 style={frameHeadingStyle}>{title}</h3>
        {caption ? <p style={frameCaptionStyle}>{caption}</p> : null}
      </header>
      <div
        style={{
          inlineSize: inlineSize ? `min(${inlineSize}, 100%)` : '100%',
          maxInlineSize: '100%',
        }}
      >
        {children}
      </div>
    </section>
  );
}
