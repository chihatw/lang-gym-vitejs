import { Container } from '@mui/material';

import { Navigate, useNavigate } from 'react-router-dom';
import { State } from '../../../Model';

import { Action, ActionTypes } from '../../../Update';

import QuizList from '../commons/QuizList';
import StyledButton from '../commons/StyledButton';

const UnAnsweredPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
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
            dispatch({ type: ActionTypes.startFetching });
            navigate('/quizzes/answered');
          }}
          color='#52a2aa'
          label='回答済'
        />
      </div>
      <QuizList dispatch={dispatch} state={state} />
    </Container>
  );
};

export default UnAnsweredPage;
