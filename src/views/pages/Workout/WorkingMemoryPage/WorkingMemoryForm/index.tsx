import { Container } from '@mui/material';
import React from 'react';

import { WorkingMemoryFormState } from '../Model';
import WorkingMemoryAnswerPane from './WorkingMemoryAnswer';

import WorkingMemoryPlayButton from './WorkingMemoryPlayButton';
import WorkingMemoryHeader from './WorkingMemoryHeader';
import WorkingMemoryOpening from './WorkingMemoryOpening';
import WorkingMemoryResultPane from './WorkingMemoryResult';

const WorkingMemoryForm = ({
  state,
  dispatch,
}: {
  state: WorkingMemoryFormState;
  dispatch: React.Dispatch<WorkingMemoryFormState>;
}) => {
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 8, paddingBottom: 120 }}>
        <div style={{ display: 'grid', rowGap: 8 }}>
          {(() => {
            switch (state.scene) {
              case 'opening':
                return (
                  <WorkingMemoryOpening state={state} dispatch={dispatch} />
                );
              case 'playbutton':
                return (
                  <>
                    <WorkingMemoryHeader state={state} />
                    <WorkingMemoryPlayButton
                      state={state}
                      dispatch={dispatch}
                    />
                  </>
                );
              case 'answer':
                return (
                  <>
                    <WorkingMemoryHeader state={state} />
                    <WorkingMemoryAnswerPane
                      state={state}
                      dispatch={dispatch}
                    />
                  </>
                );
              case 'result':
                return (
                  <WorkingMemoryResultPane state={state} dispatch={dispatch} />
                );
              default:
                return <></>;
            }
          })()}
        </div>
      </div>
    </Container>
  );
};

export default WorkingMemoryForm;
