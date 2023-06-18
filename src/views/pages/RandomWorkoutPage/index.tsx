import { useEffect } from 'react';
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { RootState } from 'main';

import CheckPane from './CheckPane';
import PracticePane from './PracticePane';
import { randomWorkoutPageActions } from 'application/randomWorkoutPage/framework/0-reducer';

const RandomWorkoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { workoutId } = useParams();

  const isChecking = useSelector(
    (state: RootState) => state.randomWorkoutPage.isChecking
  );

  const initializing = useSelector(
    (state: RootState) => state.randomWorkoutPage.initializing
  );

  useEffect(() => {
    return () => {
      dispatch(randomWorkoutPageActions.clearState());
    };
  }, []);

  useEffect(() => {
    !workoutId && navigate('/');
  }, [workoutId]);

  useEffect(() => {
    if (!workoutId) return;
    if (!initializing) return;
    dispatch(randomWorkoutPageActions.initiate(workoutId));
  }, [workoutId, initializing]);

  if (!!isChecking) {
    return <CheckPane />;
  }

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <PracticePane />
    </Container>
  );
};

export default RandomWorkoutPage;
