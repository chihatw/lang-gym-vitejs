import { useSelector } from 'react-redux';
import { css, keyframes } from '@emotion/css';

import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import PlayCircleRounded from '@mui/icons-material/PlayCircleRounded';
import StopCircleRounded from '@mui/icons-material/StopCircleRounded';

import { RootState } from 'main';
import { selectWorkout } from 'application/randomWorkoutPage/framework/2-selector';

const rotate = keyframes`
  0%  {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
`;

function IconSwitch() {
  const { currentIndex, isRunning } = useSelector(
    (state: RootState) => state.randomWorkoutPage
  );

  const workout = useSelector((state: RootState) => selectWorkout(state));

  if (!workout) return <></>;

  if (!isRunning) {
    return <PlayCircleRounded sx={{ fontSize: 120 }} />;
  }

  if (currentIndex !== workout.cueIds.length - 1) {
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
