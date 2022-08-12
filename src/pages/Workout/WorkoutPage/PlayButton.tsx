import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import PlayCircleRounded from '@mui/icons-material/PlayCircleRounded';
import StopCircleRounded from '@mui/icons-material/StopCircleRounded';
import { css, keyframes } from '@emotion/css';
import { IconButton } from '@mui/material';
import React from 'react';

const rotate = keyframes`
  0%  {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
`;

const PlayButton = ({
  start,
  stop,
  next,
  isRunning,
  hasNext,
}: {
  hasNext: boolean;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  next: () => void;
}) => {
  const handleClick = () => {
    if (!isRunning) {
      start();
      return;
    }
    if (hasNext) {
      next();
      return;
    }
    stop();
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <IconButton color='primary' onClick={handleClick}>
        {(() => {
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
        })()}
      </IconButton>
    </div>
  );
};

export default PlayButton;
