import * as R from 'ramda';
import { Card, CardContent, IconButton, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import {
  INITIAL_RANDOM_WORKOUT,
  RandomWorkout,
  RandomWorkoutState,
} from '../../../Model';
import BlobSlider from '../../../components/BlobSlider';
import Delete from '@mui/icons-material/Delete';
import { ActionTypes } from '../../../Update';
import { deleteStorage } from '../../../repositories/storage';
import { setRandomWorkout } from '../../../services/workout';

const WorkoutRow = ({ index }: { index: number }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { state, dispatch } = useContext(AppContext);
  const { workout: stateWorkout, audioContext } = state;
  const { workouts, blobs } = stateWorkout;
  const workout = Object.values(workouts)[index] || INITIAL_RANDOM_WORKOUT;
  const blob = blobs[workout.id] || null;
  const { title, id: workoutId, resultSeconds, targetBpm, resultBpm } = workout;
  const openWorkoutPage = () => {
    navigate(`/workout/${workoutId}`);
  };
  const handleDelete = async () => {
    if (!dispatch) return;

    const updatedWorkout: RandomWorkout = {
      ...workout,
      resultBpm: 0,
      resultSeconds: 0,
      storagePath: '',
    };
    const updatedWorkoutState: RandomWorkoutState = R.compose(
      R.assocPath<RandomWorkout, RandomWorkoutState>(
        ['workouts', workoutId],
        updatedWorkout
      ),
      R.assocPath<null, RandomWorkoutState>(['blobs', workoutId], null)
    )(stateWorkout);

    dispatch({
      type: ActionTypes.setWorkout,
      payload: updatedWorkoutState,
    });
    await deleteStorage(workout.storagePath);
    await setRandomWorkout(updatedWorkout);
  };
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <Card
        sx={{
          cursor: 'pointer',
          WebkitTapHighlightColor: '#EAF4F5',
          '&:active,&:focus': { background: '#EAF4F5' },
        }}
        onClick={openWorkoutPage}
        elevation={0}
      >
        <CardContent>
          <div
            style={{
              ...(theme.typography as any).mPlusRounded300,
              userSelect: 'none',
              display: 'grid',
              rowGap: 8,
              marginBottom: -16,
            }}
          >
            <div style={{ fontSize: 14 }}>{title}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <span style={{ fontSize: 12 }}>目標BPM:</span>
                <span style={{ fontSize: 20, paddingLeft: 20 }}>
                  {targetBpm}
                </span>
              </div>
              <div>
                <span style={{ fontSize: 12 }}>到達BPM:</span>
                <span style={{ fontSize: 20, paddingLeft: 20 }}>
                  {!!blob ? resultBpm : '--'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!!blob && !!audioContext && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexGrow: 1 }}>
            <BlobSlider
              blob={blob}
              spacer={5}
              duration={resultSeconds + 0.3}
              audioContext={audioContext}
            />
          </div>
          <IconButton size='small' onClick={handleDelete}>
            <Delete />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default WorkoutRow;
