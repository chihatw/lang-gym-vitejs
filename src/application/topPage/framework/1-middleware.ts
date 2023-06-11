import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';

import { topPageActions } from './0-reducer';
const topPageMiddleware =
  (services: Services): Middleware =>
  ({ dispatch }) =>
  (next) =>
  async (action: AnyAction) => {
    next(action);
    switch (action.type) {
      case 'authUser/setCurrentUid': {
        dispatch(topPageActions.resetState());
        break;
      }
      default:
    }
  };

export default [topPageMiddleware];
