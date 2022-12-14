import React, { useEffect } from 'react';
import { Navigate, useLocation, Routes, Route } from 'react-router-dom';

import QuizPage from '../pages/Quiz/QuizPage';
import ScorePage from '../pages/Quiz/ScorePage';
import SignInPage from '../pages/Auth/SingInPage';
import ArticlePage from '../pages/Article/ArticlePage';
import ArticleListPage from '../pages/Article/ArticleListPage';
import AnsweredPage from '../pages/QuizList/AnsweredPage';
import UnAnsweredPage from '../pages/QuizList/UnAnsweredPage';
import AccountPage from '../pages/Auth/AccountPage';
import MailPage from '../pages/Auth/Setting/MailPage';
import PasswordPage from '../pages/Auth/Setting/PasswordPage';

import Layout from '../Layout';
import WorkoutListPage from '../pages/Workout/WorkoutListPage';
import WorkoutPage from '../pages/Workout/WorkoutPage';
import WorkingMemoryPage from '../pages/Workout/WorkingMemoryPage';

const AppComponent = () => {
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
        <Route path='memory'>
          <Route path=':workoutId' element={<WorkingMemoryPage />} />
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
  );
};

export default AppComponent;

const hideUrlBar = () =>
  setTimeout(() => {
    window.scrollTo(0, 1);
  }, 1);
