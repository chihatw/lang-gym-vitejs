import { useEffect, useReducer } from 'react';

import AppComponent from './routes/AppRoutes';
import { ActionTypes, reducer } from './Update';
import { INITIAL_STATE, LayoutState, User } from './Model';
import { auth as firebaseAuth } from './repositories/firebase';
import { AUTH_LOCAL_STORAGE } from './constants';
import { getArticleCards } from './services/article';
import { getUnansweredQuizList } from './services/quiz';
import { getUsers } from './services/auth';

const App = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const { auth } = state;
  const { users, uid, initializing } = auth;

  // 認証判定
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      let _users: User[] = [];
      let _uid = user?.uid || '';
      let isAdmin = false;
      if (_uid === import.meta.env.VITE_ADMIN_UID) {
        isAdmin = true;

        _users = users.length ? users : await getUsers();

        const localStorageUid = localStorage.getItem(AUTH_LOCAL_STORAGE);

        if (localStorageUid) {
          _uid = localStorageUid;
        } else {
          const firstUid = _users[0].id;
          localStorage.setItem(AUTH_LOCAL_STORAGE, firstUid);
          _uid = firstUid;
        }
      }
      if (uid !== _uid || initializing) {
        dispatch({
          type: ActionTypes.authenticate,
          payload: { uid: _uid, isAdmin, initializing: false, users: _users }, // initializing どこで使っている？
        });
      }
    });

    // layout
    let layout: LayoutState = {
      width: window.innerWidth,
      height: window.innerHeight,
      isBrave: false,
    };

    const onResize = () => {
      layout = {
        ...layout,
        width: window.innerWidth,
        height: window.innerHeight,
      };
      dispatch({ type: ActionTypes.setLayout, payload: layout });
    };
    window.addEventListener('resize', onResize);

    const checkBrowser = async () => {
      layout.isBrave =
        ((navigator as any).brave &&
          (await (navigator as any).brave.isBrave())) ||
        false;
      dispatch({ type: ActionTypes.setLayout, payload: layout });
    };
    checkBrowser();

    return () => {
      unsubscribe();
      window.removeEventListener('resize', onResize);
    };
  }, [dispatch, users, uid, initializing]);

  // topPage の作文を取得
  // 未回答の問題も取得
  useEffect(() => {
    const { auth, topPage } = state;
    const { uid } = auth;
    const { cards } = topPage;

    if (!uid || !!cards.length) return;

    const fetchData = async () => {
      const articles = await getArticleCards(uid, 3);
      const quizzes = await getUnansweredQuizList(uid);
      dispatch({
        type: ActionTypes.setTopPage,
        payload: { articles, quizzes },
      });
    };
    fetchData();

    const { audioContext } = state;
    const createAudioContext = () => {
      const factory = new AudioContextFactory();
      const _audioContext = factory.create();
      dispatch({ type: ActionTypes.setAudioContext, payload: _audioContext });
      window.removeEventListener('click', createAudioContext);
    };
    if (!audioContext) {
      window.addEventListener('click', createAudioContext);
    }
  }, [state]);

  return <AppComponent state={state} dispatch={dispatch} />;
};
export default App;

class AudioContextFactory {
  create() {
    const audioContext = new window.AudioContext();
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0;
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.1);
    return audioContext;
  }
}
