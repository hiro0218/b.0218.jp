import { useMemo } from 'react';

import { SearchButton as Button } from './SearchButton';
import { SearchDialog as Dialog } from './SearchDialog';
import { useDialog } from './useDialog';

export const useSearch = () => {
  const { ref, isLocked, openDialog, closeDialog } = useDialog();

  const SearchButton = useMemo(() => <Button openDialog={openDialog} />, [openDialog]);
  const SearchDialog = useMemo(
    () => <Dialog closeDialog={closeDialog} isActive={isLocked} ref={ref} />,
    [ref, isLocked, closeDialog],
  );

  return {
    SearchButton,
    SearchDialog,
  };
};
