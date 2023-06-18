import { Button, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { MutableRefObject, useEffect, useRef } from 'react';

import { RootState } from 'main';

import IconSwitch from './IconSwitch';
import { audioActions } from 'application/audio/framework/0-reducer';
import { randomWorkoutPageActions } from 'application/randomWorkoutPage/framework/0-reducer';
import {
  startRecording,
  clearMediaRecorder,
  createMediaRecorder,
} from 'application/audio/core/2-services';
import { selectWorkout } from 'application/randomWorkoutPage/framework/2-selector';

const RecPane = () => {
  const dispatch = useDispatch();
  const { currentIndex, isRunning } = useSelector(
    (state: RootState) => state.randomWorkoutPage
  );

  const workout = useSelector((state: RootState) => selectWorkout(state));

  // streamと連携してマイクを切るため
  const audioElemRef = useRef(new Audio());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const rafIdRef = useRef(0);
  const startedAtRef = useRef(0);

  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const loop = () => {
    const miliSeconds = performance.now() - startedAtRef.current;
    dispatch(randomWorkoutPageActions.setMiliSeconds(miliSeconds));
    rafIdRef.current = window.requestAnimationFrame(loop);
  };

  const start = async () => {
    // localhost の場合、 ios chrome では navigator が取得できない
    if (!navigator.mediaDevices) return;

    const mediaRecorder = await createMediaRecorder(
      audioElemRef,
      mediaRecorderRef
    );

    await startRecording(
      mediaRecorder,
      (blob: Blob, audioBuffer: AudioBuffer) => {
        dispatch(
          audioActions.setBlobAndAudioBuffer({
            recordedBlob: blob,
            recordedAudioBuffer: audioBuffer,
          })
        );
      }
    );

    startedAtRef.current = performance.now();
    dispatch(randomWorkoutPageActions.startRecording());

    loop();
  };

  const next = () => {
    dispatch(randomWorkoutPageActions.increseCurrentIndex());
  };

  const stop = async () => {
    // 録音ストップは 500ms後
    setTimeout(() => {
      clearMediaRecorder(audioElemRef, mediaRecorderRef);
    }, 500);

    dispatch(randomWorkoutPageActions.stopRecording());
    window.cancelAnimationFrame(rafIdRef.current);
  };
  const handleClick = () => {
    if (!workout) return;
    if (!isRunning) {
      start();
      return;
    }
    if (currentIndex !== workout.cueIds.length - 1) {
      next();
      return;
    }
    stop();
  };

  const handleReset = () => {
    dispatch(randomWorkoutPageActions.cancelRecording());
    window.cancelAnimationFrame(rafIdRef.current);
  };

  if (!workout) return <></>;
  return (
    <div style={{ display: 'grid', rowGap: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <IconButton color='primary' onClick={handleClick}>
          <IconSwitch />
        </IconButton>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant='outlined' sx={{ width: 260 }} onClick={handleReset}>
          RESET
        </Button>
      </div>
    </div>
  );
};

export default RecPane;

const stopRecording = (
  micAudioElemRef: MutableRefObject<HTMLAudioElement>,
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>
) => {
  let mediaRecorder = mediaRecorderRef.current;
  let audioElem = micAudioElemRef.current;
  if (!mediaRecorder) return;
  mediaRecorder.stop();
  const stream = audioElem.srcObject as MediaStream;
  stream.getTracks().forEach((track) => {
    track.stop();
  });
  // ブラウザのマイク使用中の表示を消すために必要
  audioElem.srcObject = null;
  mediaRecorder = null;
};
