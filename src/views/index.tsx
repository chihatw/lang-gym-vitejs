import * as React from 'react';
import { useEffect } from 'react';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'views/Layout';
import AnsweredQuizListPage from 'views/pages/AnsweredQuizListPage';
import ArticleListPage from 'views/pages/ArticleListPage';
import ArticlePage from 'views/pages/ArticlePage';
import UnAnsweredQuizListPage from 'views/pages/UnAnsweredQuizListPage';
import { auth } from '../infrastructure/firebase';

import { CURRENT_UID_LOCAL_STORAGE_KEY } from 'application/authUser/core/1-constants';
import { authUserActions } from 'application/authUser/framework/0-reducer';
import { RootState } from 'main';
import { useDispatch, useSelector } from 'react-redux';
import AccountPage from 'views/pages/AccountPage';
import QuizPage from 'views/pages/QuizPage';
import RandomWorkoutListPage from 'views/pages/RandomWorkoutListPage';
import RandomWorkoutPage from 'views/pages/RandomWorkoutPage';
import SignInPage from 'views/pages/SingInPage';
import UpdateEmailPage from 'views/pages/UpdateEmailPage';
import UpdatePasswordPage from 'views/pages/UpdatePasswordPage';
import ScorePage from './pages/ScorePage';
import TopPage from './pages/TopPage';

const App = () => {
  const dispatch = useDispatch();
  const { initializing } = useSelector((state: RootState) => state.authUser);

  // 認証判定
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // currentUid は localStorage から受け取る
        const currentUid =
          localStorage.getItem(CURRENT_UID_LOCAL_STORAGE_KEY) || user.uid;
        dispatch(
          authUserActions.setUser({ loginUserUid: user.uid, currentUid })
        );
      } else {
        localStorage.setItem(CURRENT_UID_LOCAL_STORAGE_KEY, '');
        dispatch(authUserActions.removeUser());
      }
    });
  }, []);

  if (initializing) return <></>;

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            index
            element={
              <PrivateRoute>
                <TopPage />
              </PrivateRoute>
            }
          />
          <Route path='/article'>
            <Route
              path='list'
              element={
                <PrivateRoute>
                  <ArticleListPage />
                </PrivateRoute>
              }
            />
            <Route
              path=':articleId'
              element={
                <PrivateRoute>
                  <ArticlePage />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path='/quiz'>
            <Route
              path='list/unanswered'
              element={
                <PrivateRoute>
                  <UnAnsweredQuizListPage />
                </PrivateRoute>
              }
            />
            <Route
              path='list/answered'
              element={
                <PrivateRoute>
                  <AnsweredQuizListPage />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path='/score'>
            <Route
              path=':quizId/score/:scoreId'
              element={
                <PrivateRoute>
                  <ScorePage />
                </PrivateRoute>
              }
            />
          </Route>
          <Route
            path='/quiz/:quizId'
            element={
              <PrivateRoute>
                <QuizPage />
              </PrivateRoute>
            }
          />
          <Route path='/workout'>
            <Route
              path='list'
              element={
                <PrivateRoute>
                  <RandomWorkoutListPage />
                </PrivateRoute>
              }
            />
            <Route
              path=':workoutId'
              element={
                <PrivateRoute>
                  <RandomWorkoutPage />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path='/account'>
            <Route
              index
              element={
                <PrivateRoute>
                  <AccountPage />
                </PrivateRoute>
              }
            />
            <Route
              path={'mail'}
              element={
                <PrivateRoute>
                  <UpdateEmailPage />
                </PrivateRoute>
              }
            />
            <Route
              path={`password`}
              element={
                <PrivateRoute>
                  <UpdatePasswordPage />
                </PrivateRoute>
              }
            />
          </Route>
          <Route
            path='/login'
            element={
              <OnlyUnAuthorizedRoute>
                <SignInPage />
              </OnlyUnAuthorizedRoute>
            }
          />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
export default App;

// JSXコンポーネントとして使えるようにexport
export function PrivateRoute({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement {
  const { loginUserUid } = useSelector((state: RootState) => state.authUser);
  if (!loginUserUid) return <Navigate to='/login' />;
  return children;
}

export function OnlyUnAuthorizedRoute({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement {
  const { loginUserUid } = useSelector((state: RootState) => state.authUser);
  if (loginUserUid) return <Navigate to='/' />;
  return children;
}
