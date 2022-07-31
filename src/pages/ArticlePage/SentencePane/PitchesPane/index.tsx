import React from 'react';
import { State } from '../../../../Model';
import { Action } from '../../../../Update';
import AssignmentPitches from './AssignmentPitches';
import SentencePitches from './SentencePitches';

const PitchesPane = ({
  sentenceIndex,
  state,
  dispatch,
}: {
  sentenceIndex: number;
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <SentencePitches state={state} sentenceIndex={sentenceIndex} />
      <AssignmentPitches
        state={state}
        sentenceIndex={sentenceIndex}
        dispatch={dispatch}
      />
    </div>
  );
};

export default PitchesPane;
