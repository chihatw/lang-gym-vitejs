import { useSelector } from 'react-redux';

import { RootState } from 'main';

import AccentsQuestionRow from './AccentsQuestionRow';
import RhythmsQuestionRow from './RhythmsQuestionRow';
import QuestionIndex from 'views/components/QuestionIndex';
import { selectQuiz } from 'application/scorePage/framework/2-selector';

function ScorePageQuestionRow({
  index,
  questionId,
}: {
  index: number;
  questionId: string;
}) {
  const quiz = useSelector((state: RootState) => selectQuiz(state));

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
