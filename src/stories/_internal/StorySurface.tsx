import type { CSSProperties, ReactNode } from 'react';

import { css } from '@/ui/styled';

type StorySurfaceLayout = 'centered' | 'fullscreen' | 'padded';

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
  label?: string;
  title: string;
  caption?: string;
  inlineSize?: string;
  children: ReactNode;
};

type SpecimenHeaderProps = {
  componentTitle: string;
  storyName: string;
  layout: StorySurfaceLayout;
  storyId?: string;
};

const KNOWN_LAYOUTS: readonly StorySurfaceLayout[] = ['centered', 'fullscreen', 'padded'];

export function normalizeLayout(value: unknown): StorySurfaceLayout {
  return KNOWN_LAYOUTS.find((known) => known === value) ?? 'padded';
}

const stackStyle: CSSProperties = {
  display: 'grid',
  alignItems: 'start',
};

export const storySurfaceClass = css`
  font-family: var(--fonts-family-sans-serif);
  color: var(--colors-gray-1000);
  background-color: var(--colors-body-background);

  & h2 {
    margin: 0;
    font-size: var(--font-sizes-h4);
    font-weight: var(--font-weights-bolder);
    line-height: var(--line-heights-sm);
  }

  & h3 {
    margin: 0;
    font-size: var(--font-sizes-h6);
    font-weight: var(--font-weights-bold);
    line-height: var(--line-heights-sm);
  }
`;

const specimenMetaClass = css`
  font-family: var(--fonts-family-monospace);
  font-size: var(--font-sizes-xs);
  line-height: var(--line-heights-xs);
  color: var(--colors-gray-800);
  text-transform: lowercase;
  letter-spacing: var(--letter-spacings-sm);
`;

const specimenStoryNameStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-sizes-md)',
  fontWeight: 'var(--font-weights-bolder)',
  letterSpacing: 'var(--letter-spacings-sm)',
  color: 'var(--colors-gray-1000)',
  textTransform: 'none',
};

const specimenComponentNameStyle: CSSProperties = {
  color: 'var(--colors-gray-1000)',
  textTransform: 'none',
};

const specimenMetaRowStyle: CSSProperties = {
  margin: 0,
  display: 'flex',
  gap: '0.75ch',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const storyFrameMetaRowStyle: CSSProperties = {
  ...specimenMetaRowStyle,
  alignItems: 'baseline',
};

const storyFrameTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-sizes-sm)',
  fontWeight: 'var(--font-weights-bold)',
  lineHeight: 'var(--line-heights-sm)',
  color: 'var(--colors-gray-1000)',
  textWrap: 'balance',
};

const storyFrameCaptionStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--font-sizes-xs)',
  lineHeight: 'var(--line-heights-md)',
  color: 'var(--colors-gray-900)',
  textWrap: 'pretty',
};

export function getStorybookSurfaceStyle(layout: StorySurfaceLayout): CSSProperties {
  if (layout === 'fullscreen') {
    return { minBlockSize: '100vh', padding: 0 };
  }
  return {
    minBlockSize: '100vh',
    padding: 'var(--spacing-4)',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
  };
}

export function StoryCenteredFrame({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', placeItems: 'center' }}>{children}</div>;
}

export function StorySpecimenHeader({ componentTitle, storyName, layout, storyId }: SpecimenHeaderProps) {
  if (layout === 'fullscreen') return null;

  const [scope, ...rest] = componentTitle.split('/');
  const component = rest.join(' / ');
  const storyExportId = storyId?.includes('--') ? storyId.split('--').at(-1) : undefined;

  return (
    <div
      style={{
        display: 'grid',
        gap: '6px',
        paddingBlockEnd: 'var(--spacing-2)',
        marginBlockEnd: 'var(--spacing-3)',
        borderBlockEnd: '1px solid var(--colors-gray-300)',
      }}
    >
      <p className={specimenMetaClass} style={specimenMetaRowStyle}>
        <span>{scope.toLowerCase()}</span>
        {component ? (
          <>
            <span aria-hidden="true">/</span>
            <span style={specimenComponentNameStyle}>{component}</span>
          </>
        ) : null}
        {storyExportId ? (
          <>
            <span aria-hidden="true">/</span>
            <span>{storyExportId}</span>
          </>
        ) : null}
      </p>
      <p style={specimenStoryNameStyle}>{storyName}</p>
    </div>
  );
}

export function StorySpecimenFooter({ layout }: { layout: StorySurfaceLayout }) {
  if (layout === 'fullscreen') return null;

  return (
    <p
      className={specimenMetaClass}
      style={{
        ...specimenMetaRowStyle,
        marginBlockStart: 'var(--spacing-4)',
        paddingBlockStart: 'var(--spacing-2)',
        borderBlockStart: '1px solid var(--colors-gray-200)',
      }}
    >
      <span>layout</span>
      <span aria-hidden="true">·</span>
      <span style={specimenComponentNameStyle}>{layout}</span>
    </p>
  );
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

export function StoryFrame({ label, title, caption, inlineSize, children }: StoryFrameProps) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--spacing-2)',
        minInlineSize: 0,
        paddingInlineStart: 'var(--spacing-2)',
        borderInlineStart: '2px solid var(--colors-gray-300)',
      }}
    >
      <div style={{ display: 'grid', gap: '4px' }}>
        <div className={specimenMetaClass} style={storyFrameMetaRowStyle}>
          {label ? <span>{label}</span> : null}
          {inlineSize ? (
            <>
              {label ? <span aria-hidden="true">·</span> : null}
              <span>{inlineSize}</span>
            </>
          ) : null}
        </div>
        <p style={storyFrameTitleStyle}>{title}</p>
        {caption ? <p style={storyFrameCaptionStyle}>{caption}</p> : null}
      </div>
      <div
        style={{
          inlineSize: inlineSize ? `min(${inlineSize}, 100%)` : '100%',
          maxInlineSize: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}
