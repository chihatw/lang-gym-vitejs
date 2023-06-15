import { State } from './Model';

export const ActionTypes = {
  setState: 'setState',
};

export type Action = {
  type: string;
  payload?: State;
};

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.setState: {
      const newState = payload as State;
      return newState;
    }
    default:
      return state;
  }
};
