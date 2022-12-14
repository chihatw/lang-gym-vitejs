import * as R from 'ramda';
import { Card, CardContent, IconButton, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { RandomWorkout, RandomWorkoutState, State } from '../../../Model';
import BlobSlider from '../../../components/BlobSlider';
import Delete from '@mui/icons-material/Delete';
import { ActionTypes } from '../../../Update';
import { deleteStorage } from '../../../repositories/storage';
import { setRandomWorkout } from '../../../services/workout';

const WorkoutRow = ({
  blob,
  workout,
}: {
  blob: Blob | null;
  workout: RandomWorkout;
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { state, dispatch } = useContext(AppContext);

  const openWorkoutPage = () => {
    navigate(`/workout/${workout.id}`);
  };
  const handleDelete = async () => {
    const updatedWorkout: RandomWorkout = {
      ...workout,
      resultBpm: 0,
      resultSeconds: 0,
      storagePath: '',
    };
    const updatedWorkoutState: RandomWorkoutState = R.compose(
      R.assocPath<RandomWorkout, RandomWorkoutState>(
        ['workouts', workout.id],
        updatedWorkout
      ),
      R.assocPath<null, RandomWorkoutState>(['blobs', workout.id], null)
    )(state.workout);

    const updatedState = R.compose(
      R.assocPath<boolean, State>(['isFetching'], false),
      R.assocPath<RandomWorkoutState, State>(['workout'], updatedWorkoutState)
    )(state);

    dispatch({ type: ActionTypes.setState, payload: updatedState });

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
            <div style={{ fontSize: 14 }}>{workout.title}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <span style={{ fontSize: 12 }}>??????BPM:</span>
                <span style={{ fontSize: 20, paddingLeft: 20 }}>
                  {workout.targetBpm}
                </span>
              </div>
              <div>
                <span style={{ fontSize: 12 }}>??????BPM:</span>
                <span style={{ fontSize: 20, paddingLeft: 20 }}>
                  {!!blob ? workout.resultBpm : '--'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!!blob && !!state.audioContext && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexGrow: 1 }}>
            <BlobSlider
              blob={blob}
              spacer={5}
              duration={workout.resultSeconds + 0.3}
              audioContext={state.audioContext}
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
