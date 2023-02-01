import { css } from '@/ui/styled';

const TableScroll = css`
  .p-table-scroll {
    position: relative;
    isolation: isolate;
    margin-left: -0.5em;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      border-radius: var(--border-radius-4);
      background-color: var(--backgrounds-2);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: var(--border-radius-4);
      background-color: var(--solid-backgrounds-9);
    }
  }
`;

export default TableScroll;
