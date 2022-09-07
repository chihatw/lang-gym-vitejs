import downpitch_120 from '../../../assets/audios/downpitch_120.mp3';
import * as R from 'ramda';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import { INITIAL_WORKING_MEMORY_FORM_STATE } from './Model';
import { workingMemoryFormReducer } from './Update';
import { State } from '../../../Model';
import { ActionTypes } from '../../../Update';
import { buildWorkingMemoryFormState } from '../../../services/workingMemory';
import WorkingMemoryForm from './WorkingMemoryForm';
import { getBlobFromAssets } from '../../../services/utils';

const WorkingMemoryPage = () => {
  const { workoutId } = useParams();
  const { state, dispatch } = useContext(AppContext);
  const [initializing, setInitializing] = useState(true);
  if (!state.auth.uid) return <Navigate to='/login' />;
  if (!workoutId) return <></>;

  const workingMemory = state.workingMemories[workoutId];
  if (!workingMemory) return <></>;

  const [workingMemoryFormState, workingMemoryFormDispatch] = useReducer(
    workingMemoryFormReducer,
    INITIAL_WORKING_MEMORY_FORM_STATE
  );

  useEffect(() => {
    if (!initializing) return;

    const fetchData = async () => {
      const _blob = state.blobs[downpitch_120]
        ? state.blobs[downpitch_120]
        : await getBlobFromAssets(downpitch_120);

      const updatedState = R.assocPath<Blob, State>(
        ['blobs', downpitch_120],
        _blob
      )(state);

      dispatch({ type: ActionTypes.setState, payload: updatedState });

      const workingMemoryFormState = buildWorkingMemoryFormState(
        updatedState,
        workoutId
      );
      workingMemoryFormDispatch(workingMemoryFormState);
      setInitializing(false);
    };

    fetchData();
  }, [state.blobs, state.audioContext, initializing]);

  return (
    <WorkingMemoryForm
      state={workingMemoryFormState}
      dispatch={workingMemoryFormDispatch}
    />
  );
};

export default WorkingMemoryPage;
