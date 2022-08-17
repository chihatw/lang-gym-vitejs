import * as R from 'ramda';
import { Button, Container, Divider, Modal, useTheme } from '@mui/material';

import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../App';

import {
  INITIAL_CUE,
  RandomWorkout,
  RandomWorkoutParams,
  RandomWorkoutState,
  State,
} from '../../../Model';
import { ActionTypes } from '../../../Update';
import { setRandomWorkout } from '../../../services/workout';
import TimeDisplay from './TimeDisplay';

import BlobSlider from '../../../components/BlobSlider';
import string2PitchesArray from 'string2pitches-array';
import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import { uploadStorage } from '../../../repositories/storage';

const CheckPane = React.memo(
  ({ blob, clearBlob }: { blob: Blob | null; clearBlob: () => void }) => {
    const navigate = useNavigate();
    const { workoutId } = useParams();
    const theme = useTheme();
    const { state, dispatch } = useContext(AppContext);
    const { workout: stateWorkout, audioContext } = state;
    const { params, workouts } = stateWorkout;

    if (!workoutId) return <></>;

    const workout = workouts[workoutId];
    const { cues, cueIds, resultBpm } = workout;
    const { isChecking, miliSeconds } = params;

    const storagePath = `/randomWorkout/${workoutId}`;

    const handleSave = async () => {
      if (!blob || !dispatch) return;
      await uploadStorage(blob, storagePath);
      const updatedWorkout: RandomWorkout = {
        ...workout,
        storagePath,
      };

      await setRandomWorkout(updatedWorkout);
      navigate('/workout/list');

      const updatedWorkoutState: RandomWorkoutState = R.compose(
        R.assocPath<RandomWorkoutParams, RandomWorkoutState>(['params'], {
          miliSeconds: 0,
          isRunning: false,
          isChecking: false,
          currentIndex: 0,
        }),
        R.assocPath<RandomWorkout, RandomWorkoutState>(
          ['workouts', workoutId],
          updatedWorkout
        ),
        R.assocPath<Blob, RandomWorkoutState>(['blobs', workoutId], blob)
      )(stateWorkout);

      // リストへ遷移してから、変更
      setTimeout(() => {
        const updatedState = R.compose(
          R.assocPath<boolean, State>(['isFetching'], false),
          R.assocPath<RandomWorkoutState, State>(
            ['workout'],
            updatedWorkoutState
          )
        )(state);

        dispatch({
          type: ActionTypes.setState,
          payload: updatedState,
        });
      }, 200);
    };
    const handleCancel = () => {
      if (!dispatch) return;
      clearBlob();
      const updatedWorkoutState: RandomWorkoutState = R.compose(
        R.assocPath<RandomWorkoutParams, RandomWorkoutState>(['params'], {
          miliSeconds: 0,
          isRunning: false,
          isChecking: false,
          currentIndex: 0,
        })
      )(stateWorkout);

      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<RandomWorkoutState, State>(['workout'], updatedWorkoutState)
      )(state);

      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };

    return (
      <Modal open={isChecking}>
        <div
          style={{
            width: '100vw',
            minHeight: '100vh',
            background: '#fafafa',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Container maxWidth='sm'>
            <div style={{ display: 'grid', rowGap: 16 }}>
              <TimeDisplay miliSeconds={miliSeconds} />
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
                <span>{resultBpm}</span>
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
              {!!blob && !!audioContext && (
                <BlobSlider
                  blob={blob}
                  spacer={5}
                  duration={miliSeconds / 1000 + 0.3}
                  audioContext={audioContext}
                />
              )}
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
                  {cueIds.map((cueId, index) => {
                    const cue =
                      cues.find((item) => item.id === cueId) || INITIAL_CUE;
                    const { pitchStr } = cue;
                    const pitchesArray = string2PitchesArray(pitchStr);
                    return (
                      <div key={index}>
                        <div
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <SentencePitchLine pitchesArray={pitchesArray} />
                        </div>
                        <Divider />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'grid', rowGap: 16 }}>
                  <Button
                    onClick={handleSave}
                    variant='contained'
                    color='primary'
                    sx={{ color: 'white' }}
                  >
                    きれいに読めました
                  </Button>
                  <Button
                    onClick={handleCancel}
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
  }
);

export default CheckPane;
