// Copyright 2017-2025 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ExtrinsicPayload } from '@polkadot/types/interfaces';
import type { Inspect } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';

import React, { useMemo } from 'react';

import { Columar, Output, styled } from '@polkadot/react-components';
import { u8aToHex } from '@polkadot/util';

import { useTranslation } from './translate.js';

interface Props {
  className?: string;
  extrinsic?: SubmittableExtrinsic<'promise'> | null;
  isCall: boolean;
  payload?: ExtrinsicPayload | null;
  withData?: boolean;
  withHash?: boolean;
}

function extract (isCall: boolean, extrinsic?: SubmittableExtrinsic<'promise'> | null, payload?: ExtrinsicPayload | null): [HexString, HexString, Inspect | null] {
  if (!extrinsic) {
    return ['0x', '0x', null];
  }

  const u8a = extrinsic.method.toU8a();
  let inspect = isCall
    ? extrinsic.method.inspect()
    : extrinsic.inspect();

  if (payload) {
    const prev = inspect;

    inspect = payload.inspect();
    inspect.inner?.map((entry, index) => {
      if (index === 0) {
        // replace the method inner
        entry.inner = prev.inner;
        entry.outer = undefined;
      }

      return entry;
    });
  }

  // don't use the built-in hash, we only want to convert once
  return [
    u8aToHex(u8a),
    extrinsic.registry.hash(u8a).toHex(),
    inspect
  ];
}

function Decoded ({ className, extrinsic, isCall, payload, withData = true }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const [hex, inspect] = useMemo(
    () => extract(isCall, extrinsic, payload),
    [extrinsic, isCall, payload]
  );

  if (!inspect) {
    return null;
  }

  return (
    <StyledColumar
      className={className}
      isPadded={false}
    >
      <Columar.Column>
        {withData && (
          <Output
            isDisabled
            isTrimmed
            label={t('encoded call data')}
            value={hex}
            withCopy
          />
        )}
      </Columar.Column>
    </StyledColumar>
  );
}

const StyledColumar = styled(Columar)`
  
`;

export default React.memo(Decoded);
