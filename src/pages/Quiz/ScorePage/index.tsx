import * as R from 'ramda';
import { Navigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useReducer } from 'react';

import { Container } from '@mui/material';

import { QuizState, ScoreState, State } from '../../../Model';
import { ActionTypes } from '../../../Update';
import QuestionIndex from '../commons/QuestionIndex';
import {
  buildQuizFormState,
  getQuestionSet,
  getQuestionSetScore,
} from '../../../services/quiz';

import SpeakerButton from '../commons/SpeakerButton';
import AccentsAnswer from './AccentsAnswer';
import QuizPageHeader from '../commons/QuizPageHeader';
import Score from './Score';
import RhythmsAnswer from './RhythmsAnswer';
import ScoreFooter from './ScoreFooter';
import SkeletonPage from '../../../components/SkeletonPage';
import { AppContext } from '../../../App';
import { QuizFormActionTypes, quizFormReducer } from '../QuizPage/Update';
import { INITIAL_QUIZ_FORM_STATE } from '../QuizPage/Model';

const ScorePage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [quizFormState, quizFormDispatch] = useReducer(
    quizFormReducer,
    INITIAL_QUIZ_FORM_STATE
  );
  const { scoreId, quizId } = useParams();
  if (!quizId || !scoreId) return <></>;
  const { auth, isFetching, scores, quizzes, audioContext } = state;
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

      const quizFormState = buildQuizFormState(updatedState, quizId);
      quizFormDispatch({
        type: QuizFormActionTypes.setState,
        payload: quizFormState,
      });
    };

    fetchData();
  }, [isFetching, scoreId, quizId, score, quiz]);

  if (!uid) return <Navigate to='/login' />;
  if (isFetching) return <SkeletonPage />;
  if (!score.id || !quiz.id) return <Navigate to='/' />;
  const { title, createdAt, questions, type, quizBlob } = quizFormState;
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div style={{ display: 'grid', rowGap: 24 }}>
          <QuizPageHeader title={title} createdAt={createdAt} />
          <Score state={state} />
          <div style={{ display: 'grid', rowGap: 24 }}>
            {questions.map((question, questionIndex) => {
              const { start, end } = question;
              return (
                <div key={questionIndex} style={{ display: 'grid', rowGap: 8 }}>
                  <QuestionIndex index={questionIndex + 1} />
                  {type === 'articleAccents' && (
                    <AccentsAnswer
                      score={score}
                      state={quizFormState}
                      questionIndex={questionIndex}
                    />
                  )}
                  {type === 'articleRhythms' && (
                    <div>
                      {!!quizBlob && !!audioContext && (
                        <SpeakerButton
                          start={start}
                          end={end}
                          quizBlob={quizBlob}
                          audioContext={audioContext}
                        />
                      )}

                      <RhythmsAnswer
                        score={score}
                        state={quizFormState}
                        questionIndex={questionIndex}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ height: 80 }} />
        <ScoreFooter />
      </div>
    </Container>
  );
};

export default ScorePage;
