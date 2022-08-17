import * as R from 'ramda';
import { Navigate, useLocation } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';

import { QuizState, State } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { getQuestionSet } from '../../../services/quiz';
import { Container } from '@mui/material';
import QuizPageFooter from './QuizPageFooter';
import QuizPageHeader from '../commons/QuizHeader';
import QuestionIndex from '../commons/QuestionIndex';
import PitchQuiz from './PitchQuiz';
import RhythmQuiz from './RhythmQuiz';
import SkeletonPage from '../../../components/SkeletonPage';
import { AppContext } from '../../../App';

const QuizPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { pathname } = useLocation();
  const questionSetId = pathname.split('/').slice(-1)[0];

  const { auth, isFetching, memo, quiz } = state;
  const { uid } = auth;

  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      const memorizedQuiz = memo.quizzes[questionSetId];
      const quiz = memorizedQuiz || (await getQuestionSet(questionSetId));

      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<QuizState, State>(['quiz'], quiz),
        R.assocPath<QuizState, State>(['memo', 'quizzes', quiz.id], quiz)
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
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
                <PitchQuiz questionIndex={questionIndex} />
              )}
              {type === 'articleRhythms' && (
                <RhythmQuiz questionIndex={questionIndex} />
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
