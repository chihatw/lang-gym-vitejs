import { Container } from '@mui/material';
import { memo, useEffect } from 'react';
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
import { selectQuizById } from 'application/quizzes/framework/0-reducer';

const QuizPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { quizId } = useParams();

  const initializing = useSelector(
    (state: RootState) => state.quizPage.initializing
  );

  const quiz = useSelector((state: RootState) =>
    selectQuizById(state, String(quizId))
  );

  useEffect(() => {
    return () => {
      dispatch(quizPageActions.clearState());
    };
  }, []);

  useEffect(() => {
    !quizId && navigate('/');
  }, [quizId]);

  useEffect(() => {
    if (!initializing) return;
    if (!quizId) return;
    dispatch(quizPageActions.initiate(quizId));
  }, [quizId, initializing]);

  if (!quiz) return <></>;

  const content = (() => {
    switch (quiz.type) {
      case QUIZ_TIPE.articleAccents:
        return (questionId: string) => <PitchQuiz questionId={questionId} />;
      case QUIZ_TIPE.articleRhythms:
        return (questionId: string) => <RhythmQuiz questionId={questionId} />;
      default:
        return (questionId: string) => <></>;
    }
  })();

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div style={{ display: 'grid', rowGap: 24 }}>
          <QuizPageHeader title={quiz.title} createdAt={quiz.createdAt} />
          {quiz.questionIds.map((questionId, index) => (
            <div key={index} style={{ display: 'grid', rowGap: 8 }}>
              <QuestionIndex index={index + 1} />
              {content(questionId)}
            </div>
          ))}
        </div>
        <div style={{ height: 32 }} />
        <QuizPageFooter />
      </div>
    </Container>
  );
};

export default memo(QuizPage);
