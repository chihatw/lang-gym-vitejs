import { useTheme } from '@mui/material';
import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import React from 'react';

import AudioSlider from '../../../../components/AudioSlider';

import { State } from '../../../../Model';
import { INITIAL_ASSIGNMENT_SENTENCE } from '../../../../services/article';

const SentencePitches = ({
  state,
  sentenceIndex,
  isAssignment,
}: {
  state: State;
  sentenceIndex: number;
  isAssignment?: boolean;
}) => {
  const theme = useTheme();
  const { articlePage, audioContext } = state;
  const { sentences, articleAssignmentSentences, articleBlob, assignmentBlob } =
    articlePage;

  const articleSentence = sentences[sentenceIndex];
  const assignmentSentence =
    articleAssignmentSentences[sentenceIndex] || INITIAL_ASSIGNMENT_SENTENCE;
  const sentence = isAssignment ? assignmentSentence : articleSentence;

  const blob = isAssignment ? assignmentBlob : articleBlob;

  const { start, end, pitchesArray } = sentence;
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
        {`${isAssignment ? '練習' : '音調'}:`}
      </div>
      {audioContext && blob && (
        <div
          style={{
            display: 'grid',
            position: 'relative',
            marginLeft: -8,
            marginTop: -16,
          }}
        >
          <AudioSlider
            end={end}
            start={start}
            spacer={5}
            audioContext={audioContext}
            blob={blob}
          />
        </div>
      )}
      <SentencePitchLine pitchesArray={pitchesArray} />
    </div>
  );
};

export default SentencePitches;
