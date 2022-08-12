import { Container } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../../App';
import CustomLabel from '../../../components/CustomLabel';
import { getRandomWorkouts } from '../../../services/workout';
import { ActionTypes } from '../../../Update';
import WorkoutRow from './WorkoutRow';

const WorkoutListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { auth, workout, isFetching } = state;
  const { uid } = auth;
  const { workouts } = workout;

  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      const _workouts = Object.keys(workouts).length
        ? workouts
        : await getRandomWorkouts(uid);
      dispatch({ type: ActionTypes.setWorkouts, payload: _workouts });
    };
    fetchData();
  }, [isFetching]);
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ height: 16 }} />
      <div style={{ display: 'grid', rowGap: 8 }}>
        <CustomLabel label='練習' />
        {Object.values(workouts).map((_, index) => (
          <WorkoutRow key={index} index={index} />
        ))}
      </div>
    </Container>
  );
};

export default WorkoutListPage;
