import { useTheme } from '@mui/material';
import React from 'react';

const WorkingMemoryResultAnswerListHeader = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        ...(theme.typography as any).mRounded300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ flexBasis: 40 }} />
      <div
        style={{
          flexBasis: 120,
          display: 'flex',
          justifyContent: 'center',
          fontSize: 12,
        }}
      >
        播放
      </div>
      <div
        style={{
          flexBasis: 120,
          display: 'flex',
          justifyContent: 'center',
          fontSize: 12,
        }}
      >
        回答
      </div>
    </div>
  );
};

export default WorkingMemoryResultAnswerListHeader;
