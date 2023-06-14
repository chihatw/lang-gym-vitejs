import React, { createContext, useEffect, useReducer, useRef } from 'react';

import { Action, ActionTypes, reducer } from '../Update';
import { INITIAL_STATE, State } from '../Model';
import { auth } from '../infrastructure/firebase';
import { getQuizzes } from '../application/services/quiz';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'views/Layout';
import ArticleListPage from 'views/pages/ArticleListPage';
import ArticlePage from 'views/pages/ArticlePage';
import UnAnsweredPage from 'views/pages/QuizList/UnAnsweredPage';
import AnsweredPage from 'views/pages/QuizList/AnsweredPage';
import ScorePage from 'views/pages/Quiz/ScorePage';
import QuizPage from 'views/pages/Quiz/QuizPage';
import WorkoutListPage from 'views/pages/Workout/WorkoutListPage';
import WorkoutPage from 'views/pages/Workout/WorkoutPage';
import AccountPage from 'views/pages/AccountPage';
import UpdateEmailPage from 'views/pages/UpdateEmailPage';
import UpdatePasswordPage from 'views/pages/UpdatePasswordPage';
import SignInPage from 'views/pages/SingInPage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'main';
import { authUserActions } from 'application/authUser/framework/0-reducer';
import TopPage from './pages/TopPage';
import { CURRENT_UID_LOCAL_STORAGE_KEY } from 'application/authUser/core/1-constants';

export const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: INITIAL_STATE, dispatch: () => {} });

const App = () => {
  const _dispatch = useDispatch(); // todo rename
  const { initializing, currentUid } = useSelector(
    (state: RootState) => state.authUser
  );

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const isFetched = useRef(false);

  // 認証判定
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // currentUid は localStorage から受け取る
        const currentUid =
          localStorage.getItem(CURRENT_UID_LOCAL_STORAGE_KEY) || user.uid;
        _dispatch(authUserActions.setUser({ loginUser: user, currentUid }));
      } else {
        localStorage.setItem(CURRENT_UID_LOCAL_STORAGE_KEY, '');
        _dispatch(authUserActions.removeUser());
      }
    });
  }, []);

  // 初期値取得（作文、問題、記憶問題）
  useEffect(() => {
    if (isFetched.current) return;
    const fetchData = async () => {
      const quizzes = !!state.quizzes.length
        ? state.quizzes
        : await getQuizzes(currentUid);

      isFetched.current = true;
      dispatch({
        type: ActionTypes.initializeApp,
        payload: { quizzes },
      });
    };
    fetchData();
  }, [state.quizzes, currentUid]);

  if (initializing) return <></>;

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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
                  element={<PrivateRoute element={<UnAnsweredPage />} />}
                />
                <Route
                  path='answered'
                  element={<PrivateRoute element={<AnsweredPage />} />}
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
                element={<PrivateRoute element={<WorkoutListPage />} />}
              />
              <Route
                path=':workoutId'
                element={<PrivateRoute element={<WorkoutPage />} />}
              />
            </Route>
            <Route path='/account'>
              <Route
                index
                element={<PrivateRoute element={<AccountPage />} />}
              />
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
    </AppContext.Provider>
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
