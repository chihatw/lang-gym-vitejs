import { Divider } from '@mui/material';
import React from 'react';
import Index from './StyledIndex';

import TextLines from './TextLines';
import PitchesPane from './PitchesPane';
import { State } from '../../../Model';
import { Action } from '../../../Update';

const SentencePane = ({
  sentenceIndex,
  state,
  dispatch,
}: {
  sentenceIndex: number;
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { articlePage } = state;
  const { article, sentences } = articlePage;
  const { isShowAccents } = article;
  const sentence = sentences[sentenceIndex];
  const { id } = sentence;

  return (
    <div
      id={id}
      style={{
        rowGap: 8,
        display: 'grid',
        marginTop: -48,
        paddingTop: 48,
        paddingBottom: 8,
      }}
    >
      <Index label={sentenceIndex + 1} />
      <TextLines sentenceIndex={sentenceIndex} state={state} />
      {isShowAccents && (
        <PitchesPane
          sentenceIndex={sentenceIndex}
          state={state}
          dispatch={dispatch}
        />
      )}
      <Divider />
    </div>
  );
};

export default SentencePane;
