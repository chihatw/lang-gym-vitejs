import * as R from 'ramda';
import { Container } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../..';
import CustomLabel from '../../../components/CustomLabel';
import { RandomWorkoutState, State } from '../../../../Model';

import { buildWorkoutState } from '../../../../application/services/workout';
import { ActionTypes } from '../../../../Update';
import WorkoutRow from './WorkoutRow';
import { useSelector } from 'react-redux';
import { RootState } from 'main';

const WorkoutListPage = () => {
  const { state, dispatch } = useContext(AppContext);

  const [initialize, setInitialize] = useState(true);

  const { currentUid } = useSelector((state: RootState) => state.authUser);

  useEffect(() => {
    if (!initialize) return;
    const fetchData = async () => {
      const randomWorkoutState = !!Object.keys(state.workout.workouts).length
        ? state.workout
        : await buildWorkoutState(state, currentUid);

      const updatedState = R.compose(
        R.assocPath<RandomWorkoutState, State>(['workout'], randomWorkoutState)
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
      </div>
    </Container>
  );
};

export default WorkoutListPage;
