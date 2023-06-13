import MicIcon from '@mui/icons-material/Mic';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';
import { IconButton } from '@mui/material';
import { useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'main';
import {
  clearMediaRecorder,
  createMediaRecorder,
  startRecording,
} from 'application/audio/core/2-services';
import { audioActions } from 'application/audio/framework/0-reducer';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';

const RecButton = () => {
  const dispatch = useDispatch();

  const { isRecording } = useSelector((state: RootState) => state.ariclePage);

  // streamと連携してマイクを切るため
  const audioElemRef = useRef(new Audio());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const start = async () => {
    if (!navigator.mediaDevices) return;

    const mediaRecorder = await createMediaRecorder(
      audioElemRef,
      mediaRecorderRef
    );

    await startRecording(
      mediaRecorder,
      (blob: Blob, audioBuffer: AudioBuffer) => {
        dispatch(audioActions.setBlobAndAudioBuffer({ blob, audioBuffer }));
      }
    );

    dispatch(articlePageActions.startRecording());
  };

  const stop = () => {
    clearMediaRecorder(audioElemRef, mediaRecorderRef);
    dispatch(articlePageActions.stopRecording());
  };

  const handleClick = () => {
    if (!isRecording) {
      start();
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
        {isRecording ? (
          <StopCircleRoundedIcon sx={{ fontSize: 120 }} />
        ) : (
          <MicIcon sx={{ fontSize: 120 }} />
        )}
      </IconButton>
    </div>
  );
};

export default RecButton;
