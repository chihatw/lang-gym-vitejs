import * as R from 'ramda';
import { State, AuthState, LayoutState } from './Model';

export const ActionTypes = {
  setState: 'setState',
  setLayout: 'setLayout',
  authenticate: 'authenticate',
  startFetching: 'startFetching',
  setAudioContext: 'setAudioContext',
};

export type Action = {
  type: string;
  payload?: State | string | AuthState | LayoutState | AudioContext | null;
};

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;

  switch (type) {
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
    case ActionTypes.setAudioContext: {
      const audioContext = payload as AudioContext | null;
      return { ...state, audioContext };
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
