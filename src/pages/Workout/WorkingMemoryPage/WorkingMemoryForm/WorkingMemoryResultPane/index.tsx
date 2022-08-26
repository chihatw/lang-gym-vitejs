import { Button, useTheme } from '@mui/material';
import React from 'react';
import { buildCueIds } from '../../../../../services/workingMemory';
import { WorkingMemoryFormState } from '../../Model';
import WorkingMemoryFormFooter from '../common/WorkingMemoryFormFooter';
import WorkingMemoryResultAnswerListHeader from './WorkingMemoryResultAnswerListHeader';
import WorkingMemoryResultAnswerRow from './WorkingMemoryResultAnswerRow';

const WorkingMemoryResultPane = ({
  state,
  dispatch,
}: {
  state: WorkingMemoryFormState;
  dispatch: React.Dispatch<WorkingMemoryFormState>;
}) => {
  if (!state.answers.length) return <></>;

  const theme = useTheme();
  let correctCount = 0;
  state.answers.forEach((answer, index) => {
    const cueId = state.cueIds[index] || '';
    const answerId = answer.tapped.slice(-1)[0];
    if (answerId === cueId) {
      correctCount++;
    }
  });
  const correctRatio = Math.round((correctCount / state.cueCount) * 100);

  return (
    <div style={{ display: 'grid', rowGap: 8, color: '#555' }}>
      <div style={{ textAlign: 'center' }}>
        <span>正解率:</span>
        <span
          style={{
            ...(theme.typography as any).lato900,

            fontSize: 100,
          }}
        >
          {correctRatio}
        </span>
        <span>%</span>
      </div>
      <div style={{ display: 'grid', rowGap: 8 }}>
        <WorkingMemoryResultAnswerListHeader />
        {state.cueIds.map((_, index) => (
          <WorkingMemoryResultAnswerRow
            key={index}
            state={state}
            index={index}
          />
        ))}
      </div>
      <WorkingMemoryFormFooter state={state} dispatch={dispatch} />
    </div>
  );
};

export default WorkingMemoryResultPane;
