import React from 'react';

import { INITIAL_CUE, RandomWorkout } from '../../../Model';

const CueCard = React.memo(
  ({
    height,
    workout,
    currentIndex,
  }: {
    height: number;
    workout: RandomWorkout;
    currentIndex: number;
  }) => {
    const cue =
      workout.cues.find((item) => item.id === workout.cueIds[currentIndex]) ||
      INITIAL_CUE;
    const { label } = cue;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height,
        }}
      >
        <div>{label}</div>
      </div>
    );
  }
);

export default CueCard;
