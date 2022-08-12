import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../App';

import { INITIAL_CUE, INITIAL_RANDOM_WORKOUT } from '../../../Model';

const CueCard = React.memo(() => {
  const { workoutId } = useParams();
  if (!workoutId) return <></>;
  const { state } = useContext(AppContext);
  const { workout: stateWorkout } = state;
  const { workouts, params } = stateWorkout;
  const workout = workouts[workoutId] || INITIAL_RANDOM_WORKOUT;
  const { cues, cueIds } = workout;
  const { currentIndex } = params;
  const cue =
    cues.find((item) => item.id === cueIds[currentIndex]) || INITIAL_CUE;
  const { label, imagePath } = cue;

  const { blobURLs } = state;
  const blobURL = blobURLs[imagePath] || '';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 320,
      }}
    >
      {imagePath ? (
        <img src={blobURL} width={320} height={320} />
      ) : (
        <div>{label}</div>
      )}
    </div>
  );
});

export default CueCard;
