// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { ChainImg, Icon, styled } from '@polkadot/react-components';
import { useIpfs, useToggle } from '@polkadot/react-hooks';
import { Chain } from '@polkadot/react-query';

import Endpoints from '../Endpoints/index.js';

interface Props {
  className?: string;
}

function ChainInfo ({ className }: Props): React.ReactElement<Props> {
  const { ipnsChain } = useIpfs();
  const [isEndpointsVisible, toggleEndpoints] = useToggle();
  const canToggle = !ipnsChain;

  return (
    <StyledDiv className={`${className}`}>
      <div
        className={`apps--SideBar-logo-inner${canToggle ? ' isClickable' : ''} `}
        onClick={toggleEndpoints}
      >
        <ChainImg />
        <div className='info media--1000'>
          <Chain className='chain' />
        </div>
        {canToggle && (
          <Icon
            className='dropdown'
            icon={isEndpointsVisible ? 'caret-right' : 'caret-down'}
          />
        )}
      </div>
      {isEndpointsVisible && (
        <Endpoints onClose={toggleEndpoints} />
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  box-sizing: border-box;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  margin: 0;

  &:hover {
    border-color: var(--border-input-hover) !important;
  }
  .apps--SideBar-logo-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.isClickable {
      cursor: pointer;
    }

    .ui--ChainImg {
      height: 2.5rem;
      margin-right: 0.5rem;
      width: 2.5rem;
    }

    .ui--Icon.dropdown,
    > div.info {
      text-align: right;
      vertical-align: middle;
    }

    .ui--Icon.dropdown {
      flex: 0;
      margin: 0;
      display: none;
    }

    .info {
      flex: 1;
      font-size: var(--font-size-tiny);
      line-height: 1.2;
      padding-right: 0.5rem;
      text-align: right;

      .chain {
        font-size: var(--font-size-h1);
        color: var(--color-text-hover);
        font-weight: var(--font-weight-bold);
        max-width: 16rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .runtimeVersion {
        letter-spacing: -0.01em;
      }
    }
  }
`;

export default React.memo(ChainInfo);
