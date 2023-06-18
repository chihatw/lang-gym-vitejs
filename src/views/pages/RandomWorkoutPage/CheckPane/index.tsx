import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  CircularProgress,
  Container,
  Modal,
  useTheme,
} from '@mui/material';

import { RootState } from 'main';

import AudioBufferSlider from 'views/components/AudioBufferSlider';
import { audioActions } from 'application/audio/framework/0-reducer';
import { randomWorkoutPageActions } from 'application/randomWorkoutPage/framework/0-reducer';
import { RANDOM_WORKOUT_STORAGE_PATH } from 'application/randomWorkouts/core/1-constants';
import CheckPaneRow from './CheckPaneRow';
import TimeDisplay from '../PracticePane/TimeDisplay';
import { selectWorkout } from 'application/randomWorkoutPage/framework/2-selector';

const CheckPane = React.memo(() => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { workoutId } = useSelector(
    (state: RootState) => state.randomWorkoutPage
  );

  const { recordedBlob, recordedAudioBuffer } = useSelector(
    (state: RootState) => state.audio
  );

  const workout = useSelector((state: RootState) => selectWorkout(state));

  const abandonRecordedBlob = () => {
    dispatch(randomWorkoutPageActions.abandonRecordedAudioBuffer());
  };

  const saveRecordedBlob = async () => {
    if (!recordedBlob || !recordedAudioBuffer) return;

    // workoutId １つに対して、１つの stroragePath しかないので、上書きになる
    const path = RANDOM_WORKOUT_STORAGE_PATH + workoutId;
    dispatch(
      audioActions.saveAudioBuffer({ path, audioBuffer: recordedAudioBuffer })
    );

    dispatch(randomWorkoutPageActions.saveRecordedAudioBuffer(workoutId));
    navigate('/workout/list');
  };

  if (!workout) return <></>;

  if (!recordedAudioBuffer)
    return (
      <Modal open={true}>
        <div
          style={{
            width: '100vw',
            minHeight: '100vh',
            background: '#grey',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={120} />
        </div>
      </Modal>
    );

  return (
    <Modal open={true}>
      <div
        style={{
          width: '100dvw',
          minHeight: '100dvh',
          background: '#fafafa',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth='sm'>
          <div style={{ display: 'grid', rowGap: 16 }}>
            <TimeDisplay />
            <div
              style={{
                ...(theme.typography as any).mRounded300,
                fontSize: 48,
                marginTop: -32,
                marginBottom: -16,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 16 }}>BPM: </span>
              <span>{workout.resultBpm}</span>
            </div>
            <div
              style={{
                color: '#52a2aa',
                textAlign: 'center',
                padding: '8px 0',
                userSelect: 'none',
              }}
            >
              録音をチェックしてください
            </div>
            <AudioBufferSlider
              audioBuffer={recordedAudioBuffer}
              start={0}
              end={recordedAudioBuffer.duration}
            />
            <div
              style={{
                display: 'grid',
                rowGap: 8,
                height: 320,
                overflowY: 'scroll',
                background: 'white',
                borderRadius: 8,
              }}
            >
              <div style={{ padding: '24px 0' }}>
                {workout.cueIds.map((cueId, index) => (
                  <CheckPaneRow key={index} cueId={cueId} />
                ))}
              </div>
              <div style={{ display: 'grid', rowGap: 16 }}>
                <Button
                  onClick={saveRecordedBlob}
                  variant='contained'
                  color='primary'
                  sx={{ color: 'white' }}
                >
                  きれいに読めました
                </Button>
                <Button
                  onClick={abandonRecordedBlob}
                  variant='outlined'
                  color='primary'
                >
                  もう一度録音します
                </Button>
              </div>
              <div style={{ height: 180 }} />
            </div>
          </div>
        </Container>
      </div>
    </Modal>
  );
});

export default CheckPane;
