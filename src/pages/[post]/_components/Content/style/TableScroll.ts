import { css } from '@/ui/styled/dynamic';

const TableScroll = css`
  .p-table-scroll {
    position: relative;
    overflow: auto;
    isolation: isolate;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--color-gray-2);
      border-radius: var(--border-radius-4);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-gray-9);
      border-radius: var(--border-radius-4);
    }
  }
`;

export default TableScroll;
