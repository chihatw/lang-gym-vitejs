import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { quizListActions } from 'application/quizList/framework/0-reducer';
import { quizQuestionsActions } from 'application/quizQuestions/framework/0-reducer';
import { quizScoresActions } from 'application/quizScores/framework/0-reducer';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { quizzesActions } from './0-reducer';
import { getAnsweredIds, getUnansweredIds } from '../core/2-services';

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
      default:
    }
  };

export default [quizzesMiddleware];
