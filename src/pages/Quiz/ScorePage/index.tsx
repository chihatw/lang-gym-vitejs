import * as R from 'ramda';
import { Navigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';

import { Container } from '@mui/material';

import { QuizState, ScoreState, State } from '../../../Model';
import { ActionTypes } from '../../../Update';
import QuestionIndex from '../commons/QuestionIndex';
import { getQuestionSet, getQuestionSetScore } from '../../../services/quiz';

import SpeakerButton from '../commons/SpeakerButton';
import AccentsAnswer from './AccentsAnswer';
import QuizPageHeader from '../commons/QuizHeader';
import Score from './Score';
import RhythmsAnswer from './RhythmsAnswer';
import ScoreFooter from './ScoreFooter';
import SkeletonPage from '../../../components/SkeletonPage';
import { AppContext } from '../../../App';

const ScorePage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { scoreId, quizId } = useParams();
  if (!quizId || !scoreId) return <></>;
  const { auth, isFetching, scores, quizzes } = state;
  const quiz = quizzes[quizId];
  const score = scores[scoreId];
  const { uid } = auth;

  useEffect(() => {
    if (!isFetching || !scoreId || !quizId || !dispatch) return;
    const fetchData = async () => {
      const _score = score || (await getQuestionSetScore(scoreId));
      const _quiz = quiz || (await getQuestionSet(quizId));

      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<QuizState, State>(['quizzes', quizId], _quiz),
        R.assocPath<ScoreState, State>(['scores', scoreId], _score)
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };

    fetchData();
  }, [isFetching, scoreId, quizId, score, quiz]);

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
        <ScoreFooter />
      </div>
    </Container>
  );
};

export default ScorePage;
