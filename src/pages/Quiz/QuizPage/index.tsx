import * as R from 'ramda';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useReducer } from 'react';

import { QuizListState, QuizState, ScoreState, State } from '../../../Model';
import { ActionTypes } from '../../../Update';
import {
  answeredQuestionSet,
  buildNewScore,
  buildQuizFormState,
  calcPitchesQuiz,
  calcRhythmQuiz,
  getQuestionSet,
  pitchesArray2Accents,
  setNewScore,
  updateQuizzes,
} from '../../../services/quiz';
import SkeletonPage from '../../../components/SkeletonPage';
import { AppContext } from '../../../App';
import QuizForm from './QuizForm';
import { QuizFormActionTypes, quizFormReducer } from './Update';
import { INITIAL_QUIZ_FORM_STATE } from './Model';

const QuizPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();

  if (!quizId) return <></>;
  const { state, dispatch } = useContext(AppContext);
  const [quizFormState, quizFormDispatch] = useReducer(
    quizFormReducer,
    INITIAL_QUIZ_FORM_STATE
  );
  const { auth, isFetching, quizzes, quizList } = state;
  const { uid } = auth;
  if (!uid) return <Navigate to='/login' />;

  const quiz: QuizState = quizzes[quizId];
  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      const _quiz = quiz ? quiz : await getQuestionSet(quizId);
      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<QuizState, State>(['quizzes', quizId], _quiz)
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });

      const quizFormState = buildQuizFormState(updatedState, quizId);
      quizFormDispatch({
        type: QuizFormActionTypes.setState,
        payload: quizFormState,
      });
    };
    fetchData();
  }, [isFetching, quiz]);

  if (isFetching) return <SkeletonPage />;
  if (!quiz.title) return <Navigate to='/' />;

  const handleSubmit = async () => {
    const { type, questions, questionCount } = quizFormState;
    if (!dispatch) return;
    if (!['articleAccents', 'articleRhythms'].includes(type)) return;
    const points =
      type === 'articleAccents'
        ? calcPitchesQuiz(questions)
        : calcRhythmQuiz(questions);
    const inputs: { [questionId: string]: string } = {};
    questions.forEach((question) => {
      const { id, inputPitchesArray, inputSpecialMoraArray } = question;
      const accents = pitchesArray2Accents(inputPitchesArray);
      inputs[id] = JSON.stringify(
        type === 'articleAccents' ? accents : inputSpecialMoraArray
      );
    });
    const score = buildNewScore(uid, points, inputs, quizId);

    // スコアの永続化
    let successed = await setNewScore(score);
    if (!successed) return;

    // 問題セットのリモート更新
    successed = await answeredQuestionSet(quizId);
    if (!successed) return;

    const updatedQuizList = updateQuizzes(quiz, score, quizList, questionCount);

    const updatedState = R.compose(
      R.assocPath<boolean, State>(['isFetching'], true),
      R.assocPath<ScoreState, State>(['scores', score.id], score),
      R.assocPath<QuizListState, State>(['quizList'], updatedQuizList)
    )(state);

    dispatch({ type: ActionTypes.setState, payload: updatedState });
    navigate(`/score/${score.id}/quiz/${quizId}`);
  };
  return (
    <QuizForm
      state={quizFormState}
      dispatch={quizFormDispatch}
      handleSubmit={handleSubmit}
    />
  );
};

export default QuizPage;
