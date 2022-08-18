import React from 'react';
import { QuizFormState } from '../../../Model';
import { QuizFormAction } from '../../../Update';
import MoraPitch from './MoraPitch';

const WordPitch = ({
  state,
  wordIndex,
  questionIndex,
  dispatch,
}: {
  state: QuizFormState;
  wordIndex: number;
  questionIndex: number;
  dispatch: React.Dispatch<QuizFormAction>;
}) => {
  const { questions } = state;
  const question = questions[questionIndex];
  const { disableds, inputPitchesArray } = question;
  const disabled = disableds.includes(wordIndex);
  const wordPitches = inputPitchesArray[wordIndex];
  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          paddingTop: 8,
          marginBottom: 16,
          borderRadius: 4,
          backgroundColor: disabled ? '#eee' : 'transparent',
        }}
      >
        {wordPitches.map((_, moraIndex) => (
          <MoraPitch
            state={state}
            key={moraIndex}
            questionIndex={questionIndex}
            wordIndex={wordIndex}
            moraIndex={moraIndex}
            dispatch={dispatch}
          />
        ))}
      </div>
      <div style={{ width: 8 }} />
    </div>
  );
};

export default WordPitch;
