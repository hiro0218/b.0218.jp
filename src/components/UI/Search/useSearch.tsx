import { ComponentProps, useMemo } from 'react';

import { SearchButton as Button, SearchDialog as Dialog } from '@/components/UI/Search';

type ButtonProps = ComponentProps<typeof Button>;
type DialogProps = ComponentProps<typeof Dialog>;

type Props = {
  refModal: DialogProps['ref'];
  isActive: DialogProps['isActive'];
  openDialog: ButtonProps['openDialog'];
  closeDialog: DialogProps['closeDialog'];
};

export const useSearch = ({ refModal, isActive, openDialog, closeDialog }: Props) => {
  const SearchButton = useMemo(() => <Button openDialog={openDialog} />, [openDialog]);
  const SearchDialog = useMemo(
    () => <Dialog closeDialog={closeDialog} isActive={isActive} ref={refModal} />,
    [refModal, isActive, closeDialog],
  );

  return {
    SearchButton,
    SearchDialog,
  };
};
