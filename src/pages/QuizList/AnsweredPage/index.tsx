import * as R from 'ramda';
import { Navigate, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';

import { Container } from '@mui/material';
import StyledButton from '../commons/StyledButton';
import QuizList from '../commons/QuizList';
import { getAnsweredQuizList } from '../../../services/quiz';
import { ActionTypes } from '../../../Update';

import { AppContext } from '../../../App';
import { AnsweredQuiz, State } from '../../../Model';

const AnsweredPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const { auth, isFetching, quizList } = state;
  const { uid } = auth;
  const { answeredList } = quizList;

  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      const _answeredList = !!answeredList.length
        ? answeredList
        : await getAnsweredQuizList(uid);

      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<AnsweredQuiz[], State>(
          ['quizList', 'answeredList'],
          _answeredList
        )
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };
    fetchData();
  }, [isFetching, dispatch, answeredList, uid]);

  if (!uid) return <Navigate to='/login' />;
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ padding: '8px 0' }}>
        <StyledButton
          label='未回答'
          color='#52a2aa'
          handleClick={() => navigate('/quizzes')}
        />
        <StyledButton color='#ccc' disabled label='回答済' />
      </div>
      <QuizList isAnswered />
    </Container>
  );
};

export default AnsweredPage;
