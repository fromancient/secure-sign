// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types.js';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Dropdown } from '@polkadot/react-components';
import { GenericVote } from '@polkadot/types';
import { isBn, isNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Bare from './Bare.js';

interface VoteParts {
  aye: boolean;
  conviction: number;
}

const AYE_MASK = 0b10000000;
const EMPTY_VOTE: VoteParts = { aye: true, conviction: 0 };

function Vote ({ className = '', defaultValue: { value }, isDisabled, isError, onChange, withLabel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [vote, setVote] = useState(EMPTY_VOTE);

  useEffect((): void => {
    onChange && onChange({ isValid: true, value: vote });
  }, [onChange, vote]);

  const onChangeVote = useCallback(
    (aye: boolean) => setVote(({ conviction }) => ({ aye, conviction })),
    []
  );

  const onChangeConviction = useCallback(
    (conviction: number) => setVote(({ aye }) => ({ aye, conviction })),
    []
  );

  const optAyeRef = useRef([
    { text: t('Nay'), value: false },
    { text: t('Aye'), value: true }
  ]);

  const optConvRef = useRef([
    { text: t('None'), value: 0 },
    { text: t('Locked1x'), value: 1 },
    { text: t('Locked2x'), value: 2 },
    { text: t('Locked3x'), value: 3 },
    { text: t('Locked4x'), value: 4 },
    { text: t('Locked5x'), value: 5 },
    { text: t('Locked6x'), value: 6 }
  ]);

  const defaultVote = isBn(value)
    ? !!(value.toNumber() & AYE_MASK)
    : isNumber(value)
      ? !!(value & AYE_MASK)
      : value instanceof GenericVote
        ? value.isAye
        : !!value;
  const defaultConv = value instanceof GenericVote
    ? value.conviction.index
    : 0;

  return (
    <Bare className={className}>
      <Dropdown
        className='full'
        defaultValue={defaultVote}
        isDisabled={isDisabled}
        isError={isError}
        label={t('aye: bool')}
        onChange={onChangeVote}
        options={optAyeRef.current}
        withLabel={withLabel}
      />
      <Dropdown
        className='full'
        defaultValue={defaultConv}
        isDisabled={isDisabled}
        isError={isError}
        label={t('conviction: Conviction')}
        onChange={onChangeConviction}
        options={optConvRef.current}
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Vote);
