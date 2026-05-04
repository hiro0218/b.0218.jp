import { CodeBracketIcon, ComputerDesktopIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

import type { TagCategoryName } from '@/types/source';
import { ICON_SIZE_XS } from '@/ui/iconSizes';

export const CATEGORY_LABELS: Record<TagCategoryName, string> = {
  development: '開発',
  technology: 'テクノロジー',
  other: 'その他',
};

export const CATEGORY_ICONS: Record<TagCategoryName, ReactNode> = {
  development: <CodeBracketIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
  technology: <ComputerDesktopIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
  other: <DocumentTextIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />,
};
