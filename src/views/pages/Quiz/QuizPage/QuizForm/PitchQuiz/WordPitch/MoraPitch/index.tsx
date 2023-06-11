import React from 'react';
import { QuizFormState } from '../../../../Model';
import Kana from './Kana';
import Sokuon from './Sokuon';
import TouchIcon from './TouchIcon';

const MoraPitch = ({
  mora,
  state,
  isLast,
  disabled,
  isAccent,
  wordIndex,
  moraIndex,
  inputPitchesArray,
  questionIndex,
  dispatch,
}: {
  state: QuizFormState;
  wordIndex: number;
  moraIndex: number;
  questionIndex: number;
  isLast: boolean;
  mora: string[];
  disabled: boolean;
  inputPitchesArray: string[][][];
  isAccent: boolean;
  dispatch: React.Dispatch<QuizFormState>;
}) => {
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
            isAccent={isAccent}
            disabled={disabled}
            wordIndex={wordIndex}
            moraIndex={moraIndex}
            questionIndex={questionIndex}
            inputPitchesArray={inputPitchesArray}
            dispatch={dispatch}
          />
        ))}
    </div>
  );
};

export default MoraPitch;
