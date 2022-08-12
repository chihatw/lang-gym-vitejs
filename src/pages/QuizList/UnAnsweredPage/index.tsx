import { Container } from '@mui/material';
import { useContext } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { State } from '../../../Model';

import { Action, ActionTypes } from '../../../Update';

import QuizList from '../commons/QuizList';
import StyledButton from '../commons/StyledButton';

const UnAnsweredPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const { auth } = state;
  const { uid } = auth;

  if (!uid) return <Navigate to='/login' />;
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ padding: '8px 0' }}>
        <StyledButton disabled color='#ccc' label='未回答' />
        <StyledButton
          handleClick={() => {
            if (!dispatch) return;
            dispatch({ type: ActionTypes.startFetching });
            navigate('/quizzes/answered');
          }}
          color='#52a2aa'
          label='回答済'
        />
      </div>
      <QuizList />
    </Container>
  );
};

export default UnAnsweredPage;
