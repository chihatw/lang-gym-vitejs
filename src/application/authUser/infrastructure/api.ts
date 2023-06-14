import * as firebaseAuth from 'firebase/auth';
import { auth } from 'infrastructure/firebase';

export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<{
  authUser: firebaseAuth.User | null;
  emailErrMsg: string;
  passwordErrMsg: string;
}> => {
  try {
    const { user } = await firebaseAuth.signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { authUser: user, emailErrMsg: '', passwordErrMsg: '' };
  } catch (error) {
    let emailErrMsg = 'サインインできませんでした。';
    let passwordErrMsg = 'サインインできませんでした。';
    switch ((error as any).code) {
      case 'auth/user-not-found':
      case 'auth/invalid-email':
        emailErrMsg = 'メールアドレスが間違っています。';
        passwordErrMsg = '';
        break;
      case 'auth/wrong-password':
        emailErrMsg = '';
        passwordErrMsg = 'パスワードが間違っています。';
        break;
      default:
    }
    return {
      authUser: null,
      emailErrMsg,
      passwordErrMsg,
    };
  }
};

export const updateEmail = async (
  email: string,
  password: string,
  newEmail: string
) => {
  try {
    // https://firebase.google.com/docs/auth/web/manage-users
    const provider = firebaseAuth.EmailAuthProvider;
    const credential = provider.credential(email, password);
    await firebaseAuth.reauthenticateWithCredential(
      auth.currentUser!,
      credential
    );
    await firebaseAuth.updateEmail(auth.currentUser!, newEmail);
    return {
      emailErrMsg: '',
      passwordErrMsg: '',
      newEmailErrMsg: '',
    };
  } catch (error) {
    let emailErrMsg = 'メールアドレスを変更できません。';
    let passwordErrMsg = 'メールアドレスを変更できません。';
    let newEmailErrMsg = 'メールアドレスを変更できません。';
    switch ((error as any).code) {
      case 'auth/user-mismatch':
        emailErrMsg = '現在のメールアドレスが正しくありません。';
        passwordErrMsg = '';
        newEmailErrMsg = '';
        break;
      case 'auth/wrong-password':
        emailErrMsg = '';
        passwordErrMsg = 'パスワードが正しくありません。';
        newEmailErrMsg = '';
        break;
      default:
        console.warn((error as any).code);
    }
    return {
      emailErrMsg,
      passwordErrMsg,
      newEmailErrMsg,
    };
  }
};

export const signOut = async (): Promise<{ errorMsg: string }> => {
  try {
    await firebaseAuth.signOut(auth);
    return { errorMsg: '' };
  } catch (error) {
    return { errorMsg: (error as { message: string }).message };
  }
};
