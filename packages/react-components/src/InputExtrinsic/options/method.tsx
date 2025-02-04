// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DropdownOption, DropdownOptions } from '../../util/types.js';

import React from 'react';

export default function createOptions(api: ApiPromise, sectionName: string, filter?: (section: string, method?: string) => boolean): DropdownOptions {
  const section = api.tx[sectionName];
  const sectionBalance = api.tx['balances'];
  const sectionAdminUtils = api.tx['adminUtils'];
  const sectionSubnetEmission = api.tx['subnetEmissionModule'];

  const combinedSection = { ...section, ...sectionBalance, ...sectionAdminUtils, ...sectionSubnetEmission };
  const isAllowed = !filter || filter(sectionName);

  if (!combinedSection || Object.keys(combinedSection).length === 0 || !isAllowed) {
    return [];
  }

  return Object
    .keys(combinedSection)
    .filter((s) =>
      !s.startsWith('$') &&
      (!filter || filter(sectionName, s))
    )
    .sort()
    .map((value): DropdownOption => {
      const method = combinedSection[value];
      let inputs = method.meta.args
        .map((arg) => arg.name.toString())
        .join(', ');

      return {
        className: 'ui--DropdownLinked-Item',
        key: `${sectionName}_${value}`,
        text: [
          <div
            className='ui--DropdownLinked-Item-call'
            key={`${sectionName}_${value}:call`}
          >
            {value}({inputs})
          </div>,
          <div
            className='ui--DropdownLinked-Item-text'
            key={`${sectionName}_${value}:text`}
          >
            {(method.meta.docs[0] || value).toString()}
          </div>
        ],
        value
      };
    });
}
