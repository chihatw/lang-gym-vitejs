import { Container } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'main';

import { quizPageActions } from 'application/quizPage/framework/0-reducer';
import QuizPageHeader from 'views/components/QuizPageHeader';
import QuestionIndex from 'views/components/QuestionIndex';
import { QUIZ_TIPE } from 'application/quizPage/core/1-constants';
import PitchQuiz from './PitchQuiz';
import RhythmQuiz from './RhythmQuiz';
import QuizPageFooter from './QuizPageFooter';

const QuizPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { quizId } = useParams();

  const quizzes = useSelector((state: RootState) => state.quizzes);

  useEffect(() => {
    !quizId && navigate('/');
  }, [quizId]);

  useEffect(() => {
    if (!quizId) return;
    dispatch(quizPageActions.initiate(quizId));
  }, [quizId]);

  const quiz = useMemo(() => quizzes[quizId!] || null, [quizId, quizzes]);

  if (!quiz) return <></>;

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div style={{ display: 'grid', rowGap: 24 }}>
          <QuizPageHeader title={quiz.title} createdAt={quiz.createdAt} />
          {quiz.questionIds.map((questionId, index) => (
            <div key={index} style={{ display: 'grid', rowGap: 8 }}>
              <QuestionIndex index={index + 1} />
              {quiz.type === QUIZ_TIPE.articleAccents && (
                <PitchQuiz questionId={questionId} />
              )}
              {quiz.type === QUIZ_TIPE.articleRhythms && (
                <RhythmQuiz questionId={questionId} />
              )}
            </div>
          ))}
        </div>
        <div style={{ height: 32 }} />
        <QuizPageFooter />
      </div>
    </Container>
  );
};

export default QuizPage;
