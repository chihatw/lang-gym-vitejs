import React from 'react';
import { useParams } from 'react-router-dom';
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
  const { scoreId, quizId } = useParams();
  if (!scoreId || !quizId) return <></>;
  const { scores, quizzes } = state;
  const quiz = quizzes[quizId];
  const score = scores[scoreId];
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
