import * as R from 'ramda';
import {
  Quiz,
  State,
  Article,
  AuthState,
  LayoutState,
  ArticleListParams,
} from './Model';

export const ActionTypes = {
  setState: 'setState',
  setLayout: 'setLayout',
  authenticate: 'authenticate',
  startFetching: 'startFetching',
  initializeApp: 'initializeApp',
  setAudioContext: 'setAudioContext',
};

export type Action = {
  type: string;
  payload?:
    | State
    | string
    | AuthState
    | LayoutState
    | AudioContext
    | {
        quizzes: Quiz[];
        articles: Article[];
        articleListParams: ArticleListParams;
      }
    | null;
};

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.initializeApp: {
      const { quizzes, articleListParams, articles } = payload as {
        quizzes: Quiz[];
        articles: Article[];
        articleListParams: ArticleListParams;
      };
      return R.compose(
        R.assocPath<Article[], State>(['articleList'], articles),
        R.assocPath<ArticleListParams, State>(
          ['articleListParams'],
          articleListParams
        ),
        R.assocPath<Quiz[], State>(['quizzes'], quizzes)
      )(state);
    }
    case ActionTypes.setState: {
      const newState = payload as State;
      return newState;
    }
    case ActionTypes.authenticate: {
      const auth = payload as AuthState;
      return { ...state, auth };
    }
    case ActionTypes.startFetching: {
      return { ...state, isFetching: true };
    }
    case ActionTypes.setLayout: {
      const layout = payload as LayoutState;
      return R.compose(R.assocPath<LayoutState, State>(['layout'], layout))(
        state
      );
    }
    default:
      return state;
  }
};
