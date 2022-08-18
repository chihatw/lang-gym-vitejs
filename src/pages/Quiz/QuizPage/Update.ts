import { QuizFormState } from './Model';

export const QuizFormActionTypes = {
  setState: 'setState',
};

export type QuizFormAction = {
  type: string;
  payload: QuizFormState;
};

export const quizFormReducer = (
  state: QuizFormState,
  action: QuizFormAction
): QuizFormState => {
  const { payload } = action;
  return payload;
};
