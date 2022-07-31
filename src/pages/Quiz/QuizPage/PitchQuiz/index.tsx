import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import { useTheme } from '@mui/material';
import React from 'react';
import WordPitch from './WordPitch';
import { State } from '../../../../Model';
import { Action } from '../../../../Update';

const PitchQuiz = ({
  state,
  questionIndex,
  dispatch,
}: {
  state: State;
  questionIndex: number;
  dispatch: React.Dispatch<Action>;
}) => {
  const theme = useTheme();
  const { quiz } = state;
  const { questions } = quiz;
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
        {inputPitchesArray.map((_, index) => (
          <WordPitch
            key={index}
            state={state}
            wordIndex={index}
            questionIndex={questionIndex}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  );
};

export default PitchQuiz;
