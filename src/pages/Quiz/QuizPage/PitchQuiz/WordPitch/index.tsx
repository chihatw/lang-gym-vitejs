import React, { useContext } from 'react';
import { AppContext } from '../../../../../App';
import { State } from '../../../../../Model';
import { Action } from '../../../../../Update';
import MoraPitch from './MoraPitch';

const WordPitch = ({
  questionIndex,
  wordIndex,
}: {
  questionIndex: number;
  wordIndex: number;
}) => {
  const { state, dispatch } = useContext(AppContext);
  const { quiz } = state;
  const { questions } = quiz;
  const question = questions[questionIndex];
  const { disableds, inputPitchesArray } = question;
  const wordPitches = inputPitchesArray[wordIndex];
  const disabled = disableds.includes(wordIndex);
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
            key={moraIndex}
            questionIndex={questionIndex}
            wordIndex={wordIndex}
            moraIndex={moraIndex}
          />
        ))}
      </div>
      <div style={{ width: 8 }} />
    </div>
  );
};

export default WordPitch;
