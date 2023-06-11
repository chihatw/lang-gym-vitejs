import React from 'react';
import { useParams } from 'react-router-dom';
import { State } from '../../../../../../Model';

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
  const { articleId } = useParams();
  if (!articleId) return <></>;
  const { articlePages } = state;
  const articlePage = articlePages[articleId];
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
