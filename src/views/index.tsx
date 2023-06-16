import React, { useEffect } from 'react';

import { auth } from '../infrastructure/firebase';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'views/Layout';
import ArticleListPage from 'views/pages/ArticleListPage';
import ArticlePage from 'views/pages/ArticlePage';
import UnAnsweredQuizListPage from 'views/pages/UnAnsweredQuizListPage';
import AnsweredQuizListPage from 'views/pages/AnsweredQuizListPage';

import QuizPage from 'views/pages/QuizPage';
import RandomWorkoutListPage from 'views/pages/RandomWorkoutListPage';
import RandomWorkoutPage from 'views/pages/RandomWorkoutPage';
import AccountPage from 'views/pages/AccountPage';
import UpdateEmailPage from 'views/pages/UpdateEmailPage';
import UpdatePasswordPage from 'views/pages/UpdatePasswordPage';
import SignInPage from 'views/pages/SingInPage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'main';
import { authUserActions } from 'application/authUser/framework/0-reducer';
import TopPage from './pages/TopPage';
import { CURRENT_UID_LOCAL_STORAGE_KEY } from 'application/authUser/core/1-constants';
import ScorePage from './pages/ScorePage';

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
        dispatch(authUserActions.setUser({ loginUser: user, currentUid }));
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
          <Route index element={<PrivateRoute element={<TopPage />} />} />

          <Route path='/article'>
            <Route
              path='list'
              element={<PrivateRoute element={<ArticleListPage />} />}
            />
            <Route
              path=':articleId'
              element={<PrivateRoute element={<ArticlePage />} />}
            />
          </Route>

          <Route path='/quiz'>
            <Route path='list'>
              <Route
                path='unanswered'
                element={<PrivateRoute element={<UnAnsweredQuizListPage />} />}
              />
              <Route
                path='answered'
                element={<PrivateRoute element={<AnsweredQuizListPage />} />}
              />
            </Route>
            <Route
              path=':quizId/score/:scoreId'
              element={<PrivateRoute element={<ScorePage />} />}
            />
            <Route
              path=':quizId'
              element={<PrivateRoute element={<QuizPage />} />}
            />
          </Route>

          <Route path='workout'>
            <Route
              path='list'
              element={<PrivateRoute element={<RandomWorkoutListPage />} />}
            />
            <Route
              path=':workoutId'
              element={<PrivateRoute element={<RandomWorkoutPage />} />}
            />
          </Route>
          <Route path='/account'>
            <Route index element={<PrivateRoute element={<AccountPage />} />} />
            <Route
              path={'mail'}
              element={<PrivateRoute element={<UpdateEmailPage />} />}
            />
            <Route
              path={`password`}
              element={<PrivateRoute element={<UpdatePasswordPage />} />}
            />
          </Route>
          <Route
            path='/login'
            element={<OnlyUnAuthorizedRoute element={<SignInPage />} />}
          />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
export default App;

function PrivateRoute({ element }: { element: React.ReactElement }) {
  const { loginUser } = useSelector((state: RootState) => state.authUser);

  if (!loginUser) {
    return <Navigate to='/login' />;
  }
  return element;
}

function OnlyUnAuthorizedRoute({ element }: { element: React.ReactElement }) {
  const { loginUser } = useSelector((state: RootState) => state.authUser);
  if (loginUser) {
    return <Navigate to='/' />;
  }
  return element;
}
