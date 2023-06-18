import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';

import { RootState } from 'main';

import WordPitch from './WordPitch';

import AudioBufferSlider from 'views/components/AudioBufferSlider';
import SentencePitchLine from 'views/components/SentencePitchLine';
import {
  selectInputPitchStr,
  selectQuizAudioBuffer,
} from 'application/quizPage/framework/2-selector';
import { buildWordPitchStrs } from 'application/utils/utils';

const PitchQuiz = ({ questionId }: { questionId: string }) => {
  const theme = useTheme();

  const inputPitchStr = useSelector((state: RootState) =>
    selectInputPitchStr(state, questionId)
  );

  const wordPitchStrs = useMemo(
    () => buildWordPitchStrs(inputPitchStr),
    [inputPitchStr]
  );

  const question = useSelector(
    (state: RootState) => state.quizQuestions.entities[questionId]
  );

  const audioBuffer = useSelector((state: RootState) =>
    selectQuizAudioBuffer(state)
  );

  if (!question || !wordPitchStrs.length) return <></>;

  const wordPitches = wordPitchStrs.map((wordPitchStr, wordIndex) => (
    <WordPitch
      key={wordIndex}
      wordIndex={wordIndex}
      questionId={questionId}
      wordPitchStr={wordPitchStr}
    />
  ));

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      {!!audioBuffer && (
        <AudioBufferSlider
          end={question.end}
          start={question.start}
          audioBuffer={audioBuffer}
        />
      )}
      <div
        style={{
          ...(theme.typography as any).notoSerifJP,
          fontSize: 14,
        }}
      >
        {question.japanese}
      </div>
      <SentencePitchLine pitchStr={inputPitchStr} />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>{wordPitches}</div>
    </div>
  );
};

export default React.memo(PitchQuiz);
