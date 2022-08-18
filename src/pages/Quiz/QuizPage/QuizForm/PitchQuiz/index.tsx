import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import { useTheme } from '@mui/material';
import React from 'react';
import { QuizFormState } from '../../Model';
import { QuizFormAction } from '../../Update';
import WordPitch from './WordPitch';

const PitchQuiz = ({
  state,
  questionIndex,
  dispatch,
}: {
  state: QuizFormState;
  questionIndex: number;
  dispatch: React.Dispatch<QuizFormAction>;
}) => {
  const theme = useTheme();
  const { questions } = state;
  const question = questions[questionIndex];
  const { japanese, inputPitchesArray } = question;
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div
        style={{
          ...(theme.typography as any).notoSerifJP,
          fontSize: 14,
        }}
      >
        {japanese}
      </div>
      <SentencePitchLine pitchesArray={inputPitchesArray} />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {inputPitchesArray.map((_, wordIndex) => (
          <WordPitch
            key={wordIndex}
            state={state}
            wordIndex={wordIndex}
            questionIndex={questionIndex}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  );
};

export default PitchQuiz;
