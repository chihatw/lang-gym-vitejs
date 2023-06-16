import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';

import { RootState } from 'main';

import { buildTimeNumber } from 'application/randomWorkoutPage/core/2-services';
const WIDTH = 200;

const TimeDisplay = () => {
  const theme = useTheme();

  const { miliSeconds } = useSelector(
    (state: RootState) => state.randomWorkoutPage
  );

  const { seconds, underDecimalPoint } = useMemo(
    () => buildTimeNumber(miliSeconds),
    [miliSeconds]
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          ...(theme.typography as any).lato900,
          width: WIDTH,
          height: WIDTH * 0.6,
          display: 'flex',
          fontSize: WIDTH * 0.5,
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'end' }}>{seconds}</div>
        <div>.</div>
        <div>{underDecimalPoint}</div>
      </div>
    </div>
  );
};

export default TimeDisplay;
