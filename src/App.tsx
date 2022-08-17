import * as R from 'ramda';
import React, { createContext, useEffect, useReducer, useRef } from 'react';

import AppComponent from './routes/AppRoutes';
import { Action, ActionTypes, reducer } from './Update';
import {
  Article,
  ArticleListParams,
  INITIAL_ARTICLE_LIST_PARAMS,
  INITIAL_STATE,
  LayoutState,
  State,
  UnansweredQuiz,
  User,
} from './Model';
import { auth as firebaseAuth } from './repositories/firebase';
import { AUTH_LOCAL_STORAGE } from './constants';
import { getArticleList } from './services/article';
import { getUnansweredQuizList } from './services/quiz';
import { getUsers } from './services/auth';

export const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action> | null;
}>({ state: INITIAL_STATE, dispatch: null });

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

  // 初期値取得
  // 作文、未回答の問題
  useEffect(() => {
    if (state.auth.initializing) {
      isFetched.current = false;
    }
    if (!state.auth.uid || isFetched.current) return;
    const fetchData = async () => {
      let _articles: Article[] = [];
      let _params = INITIAL_ARTICLE_LIST_PARAMS;
      if (!!state.articleList.length) {
        _articles = state.articleList;
        _params = state.articleListParams;
      } else {
        const { articles, params } = await getArticleList(state.auth.uid, 10);
        _articles = articles;
        _params = params;
      }

      const unansweredList = !!state.quizList.unansweredList.length
        ? state.quizList.unansweredList
        : await getUnansweredQuizList(state.auth.uid);

      isFetched.current = true;

      const updatedState: State = R.compose(
        R.assocPath<boolean, State>(['auth', 'initializing'], false),
        R.assocPath<Article[], State>(['articleList'], _articles),
        R.assocPath<ArticleListParams, State>(['articleListParams'], _params),
        R.assocPath<UnansweredQuiz[], State>(
          ['quizList', 'unansweredList'],
          unansweredList
        )
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };
    fetchData();
  }, [state.auth.uid, state.quizList.unansweredList, state.articleList.length]);

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
