import React from 'react';
import { State } from '../../../../../Model';

import Chinese from './Chinese';
import Japanese from './Japanese';
import Original from './Original';

const TextLines = ({
  sentenceIndex,
  state,
}: {
  sentenceIndex: number;
  state: State;
}) => {
  const { articlePage } = state;
  const { sentences } = articlePage;
  const sentence = sentences[sentenceIndex];
  const { japanese, chinese, original } = sentence;
  return (
    <>
      <Japanese japanese={japanese} />
      <Chinese chinese={chinese} />
      <Original original={original} />
    </>
  );
};

export default TextLines;
