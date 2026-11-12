import { CodeIcon, DesktopIcon, FilesIcon } from '@phosphor-icons/react/ssr';

import type { ReactNode } from 'react';

import type { TagCategoryName } from '@/types/source';
import { ICON_SIZE_XS } from '@/ui/iconSizes';

type CategoryDisplay = {
  label: string;
  icon: ReactNode;
  color: string;
  backgroundColor: string;
};

export const CATEGORIES: Record<TagCategoryName, CategoryDisplay> = {
  development: {
    label: '開発',
    icon: <CodeIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
    color: 'var(--colors-blue-900)',
    backgroundColor: 'var(--colors-blue-100)',
  },
  technology: {
    label: 'テクノロジー',
    icon: <DesktopIcon height={ICON_SIZE_XS} weight="duotone" width={ICON_SIZE_XS} />,
    color: 'var(--colors-green-900)',
    backgroundColor: 'var(--colors-green-100)',
  },
  other: {
    label: 'その他',
    icon: <FilesIcon height={ICON_SIZE_XS} weight="duotone" width={ICON_SIZE_XS} />,
    color: 'var(--colors-gray-800)',
    backgroundColor: 'var(--colors-gray-75)',
  },
};
