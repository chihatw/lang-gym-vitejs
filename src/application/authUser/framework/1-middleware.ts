import { Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';

import { articleListActions } from 'application/articleList/framework/0-reducer';
import { authUserActions } from 'application/authUser/framework/0-reducer';
import { quizListActions } from 'application/quizList/framework/0-reducer';
import { randomWorkoutListActions } from 'application/randomWorkoutList/framework/0-reducer';
import { signInFormActions } from 'application/signinForm/framework/0-reducer';
import { topPageActions } from 'application/topPage/framework/0-reducer';
import { updateEmailFormActions } from 'application/updateEmailForm/framework/0-reducer';
import { updatePasswordFormActions } from 'application/updatePasswordForm/framework/0-reducer';
import { RootState } from 'main';

const userMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  (action: unknown): unknown => {
    next(action as any);
    const typedAction = action as { type: string; payload?: any };
    switch (typedAction.type) {
      case 'signinForm/signInStart': {
        (async () => {
          const { email, password } = (getState() as RootState).signInForm;
          const { authUser, emailErrMsg, passwordErrMsg } =
            await services.api.authUser.signInWithEmailAndPassword(
              email,
              password
            );
          if (authUser) {
            dispatch(authUserActions.setLoginUser(authUser.uid));
            dispatch(signInFormActions.signInSuccess());
          } else if (!!emailErrMsg || !!passwordErrMsg) {
            dispatch(
              signInFormActions.signInFail({ emailErrMsg, passwordErrMsg })
            );
          }
        })();
        break;
      }
      case 'updateEmailForm/updateEmailStart': {
        (async () => {
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
        })();
        break;
      }
      case 'updatePasswordForm/updatePasswordStart': {
        (async () => {
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
        })();
        break;
      }
      case 'authUser/signoutInitiate': {
        (async () => {
          const { errorMsg } = await services.api.authUser.signOut();
          if (!errorMsg) {
            dispatch(authUserActions.signoutSuccess());
          }
        })();
        break;
      }
      case 'userList/setSelectedUid': {
        const currentUid = typedAction.payload as string;
        dispatch(authUserActions.setCurrentUid(currentUid));
        dispatch(articleListActions.resetState());
        dispatch(topPageActions.resetState());
        dispatch(quizListActions.resetState());
        dispatch(randomWorkoutListActions.resetState());
        break;
      }
    }
    return next(action as any);
  };

export default [userMiddleware];
