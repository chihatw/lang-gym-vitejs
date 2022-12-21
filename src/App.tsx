import React, { createContext, useEffect, useReducer, useRef } from 'react';

import AppComponent from './routes/AppRoutes';
import { Action, ActionTypes, reducer } from './Update';
import {
  Article,
  INITIAL_ARTICLE_LIST_PARAMS,
  INITIAL_STATE,
  LayoutState,
  State,
  User,
} from './Model';
import { auth as firebaseAuth } from './repositories/firebase';
import { AUTH_LOCAL_STORAGE } from './constants';
import { getArticleList } from './services/article';
import { getUsers } from './services/auth';
import { getQuizzes } from './services/quiz';

export const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: INITIAL_STATE, dispatch: () => {} });

const App = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const isFetched = useRef(false);

  // 認証判定
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      let _users: User[] = [];
      let _uid = user?.uid || '';
      let isAdmin = false;
      if (_uid === import.meta.env.VITE_ADMIN_UID) {
        isAdmin = true;

        _users = state.auth.users.length ? state.auth.users : await getUsers();

        const localStorageUid = localStorage.getItem(AUTH_LOCAL_STORAGE);

        if (localStorageUid) {
          _uid = localStorageUid;
        } else {
          const firstUid = _users[0].id;
          localStorage.setItem(AUTH_LOCAL_STORAGE, firstUid);
          _uid = firstUid;
        }
      }

      // 初期化が true の時、または uid が変更された時
      if (state.auth.initializing || state.auth.uid !== _uid) {
        dispatch({
          type: ActionTypes.authenticate,
          payload: { uid: _uid, isAdmin, users: _users, initializing: false },
        });
      }
    });

    // layout
    let layout: LayoutState = {
      width: window.innerWidth,
      height: window.innerHeight,
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

    return () => {
      unsubscribe();
      window.removeEventListener('resize', onResize);
    };
  }, [dispatch, state.auth.users, state.auth.uid]);

  // 初期値取得（作文、問題、記憶問題）
  useEffect(() => {
    if (state.auth.initializing) {
      isFetched.current = false;
    }
    if (!state.auth.uid || isFetched.current) return;
    const fetchData = async () => {
      let articles: Article[] = [];
      let articleListParams = INITIAL_ARTICLE_LIST_PARAMS;
      if (!!state.articleList.length) {
        articles = state.articleList;
        articleListParams = state.articleListParams;
      } else {
        const { articles: _articles, params } = await getArticleList(
          state.auth.uid,
          10
        );
        articles = _articles;
        articleListParams = params;
      }

      const quizzes = !!state.quizzes.length
        ? state.quizzes
        : await getQuizzes(state.auth.uid);

      isFetched.current = true;
      dispatch({
        type: ActionTypes.initializeApp,
        payload: {
          quizzes,
          articles,
          articleListParams,
        },
      });
    };
    fetchData();
  }, [state.auth.uid, state.quizzes, state.articleList.length]);

  useEffect(() => {
    const createAudioContext = () => {
      console.log('create audio context');
      const factory = new AudioContextFactory();
      const _audioContext = factory.create();
      dispatch({ type: ActionTypes.setAudioContext, payload: _audioContext });
      window.removeEventListener('click', createAudioContext);
    };
    if (!state.audioContext) {
      window.addEventListener('click', createAudioContext);
    }
  }, [state.audioContext]);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <AppComponent />
    </AppContext.Provider>
  );
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
