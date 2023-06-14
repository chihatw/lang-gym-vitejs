import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';

import { authUserActions } from 'application/authUser/framework/0-reducer';
import { signInFormActions } from 'application/signinForm/framework/0-reducer';
import { changeEmailFormActions } from 'application/changeEmailForm/framework/0-reducer';
import { RootState } from 'main';

const userMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  async (action: AnyAction) => {
    next(action);
    switch (action.type) {
      case 'signinForm/signInStart': {
        const { email, password } = (getState() as RootState).signInForm;
        const { authUser, emailErrMsg, passwordErrMsg } =
          await services.api.authUser.signInWithEmailAndPassword(
            email,
            password
          );
        if (authUser) {
          dispatch(authUserActions.setLoginUser(authUser));
          dispatch(signInFormActions.signInSuccess());
        } else if (!!emailErrMsg || !!passwordErrMsg) {
          dispatch(
            signInFormActions.signInFail({ emailErrMsg, passwordErrMsg })
          );
        }
        break;
      }
      case 'changeEmailForm/updateEmailStart': {
        const { email, password, newEmail } = (getState() as RootState)
          .changeEmailForm;

        const { emailErrMsg, passwordErrMsg, newEmailErrMsg } =
          await services.api.authUser.updateEmail(email, password, newEmail);

        if (!emailErrMsg && !passwordErrMsg && !newEmailErrMsg) {
          dispatch(changeEmailFormActions.updateEmailSuccess(newEmail));
        } else {
          dispatch(
            changeEmailFormActions.updateEmailFail({
              emailErrMsg,
              passwordErrMsg,
              newEmailErrMsg,
            })
          );
        }
        break;
      }
      case 'authUser/signoutInitiate': {
        const { errorMsg } = await services.api.authUser.signOut();
        if (!errorMsg) {
          dispatch(authUserActions.signoutSuccess());
        }
        break;
      }
      case 'userList/setSelectedUid': {
        const currentUid = action.payload as string;
        dispatch(authUserActions.setCurrentUid(currentUid));
        break;
      }
    }
  };

export default [userMiddleware];
