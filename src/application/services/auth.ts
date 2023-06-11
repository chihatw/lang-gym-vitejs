import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
} from 'firebase/auth';
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  query,
} from 'firebase/firestore';
import { User } from '../../Model';
import { auth, db } from '../../infrastructure/firebase';

const COLLECTIONS = { users: 'users' };

const LIMIT = 5;

export const signOut = () => auth.signOut();

export const signIn = async (
  email: string,
  password: string
): Promise<{
  success?: boolean;
  error?: any;
}> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true, error: { emailErrMsg: '', passwordErrMsg: '' } };
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
    return { error: { emailErrMsg, passwordErrMsg } };
  }
};

export const handleUpdateEmail = async (
  email: string,
  password: string,
  newEmail: string
): Promise<{
  success?: boolean;
  message: string;
  emailErrMsg: string;
  passwordErrMsg: string;
  newEmailErrMsg: string;
}> => {
  try {
    // https://firebase.google.com/docs/auth/web/manage-users#web-version-9_5
    const provider = EmailAuthProvider;
    const credential = provider.credential(email, password);
    await reauthenticateWithCredential(auth.currentUser!, credential);
    await updateEmail(auth.currentUser!, newEmail);

    return {
      success: true,
      message: `メールアドレスを「${newEmail}」に変更しました。`,
      emailErrMsg: '',
      passwordErrMsg: '',
      newEmailErrMsg: '',
    };
  } catch (error) {
    console.warn(error);
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
    }
    return {
      message: '',
      emailErrMsg,
      passwordErrMsg,
      newEmailErrMsg,
    };
  }
};

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
export const getUsers = async (): Promise<User[]> => {
  const users: User[] = [];
  const q = query(collection(db, COLLECTIONS.users), limit(LIMIT));
  console.log('get users');
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    users.push(buildUser(doc));
  });
  return users;
};

const buildUser = (doc: DocumentData) => {
  const { displayname } = doc.data();
  const user: User = {
    id: doc.id,
    displayname: displayname || '',
  };
  return user;
};
