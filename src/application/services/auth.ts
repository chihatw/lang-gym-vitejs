import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

import { auth } from '../../infrastructure/firebase';

export const handleUpdatePassword = async (
  email: string,
  password: string,
  newPassword: string
): Promise<{
  success?: boolean;
  message: string;
  emailErrMsg: string;
  passwordErrMsg: string;
  newPasswordErrMsg: string;
}> => {
  try {
    const provider = EmailAuthProvider;
    const credential = provider.credential(email, password);
    await reauthenticateWithCredential(auth.currentUser!, credential);
    await updatePassword(auth.currentUser!, newPassword);
    return {
      success: true,
      message: `パスワードを変更しました。`,
      emailErrMsg: '',
      passwordErrMsg: '',
      newPasswordErrMsg: '',
    };
  } catch (error) {
    console.warn(error);
    let emailErrMsg = 'パスワードを変更できません。';
    let passwordErrMsg = 'パスワードを変更できません。';
    let newPasswordErrMsg = 'パスワードを変更できません。';
    switch ((error as any).code) {
      case 'auth/user-mismatch':
        emailErrMsg = 'メールアドレスが正しくありません。';
        passwordErrMsg = '';
        newPasswordErrMsg = '';
        break;
      case 'auth/wrong-password':
        emailErrMsg = '';
        passwordErrMsg = 'パスワードが正しくありません。';
        newPasswordErrMsg = '';
        break;
      case 'auth/weak-password':
        emailErrMsg = '';
        passwordErrMsg = '';
        newPasswordErrMsg = 'パスワードは6字以上にしてください。';
        break;
      default:
    }
    return {
      message: '',
      emailErrMsg,
      passwordErrMsg,
      newPasswordErrMsg,
    };
  }
};
