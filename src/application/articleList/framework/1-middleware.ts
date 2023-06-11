import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';
import { articleListActions } from './0-reducer';

const articleListMiddleware =
  (services: Services): Middleware =>
  ({ dispatch }) =>
  (next) =>
  async (action: AnyAction) => {
    next(action);
    switch (action.type) {
      case 'authUser/setCurrentUid': {
        dispatch(articleListActions.resetState());
        break;
      }
      default:
    }
  };

export default [articleListMiddleware];
