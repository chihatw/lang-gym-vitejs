import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Divider } from '@mui/material';

import { RootState } from 'main';
import SentencePitchLine from 'views/components/SentencePitchLine';

function CheckPaneRow({ cueId }: { cueId: string }) {
  const { workoutId } = useSelector(
    (state: RootState) => state.randomWorkoutPage
  );
  const randomWorkouts = useSelector(
    (state: RootState) => state.randomWorkouts
  );

  const workout = useMemo(
    () => randomWorkouts[workoutId!],
    [workoutId, randomWorkouts]
  );

  const pitchStr = useMemo(() => {
    if (!workout) return '';
    const cue = workout.cues.find((item) => item.id === cueId);
    if (!cue) return '';
    return cue.pitchStr;
  }, [workout, cueId]);

  if (!pitchStr) return <></>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <SentencePitchLine pitchStr={pitchStr} />
      </div>
      <Divider />
    </div>
  );
}

export default CheckPaneRow;
