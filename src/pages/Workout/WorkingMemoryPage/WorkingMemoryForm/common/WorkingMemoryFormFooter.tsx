import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { buildCueIds } from '../../../../../services/workingMemory';
import { WorkingMemoryFormState } from '../../Model';

const WorkingMemoryFormFooter = ({
  state,
  dispatch,
}: {
  state: WorkingMemoryFormState;
  dispatch: React.Dispatch<WorkingMemoryFormState>;
}) => {
  const navigate = useNavigate();
  const handleReset = () => {
    const updatedState: WorkingMemoryFormState = {
      ...state,
      cueIds: buildCueIds(Object.keys(state.cues), state.cueCount),
      answers: [],
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
        rowGap: 16,
        paddingTop: 80,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Button variant='outlined' onClick={handleReset} sx={{ width: 240 }}>
          重新一次
        </Button>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button variant='outlined' onClick={handleExit} sx={{ width: 240 }}>
          停止練習
        </Button>
      </div>
    </div>
  );
};

export default WorkingMemoryFormFooter;
