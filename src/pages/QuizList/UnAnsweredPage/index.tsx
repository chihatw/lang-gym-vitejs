import { Container } from '@mui/material';
import { useContext } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import QuizList from '../commons/QuizList';
import StyledButton from '../commons/StyledButton';

const UnAnsweredPage = () => {
  const { state } = useContext(AppContext);
  if (!state.auth.uid) return <Navigate to='/login' />;

  const navigate = useNavigate();
  const unansweredList = state.quizzes.filter(
    (item) => !Object.keys(item.scores).length
  );
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ padding: '8px 0' }}>
        <StyledButton disabled color='#ccc' label='未回答' />
        <StyledButton
          handleClick={() => navigate('/quiz/list/answered')}
          color='#52a2aa'
          label='回答済'
        />
      </div>
      <QuizList quizList={unansweredList} />
    </Container>
  );
};

export default UnAnsweredPage;
