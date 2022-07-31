import React from 'react';
import { State } from '../../../../Model';
import CorrectAnswer from '../commons/CorrectAnswer';
import CorrectRhythms from './CorrectRhythms';
import IncorrectRhythms from './IncorrectRhythms';

const RhythmsAnswer = ({
  state,
  questionIndex,
}: {
  state: State;
  questionIndex: number;
}) => {
  const { score, quiz } = state;
  const { questions } = quiz;
  const question = questions[questionIndex];
  const { answers } = score;
  const { id: questionId, syllablesArray } = question;

  const answer = answers[questionId];
  const answeredSpecialMoraArray = JSON.parse(answer);

  if (
    JSON.stringify(answeredSpecialMoraArray) ===
    JSON.stringify(
      syllablesArray.map((syllableUnit) =>
        syllableUnit.map((syllable) => syllable.mora)
      )
    )
  ) {
    return (
      <CorrectAnswer>
        <CorrectRhythms state={state} questionIndex={questionIndex} />
      </CorrectAnswer>
    );
  }
  return <IncorrectRhythms state={state} questionIndex={questionIndex} />;
};

export default RhythmsAnswer;
