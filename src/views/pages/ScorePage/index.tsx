import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { RootState } from 'main';

import Score from './Score';
import ScoreFooter from './ScoreFooter';
import { scorePageActions } from 'application/scorePage/framework/0-reducer';
import ScorePageQuestionRow from './ScorePageQuestionRow';
import QuizPageHeader from 'views/components/QuizPageHeader';
import { selectQuiz } from 'application/scorePage/framework/2-selector';

const ScorePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { quizId, scoreId: scoreCreatedAt } = useParams(); // params の scoreId は実は scoreCreatedAt

  const quiz = useSelector((state: RootState) => selectQuiz(state));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!quizId || !scoreCreatedAt) {
      navigate('/');
    }
  }, [quizId, scoreCreatedAt]);

  useEffect(() => {
    if (!quizId || !scoreCreatedAt) return;
    dispatch(scorePageActions.initiate({ quizId, scoreCreatedAt }));
  }, [quizId, scoreCreatedAt]);

  if (!quiz || !scoreCreatedAt) return <></>;

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div style={{ display: 'grid', rowGap: 24 }}>
          <QuizPageHeader title={quiz.title} createdAt={quiz.createdAt} />
          <Score />
          <div style={{ display: 'grid', rowGap: 24 }}>
            {quiz.questionIds.map((questionId, index) => (
              <ScorePageQuestionRow
                key={index}
                index={index}
                questionId={questionId}
              />
            ))}
          </div>
        </div>
        <div style={{ height: 80 }} />
        <ScoreFooter />
      </div>
    </Container>
  );
};

export default ScorePage;
