import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';

import { IconButton } from '@mui/material';
import {
  pauseSourceNode,
  playAudioBufferAndSetSourceNode,
} from 'application/audio/core/2-services';
import { RootState } from 'main';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';

function PlayRecordedAudioButton() {
  const dispatch = useDispatch();
  const sourceNodeRef = useRef<AudioBufferSourceNode | undefined>(undefined);
  const { recordedAudioBuffer } = useSelector(
    (state: RootState) => state.audio
  );
  const { playedRecordedAudio } = useSelector(
    (state: RootState) => state.ariclePage
  );

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      pauseSourceNode(sourceNodeRef);
      setIsPlaying(false);
    };
  }, []);

  const play = () => {
    setIsPlaying(true);
    playAudioBufferAndSetSourceNode(
      recordedAudioBuffer!,
      0,
      recordedAudioBuffer!.duration,
      sourceNodeRef,
      () => setIsPlaying(false)
    );
    !playedRecordedAudio && dispatch(articlePageActions.playedRecordedAudio());
  };

  const pause = () => {
    setIsPlaying(false);
    pauseSourceNode(sourceNodeRef);
  };

  const handleClick = () => {
    if (isPlaying) {
      pause();
      return;
    }

    play();
  };

  return (
    <IconButton
      sx={{ color: '#52a2aa' }}
      onClick={handleClick}
      disabled={!recordedAudioBuffer}
    >
      {isPlaying ? (
        <StopCircleRoundedIcon sx={{ fontSize: 120 }} />
      ) : (
        <PlayCircleRoundedIcon sx={{ fontSize: 120 }} />
      )}
    </IconButton>
  );
}

export default PlayRecordedAudioButton;
