import { css } from '@/ui/styled';

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
      background-color: var(--backgrounds-2);
      border-radius: var(--border-radius-4);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--solid-backgrounds-9);
      border-radius: var(--border-radius-4);
    }
  }
`;

export default TableScroll;
