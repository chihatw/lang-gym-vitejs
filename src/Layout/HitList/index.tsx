import { Container, useTheme } from '@mui/material';
import React from 'react';
import { State } from '../../Model';
import { Action } from '../../Update';
import HitItem from './HitItem';

const HitList = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const theme = useTheme();
  const { search, layout } = state;
  const { hitItems } = search;
  const { width, height } = layout;
  return (
    <div
      style={{
        top: 48,
        right: 0,
        width: '100%',
        border: 'solid #cbe3e6',
        maxWidth: 600,
        position: 'absolute',
        boxSizing: 'border-box',
        overflowY: 'scroll',
        background: 'white',
        borderWidth: '0 4px 4px 4px',
        maxHeight: width > 599 ? height - 48 : height - (48 + 56),
      }}
    >
      {hitItems.length > 0 && (
        <Container>
          <div style={{ height: 8 }} />
          <div
            style={{
              ...(theme.typography as any).mPlusRounded,
              color: '#aaa',
              fontSize: 12,
            }}
          >
            {`相關結果: ${hitItems.length}件${
              hitItems.length === 20 ? '以上' : ''
            }`}
          </div>
        </Container>
      )}
      {hitItems.map((_, index) => (
        <HitItem key={index} index={index} state={state} dispatch={dispatch} />
      ))}
    </div>
  );
};

export default HitList;
