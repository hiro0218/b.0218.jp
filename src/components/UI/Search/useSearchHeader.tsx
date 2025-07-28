import { useMemo } from 'react';

import { SearchHeader } from './SearchHeader';
import type { onCloseDialogProps } from './type';
import { usePostsList } from './usePostsList';
import { useSearchData } from './useSearchData';

type Props = {
  closeDialog: onCloseDialogProps;
};

export const useSearchHeader = ({ closeDialog }: Props) => {
  const archives = usePostsList();
  const { searchData, onKeyup, setResultRef } = useSearchData(archives, closeDialog);
  const SearchHeaderComponent = useMemo(() => <SearchHeader onKeyupAction={onKeyup} />, [onKeyup]);

  return {
    // biome-ignore lint/style/useNamingConvention: ComponentなのでUpperCamelにする
    SearchHeader: SearchHeaderComponent,
    searchData,
    setResultRef,
  };
};
