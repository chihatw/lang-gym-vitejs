import { useSelector } from 'react-redux';
import { useMemo } from 'react';

import { RootState } from 'main';

import QuestionIndex from '../../commons/QuestionIndex';
import AccentsQuestionRow from './AccentsQuestionRow';
import RhythmsQuestionRow from './RhythmsQuestionRow';

function ScorePageQuestionRow({
  index,
  questionId,
}: {
  index: number;
  questionId: string;
}) {
  const { quizId } = useSelector((state: RootState) => state.scorePage);
  const quizzes = useSelector((state: RootState) => state.quizzes);
  const quiz = useMemo(() => quizzes[quizId!] || null, [quizId, quizzes]);

  if (!quiz) return <></>;
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <QuestionIndex index={index + 1} />
      {quiz.type === 'articleAccents' && (
        <AccentsQuestionRow questionId={questionId} index={index} />
      )}

      {quiz.type === 'articleRhythms' && (
        <RhythmsQuestionRow questionId={questionId} index={index} />
      )}
    </div>
  );
}

export default ScorePageQuestionRow;
