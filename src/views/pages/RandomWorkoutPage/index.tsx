import { useEffect } from 'react';
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { RootState } from 'main';

import CheckPane from './CheckPane';
import PracticePane from './PracticePane';
import { randomWorkoutPageActions } from 'application/randomWorkoutPage/framework/0-reducer';
import { GUEST_UID } from 'application/authUser/core/1-constants';
import OpeningPane from './OpeningPane';

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

  const showOpeningPane = useSelector(
    (state: RootState) => state.randomWorkoutPage.showOpeningPane
  );

  const currentUid = useSelector(
    (state: RootState) => state.authUser.currentUid
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

  useEffect(() => {
    dispatch(
      randomWorkoutPageActions.setShowOpeningPane(currentUid === GUEST_UID)
    );
  }, [currentUid]);

  if (!!isChecking) {
    return <CheckPane />;
  }

  if (showOpeningPane) return <OpeningPane />;

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <PracticePane />
    </Container>
  );
};

export default RandomWorkoutPage;
