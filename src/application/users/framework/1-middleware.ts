import { Middleware } from '@reduxjs/toolkit';
import { userListActions } from 'application/userList/framework/0-reducer';
import { Services } from 'infrastructure/services';
import { usersAcions } from './0-reducer';

const usersMiddleWare =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  (action: unknown): unknown => {
    next(action as any);
    const typedAction = action as { type: string; payload?: any };
    switch (typedAction.type) {
      case 'userList/initiate': {
        (async () => {
          const currentUid = typedAction.payload as string;
          const users = await services.api.users.fetchUsers();
          dispatch(usersAcions.setUsers(users));
          dispatch(userListActions.setSelectedUid(currentUid));
        })();
        break;
      }
      default:
    }
    return next(action as any);
  };

export default [usersMiddleWare];
