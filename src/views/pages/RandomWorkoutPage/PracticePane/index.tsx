import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

import { RootState } from 'main';

import Header from './Header';
import RecPane from './RecPane';
import CueCard from './CueCard';
import TimeDisplay from './TimeDisplay';

function PracticePane() {
  const theme = useTheme();

  const { currentIndex, isRunning, workoutId } = useSelector(
    (state: RootState) => state.randomWorkoutPage
  );
  const randomWorkouts = useSelector(
    (state: RootState) => state.randomWorkouts
  );

  const workout = useMemo(
    () => randomWorkouts[workoutId!],
    [workoutId, randomWorkouts]
  );

  if (!workout) return <></>;

  return (
    <div style={{ paddingTop: 16, paddingBottom: 80 }}>
      <div
        style={{
          ...(theme.typography as any).notoSerifJP,
          display: 'grid',
        }}
      >
        <Header />
        <div style={{ fontSize: 48, textAlign: 'center' }}>
          {`${workout.cueIds.length ? currentIndex + 1 : 0}/${
            workout.cueIds.length
          }`}
        </div>
        <TimeDisplay />
        <div style={{ height: 160 }}>{isRunning && <CueCard />}</div>
        <RecPane />
      </div>
    </div>
  );
}

export default PracticePane;
