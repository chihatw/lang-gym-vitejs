import { Navigate } from 'react-router-dom';
import React, { useState } from 'react';

import { SignInPageComponent } from './SignInPageComponent';
import { signIn } from '../../../services/auth';
import { State } from '../../../Model';
import { Action } from '../../../Update';

const SignInPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { auth } = state;
  const { uid, initializing } = auth;
  const [emailErrMsg, setEmailErrMsg] = useState<string>('');
  const [passwordErrMsg, setPasswordErrMsg] = useState<string>('');
  const resetErrMsg = () => {
    setEmailErrMsg('');
    setPasswordErrMsg('');
  };

  const onSignIn = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    setEmailErrMsg(error.emailErrMsg);
    setPasswordErrMsg(error.passwordErrMsg);
  };
  if (initializing) return <></>;
  if (!!uid) return <Navigate to='/' />;
  return (
    <SignInPageComponent
      onSignIn={onSignIn}
      emailErrMsg={emailErrMsg}
      resetErrMsg={resetErrMsg}
      passwordErrMsg={passwordErrMsg}
    />
  );
};

export default SignInPage;
