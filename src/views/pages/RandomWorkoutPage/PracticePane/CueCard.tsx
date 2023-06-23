import React from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { selectWorkout } from 'application/randomWorkoutPage/framework/2-selector';

const CueCard = React.memo(() => {
  const { currentIndex } = useSelector(
    (state: RootState) => state.randomWorkoutPage
  );

  const workout = useSelector((state: RootState) => selectWorkout(state));

  if (!workout) return <></>;

  const label = () => {
    const cue = workout.cues.find(
      (item) => item.id === workout.cueIds[currentIndex]
    );
    return cue?.label || '';
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 160,
      }}
    >
      <div>{label()}</div>
    </div>
  );
});

export default CueCard;
