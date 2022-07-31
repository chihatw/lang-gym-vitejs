import { Navigate, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';

import { Container } from '@mui/material';

import { State } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import QuestionIndex from '../commons/QuestionIndex';
import { getQuestionSet, getQuestionSetScore } from '../../../services/quiz';

import SpeakerButton from '../commons/SpeakerButton';
import AccentsAnswer from './AccentsAnswer';
import QuizPageHeader from '../commons/QuizHeader';
import Score from './Score';
import RhythmsAnswer from './RhythmsAnswer';
import ScoreFooter from './ScoreFooter';
import SkeletonPage from '../../../components/SkeletonPage';

const ScorePage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { pathname } = useLocation();
  const items = pathname.split('/');
  // 先頭を破棄
  items.shift();
  const questionSetScoreId = items[1];
  const questionSetId = items[3];
  const { auth, isFetching, memo, score, quiz } = state;
  const { uid } = auth;

  useEffect(() => {
    if (!isFetching || !questionSetScoreId || !questionSetId) return;
    const fetchData = async () => {
      const memorizedScore = memo.scores[questionSetScoreId];
      const memorizedQuiz = memo.quizzes[questionSetId];
      const score =
        memorizedScore || (await getQuestionSetScore(questionSetScoreId));
      const quiz = memorizedQuiz || (await getQuestionSet(questionSetId));
      dispatch({ type: ActionTypes.setScore, payload: { quiz, score } });
    };

    fetchData();
  }, [isFetching, questionSetScoreId, memo, dispatch, questionSetId]);

  if (!uid) return <Navigate to='/login' />;
  if (isFetching) return <SkeletonPage />;
  if (!score.id || !quiz.id) return <Navigate to='/' />;
  const { type, questions } = quiz;
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div style={{ display: 'grid', rowGap: 24 }}>
          <QuizPageHeader state={state} isScore />
          <Score state={state} />
          <div style={{ display: 'grid', rowGap: 24 }}>
            {questions.map((_, questionIndex) => (
              <div key={questionIndex} style={{ display: 'grid', rowGap: 8 }}>
                <QuestionIndex index={questionIndex + 1} />
                {type === 'articleAccents' && (
                  <AccentsAnswer state={state} questionIndex={questionIndex} />
                )}
                {type === 'articleRhythms' && (
                  <div>
                    <SpeakerButton
                      state={state}
                      questionIndex={questionIndex}
                    />
                    <RhythmsAnswer
                      state={state}
                      questionIndex={questionIndex}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 80 }} />
        <ScoreFooter dispatch={dispatch} />
      </div>
    </Container>
  );
};

export default ScorePage;
