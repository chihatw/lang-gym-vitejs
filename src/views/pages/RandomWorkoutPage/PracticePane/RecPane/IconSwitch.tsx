import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { css, keyframes } from '@emotion/css';

import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import PlayCircleRounded from '@mui/icons-material/PlayCircleRounded';
import StopCircleRounded from '@mui/icons-material/StopCircleRounded';

import { RootState } from 'main';

const rotate = keyframes`
  0%  {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
`;

function IconSwitch() {
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

  const hasNext = useMemo(
    () => (workout ? currentIndex !== workout.cueIds.length - 1 : false),
    [workout, currentIndex]
  );

  if (!isRunning) {
    return <PlayCircleRounded sx={{ fontSize: 120 }} />;
  }
  if (hasNext) {
    return (
      <ChangeCircleIcon
        className={css`
          animation: ${rotate} 4s linear infinite;
        `}
        sx={{ fontSize: 120 }}
      />
    );
  }
  return <StopCircleRounded sx={{ fontSize: 120 }} />;
}

export default IconSwitch;
