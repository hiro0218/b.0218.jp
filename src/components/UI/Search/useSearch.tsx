import { ComponentProps, useMemo } from 'react';

import { SearchButton as Button, SearchDialog as Dialog } from '@/components/UI/Search';

type ButtonProps = ComponentProps<typeof Button>;
type DialogProps = ComponentProps<typeof Dialog>;

type Props = {
  refModal: DialogProps['ref'];
  openDialog: ButtonProps['openDialog'];
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
