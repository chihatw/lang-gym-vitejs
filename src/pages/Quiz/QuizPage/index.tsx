import { Navigate, useLocation } from 'react-router-dom';
import { SkeletonPage } from '@chihatw/lang-gym-h.page.skeleton-page';
import React, { useEffect } from 'react';

import { State } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { getQuestionSet } from '../../../services/quiz';
import { Container } from '@mui/material';
import QuizPageFooter from './QuizPageFooter';
import QuizPageHeader from '../commons/QuizHeader';
import QuestionIndex from '../commons/QuestionIndex';
import PitchQuiz from './PitchQuiz';
import RhythmQuiz from './RhythmQuiz';

const QuizPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { pathname } = useLocation();
  const questionSetId = pathname.split('/').slice(-1)[0];

  const { auth, isFetching, memo, quiz } = state;
  const { uid } = auth;

  useEffect(() => {
    if (!isFetching) return;
    const fetchData = async () => {
      const memorizedQuiz = memo.quizzes[questionSetId];
      const quiz = memorizedQuiz || (await getQuestionSet(questionSetId));

      dispatch({ type: ActionTypes.setQuiz, payload: quiz });
    };
    fetchData();
  }, [isFetching, questionSetId, memo, dispatch]);

  if (!uid) return <Navigate to='/login' />;
  if (isFetching) return <SkeletonPage />;
  if (!quiz.title) return <Navigate to='/' />;

  const { type, questions } = quiz;
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div style={{ display: 'grid', rowGap: 24 }}>
          <QuizPageHeader state={state} />

          {questions.map((_, questionIndex) => (
            <div key={questionIndex} style={{ display: 'grid', rowGap: 8 }}>
              <QuestionIndex index={questionIndex + 1} />
              {type === 'articleAccents' && (
                <PitchQuiz
                  state={state}
                  questionIndex={questionIndex}
                  dispatch={dispatch}
                />
              )}
              {type === 'articleRhythms' && (
                <RhythmQuiz
                  state={state}
                  questionIndex={questionIndex}
                  dispatch={dispatch}
                />
              )}
            </div>
          ))}
        </div>
        <div style={{ height: 32 }} />
        <QuizPageFooter state={state} dispatch={dispatch} />
      </div>
    </Container>
  );
};

export default QuizPage;
