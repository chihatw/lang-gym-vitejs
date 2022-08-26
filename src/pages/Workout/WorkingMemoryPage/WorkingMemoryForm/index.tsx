import { Container } from '@mui/material';
import React from 'react';

import { WorkingMemoryFormState } from '../Model';
import WorkingMemoryAnswerPane from './WorkingMemoryAnswerPane';

import WorkingMemoryFormPlayButton from './WorkingMemoryFormPlayButton';
import WorkingMemoryHeader from './WorkingMemoryHeader';
import WorkingMemoryResultPane from './WorkingMemoryResultPane';

const WorkingMemoryForm = ({
  state,
  dispatch,
  handleSubmit,
}: {
  state: WorkingMemoryFormState;
  dispatch: React.Dispatch<WorkingMemoryFormState>;
  handleSubmit: (state: WorkingMemoryFormState) => void;
}) => {
  if (!state.cueIds.length) return <></>;
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 8, paddingBottom: 120 }}>
        <div style={{ display: 'grid', rowGap: 8 }}>
          <WorkingMemoryHeader state={state} />
          {(() => {
            if (state.currentIndex < state.offset) {
              return (
                <WorkingMemoryFormPlayButton
                  state={state}
                  dispatch={dispatch}
                />
              );
            }
            if (state.currentIndex < state.offset + state.cueCount) {
              return (
                <WorkingMemoryAnswerPane
                  state={state}
                  dispatch={dispatch}
                  handleSubmit={handleSubmit}
                />
              );
            }
            return (
              <WorkingMemoryResultPane state={state} dispatch={dispatch} />
            );
          })()}
        </div>
      </div>
    </Container>
  );
};

export default WorkingMemoryForm;
