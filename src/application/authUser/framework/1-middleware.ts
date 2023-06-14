import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';

import { authUserActions } from 'application/authUser/framework/0-reducer';
import { signInFormActions } from 'application/signinForm/framework/0-reducer';
import { updateEmailFormActions } from 'application/updateEmailForm/framework/0-reducer';
import { RootState } from 'main';
import { updatePasswordFormActions } from 'application/updatePasswordForm/framework/0-reducer';
import { articleListActions } from 'application/articleList/framework/0-reducer';
import { topPageActions } from 'application/topPage/framework/0-reducer';

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
      case 'updateEmailForm/updateEmailStart': {
        const { email, password, newEmail } = (getState() as RootState)
          .updateEmailForm;

        const { emailErrMsg, passwordErrMsg, newEmailErrMsg } =
          await services.api.authUser.updateEmail(email, password, newEmail);

        if (!emailErrMsg && !passwordErrMsg && !newEmailErrMsg) {
          dispatch(updateEmailFormActions.updateEmailSuccess(newEmail));
        } else {
          dispatch(
            updateEmailFormActions.updateEmailFail({
              emailErrMsg,
              passwordErrMsg,
              newEmailErrMsg,
            })
          );
        }
        break;
      }
      case 'updatePasswordForm/updatePasswordStart': {
        const { email, password, newPassword } = (getState() as RootState)
          .updatePasswordForm;
        const { emailErrMsg, passwordErrMsg, newPasswordErrMsg } =
          await services.api.authUser.updatePassword(
            email,
            password,
            newPassword
          );
        if (!emailErrMsg && !passwordErrMsg && !newPasswordErrMsg) {
          dispatch(updatePasswordFormActions.updatePasswordSuccess());
        } else {
          dispatch(
            updatePasswordFormActions.updatePasswordFail({
              emailErrMsg,
              passwordErrMsg,
              newPasswordErrMsg,
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
        dispatch(articleListActions.resetState());
        dispatch(topPageActions.resetState());
        break;
      }
    }
  };

export default [userMiddleware];
