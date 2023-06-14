import { useMemo } from 'react';
import CorrectAnswer from '../../../commons/CorrectAnswer';
import CorrectRhythms from './CorrectRhythms';
import IncorrectRhythms from './IncorrectRhythms';
import { useSelector } from 'react-redux';
import { RootState } from 'main';

const RhythmsAnswer = ({
  index,
  questionId,
}: {
  index: number;
  questionId: string;
}) => {
  const { quizId, scoreCreatedAt } = useSelector(
    (state: RootState) => state.scorePage
  );
  const quizzes = useSelector((state: RootState) => state.quizzes);
  const quizScores = useSelector((state: RootState) => state.quizScores);
  const quizQuestions = useSelector((state: RootState) => state.quizQuestions);

  const quiz = useMemo(() => quizzes[quizId!] || null, [quizId, quizzes]);
  const score = useMemo(() => {
    if (!quiz) return null;
    return (
      quiz.scoreIds
        .map((scoreId) => quizScores[scoreId])
        .find((score) => score.createdAt === Number(scoreCreatedAt)) || null
    );
  }, [scoreCreatedAt, quiz]);

  const question = useMemo(
    () => quizQuestions[questionId] || null,
    [questionId, quizQuestions]
  );
  const syllablesArray = Object.values(question.syllables);

  const answeredSpecialMoraArray = score
    ? score.rhythmAnswers[index]
        .split('\n')
        .map((word) => word.split(',').map((specialMora) => specialMora))
    : [];

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
        <CorrectRhythms questionId={questionId} />
      </CorrectAnswer>
    );
  }
  return <IncorrectRhythms index={index} questionId={questionId} />;
};

export default RhythmsAnswer;
