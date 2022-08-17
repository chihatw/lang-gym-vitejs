import * as R from 'ramda';
import { Container } from '@mui/material';
import { getDownloadURL, ref } from 'firebase/storage';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../../App';
import CustomLabel from '../../../components/CustomLabel';
import {
  INITIAL_RANDOM_WORKOUT_PARAMS,
  RandomWorkoutState,
  State,
} from '../../../Model';
import { storage } from '../../../repositories/firebase';
import { getRandomWorkouts } from '../../../services/workout';
import { ActionTypes } from '../../../Update';
import WorkoutRow from './WorkoutRow';

const WorkoutListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { auth, workout, isFetching } = state;
  const { uid } = auth;
  const { workouts, blobs } = workout;
  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      const _workouts = Object.keys(workouts).length
        ? workouts
        : await getRandomWorkouts(uid);

      const storagePathToFetch: { workoutId: string; storagePath: string }[] =
        [];
      for (const workout of Object.values(_workouts)) {
        const { id: workoutId, storagePath } = workout;
        if (!!storagePath && !Object.keys(blobs).includes(workoutId)) {
          storagePathToFetch.push({ workoutId, storagePath });
        }
      }
      const gotBlobs: { [workoutId: string]: Blob | null } = {};
      await Promise.all(
        storagePathToFetch.map(async ({ workoutId, storagePath }) => {
          console.log('get workout audio');
          const downloadURL = await getDownloadURL(ref(storage, storagePath));
          const response = await fetch(downloadURL);
          const blob = await response.blob();
          gotBlobs[workoutId] = blob;
        })
      );

      const initialWorkoutState: RandomWorkoutState = {
        workouts: _workouts,
        blobs: { ...blobs, ...gotBlobs },
        params: INITIAL_RANDOM_WORKOUT_PARAMS,
      };

      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<RandomWorkoutState, State>(['workout'], initialWorkoutState)
      )(state);

      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };
    fetchData();
  }, [isFetching, blobs]);
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
