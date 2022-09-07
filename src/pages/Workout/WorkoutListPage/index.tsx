import * as R from 'ramda';
import { Container } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import CustomLabel from '../../../components/CustomLabel';
import { RandomWorkoutState, State } from '../../../Model';

import { buildWorkoutState } from '../../../services/workout';
import { ActionTypes } from '../../../Update';
import WorkoutRow from './WorkoutRow';
import WorkingMemoryRow from './WorkingMemoryRow';

const WorkoutListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [initialize, setInitialize] = useState(true);
  useEffect(() => {
    if (!initialize) return;
    const fetchData = async () => {
      const initialWorkoutState = await buildWorkoutState(state);
      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<RandomWorkoutState, State>(['workout'], initialWorkoutState)
      )(state);

      dispatch({ type: ActionTypes.setState, payload: updatedState });
      setInitialize(false);
    };
    fetchData();
  }, [state.workout.blobs, initialize]);
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
