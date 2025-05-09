import { css, styled } from '@/ui/styled/static';

export const styleTimelineContainer = css`
  --vertical-space: var(--space-3);
  --columns-1: 12%;
  --columns-2: 8%;
  --year-heading-height: var(--space-5);
  --year-heading-circle-color: var(--color-gray-8);
  --year-heading-separator-size: var(--space-2);
  --year-post-separator-size-h: var(--space-1);
  --year-post-separator-size-w: var(--space-1);
  --year-post-separator-color: var(--color-gray-7);
  --year-post-separator-border-radius: var(--border-radius-full);

  position: relative;

  /* Separator */
  &::before {
    position: absolute;
    inset: 0;
    left: calc(var(--columns-1) + var(--columns-2) / 2);
    z-index: -1;
    width: 2px;
    margin-top: var(--vertical-space);
    pointer-events: none;
    content: '';
    background-color: var(--color-gray-7);
    transform: translateX(-50%);
  }

  /* circle */
  &::after {
    position: absolute;
    inset: 0;
    top: var(--vertical-space);
    left: calc(var(--columns-1) + var(--columns-2) / 2);
    z-index: 1;
    display: block;
    width: var(--year-heading-separator-size);
    height: var(--year-heading-separator-size);
    content: '';
    background-color: var(--white);
    border: 4px solid var(--year-heading-circle-color);
    border-radius: var(--border-radius-full);
    transform: translateX(-50%);
    transition: background-color 0.15s var(--easing-ease-out);
  }

  &:hover {
    --year-heading-circle-color: var(--color-accent-10);
  }
`;

export const YearHeader = styled.div`
  display: grid;
  grid-template-rows: repeat(1, 1fr);
  grid-template-columns: var(--columns-1) var(--columns-2) 1fr;
  align-items: center;
  height: var(--year-heading-height);
`;

export const YearHeaderTitle = styled.h2`
  padding-left: var(--space-1);
  font-size: var(--font-size-h3);
`;

export const YearHeaderPostCount = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-gray-10);
  text-align: right;
`;

export const YearPosts = styled.div`
  margin-top: var(--space-1);
`;

export const styleYearPostAnchor = css`
  position: relative;
  display: grid;
  grid-template-rows: repeat(1, 1fr);
  grid-template-columns: var(--columns-1) var(--columns-2) 1fr;
  align-items: center;
  width: 100%;
  padding-block: var(--space-1);
  border-radius: var(--border-radius-8);

  &:hover {
    background-color: var(--color-gray-3A);

    --year-post-separator-size-h: var(--space-3);
    --year-post-separator-size-w: var(--space-1);
    --year-post-separator-color: var(--color-accent-10);
    --year-post-separator-border-radius: var(--border-radius-8);
  }

  &:active {
    background-color: var(--color-gray-4A);
  }
`;

export const YearPostDate = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-gray-10);
  text-align: center;
`;

export const YearPostSeparator = styled.span`
  width: var(--year-post-separator-size-w);
  height: var(--year-post-separator-size-h);
  margin: auto;
  background-color: var(--year-post-separator-color);
  border-radius: var(--year-post-separator-border-radius);
  transition: all 0.15s var(--easing-ease-out);
`;
