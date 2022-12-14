import * as R from 'ramda';
import { Container } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import CustomLabel from '../../../components/CustomLabel';
import { RandomWorkoutState, State, WorkingMemory } from '../../../Model';

import { buildWorkoutState } from '../../../services/workout';
import { ActionTypes } from '../../../Update';
import WorkoutRow from './WorkoutRow';
import WorkingMemoryRow from './WorkingMemoryRow';
import { getWorkingMemories } from '../../../services/workingMemory';

const WorkoutListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [initialize, setInitialize] = useState(true);
  useEffect(() => {
    if (state.auth.initializing) return;
    if (!initialize) return;
    const fetchData = async () => {
      const randomWorkoutState = !!Object.keys(state.workout.workouts).length
        ? state.workout
        : await buildWorkoutState(state);

      const workingMemories = !!Object.keys(state.workingMemories).length
        ? state.workingMemories
        : await getWorkingMemories(state.auth.uid);

      const updatedState = R.compose(
        R.assocPath<RandomWorkoutState, State>(['workout'], randomWorkoutState),
        R.assocPath<{ [id: string]: WorkingMemory }, State>(
          ['workingMemories'],
          workingMemories
        )
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
      setInitialize(false);
    };
    fetchData();
  }, [state.workout.blobs, initialize, state.auth.initializing]);
  return (
    <Container maxWidth='sm' sx={{ paddingBottom: 20 }}>
      <div style={{ height: 48 }} />
      <div style={{ height: 16 }} />
      <div style={{ display: 'grid', rowGap: 8 }}>
        {!!Object.values(state.workout.workouts).length && (
          <>
            <CustomLabel label='反応練習' />
            {Object.values(state.workout.workouts).map((workout, index) => (
              <WorkoutRow
                key={index}
                blob={state.workout.blobs[workout.id]}
                workout={workout}
              />
            ))}
          </>
        )}
        {!!Object.values(state.workingMemories).length && (
          <>
            <CustomLabel label='記憶練習' />
            {Object.values(state.workingMemories)
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((workingMemory, index) => (
                <WorkingMemoryRow workingMemory={workingMemory} key={index} />
              ))}
          </>
        )}
      </div>
    </Container>
  );
};

export default WorkoutListPage;
