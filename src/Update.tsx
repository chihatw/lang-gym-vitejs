import * as R from 'ramda';
import { Quiz, State } from './Model';

export const ActionTypes = {
  setState: 'setState',
  startFetching: 'startFetching',
  initializeApp: 'initializeApp',
  setAudioContext: 'setAudioContext',
};

export type Action = {
  type: string;
  payload?:
    | State
    | string
    | {
        quizzes: Quiz[];
      }
    | null;
};

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.initializeApp: {
      const { quizzes } = payload as {
        quizzes: Quiz[];
      };
      return R.compose(R.assocPath<Quiz[], State>(['quizzes'], quizzes))(state);
    }
    case ActionTypes.setState: {
      const newState = payload as State;
      return newState;
    }
    case ActionTypes.startFetching: {
      return { ...state, isFetching: true };
    }
    default:
      return state;
  }
};
