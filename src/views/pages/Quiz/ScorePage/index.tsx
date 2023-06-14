import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

import { RootState } from 'main';

import QuizPageHeader from '../commons/QuizPageHeader';
import Score from './Score';
import ScoreFooter from './ScoreFooter';
import { scorePageActions } from 'application/scorePage/framework/0-reducer';
import ScorePageQuestionRow from './ScorePageQuestionRow';

const ScorePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { quizId, scoreId: scoreCreatedAt } = useParams(); // scoreId は実は scoreCreatedAt

  const quizzes = useSelector((state: RootState) => state.quizzes);

  useEffect(() => {
    if (!quizId || !scoreCreatedAt) {
      navigate('/');
    }
  }, [quizId, scoreCreatedAt]);

  useEffect(() => {
    if (!quizId || !scoreCreatedAt) return;
    dispatch(scorePageActions.initiate({ quizId, scoreCreatedAt }));
  }, [quizId, scoreCreatedAt]);

  const quiz = useMemo(() => quizzes[quizId!] || null, [quizId, quizzes]);

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
