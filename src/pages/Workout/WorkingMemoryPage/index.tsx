import * as R from 'ramda';
import React, { useContext, useEffect, useReducer } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import {
  INITIAL_WORKING_MEMORY_FORM_STATE,
  WorkingMemoryFormState,
} from './Model';
import { workingMemoryFormReducer } from './Update';
import { State, WorkingMemory, WorkingMemoryAnswer } from '../../../Model';
import { ActionTypes } from '../../../Update';
import {
  getBlob,
  buildWorkingMemoryFormState,
  buildWorkingMemoryAnswer,
  setWorkingMemory,
} from '../../../services/workingMemory';
import WorkingMemoryForm from './WorkingMemoryForm';

const WorkingMemoryPage = () => {
  const { workoutId } = useParams();
  const { state, dispatch } = useContext(AppContext);
  if (!state.auth.uid) return <Navigate to='/login' />;
  if (!workoutId) return <></>;

  const workingMemory = state.workingMemories[workoutId];
  if (!workingMemory) return <></>;

  const [workingMemoryFormState, workingMemoryFormDispatch] = useReducer(
    workingMemoryFormReducer,
    INITIAL_WORKING_MEMORY_FORM_STATE
  );

  useEffect(() => {
    if (!dispatch) return;
    if (!state.isFetching) {
      const updatedWorkingMemoryFormState: WorkingMemoryFormState = {
        ...workingMemoryFormState,
        audioContext: state.audioContext,
      };
      workingMemoryFormDispatch(updatedWorkingMemoryFormState);
      return;
    }
    const fetchData = async () => {
      const { blob, downloadURL } = await getBlob(
        workingMemory.storagePath,
        state.blobs
      );
      let updatedState: State = { ...state, isFetching: false };
      if (blob) {
        updatedState = R.assocPath<Blob, State>(
          ['blobs', downloadURL],
          blob
        )(updatedState);
      }
      dispatch({ type: ActionTypes.setState, payload: updatedState });

      const workingMemoryFormState = buildWorkingMemoryFormState(
        state,
        blob,
        workoutId
      );
      workingMemoryFormDispatch(workingMemoryFormState);
    };

    fetchData();
  }, [
    state.blobs,
    state.isFetching,
    state.audioContext,
    workingMemory.storagePath,
  ]);

  const handleSubmit = (workingMemoryFormState: WorkingMemoryFormState) => {
    if (!dispatch) return;
    const answer = buildWorkingMemoryAnswer(workingMemoryFormState);

    const updatedAnswers = {
      ...workingMemory.answers,
      [answer.createdAt]: answer,
    };

    // remote
    const updatedWorkingMemory = R.assocPath<
      { [createdAt: number]: WorkingMemoryAnswer },
      WorkingMemory
    >(
      ['answers'],
      updatedAnswers
    )(workingMemory);

    setWorkingMemory(updatedWorkingMemory);

    const updatedState = R.assocPath<WorkingMemory, State>(
      ['workingMemories', workoutId],
      updatedWorkingMemory
    )(state);
    dispatch({ type: ActionTypes.setState, payload: updatedState });
  };

  return (
    <WorkingMemoryForm
      state={workingMemoryFormState}
      dispatch={workingMemoryFormDispatch}
      handleSubmit={handleSubmit}
    />
  );
};

export default WorkingMemoryPage;
