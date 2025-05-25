import { Middleware } from '@reduxjs/toolkit';
import { audioBuffersActions } from 'application/audioBuffers/framework/0-reducer';
import { quizListActions } from 'application/quizList/framework/0-reducer';
import { QUIZ_TIPE } from 'application/quizPage/core/1-constants';
import {
  buildInputPitchStr,
  buildQuestionAnswers,
  buildRemoteScores,
  buildRhythmQuizProps,
  calcPoints,
} from 'application/quizPage/core/2-services';
import { quizPageActions } from 'application/quizPage/framework/0-reducer';
import { ISyllable } from 'application/quizQuestions/core/0-interface';
import { quizQuestionsActions } from 'application/quizQuestions/framework/0-reducer';
import { IQuizScore } from 'application/quizScores/core/0-interface';
import { quizScoresActions } from 'application/quizScores/framework/0-reducer';
import { scorePageActions } from 'application/scorePage/framework/0-reducer';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { nanoid } from 'nanoid';
import { getAnsweredIds, getUnansweredIds } from '../core/2-services';
import { quizzesActions } from './0-reducer';

const quizzesMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  (action: unknown): unknown => {
    next(action as any);
    const typedAction = action as { type: string; payload?: any };
    switch (typedAction.type) {
      case 'quizList/initiate': {
        (async () => {
          const uid = (getState() as RootState).authUser.currentUid;
          const { quizzes, quizScores, quizQuestions } =
            await services.api.quizzes.fetchQuizzes(uid);
          const answeredIds = getAnsweredIds(quizzes);
          const unansweredIds = getUnansweredIds(quizzes);
          dispatch(quizzesActions.setQuizzes(quizzes));
          dispatch(quizQuestionsActions.setQuizQuestions(quizQuestions));
          dispatch(quizScoresActions.setQuizScores(quizScores));
          dispatch(quizListActions.setQuizIds({ answeredIds, unansweredIds }));
        })();
        return;
      }
      case 'scorePage/initiate': {
        (async () => {
          const { quizId, scoreCreatedAt } = typedAction.payload as {
            quizId: string;
            scoreCreatedAt: string;
          };
          const quizzes = (getState() as RootState).quizzes.entities;
          const quizIds = Object.keys(quizzes);
          if (quizIds.includes(quizId)) {
            dispatch(
              scorePageActions.setQuizIdScoreCreatedAt({
                quizId,
                scoreCreatedAt,
              })
            );
            const quiz = quizzes[quizId];
            if (!!quiz && quiz.downloadURL) {
              dispatch(
                audioBuffersActions.getAudioBufferStart(quiz.downloadURL)
              );
            }
            return;
          }
          const { quiz, quizScores, quizQuestions } =
            await services.api.quizzes.fetchQuiz(quizId);
          dispatch(
            scorePageActions.setQuizIdScoreCreatedAt({ quizId, scoreCreatedAt })
          );
          if (!quiz) return;
          dispatch(quizzesActions.addQuiz(quiz));
          dispatch(quizScoresActions.addQuizScores(quizScores));
          dispatch(quizQuestionsActions.addQuizQuestions(quizQuestions));
          if (!!quiz && quiz.downloadURL) {
            dispatch(audioBuffersActions.getAudioBufferStart(quiz.downloadURL));
          }
        })();
        return;
      }
      case 'quizPage/initiate': {
        (async () => {
          const quizId = typedAction.payload as string;
          const quizzes = (getState() as RootState).quizzes.entities;
          const quizIds = Object.keys(quizzes);
          if (quizIds.includes(quizId)) {
            dispatch(quizPageActions.setQuizId(quizId));
            const quiz = quizzes[quizId];
            if (!!quiz && quiz.downloadURL) {
              dispatch(
                audioBuffersActions.getAudioBufferStart(quiz.downloadURL)
              );
            }
            return;
          }
          const { quiz, quizScores, quizQuestions } =
            await services.api.quizzes.fetchQuiz(quizId);
          dispatch(quizPageActions.setQuizId(quizId));
          if (!quiz) return;
          dispatch(quizzesActions.addQuiz(quiz));
          dispatch(quizScoresActions.addQuizScores(quizScores));
          dispatch(quizQuestionsActions.addQuizQuestions(quizQuestions));
          if (!!quiz && quiz.downloadURL) {
            dispatch(audioBuffersActions.getAudioBufferStart(quiz.downloadURL));
          }
        })();
        return;
      }
      case 'quizPage/setQuizId': {
        (async () => {
          const quizId = typedAction.payload as string;
          const quizzes = (getState() as RootState).quizzes.entities;
          const quiz = quizzes[quizId];
          if (!quiz) {
            setTimeout(() => {
              console.log('%credispatch', 'color:red');
              dispatch(quizPageActions.setQuizId(quizId));
            }, 100);
            return;
          }
          const quizQuestions = (getState() as RootState).quizQuestions;
          const inputPitchStrs: { [questionId: string]: string } = {};
          if (quiz.type === QUIZ_TIPE.articleAccents) {
            for (const questionId of quiz.questionIds) {
              const question = quizQuestions.entities[questionId];
              const inputPitchStr = question
                ? buildInputPitchStr(question.pitchStr, question.disableds)
                : '';
              inputPitchStrs[questionId] = inputPitchStr;
            }
          }
          const syllablesArrays: { [questionId: string]: ISyllable[][] } = {};
          const inputSpecialMoraArrays: { [questionId: string]: string[][] } =
            {};
          const monitorSpecialMoraArrays: { [questionId: string]: string[][] } =
            {};
          if (quiz.type === QUIZ_TIPE.articleRhythms) {
            for (const questionId of quiz.questionIds) {
              const question = quizQuestions.entities[questionId];
              const {
                syllablesArray,
                inputSpecialMoraArray,
                monitorSpecialMoraArray,
              } = question
                ? buildRhythmQuizProps(question.syllables, question.disableds)
                : {
                    syllablesArray: [],
                    inputSpecialMoraArray: [],
                    monitorSpecialMoraArray: [],
                  };
              syllablesArrays[questionId] = syllablesArray;
              inputSpecialMoraArrays[questionId] = inputSpecialMoraArray;
              monitorSpecialMoraArrays[questionId] = monitorSpecialMoraArray;
            }
          }
          dispatch(
            quizPageActions.setQuestionProps({
              inputPitchStrs,
              syllablesArrays,
              inputSpecialMoraArrays,
              monitorSpecialMoraArrays,
            })
          );
        })();
        return;
      }
      case 'quizPage/updateQuizScoreStart': {
        (async () => {
          const createdAt = typedAction.payload as number;
          const { quizId, inputPitchStrs, inputSpecialMoraArrays } = (
            getState() as RootState
          ).quizPage;
          const quizzes = (getState() as RootState).quizzes.entities;
          const quizScores = (getState() as RootState).quizScores.entities;
          const quizQuestions = (getState() as RootState).quizQuestions;
          let { answeredIds, unansweredIds } = (getState() as RootState)
            .quizList;
          const quiz = quizzes[quizId];
          if (!quiz) return;
          if (!Object.values(QUIZ_TIPE).includes(quiz.type)) return;
          const points = calcPoints(
            quiz,
            quizQuestions.entities,
            inputPitchStrs,
            inputSpecialMoraArrays
          );
          const { pitchAnswers, rhythmAnswers } = buildQuestionAnswers(
            quiz,
            inputPitchStrs,
            inputSpecialMoraArrays
          );
          const scoreId = nanoid(8);
          const score: IQuizScore = {
            id: scoreId,
            score: points,
            createdAt,
            pitchAnswers,
            rhythmAnswers,
          };
          dispatch(quizScoresActions.addQuizScore(score));
          dispatch(
            quizzesActions.unshiftScoreId({ quizId, scoreId: score.id })
          );
          const scores = quiz.scoreIds.map((scoreId) => quizScores[scoreId]);
          scores.unshift(score);
          const remoteScores = buildRemoteScores(scores);
          await services.api.quizzes.updateQuizScore(quizId, remoteScores);
          if (unansweredIds.includes(quizId)) {
            unansweredIds = unansweredIds.filter((id) => id !== quizId);
            const answeredQuizzes = answeredIds.map(
              (quizId) => quizzes[quizId]
            );
            answeredQuizzes.push(quiz);
            answeredIds = answeredQuizzes
              .sort((a, b) => b!.createdAt - a!.createdAt)
              .map((quiz) => quiz!.id);
            dispatch(
              quizListActions.setQuizIds({ answeredIds, unansweredIds })
            );
          }
        })();
        return;
      }
      default:
    }
    return next(action as any);
  };

export default [quizzesMiddleware];
