import * as R from 'ramda';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';

import { Quiz, QuizScore, QuizScores, State } from '../../../../Model';
import { ActionTypes } from '../../../../Update';
import {
  buildQuizFormState,
  calcPitchesQuiz,
  calcRhythmQuiz,
  getBlob,
  rhythmAnswerToString,
  setQuiz,
} from '../../../../application/services/quiz';
import SkeletonPage from '../../../components/SkeletonPage';
import { AppContext } from '../../..';
import QuizForm from './QuizForm';
import { INITIAL_QUIZ_FORM_STATE, QuizFormState } from './Model';

const reducer = (state: QuizFormState, action: QuizFormState) => action;

const QuizPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { state, dispatch } = useContext(AppContext);
  const [initialization, setInitialization] = useState(true);
  const [quizFormState, quizFormDispatch] = useReducer(
    reducer,
    INITIAL_QUIZ_FORM_STATE
  );

  if (!state.auth.uid) return <Navigate to='/login' />;

  if (!quizId) return <></>;
  const quiz = state.quizzes.find((item) => item.id === quizId);
  if (!quiz) return <></>;

  useEffect(() => {
    if (!initialization) return;
    const fetchData = async () => {
      let blob: Blob | null = null;
      if (quiz.downloadURL) {
        blob =
          state.blobs[quiz.downloadURL] || (await getBlob(quiz.downloadURL));
      }

      const updatedBlobs = { ...state.blobs };
      if (blob) {
        updatedBlobs[quiz.downloadURL] = blob;
      }

      const updatedState = R.assocPath<{ [downloadURL: string]: Blob }, State>(
        ['blobs'],
        updatedBlobs
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });

      const quizFormState = buildQuizFormState(updatedState, quizId);
      quizFormDispatch(quizFormState);
      setInitialization(false);
    };
    fetchData();
  }, [
    // state.isFetching,
    quiz,
    initialization,
  ]);

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
        const pitchStr = question.inputPitchStr;
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
      createdAt: Date.now(),
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
