import { Button } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../../../../App';
import { WORKING_MEMORY_MAX_ROUND } from '../../../../../../assets/constants';
import { INITIAL_WORKING_MEMORY_LOG } from '../../../../../../Model';
import {
  buildCueIds,
  getTodaysLogCount,
} from '../../../../../../application/services/workingMemory';
import { WorkingMemoryFormState } from '../../Model';

const WorkingMemoryFormFooter = ({
  state,
  dispatch,
}: {
  state: WorkingMemoryFormState;
  dispatch: React.Dispatch<WorkingMemoryFormState>;
}) => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const { state: appState } = useContext(AppContext);
  if (!workoutId) return <></>;

  const workingMemory = appState.workingMemories[workoutId];
  const logCount = getTodaysLogCount(workingMemory);

  let hasResetButton = false;
  let resetButtonLabel = '重新一次';
  let retryMsg = '';
  let backButtonLabel = '停止練習';

  if (state.scene !== 'result') {
    hasResetButton = true;
  } else {
    if (logCount < WORKING_MEMORY_MAX_ROUND) {
      hasResetButton = true;
      resetButtonLabel = '再一次挑戰';
      retryMsg = `今天還可以挑戰${WORKING_MEMORY_MAX_ROUND - logCount}次`;
    } else {
      backButtonLabel = '今天到此為止';
    }
  }

  const handleReset = () => {
    const count = state.baseCueCount + state.step * state.offset;
    const cueIds = buildCueIds(state.cueRange, count);
    const updatedState: WorkingMemoryFormState = {
      ...state,
      scene: 'opening',
      cueIds,
      log: {
        ...INITIAL_WORKING_MEMORY_LOG,
        id: nanoid(8),
        cueIds,
        offset: state.offset,
        createdAt: Date.now(),
      },
      currentIndex: 0,
    };
    dispatch(updatedState);
  };
  const handleExit = () => {
    navigate('/workout/list');
  };
  return (
    <div
      style={{
        display: 'grid',
        rowGap: 40,
        paddingTop: state.scene !== 'result' ? 80 : 40,
      }}
    >
      {hasResetButton && (
        <div style={{ display: 'grid' }}>
          <div style={{ textAlign: 'center' }}>
            <Button
              variant={state.scene !== 'result' ? 'outlined' : 'contained'}
              onClick={handleReset}
              sx={{
                width: 240,
                color: state.scene !== 'result' ? '#52a2aa' : 'white',
              }}
            >
              {resetButtonLabel}
            </Button>
          </div>
          {!!retryMsg && (
            <div style={{ textAlign: 'center', color: '#aaa', fontSize: 14 }}>
              {retryMsg}
            </div>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <Button variant='outlined' onClick={handleExit} sx={{ width: 240 }}>
          {backButtonLabel}
        </Button>
      </div>
    </div>
  );
};

export default WorkingMemoryFormFooter;
