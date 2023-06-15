import { Container } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'main';

import WorkoutRow from './WorkoutRow';
import CustomLabel from '../../components/CustomLabel';
import { randomWorkoutListActions } from 'application/randomWorkoutList/framework/0-reducer';

const WorkoutListPage = () => {
  const dispatch = useDispatch();
  const { initializing, workoutIds } = useSelector(
    (state: RootState) => state.randomWorkoutList
  );

  useEffect(() => {
    if (!initializing) return;
    dispatch(randomWorkoutListActions.initiate());
  }, [initializing]);

  return (
    <Container maxWidth='sm' sx={{ paddingBottom: 20 }}>
      <div style={{ height: 48 }} />
      <div style={{ height: 16 }} />
      <div style={{ display: 'grid', rowGap: 8 }}>
        {!!workoutIds.length && (
          <>
            <CustomLabel label='反応練習' />
            {workoutIds.map((workoutId, index) => (
              <WorkoutRow key={index} workoutId={workoutId} />
            ))}
          </>
        )}
      </div>
    </Container>
  );
};

export default WorkoutListPage;
