import pitchesArray2String from 'pitches-array2string';
import * as R from 'ramda';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useReducer } from 'react';

import { Quiz, QuizScore, QuizScores, State } from '../../../Model';
import { ActionTypes } from '../../../Update';
import {
  buildQuizFormState,
  calcPitchesQuiz,
  calcRhythmQuiz,
  getBlob,
  rhythmAnswerToString,
  setQuiz,
} from '../../../services/quiz';
import SkeletonPage from '../../../components/SkeletonPage';
import { AppContext } from '../../../App';
import QuizForm from './QuizForm';
import { QuizFormActionTypes, quizFormReducer } from './Update';
import { INITIAL_QUIZ_FORM_STATE } from './Model';

const QuizPage = () => {
  const { state, dispatch } = useContext(AppContext);
  if (!state.auth.uid) return <Navigate to='/login' />;

  const navigate = useNavigate();
  const { quizId } = useParams();
  if (!quizId) return <></>;
  const quiz = state.quizzes.find((item) => item.id === quizId);
  if (!quiz) return <></>;

  const [quizFormState, quizFormDispatch] = useReducer(
    quizFormReducer,
    INITIAL_QUIZ_FORM_STATE
  );

  useEffect(() => {
    if (!state.isFetching || !dispatch) return;
    const fetchData = async () => {
      let _blob: Blob | null = null;
      if (quiz.downloadURL) {
        _blob =
          state.blobs[quiz.downloadURL] || (await getBlob(quiz.downloadURL));
      }

      const updatedBlobs = { ...state.blobs };
      if (_blob) {
        updatedBlobs[quiz.downloadURL] = _blob;
      }

      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<{ [downloadURL: string]: Blob }, State>(
          ['blobs'],
          updatedBlobs
        )
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });

      const quizFormState = buildQuizFormState(updatedState, quizId);
      quizFormDispatch({
        type: QuizFormActionTypes.setState,
        payload: quizFormState,
      });
    };
    fetchData();
  }, [state.isFetching, quiz]);

  if (state.isFetching) return <SkeletonPage />;
  if (!quiz.title) return <Navigate to='/' />;

  const handleSubmit = async () => {
    if (!dispatch) return;
    if (!['articleAccents', 'articleRhythms'].includes(quizFormState.type))
      return;
    const points =
      quizFormState.type === 'articleAccents'
        ? calcPitchesQuiz(quizFormState.questions)
        : calcRhythmQuiz(quizFormState.questions);

    const pitchAnswers: string[] = [];
    const rhythmAnswers: string[] = [];

    quizFormState.questions.forEach((question) => {
      if (quizFormState.type === 'articleAccents') {
        const pitchStr = pitchesArray2String(question.inputPitchesArray);
        pitchAnswers.push(pitchStr);
      } else {
        const rhythmAnswerStr = rhythmAnswerToString(
          question.inputSpecialMoraArray
        );
        rhythmAnswers.push(rhythmAnswerStr);
      }
    });
    const score: QuizScore = {
      score: points,
      createdAt: new Date().getTime(),
      pitchAnswers,
      rhythmAnswers,
    };
    const updatedScores: QuizScores = { ...quiz.scores };
    updatedScores[score.createdAt] = score;
    const updatedQuiz: Quiz = { ...quiz, scores: updatedScores };

    // 問題のリモート更新
    await setQuiz(updatedQuiz);

    const updatedQuizzes = state.quizzes.map((item) =>
      item.id === quizId ? updatedQuiz : item
    );

    const updatedState: State = { ...state, quizzes: updatedQuizzes };
    dispatch({ type: ActionTypes.setState, payload: updatedState });
    navigate(`/quiz/${quizId}/score/${score.createdAt}`);
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
