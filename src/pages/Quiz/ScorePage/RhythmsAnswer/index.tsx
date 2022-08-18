import React from 'react';
import { ScoreState } from '../../../../Model';
import { QuizFormState } from '../../QuizPage/Model';
import CorrectAnswer from '../commons/CorrectAnswer';
import CorrectRhythms from './CorrectRhythms';
import IncorrectRhythms from './IncorrectRhythms';

const RhythmsAnswer = ({
  score,
  state,
  questionIndex,
}: {
  score: ScoreState;
  state: QuizFormState;
  questionIndex: number;
}) => {
  const { questions } = state;
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
  return (
    <IncorrectRhythms
      state={state}
      questionIndex={questionIndex}
      score={score}
    />
  );
};

export default RhythmsAnswer;
