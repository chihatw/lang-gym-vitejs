import React, { useMemo } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'main';

const CueCard = React.memo(() => {
  const { currentIndex, workoutId } = useSelector(
    (state: RootState) => state.randomWorkoutPage
  );

  const randomWorkouts = useSelector(
    (state: RootState) => state.randomWorkouts
  );

  const workout = useMemo(
    () => randomWorkouts[workoutId!],
    [workoutId, randomWorkouts]
  );

  const label = useMemo(() => {
    if (!workout) return '';
    const cue = workout.cues.find(
      (item) => item.id === workout.cueIds[currentIndex]
    );
    return cue?.label || '';
  }, [workout, currentIndex]);

  if (!workout) return <></>;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 160,
      }}
    >
      <div>{label}</div>
    </div>
  );
});

export default CueCard;
