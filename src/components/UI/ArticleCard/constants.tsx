import { CodeIcon, DesktopIcon, FilesIcon } from '@phosphor-icons/react/ssr';

import type { ReactNode } from 'react';

import type { TagCategoryName } from '@/types/source';
import { ICON_SIZE_XS } from '@/ui/iconSizes';

export const CATEGORY_LABELS: Record<TagCategoryName, string> = {
  development: '開発',
  technology: 'テクノロジー',
  other: 'その他',
};

export const CATEGORY_ICONS: Record<TagCategoryName, ReactNode> = {
  development: <CodeIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
  technology: <DesktopIcon height={ICON_SIZE_XS} weight="duotone" width={ICON_SIZE_XS} />,
  other: <FilesIcon height={ICON_SIZE_XS} weight="duotone" width={ICON_SIZE_XS} />,
};
