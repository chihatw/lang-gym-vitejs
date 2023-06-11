import { useTheme } from '@mui/material';
import React from 'react';
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
  if (!Object.keys(state.log.practice).length) return <></>;

  const theme = useTheme();

  let updateOffsetMsg = `正確率66〜84%，繼續加油！`;
  if (state.log.correctRatio <= 65) {
    updateOffsetMsg = `正確率65%以下，不用焦急。下次挑戰前${Math.max(
      1,
      state.log.offset - 1
    )}項`;
  } else if (state.log.correctRatio >= 85) {
    updateOffsetMsg = `正確率85%以上，表現很好！下次挑戰前${
      state.log.offset + 1
    }項`;
  }

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
          {state.log.correctRatio}
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
            dispatch={dispatch}
          />
        ))}
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}
      >
        {updateOffsetMsg}
      </div>
      <WorkingMemoryFormFooter state={state} dispatch={dispatch} />
    </div>
  );
};

export default WorkingMemoryResultPane;
