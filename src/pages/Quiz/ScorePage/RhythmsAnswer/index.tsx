import React from 'react';
import { Quiz, Syllable } from '../../../../Model';
import CorrectAnswer from '../commons/CorrectAnswer';
import CorrectRhythms from './CorrectRhythms';
import IncorrectRhythms from './IncorrectRhythms';

const RhythmsAnswer = ({
  scoreId,
  quiz,
  questionIndex,
}: {
  quiz: Quiz;
  scoreId: string;
  questionIndex: number;
}) => {
  const question = quiz.questions[questionIndex];
  const syllablesArray: Syllable[][] = [];
  for (const syllables of Object.values(question.syllables)) {
    syllablesArray.push(syllables);
  }

  const score = quiz.scores[Number(scoreId)];
  const { rhythmAnswers } = score;
  const answer = rhythmAnswers[questionIndex];
  const answeredSpecialMoraArray: string[][] = answer
    .split('\n')
    .map((word) => word.split(',').map((specialMora) => specialMora));

  if (
    JSON.stringify(answeredSpecialMoraArray) ===
    JSON.stringify(
      syllablesArray.map((syllableUnit) =>
        syllableUnit.map((syllable) => syllable.specialMora)
      )
    )
  ) {
    return (
      <CorrectAnswer>
        <CorrectRhythms quiz={quiz} questionIndex={questionIndex} />
      </CorrectAnswer>
    );
  }
  return (
    <IncorrectRhythms quiz={quiz} questionIndex={questionIndex} score={score} />
  );
};

export default RhythmsAnswer;
