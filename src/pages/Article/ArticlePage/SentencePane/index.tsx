import { Divider } from '@mui/material';
import React, { useContext } from 'react';
import Index from './StyledIndex';

import TextLines from './TextLines';
import PitchesPane from './PitchesPane';
import { AppContext } from '../../../../App';
import { useParams } from 'react-router-dom';

const SentencePane = ({ sentenceIndex }: { sentenceIndex: number }) => {
  const { articleId } = useParams();
  if (!articleId) return <></>;

  const { state } = useContext(AppContext);
  const { articlePages } = state;
  const articlePage = articlePages[articleId];
  const { article, sentences } = articlePage;
  const { isShowAccents } = article;
  const sentence = sentences[sentenceIndex];
  const { id: sentenceId } = sentence;

  return (
    <div
      id={sentenceId}
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
      {isShowAccents && <PitchesPane sentenceIndex={sentenceIndex} />}
      <Divider />
    </div>
  );
};

export default SentencePane;
