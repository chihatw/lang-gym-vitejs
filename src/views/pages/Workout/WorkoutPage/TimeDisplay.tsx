import { useTheme } from '@mui/material';
import React from 'react';

const WIDTH = 200;

const TimeDisplay = ({ miliSeconds }: { miliSeconds: number }) => {
  const theme = useTheme();
  const width = WIDTH;
  const seconds = String(Math.floor(miliSeconds / 1000));
  const underDecimalPoint = String(Math.floor((miliSeconds % 1000) / 100));
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          ...(theme.typography as any).lato900,
          width,
          height: (width || 120) * 0.6,
          display: 'flex',
          fontSize: (width || 120) * 0.5,
          justifyContent: 'center',
        }}
      >
        <>
          <div style={{ textAlign: 'end' }}>{seconds}</div>
          <div>.</div>
          <div>{underDecimalPoint}</div>
        </>
      </div>
    </div>
  );
};

export default TimeDisplay;
