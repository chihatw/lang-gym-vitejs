import { useTheme } from '@mui/material';

import React, { useContext } from 'react';

import AudioSlider from '../../../../../components/AudioSlider';

import { AppContext } from '../../../../..';
import { useParams } from 'react-router-dom';
import SentencePitchLine from '../../../../../components/SentencePitchLine';

const SentencePitches = ({ sentenceIndex }: { sentenceIndex: number }) => {
  const { articleId } = useParams();
  if (!articleId) return <></>;
  const { state } = useContext(AppContext);
  const theme = useTheme();
  const { articlePages } = state;
  const articlePage = articlePages[articleId];
  const { sentences, articleBlob } = articlePage;

  const articleSentence = sentences[sentenceIndex];
  const sentence = articleSentence;

  const blob = articleBlob;
  const { start, end, pitchStr } = sentence;

  return (
    <div
      style={{
        border: '1px solid #A9D1D5',
        padding: 8,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          ...(theme.typography as any).mPlusRounded,
          color: '#52a2aa',
          fontSize: 12,
          marginBottom: 8,
        }}
      >
        {`${'音調'}:`}
      </div>
      {blob && (
        <div
          style={{
            display: 'grid',
            position: 'relative',
            marginLeft: -8,
            marginTop: -16,
          }}
        >
          <AudioSlider end={end} start={start} spacer={5} blob={blob} />
        </div>
      )}
      <SentencePitchLine pitchStr={pitchStr} />
    </div>
  );
};

export default SentencePitches;
