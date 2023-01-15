import { useMemo } from 'react';

import { SearchButton as Button, SearchDialog as Dialog } from '@/components/UI/Search';
import { useDialog } from '@/components/UI/Search/useDialog';

type DialogProps = ReturnType<typeof useDialog>;

type Props = {
  refModal: DialogProps['ref'];
  openDialog: DialogProps['openDialog'];
  closeDialog: DialogProps['closeDialog'];
};

export const useSearch = ({ refModal, openDialog, closeDialog }: Props) => {
  const SearchButton = useMemo(() => <Button openDialog={openDialog} />, [openDialog]);
  const SearchDialog = useMemo(() => <Dialog ref={refModal} closeDialog={closeDialog} />, [refModal, closeDialog]);

  return {
    SearchButton,
    SearchDialog,
  };
};
