import React, { useContext } from 'react';
import { AppContext } from '../../../../..';
import AssignmentPitches from './AssignmentPitches';
import SentencePitches from './SentencePitches';

const PitchesPane = ({ sentenceIndex }: { sentenceIndex: number }) => {
  const { state, dispatch } = useContext(AppContext);
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <SentencePitches sentenceIndex={sentenceIndex} />
      <AssignmentPitches sentenceIndex={sentenceIndex} />
    </div>
  );
};

export default PitchesPane;
