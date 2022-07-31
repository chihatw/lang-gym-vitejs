import React, { useEffect } from 'react';
import { Navigate, useLocation, Routes, Route } from 'react-router-dom';

import TopPage from '../pages/TopPage';
import QuizPage from '../pages/Quiz/QuizPage';
import ScorePage from '../pages/Quiz/ScorePage';
import SignInPage from '../pages/Auth/SingInPage';
import ArticlePage from '../pages/ArticlePage';
import ArticlesPage from '../pages/ArticlesPage';
import SentenceParsePage from '../pages/SentenceParsePage';
import AnsweredPage from '../pages/QuizList/AnsweredPage';
import UnAnsweredPage from '../pages/QuizList/UnAnsweredPage';
import AccountPage from '../pages/Auth/AccountPage';
import MailPage from '../pages/Auth/Setting/MailPage';
import PasswordPage from '../pages/Auth/Setting/PasswordPage';

import { State } from '../Model';
import Layout from '../Layout';
import { Action } from '../Update';

const AppComponent = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 1);
  }, [pathname]);

  useEffect(() => {
    document.title = '原田日語小房';
    document.readyState === 'complete'
      ? hideUrlBar()
      : (() => {
          window.addEventListener('load', hideUrlBar);
          return () => window.removeEventListener('load', hideUrlBar);
        })();
  }, []);

  return (
    <Layout state={state} dispatch={dispatch}>
      <Routes>
        <Route
          path='/'
          element={<TopPage state={state} dispatch={dispatch} />}
        />
        <Route
          path='/articles'
          element={<ArticlesPage state={state} dispatch={dispatch} />}
        />
        <Route
          path='/article/:id/parse'
          element={<SentenceParsePage state={state} dispatch={dispatch} />}
        />
        <Route
          path='/article/:id'
          element={<ArticlePage state={state} dispatch={dispatch} />}
        />
        <Route path='/quizzes/*'>
          <Route
            path={``}
            element={<UnAnsweredPage state={state} dispatch={dispatch} />}
          />
          <Route
            path={'answered'}
            element={<AnsweredPage state={state} dispatch={dispatch} />}
          />
        </Route>
        <Route
          path='/quiz/:id'
          element={<QuizPage state={state} dispatch={dispatch} />}
        />
        <Route
          path='/score/:id/quiz/:quizId'
          element={<ScorePage state={state} dispatch={dispatch} />}
        />
        <Route path='/account/*'>
          <Route
            path={''}
            element={<AccountPage state={state} dispatch={dispatch} />}
          />
          <Route
            path={'mail'}
            element={<MailPage state={state} dispatch={dispatch} />}
          />
          <Route
            path={`password`}
            element={<PasswordPage state={state} dispatch={dispatch} />}
          />
        </Route>
        <Route
          path='/login'
          element={<SignInPage state={state} dispatch={dispatch} />}
        />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Layout>
  );
};

export default AppComponent;

const hideUrlBar = () =>
  setTimeout(() => {
    window.scrollTo(0, 1);
  }, 1);
