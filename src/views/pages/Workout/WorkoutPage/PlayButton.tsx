import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import PlayCircleRounded from '@mui/icons-material/PlayCircleRounded';
import StopCircleRounded from '@mui/icons-material/StopCircleRounded';
import { css, keyframes } from '@emotion/css';
import { IconButton } from '@mui/material';

const rotate = keyframes`
  0%  {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
`;

const PlayButton = ({
  hasNext,
  isRunning,
  handleClickPlayButton,
}: {
  hasNext: boolean;
  isRunning: boolean;
  handleClickPlayButton: () => void;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <IconButton color='primary' onClick={handleClickPlayButton}>
        <IconSwitch hasNext={hasNext} isRunning={isRunning} />
      </IconButton>
    </div>
  );
};

export default PlayButton;

const IconSwitch = ({
  isRunning,
  hasNext,
}: {
  isRunning: boolean;
  hasNext: boolean;
}) => {
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
};
