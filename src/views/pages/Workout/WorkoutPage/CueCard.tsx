import React, { useContext } from 'react';
import { AppContext } from '../../..';

import { INITIAL_CUE, RandomWorkout } from '../../../../Model';

const CueCard = React.memo(
  ({
    workout,
    currentIndex,
  }: {
    workout: RandomWorkout;
    currentIndex: number;
  }) => {
    const { state } = useContext(AppContext);
    const cue =
      workout.cues.find((item) => item.id === workout.cueIds[currentIndex]) ||
      INITIAL_CUE;
    const { label, imagePath } = cue;
    const blobURL = state.blobURLs[imagePath] || '';
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
  }
);

export default CueCard;
