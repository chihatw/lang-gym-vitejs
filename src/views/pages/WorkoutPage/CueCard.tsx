import React from 'react';

import { INITIAL_CUE, RandomWorkout } from '../../../Model';

const CueCard = React.memo(
  ({
    workout,
    currentIndex,
  }: {
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
          height: 320,
        }}
      >
        <div>{label}</div>
      </div>
    );
  }
);

export default CueCard;
