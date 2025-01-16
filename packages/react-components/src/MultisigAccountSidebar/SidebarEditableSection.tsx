// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect } from 'react';

import { useAccountInfo } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import AccountMenuButtons from './AccountMenuButtons.js';
import AddressSection from './AddressSection.js';

interface Props {
  accountIndex: string | undefined;
  address: string;
  isBeingEdited: (arg: boolean) => void;
  onUpdateName?: (() => void) | null;
  sidebarRef: React.RefObject<HTMLDivElement>;
  // toggleProxyOverview: () => void;
}

function SidebarEditableSection ({ accountIndex, address, isBeingEdited, onUpdateName }: Props): React.ReactElement<Props> {
  const { flags, isEditing, isEditingName, name, onForgetAccount, onForgetAddress, onSaveName, onSaveTags, setIsEditingName, setIsEditingTags, setName, setTags, toggleIsEditingName, toggleIsEditingTags } = useAccountInfo(address);

  useEffect((): void => {
    isBeingEdited(isEditing());
  }, [isBeingEdited, isEditing]);

  const onCancel = useCallback(
    (): void => {
      if (isEditing()) {
        try {
          const accountOrAddress = keyring.getAccount(address) || keyring.getAddress(address);

          setName(accountOrAddress?.meta.name || '');
          setTags(accountOrAddress?.meta.tags ? (accountOrAddress.meta.tags).sort() : []);
          setIsEditingName(false);
          setIsEditingTags(false);
        } catch {
          // ignore
        }
      }
    }, [isEditing, setName, setTags, setIsEditingName, setIsEditingTags, address]);

  return (
    <>
      <AddressSection
        accountIndex={accountIndex}
        defaultValue={name}
        editingName={isEditingName}
        flags={flags}
        onChange={setName}
        value={address}
      />
      <AccountMenuButtons
        flags={flags}
        isEditing={isEditing()}
        isEditingName={isEditingName}
        onCancel={onCancel}
        onForgetAccount={onForgetAccount}
        onForgetAddress={onForgetAddress}
        onSaveName={onSaveName}
        onSaveTags={onSaveTags}
        onUpdateName={onUpdateName}
        recipientId={address}
        toggleIsEditingName={toggleIsEditingName}
        toggleIsEditingTags={toggleIsEditingTags}
        // toggleProxyOverview={toggleProxyOverview}
      />
    </>
  );
}

export default React.memo(SidebarEditableSection);
