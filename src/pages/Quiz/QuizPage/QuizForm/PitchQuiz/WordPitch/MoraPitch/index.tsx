import React from 'react';
import { QuizFormState } from '../../../../Model';
import { QuizFormAction } from '../../../../Update';
import Kana from './Kana';
import Sokuon from './Sokuon';
import TouchIcon from './TouchIcon';

const MoraPitch = ({
  state,
  wordIndex,
  moraIndex,
  questionIndex,
  dispatch,
}: {
  state: QuizFormState;
  wordIndex: number;
  moraIndex: number;
  questionIndex: number;
  dispatch: React.Dispatch<QuizFormAction>;
}) => {
  const { questions } = state;
  const question = questions[questionIndex];
  const { inputPitchesArray } = question;
  const wordPitches = inputPitchesArray[wordIndex];
  const mora = wordPitches[moraIndex];
  const isLast = moraIndex === wordPitches.length - 1;
  const kana = mora[0];
  const isSokuon = ['っ', 'ッ'].includes(kana);
  return (
    <div>
      <Kana kana={kana} />
      {!isLast &&
        (isSokuon ? (
          <Sokuon />
        ) : (
          <TouchIcon
            state={state}
            wordIndex={wordIndex}
            moraIndex={moraIndex}
            questionIndex={questionIndex}
            dispatch={dispatch}
          />
        ))}
    </div>
  );
};

export default MoraPitch;
