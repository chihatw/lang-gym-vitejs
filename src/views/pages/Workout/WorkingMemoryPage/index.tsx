import downpitch_120 from '../../../../assets/audios/downpitch_120.mp3';
import ma_tones from '../../../../assets/audios/ma_tones.mp3';
import number_chinese from '../../../../assets/audios/number_chinese.mp3';
import * as R from 'ramda';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../../App';
import { INITIAL_WORKING_MEMORY_FORM_STATE } from './Model';
import { workingMemoryFormReducer } from './Update';
import { State } from '../../../../Model';
import { ActionTypes } from '../../../../Update';
import { buildWorkingMemoryFormState } from '../../../../application/services/workingMemory';
import WorkingMemoryForm from './WorkingMemoryForm';
import { getBlobFromAssets } from '../../../../application/services/utils';

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
      const _blob_1 = state.blobs[downpitch_120]
        ? state.blobs[downpitch_120]
        : await getBlobFromAssets(downpitch_120);

      const _blob_2 = state.blobs[ma_tones]
        ? state.blobs[ma_tones]
        : await getBlobFromAssets(ma_tones);

      const _blob_3 = state.blobs[number_chinese]
        ? state.blobs[number_chinese]
        : await getBlobFromAssets(number_chinese);

      const updatedState = R.compose(
        R.assocPath<Blob, State>(['blobs', downpitch_120], _blob_1),
        R.assocPath<Blob, State>(['blobs', ma_tones], _blob_2),
        R.assocPath<Blob, State>(['blobs', number_chinese], _blob_3)
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
