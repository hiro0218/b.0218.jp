import { useMemo } from 'react';

import { SearchHeader } from './SearchHeader';
import { usePostsList } from './usePostsList';
import { useSearchData } from './useSearchData';

type Props = {
  closeDialog: () => void;
};

export const useSearchHeader = ({ closeDialog }: Props) => {
  const archives = usePostsList();
  const { searchData, onKeyup } = useSearchData(archives, closeDialog);
  const SearchHeaderComponent = useMemo(() => <SearchHeader onKeyup={onKeyup} />, [onKeyup]);

  return {
    SearchHeader: SearchHeaderComponent,
    searchData,
  };
};
