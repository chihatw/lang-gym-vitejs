import { useState } from 'react';

import { SignInPageComponent } from './SignInPageComponent';
import { signIn } from '../../../../application/services/auth';

// debug redux にする
const SignInPage = () => {
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
