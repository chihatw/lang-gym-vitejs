import React, { createContext, useEffect, useReducer, useRef } from 'react';

import { Action, ActionTypes, reducer } from '../Update';
import {
  Article,
  INITIAL_ARTICLE_LIST_PARAMS,
  INITIAL_STATE,
  State,
  User,
} from '../Model';
import { auth as firebaseAuth } from '../infrastructure/repositories/firebase';
import { AUTH_LOCAL_STORAGE } from '../constants';
import { getArticleList } from '../application/services/article';
import { getUsers } from '../application/services/auth';
import { getQuizzes } from '../application/services/quiz';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'views/Layout';
import ArticleListPage from 'views/pages/Article/ArticleListPage';
import ArticlePage from 'views/pages/Article/ArticlePage';
import UnAnsweredPage from 'views/pages/QuizList/UnAnsweredPage';
import AnsweredPage from 'views/pages/QuizList/AnsweredPage';
import ScorePage from 'views/pages/Quiz/ScorePage';
import QuizPage from 'views/pages/Quiz/QuizPage';
import WorkoutListPage from 'views/pages/Workout/WorkoutListPage';
import WorkoutPage from 'views/pages/Workout/WorkoutPage';
import AccountPage from 'views/pages/Auth/AccountPage';
import MailPage from 'views/pages/Auth/Setting/MailPage';
import PasswordPage from 'views/pages/Auth/Setting/PasswordPage';
import SignInPage from 'views/pages/Auth/SingInPage';

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

    return () => {
      unsubscribe();
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

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route index element={<ArticleListPage />} />

            <Route path='/article'>
              <Route path='list' element={<ArticleListPage />} />
              <Route path=':articleId' element={<ArticlePage />} />
            </Route>

            <Route path='/quiz'>
              <Route path='list'>
                <Route path='unanswered' element={<UnAnsweredPage />} />
                <Route path='answered' element={<AnsweredPage />} />
              </Route>
              <Route path=':quizId/score/:scoreId' element={<ScorePage />} />
              <Route path=':quizId' element={<QuizPage />} />
            </Route>

            <Route path='workout'>
              <Route path='list' element={<WorkoutListPage />} />
              <Route path=':workoutId' element={<WorkoutPage />} />
            </Route>
            <Route path='/account'>
              <Route index element={<AccountPage />} />
              <Route path={'mail'} element={<MailPage />} />
              <Route path={`password`} element={<PasswordPage />} />
            </Route>
            <Route path='/login' element={<SignInPage />} />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppContext.Provider>
  );
};
export default App;
