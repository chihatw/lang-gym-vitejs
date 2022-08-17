import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../../../../App';
import { State } from '../../../../../../Model';
import { Action } from '../../../../../../Update';
import Mora from './Mora';
import Sokuon from './Sokuon';
import TouchIcon from './TouchIcon';

const MoraPitch = ({
  questionIndex,
  wordIndex,
  moraIndex,
}: {
  questionIndex: number;
  wordIndex: number;
  moraIndex: number;
}) => {
  const { quizId } = useParams();
  if (!quizId) return <></>;
  const { state } = useContext(AppContext);
  const { quizzes } = state;
  const quiz = quizzes[quizId];
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
            questionIndex={questionIndex}
            wordIndex={wordIndex}
            moraIndex={moraIndex}
          />
        ))}
    </div>
  );
};

export default MoraPitch;
