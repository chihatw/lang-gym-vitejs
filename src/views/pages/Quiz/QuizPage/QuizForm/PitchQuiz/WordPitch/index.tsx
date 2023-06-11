import React from 'react';
import { QuizFormQuestion, QuizFormState } from '../../../Model';
import MoraPitch from './MoraPitch';
import string2PitchesArray from 'string2pitches-array';

const WordPitch = ({
  state,
  question,
  wordIndex,
  questionIndex,
  dispatch,
}: {
  state: QuizFormState;
  question: QuizFormQuestion;
  wordIndex: number;
  questionIndex: number;
  dispatch: React.Dispatch<QuizFormState>;
}) => {
  const disabled = question.disableds.includes(wordIndex);
  // todo check split
  const wordPitchStr = question.inputPitchStr.split(' ')[wordIndex];
  const wordPitches = string2PitchesArray(wordPitchStr)[0];
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
        {wordPitches.map((mora, moraIndex) => {
          const next = wordPitches[moraIndex + 1];
          return (
            <MoraPitch
              key={moraIndex}
              mora={mora}
              state={state}
              isLast={moraIndex === wordPitches.length - 1}
              disabled={disabled}
              isAccent={!!next && next.length === 1 && mora.length === 2}
              wordIndex={wordIndex}
              moraIndex={moraIndex}
              questionIndex={questionIndex}
              inputPitchStr={question.inputPitchStr}
              dispatch={dispatch}
            />
          );
        })}
      </div>
      <div style={{ width: 8 }} />
    </div>
  );
};

export default WordPitch;
