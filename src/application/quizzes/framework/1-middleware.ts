import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { quizListActions } from 'application/quizList/framework/0-reducer';
import { quizQuestionsActions } from 'application/quizQuestions/framework/0-reducer';
import { quizScoresActions } from 'application/quizScores/framework/0-reducer';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { quizzesActions } from './0-reducer';
import { getAnsweredIds, getUnansweredIds } from '../core/2-services';
import { scorePageActions } from 'application/scorePage/framework/0-reducer';
import { audioActions } from 'application/audio/framework/0-reducer';

const quizzesMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  async (action: AnyAction) => {
    next(action);
    switch (action.type) {
      case 'quizList/initiate': {
        const uid = (getState() as RootState).authUser.currentUid;
        const { quizzes, quizScores, quizQuestions } =
          await services.api.quizzes.fetchQuizzes(uid);

        const answeredIds = getAnsweredIds(quizzes);
        const unansweredIds = getUnansweredIds(quizzes);

        dispatch(quizzesActions.mergeQuizzes(quizzes));
        dispatch(quizQuestionsActions.mergeQuizQuestions(quizQuestions));
        dispatch(quizScoresActions.mergeQuizScores(quizScores));
        dispatch(quizListActions.setQuizIds({ answeredIds, unansweredIds }));

        break;
      }
      case 'scorePage/initiate': {
        const { quizId, scoreCreatedAt } = action.payload as {
          quizId: string;
          scoreCreatedAt: string;
        };

        const quizzes = (getState() as RootState).quizzes;
        const quizIds = Object.keys(quizzes);

        // fetch済みの quizId の場合
        if (quizIds.includes(quizId)) {
          dispatch(
            scorePageActions.setQuizIdScoreCreatedAt({ quizId, scoreCreatedAt })
          );
          const quiz = quizzes[quizId];
          if (!!quiz && quiz.downloadURL) {
            dispatch(audioActions.getAudioBufferStart(quiz.downloadURL));
          }
          return;
        }

        // quiz の取得
        const { quiz, quizScores, quizQuestions } =
          await services.api.quizzes.fetchQuiz(quizId);

        dispatch(
          scorePageActions.setQuizIdScoreCreatedAt({ quizId, scoreCreatedAt })
        );

        dispatch(quizzesActions.mergeQuizzes({ [quizId]: quiz }));

        if (!quiz) break;

        dispatch(quizScoresActions.mergeQuizScores(quizScores));
        dispatch(quizQuestionsActions.mergeQuizQuestions(quizQuestions));

        if (!!quiz && quiz.downloadURL) {
          dispatch(audioActions.getAudioBufferStart(quiz.downloadURL));
        }
        break;
      }
      default:
    }
  };

export default [quizzesMiddleware];
