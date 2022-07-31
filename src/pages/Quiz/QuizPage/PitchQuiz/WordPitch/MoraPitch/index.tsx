import React from 'react';
import { State } from '../../../../../../Model';
import { Action } from '../../../../../../Update';
import Mora from './Mora';
import Sokuon from './Sokuon';
import TouchIcon from './TouchIcon';

const MoraPitch = ({
  state,
  questionIndex,
  wordIndex,
  moraIndex,
  dispatch,
}: {
  questionIndex: number;
  wordIndex: number;
  moraIndex: number;
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { quiz } = state;
  const { questions } = quiz;
  const question = questions[questionIndex];
  const { inputPitchesArray } = question;
  const wordPitches = inputPitchesArray[wordIndex];
  const isLast = moraIndex === wordPitches.length - 1;

  const mora = wordPitches[moraIndex];
  const isSokuon = ['っ', 'ッ'].includes(mora[0]);

  return (
    <div>
      <Mora mora={mora[0]} />
      {!isLast &&
        (isSokuon ? (
          <Sokuon />
        ) : (
          <TouchIcon
            state={state}
            questionIndex={questionIndex}
            wordIndex={wordIndex}
            moraIndex={moraIndex}
            dispatch={dispatch}
          />
        ))}
    </div>
  );
};

export default MoraPitch;
